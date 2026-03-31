"use client";

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

type SheetSide = "left" | "right" | "top" | "bottom";

interface SheetContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("Sheet compound components must be used within <Sheet>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: ReactNode;
}

function Sheet({ open: controlledOpen, onOpenChange, defaultOpen = false, children }: SheetProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolled;

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolled(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Trigger                                                            */
/* ------------------------------------------------------------------ */

const SheetTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { setOpen } = useSheetContext();
    return (
      <button
        ref={ref}
        type="button"
        className={cn("inline-flex items-center", className)}
        onClick={() => setOpen(true)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SheetTrigger.displayName = "SheetTrigger";

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const slideStyles: Record<SheetSide, { base: string; open: string; closed: string }> = {
  right: {
    base: "inset-y-0 right-0 h-full w-80 max-w-full border-l",
    open: "translate-x-0",
    closed: "translate-x-full",
  },
  left: {
    base: "inset-y-0 left-0 h-full w-80 max-w-full border-r",
    open: "translate-x-0",
    closed: "-translate-x-full",
  },
  top: {
    base: "inset-x-0 top-0 w-full h-80 max-h-full border-b",
    open: "translate-y-0",
    closed: "-translate-y-full",
  },
  bottom: {
    base: "inset-x-0 bottom-0 w-full h-80 max-h-full border-t",
    open: "translate-y-0",
    closed: "translate-y-full",
  },
};

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: SheetSide;
}

const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, side = "right", children, ...props }, ref) => {
    const { open, setOpen } = useSheetContext();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    // Mount animation
    useEffect(() => {
      if (open) {
        setMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true));
        });
      } else {
        setVisible(false);
        const timer = setTimeout(() => setMounted(false), 300);
        return () => clearTimeout(timer);
      }
    }, [open]);

    // Escape key
    useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open, setOpen]);

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

    const sideConfig = slideStyles[side];

    return createPortal(
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            visible ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
          onClick={() => setOpen(false)}
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
            "fixed bg-white shadow-xl transition-transform duration-300 ease-in-out border-surface-200 dark:bg-surface-800 dark:border-surface-700",
            sideConfig.base,
            visible ? sideConfig.open : sideConfig.closed,
            className
          )}
          {...props}
        >
          {children}

          {/* Close button */}
          <button
            type="button"
            className="absolute right-4 top-4 rounded-sm text-surface-500 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:text-surface-400"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
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
          </button>
        </div>
      </div>,
      document.body
    );
  }
);
SheetContent.displayName = "SheetContent";

/* ------------------------------------------------------------------ */
/*  Header / Title / Description / Close                               */
/* ------------------------------------------------------------------ */

const SheetHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5 p-6 pb-0", className)}
      {...props}
    />
  )
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold text-surface-900 dark:text-white",
        className
      )}
      {...props}
    />
  )
);
SheetTitle.displayName = "SheetTitle";

const SheetDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-surface-500 dark:text-surface-400", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

function SheetClose({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useSheetContext();
  return (
    <button
      type="button"
      className={cn("inline-flex items-center", className)}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
};
