"use client";

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

type TabsVariant = "default" | "pills";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  variant?: TabsVariant;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ value: controlledValue, onValueChange, defaultValue = "", variant = "default", className, children, ...props }, ref) => {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolled;

    const setValue = useCallback(
      (v: string) => {
        if (!isControlled) setUncontrolled(v);
        onValueChange?.(v);
      },
      [isControlled, onValueChange]
    );

    return (
      <TabsContext.Provider value={{ value, setValue, variant }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

/* ------------------------------------------------------------------ */
/*  TabsList                                                           */
/* ------------------------------------------------------------------ */

const TabsList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useTabsContext();
    const listRef = useRef<HTMLDivElement | null>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const el = listRef.current;
      if (!el) return;
      const triggers = Array.from(
        el.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      );
      const current = triggers.findIndex((t) => t === document.activeElement);
      if (current === -1) return;

      let next = current;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next = (current + 1) % triggers.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next = (current - 1 + triggers.length) % triggers.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = triggers.length - 1;
      }

      triggers[next]?.focus();
      triggers[next]?.click();
    };

    return (
      <div
        ref={(node) => {
          listRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="tablist"
        className={cn(
          "inline-flex items-center gap-1",
          variant === "default" &&
            "border-b border-surface-200 dark:border-surface-700",
          variant === "pills" &&
            "rounded-lg bg-surface-100 p-1 dark:bg-surface-800",
          className
        )}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

/* ------------------------------------------------------------------ */
/*  TabsTrigger                                                        */
/* ------------------------------------------------------------------ */

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, disabled, ...props }, ref) => {
    const { value: selected, setValue, variant } = useTabsContext();
    const isActive = selected === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        tabIndex={isActive ? 0 : -1}
        aria-selected={isActive}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && [
            "relative px-3 pb-2.5 pt-2 -mb-px border-b-2 border-transparent",
            isActive
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200",
          ],
          variant === "pills" && [
            "rounded-md px-3 py-1.5",
            isActive
              ? "bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white"
              : "text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200",
          ],
          className
        )}
        onClick={() => setValue(value)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

/* ------------------------------------------------------------------ */
/*  TabsContent                                                        */
/* ------------------------------------------------------------------ */

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selected } = useTabsContext();
    if (selected !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn(
          "mt-2 animate-in fade-in-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
