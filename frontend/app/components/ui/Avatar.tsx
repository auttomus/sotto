import * as React from "react";
import { cn } from "../../core/utils/cn";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Avatar({ className, src, alt, fallback, size = "md", ...props }: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden", sizes[size], className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          {...props}
        />
      ) : (
        <span className="font-medium text-gray-500 dark:text-gray-400 uppercase">
          {fallback || alt?.charAt(0) || "?"}
        </span>
      )}
    </div>
  );
}
