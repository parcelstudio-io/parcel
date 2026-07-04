import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

type AvatarProps = {
  user: User;
  size?: "sm" | "md" | "lg" | "profile";
  className?: string;
};

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  profile: "h-[86px] w-[86px]",
};

export function Avatar({ user, size = "md", className }: AvatarProps) {
  return (
    <img
      src={user.avatar}
      alt={user.name}
      className={cn("rounded-full bg-app-surface-muted object-cover", sizes[size], className)}
    />
  );
}
