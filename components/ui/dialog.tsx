"use client";

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

interface DialogContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  closeOnOverlay: boolean;
  closeOnEscape: boolean;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog compound components must be used within <Dialog>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  children: ReactNode;
}

function Dialog({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  closeOnOverlay = true,
  closeOnEscape = true,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolledOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, setOpen, closeOnOverlay, closeOnEscape }}>
      {children}
    </DialogContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Content (portal + overlay + panel + focus-trap)                     */
/* ------------------------------------------------------------------ */

const sizeStyles: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: DialogSize;
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, size = "md", children, ...props }, ref) => {
    const { open, setOpen, closeOnOverlay, closeOnEscape } = useDialogContext();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    // Mount/unmount with animation
    useEffect(() => {
      if (open) {
        setMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true));
        });
      } else {
        setVisible(false);
        const timer = setTimeout(() => setMounted(false), 200);
        return () => clearTimeout(timer);
      }
    }, [open]);

    // Escape key
    useEffect(() => {
      if (!open || !closeOnEscape) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open, closeOnEscape, setOpen]);

    // Focus trap
    useEffect(() => {
      if (!open) return;
      const el = contentRef.current;
      if (!el) return;

      const previouslyFocused = document.activeElement as HTMLElement | null;

      const focusable = () =>
        el.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
        );

      const first = focusable()[0];
      first?.focus();

      const trap = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const nodes = focusable();
        if (nodes.length === 0) return;
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstNode) {
            e.preventDefault();
            lastNode.focus();
          }
        } else {
          if (document.activeElement === lastNode) {
            e.preventDefault();
            firstNode.focus();
          }
        }
      };

      document.addEventListener("keydown", trap);
      return () => {
        document.removeEventListener("keydown", trap);
        previouslyFocused?.focus();
      };
    }, [open]);

    // Scroll lock
    useEffect(() => {
      if (!open) return;
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }, [open]);

    if (!mounted) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
            visible ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
          onClick={() => closeOnOverlay && setOpen(false)}
        />

        {/* Panel */}
        <div
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative z-10 w-full rounded-xl bg-white shadow-xl transition-all duration-200 dark:bg-surface-800",
            visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
            sizeStyles[size],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
);
DialogContent.displayName = "DialogContent";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const DialogHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5 p-6 pb-0", className)}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-surface-900 dark:text-white",
        className
      )}
      {...props}
    />
  )
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-surface-500 dark:text-surface-400", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-3 p-6 pt-4", className)}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

function DialogClose({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDialogContext();
  return (
    <button
      type="button"
      className={cn(
        "absolute right-4 top-4 rounded-sm text-surface-500 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:text-surface-400",
        className
      )}
      onClick={() => setOpen(false)}
      aria-label="Close"
      {...props}
    >
      {children ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </button>
  );
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
