"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ProgressRingProps extends React.SVGAttributes<SVGSVGElement> {
  /** Progress value 0-100 */
  value: number;
  /** Overall size in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Track color class */
  trackClassName?: string;
  /** Fill color class */
  fillClassName?: string;
  /** Label in center (e.g. percentage) */
  label?: React.ReactNode;
  /** Label class name */
  labelClassName?: string;
}

const ProgressRing = forwardRef<SVGSVGElement, ProgressRingProps>(
  (
    {
      value,
      size = 64,
      strokeWidth = 4,
      trackClassName,
      fillClassName,
      label,
      labelClassName,
      className,
      ...props
    },
    ref
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamped / 100) * circumference;
    const center = size / 2;

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          {...props}
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={cn("stroke-surface-200 dark:stroke-surface-700", trackClassName)}
          />
          {/* Fill */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(
              "stroke-brand-500 transition-[stroke-dashoffset] duration-500 ease-in-out",
              fillClassName
            )}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>

        {label != null && (
          <span
            className={cn(
              "absolute text-sm font-medium text-surface-700 dark:text-surface-200",
              labelClassName
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
);
ProgressRing.displayName = "ProgressRing";

export { ProgressRing };
