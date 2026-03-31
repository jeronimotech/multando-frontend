"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type AvatarStatus = "online" | "offline" | "away";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
};

const statusSizeStyles: Record<AvatarSize, string> = {
  xs: "h-1.5 w-1.5 border",
  sm: "h-2 w-2 border",
  md: "h-2.5 w-2.5 border-2",
  lg: "h-3 w-3 border-2",
  xl: "h-3.5 w-3.5 border-2",
  "2xl": "h-4 w-4 border-2",
};

const statusColorStyles: Record<AvatarStatus, string> = {
  online: "bg-success-500",
  offline: "bg-surface-400",
  away: "bg-accent-500",
};

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt = "", initials, size = "md", status, ...props }, ref) => {
    const [imgError, setImgError] = useState(false);
    const showImage = src && !imgError;

    return (
      <span
        ref={ref}
        className={cn("relative inline-flex shrink-0", className)}
        {...props}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-surface-200 font-medium text-surface-700 overflow-hidden dark:bg-surface-700 dark:text-surface-200",
            sizeStyles[size]
          )}
        >
          {showImage ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span aria-hidden="true">
              {initials ?? alt?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          )}
        </span>

        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-white dark:border-surface-900",
              statusSizeStyles[size],
              statusColorStyles[status]
            )}
            aria-label={status}
          />
        )}
      </span>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
