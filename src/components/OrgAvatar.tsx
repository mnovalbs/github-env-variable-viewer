import { cn } from "@src/lib/utils";

const TINTS = [
  "bg-indigo-100 text-indigo-800",
  "bg-amber-100 text-amber-800",
  "bg-sky-100 text-sky-800",
  "bg-rose-100 text-rose-800",
  "bg-teal-100 text-teal-800",
];

const SIZES = {
  sm: "size-5 rounded-md text-[10px]",
  md: "size-12 rounded-xl text-base",
  lg: "size-14 rounded-2xl text-lg",
};

interface OrgAvatarProps {
  login: string;
  size?: keyof typeof SIZES;
}

function OrgAvatar({ login, size = "md" }: Readonly<OrgAvatarProps>) {
  const initials = login
    .split(/[-_\s]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const tint = TINTS[[...login].reduce((sum, c) => sum + c.charCodeAt(0), 0) % TINTS.length];

  return (
    <span
      aria-hidden="true"
      className={cn("flex shrink-0 items-center justify-center font-semibold", SIZES[size], tint)}
    >
      {initials}
    </span>
  );
}

export default OrgAvatar;
