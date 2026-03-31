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
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ToastVariant = "default" | "success" | "danger" | "warning" | "info";
type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  title?: string;
  description?: string;
  duration: number;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, "id" | "duration"> & { duration?: number }) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
  defaultDuration?: number;
}

const positionStyles: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

let toastCounter = 0;

function ToastProvider({
  children,
  position = "top-right",
  maxToasts = 5,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (opts: Omit<ToastItem, "id" | "duration"> & { duration?: number }) => {
      const id = `toast-${++toastCounter}`;
      const item: ToastItem = {
        id,
        variant: opts.variant ?? "default",
        title: opts.title,
        description: opts.description,
        duration: opts.duration ?? defaultDuration,
      };
      setToasts((prev) => [...prev.slice(-(maxToasts - 1)), item]);
      return id;
    },
    [defaultDuration, maxToasts]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed z-[100] flex flex-col gap-2 pointer-events-none",
              positionStyles[position]
            )}
            aria-live="polite"
            aria-label="Notifications"
          >
            {toasts.map((t) => (
              <ToastCard key={t.id} item={t} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Single Toast Card                                                  */
/* ------------------------------------------------------------------ */

const variantStyles: Record<ToastVariant, string> = {
  default:
    "bg-white border-surface-200 text-surface-900 dark:bg-surface-800 dark:border-surface-700 dark:text-surface-100",
  success:
    "bg-white border-success-300 text-surface-900 dark:bg-surface-800 dark:border-success-600 dark:text-surface-100",
  danger:
    "bg-white border-danger-300 text-surface-900 dark:bg-surface-800 dark:border-danger-600 dark:text-surface-100",
  warning:
    "bg-white border-accent-300 text-surface-900 dark:bg-surface-800 dark:border-accent-600 dark:text-surface-100",
  info:
    "bg-white border-brand-300 text-surface-900 dark:bg-surface-800 dark:border-brand-600 dark:text-surface-100",
};

const progressColors: Record<ToastVariant, string> = {
  default: "bg-surface-400",
  success: "bg-success-500",
  danger: "bg-danger-500",
  warning: "bg-accent-500",
  info: "bg-brand-500",
};

const iconMap: Record<ToastVariant, ReactNode> = {
  default: null,
  success: (
    <svg className="h-5 w-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  danger: (
    <svg className="h-5 w-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.56 20h18.88a1 1 0 00.87-1.28l-8.6-14.86a1 1 0 00-1.72 0z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ item, onDismiss }: ToastCardProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    if (item.duration <= 0) return;
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / item.duration) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setVisible(false);
        setTimeout(() => onDismiss(item.id), 200);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [item.duration, item.id, onDismiss]);

  return (
    <div
      role={item.variant === "danger" ? "alert" : "status"}
      aria-live={item.variant === "danger" ? "assertive" : "polite"}
      className={cn(
        "pointer-events-auto relative w-80 overflow-hidden rounded-lg border shadow-lg transition-all duration-200",
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-4 opacity-0",
        variantStyles[item.variant]
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {iconMap[item.variant] && (
          <span className="shrink-0 mt-0.5">{iconMap[item.variant]}</span>
        )}
        <div className="flex-1 min-w-0">
          {item.title && (
            <p className="text-sm font-semibold">{item.title}</p>
          )}
          {item.description && (
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
              {item.description}
            </p>
          )}
        </div>
        <button
          type="button"
          className="shrink-0 rounded-sm text-surface-400 hover:text-surface-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-surface-500 dark:hover:text-surface-300"
          onClick={() => {
            setVisible(false);
            setTimeout(() => onDismiss(item.id), 200);
          }}
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {item.duration > 0 && (
        <div className="h-0.5 w-full bg-surface-100 dark:bg-surface-700">
          <div
            className={cn("h-full transition-none", progressColors[item.variant])}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export { ToastProvider };
