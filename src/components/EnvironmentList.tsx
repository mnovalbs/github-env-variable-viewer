import { ArrowRightIcon, LayersIcon } from "lucide-react";
import type { Environment } from "@src/types/github";
import { cn, isReadOnlyEnv } from "@src/lib/utils";
import EmptyState from "./EmptyState";
import EnvBadge from "./EnvBadge";

interface EnvironmentListProps {
  orgName: string;
  repoName: string;
  environments: Environment[];
  counts: Record<string, number | undefined>;
}

function EnvironmentList({
  orgName,
  repoName,
  environments,
  counts,
}: Readonly<EnvironmentListProps>) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs text-muted-foreground">{orgName}/{repoName}</span>
        <h1 className="text-[32px] leading-tight font-semibold tracking-tight">Environments</h1>
        <p className="text-[15px] text-muted-foreground">Choose an environment to see its variables.</p>
      </div>

      {environments.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {environments.map((env) => {
            const readOnly = isReadOnlyEnv(env.name);
            const count = counts[env.name];
            return (
              <a
                key={env.id}
                href={`/${orgName}/${repoName}/${encodeURIComponent(env.name)}`}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
              >
                <span className="flex items-center justify-between gap-3">
                  <EnvBadge envName={env.name} />
                  {count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {count} {count === 1 ? "variable" : "variables"}
                    </span>
                  )}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-xl font-semibold tracking-tight">{env.name}</span>
                  <span className="text-[13px] text-muted-foreground">
                    {readOnly
                      ? "View only. Names starting with “prod” can't be changed from this app."
                      : "View, add and edit variables."}
                  </span>
                </span>
                <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-medium", readOnly ? "text-foreground/75" : "text-primary")}>
                  {readOnly ? "View variables" : "Manage variables"}
                  <ArrowRightIcon aria-hidden="true" className="size-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<LayersIcon />}
          title="No environments"
          description="This repository has no deployment environments yet."
        />
      )}
    </>
  );
}

export default EnvironmentList;
