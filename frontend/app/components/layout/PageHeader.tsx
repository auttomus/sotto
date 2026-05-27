import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export interface PageHeaderProps {
  title: React.ReactNode;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  tabs?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  showBackButton = false,
  rightAction,
  tabs,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-30 w-full bg-card/95 backdrop-blur-md border-b border-border transition-colors duration-300 ${className || ""}`}>
      <div className="flex flex-col w-full">
        {/* Top row: Back button, Title, and Right Actions */}
        <div className="flex items-center justify-between px-4 h-16 w-full gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer shrink-0 animate-scale-in"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-lg font-extrabold tracking-tight text-foreground truncate">
              {title}
            </h1>
          </div>
          {rightAction && (
            <div className="flex items-center gap-2 shrink-0">
              {rightAction}
            </div>
          )}
        </div>

        {/* Optional Secondary row: tabs, etc. */}
        {tabs && (
          <div className="w-full">
            {tabs}
          </div>
        )}
      </div>
    </header>
  );
}
