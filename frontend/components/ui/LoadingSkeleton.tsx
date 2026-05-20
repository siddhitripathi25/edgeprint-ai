"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
  variant?: "card" | "text" | "circle" | "bar";
}

export function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg skeleton bg-[#1a2744]/60",
        className
      )}
    />
  );
}

export default function LoadingSkeleton({ className, rows = 3, variant = "text" }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className={cn("rounded-xl border border-[#1a2744] bg-[#0a0f1e]/80 p-5", className)}>
        <SkeletonBox className="mb-4 h-4 w-1/3" />
        <SkeletonBox className="mb-2 h-8 w-2/3" />
        <SkeletonBox className="h-1.5 w-full" />
      </div>
    );
  }

  if (variant === "circle") {
    return <SkeletonBox className={cn("rounded-full", className)} />;
  }

  if (variant === "bar") {
    return <SkeletonBox className={cn("h-1.5 w-full rounded-full", className)} />;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBox
          key={i}
          className={cn("h-4 rounded-md", i === rows - 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}
