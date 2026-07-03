import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800", className)}
      {...props}
    />
  );
}

export function AvatarImage({ className, src, alt }: { className?: string; src?: string | null; alt?: string }) {
  if (!src) return null;
  return <img className={cn("aspect-square h-full w-full object-cover", className)} src={src} alt={alt ?? ""} />;
}

export function AvatarFallback({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center text-sm font-medium", className)}>
      {children}
    </div>
  );
}
