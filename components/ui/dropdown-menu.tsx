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
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface DropdownContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("DropdownMenu compound components must be used within <DropdownMenu>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

export interface DropdownMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

function DropdownMenu({ open: controlledOpen, onOpenChange, children }: DropdownMenuProps) {
  const [uncontrolled, setUncontrolled] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolled;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolled(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Trigger                                                            */
/* ------------------------------------------------------------------ */

const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useDropdownContext();

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      className={cn("inline-flex items-center", className)}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = "start", sideOffset = 4, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = useDropdownContext();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    // Position
    useEffect(() => {
      if (!open || !triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const top = rect.bottom + sideOffset + window.scrollY;
      let left = rect.left + window.scrollX;
      if (align === "end") left = rect.right + window.scrollX;
      else if (align === "center") left = rect.left + rect.width / 2 + window.scrollX;
      setPos({ top, left });
    }, [open, align, sideOffset, triggerRef]);

    // Mount animation
    useEffect(() => {
      if (open) {
        setMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true));
        });
      } else {
        setVisible(false);
        const timer = setTimeout(() => setMounted(false), 150);
        return () => clearTimeout(timer);
      }
    }, [open]);

    // Close on click outside
    useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open, setOpen, triggerRef]);

    // Close on escape
    useEffect(() => {
      if (!open) return;
      const handler = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          triggerRef.current?.focus();
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open, setOpen, triggerRef]);

    // Keyboard navigation within menu
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const el = contentRef.current;
      if (!el) return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
      );
      const current = items.findIndex((item) => item === document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = current < items.length - 1 ? current + 1 : 0;
        items[next]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = current > 0 ? current - 1 : items.length - 1;
        items[prev]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    };

    // Focus first item on open
    useEffect(() => {
      if (!visible) return;
      const el = contentRef.current;
      if (!el) return;
      const first = el.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
      first?.focus();
    }, [visible]);

    if (!mounted) return null;

    const alignStyles =
      align === "end"
        ? "origin-top-right"
        : align === "center"
          ? "origin-top -translate-x-1/2"
          : "origin-top-left";

    return createPortal(
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="menu"
        aria-orientation="vertical"
        className={cn(
          "fixed z-50 min-w-[8rem] rounded-lg border border-surface-200 bg-white p-1 shadow-lg transition-all duration-150 dark:border-surface-700 dark:bg-surface-800",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          alignStyles,
          className
        )}
        style={{ top: pos.top, left: pos.left }}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

/* ------------------------------------------------------------------ */
/*  Item                                                               */
/* ------------------------------------------------------------------ */

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  destructive?: boolean;
}

const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, icon, destructive = false, children, disabled, ...props }, ref) => {
    const { setOpen } = useDropdownContext();

    return (
      <button
        ref={ref}
        role="menuitem"
        type="button"
        disabled={disabled}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
          "focus:bg-surface-100 dark:focus:bg-surface-700",
          destructive
            ? "text-danger-600 focus:text-danger-700 dark:text-danger-400"
            : "text-surface-700 dark:text-surface-200",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={(e) => {
          props.onClick?.(e);
          setOpen(false);
        }}
        {...props}
      >
        {icon && <span className="shrink-0 h-4 w-4">{icon}</span>}
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

/* ------------------------------------------------------------------ */
/*  Label                                                              */
/* ------------------------------------------------------------------ */

const DropdownMenuLabel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-surface-500 dark:text-surface-400",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

/* ------------------------------------------------------------------ */
/*  Separator                                                          */
/* ------------------------------------------------------------------ */

const DropdownMenuSeparator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-surface-200 dark:bg-surface-700", className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
