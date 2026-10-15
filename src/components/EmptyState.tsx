import type { ReactNode } from "react";
import { cn } from "@src/lib/utils";

const TONES = {
  default: "bg-muted text-foreground/70",
  primary: "bg-primary/10 text-primary",
  destructive: "bg-destructive/10 text-destructive",
};

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  tone?: keyof typeof TONES;
}

function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "default",
}: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-dashed px-6 py-14 text-center">
      <span className={cn("flex size-13 items-center justify-center rounded-2xl [&_svg]:size-5.5", TONES[tone])}>
        {icon}
      </span>
      <h2 className="text-[17px] font-semibold">{title}</h2>
      <p className="max-w-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  );
}

export default EmptyState;
