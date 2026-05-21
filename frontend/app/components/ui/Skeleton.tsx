import * as React from "react";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`}
      {...props}
    />
  );
}

export { Skeleton };

export function PostCardSkeleton() {
  return (
    <article className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-5 rounded-md" />
      </div>

      {/* Body */}
      <div className="mb-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[60%]" />
        
        {/* Optional Media Skeleton */}
        <Skeleton className="h-48 w-full rounded-2xl mt-4" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-8 ml-auto" />
      </div>
    </article>
  );
}

export function ListingDetailSkeleton() {
  return (
    <div className="pb-24 bg-white dark:bg-gray-950 min-h-screen">
      {/* Media Skeleton */}
      <Skeleton className="w-full aspect-square md:aspect-video rounded-none" />
      
      {/* Content Skeleton */}
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <Skeleton className="h-5 w-24 mb-3" />
          <Skeleton className="h-8 w-full max-w-sm mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-4 w-12 mb-1" />
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="py-6 border-y border-gray-100 dark:border-gray-800 space-y-3">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>

        <div className="py-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
