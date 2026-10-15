import { useEffect, useState } from "react";
import {
  ArrowUpRightIcon,
  BracesIcon,
  CopyIcon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { ActionVariable, Environment } from "@src/types/github";
import { cn, isReadOnlyEnv } from "@src/lib/utils";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@src/components/ui/sheet";
import { Toaster } from "@src/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import EmptyState from "./EmptyState";
import EnvBadge from "./EnvBadge";
import VariableForm, { type VariableDraft } from "./VariableForm";

interface VariableListProps {
  orgName: string;
  repoName: string;
  envName: string;
  variables: ActionVariable[];
  environments: Pick<Environment, "id" | "name">[];
  counts: Record<string, number | undefined>;
  savedName?: string;
  failedSubmission?: VariableDraft;
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

const timeAgo = (iso: string) => {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const unit = UNITS.find(([, size]) => Math.abs(seconds) >= size);
  return unit ? rtf.format(Math.round(seconds / unit[1]), unit[0]) : "just now";
};

function VariableList({
  orgName,
  repoName,
  envName,
  variables,
  environments,
  counts,
  savedName,
  failedSubmission,
}: Readonly<VariableListProps>) {
  const readOnly = isReadOnlyEnv(envName);
  const [filter, setFilter] = useState("");
  const [draft, setDraft] = useState<VariableDraft | null>(failedSubmission ?? null);

  useEffect(() => {
    if (!savedName) return;
    toast.success("Variable saved", { description: `${savedName} was updated in ${envName}.` });
    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const copy = (variable: ActionVariable) =>
    navigator.clipboard.writeText(variable.value).then(() => toast.success(`Copied ${variable.name}`));

  const visible = variables.filter((v) => v.name.toLowerCase().includes(filter.trim().toLowerCase()));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-muted-foreground">{orgName}/{repoName}</span>
          <div className="flex items-center gap-3">
            <h1 className="text-[32px] leading-tight font-semibold tracking-tight">{envName}</h1>
            <EnvBadge envName={envName} />
          </div>
        </div>
        <Button
          size="lg"
          disabled={readOnly}
          aria-describedby={readOnly ? "read-only-note" : undefined}
          onClick={() => setDraft({ name: "", value: "" })}
        >
          <PlusIcon />
          Add variable
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Environment" className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
          {environments.map((env) => {
            const active = env.name === envName;
            return (
              <a
                key={env.id}
                href={`/${orgName}/${repoName}/${encodeURIComponent(env.name)}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8.5 items-center gap-2 rounded-[9px] px-3 font-medium text-foreground/70 hover:text-foreground",
                  active && "bg-background text-foreground shadow-sm"
                )}
              >
                {isReadOnlyEnv(env.name) && <LockIcon aria-hidden="true" className="size-3.5" />}
                {env.name}
                {counts[env.name] !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs leading-4.5",
                      active ? (isReadOnlyEnv(env.name) ? "bg-warning text-warning-foreground" : "bg-primary/10 text-primary") : "text-muted-foreground"
                    )}
                  >
                    {counts[env.name]}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
        {variables.length > 0 && (
          <div className="relative flex min-w-50 flex-[0_1_280px] items-center">
            <label htmlFor="var-filter" className="sr-only">Filter variables by name</label>
            <SearchIcon aria-hidden="true" className="absolute left-3 size-4 text-muted-foreground" />
            <Input
              id="var-filter"
              type="search"
              placeholder="Filter by name"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
        )}
      </div>

      {readOnly && (
        <div id="read-only-note" role="note" className="flex items-start gap-3 rounded-xl border border-warning-border bg-warning px-4 py-3.5 text-warning-foreground">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <LockIcon aria-hidden="true" className="size-4" />
          </span>
          <div className="flex flex-col gap-0.5">
            <strong className="font-semibold">Production is read-only</strong>
            <span className="text-[13px]">
              Variables in environments whose name starts with “prod” can be viewed and copied here, but changes have to be made on GitHub.
            </span>
          </div>
        </div>
      )}

      {variables.length ? (
        <section aria-label="Variables" className="overflow-hidden rounded-2xl border">
          <Table className="min-w-[640px]">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="px-5">Name</TableHead>
                <TableHead className="px-5">Value</TableHead>
                <TableHead className="w-32 px-5">Updated</TableHead>
                <TableHead className="w-24 px-5"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((variable) => (
                <TableRow key={variable.name}>
                  <TableCell className="px-5 font-mono text-[13px] font-medium">{variable.name}</TableCell>
                  <TableCell className="max-w-75 px-5">
                    <span className="inline-block max-w-full truncate rounded-md bg-muted px-2 py-0.5 align-middle font-mono text-xs text-foreground/80">
                      {variable.value}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 text-[13px] text-muted-foreground" title={variable.updated_at} suppressHydrationWarning>
                    {timeAgo(variable.updated_at)}
                  </TableCell>
                  <TableCell className="px-3.5 py-1.5">
                    <div className="flex justify-end gap-0.5">
                      <Button variant="ghost" size="icon" aria-label={`Copy value of ${variable.name}`} onClick={() => copy(variable)}>
                        <CopyIcon />
                      </Button>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${variable.name}`}
                          onClick={() => setDraft({ original: variable.name, name: variable.name, value: variable.value })}
                        >
                          <PencilIcon />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!visible.length && (
                <TableRow>
                  <TableCell colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                    No variables match “{filter}”
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      ) : (
        <EmptyState
          icon={<BracesIcon />}
          title={`No variables in ${envName}`}
          description={
            readOnly
              ? "This environment has no variables yet. Add them in the repository's environment settings on GitHub."
              : "This environment has no variables yet."
          }
          action={
            readOnly ? (
              <Button variant="outline" asChild>
                <a href={`https://github.com/${orgName}/${repoName}/settings/environments`}>
                  Open settings on GitHub
                  <ArrowUpRightIcon />
                </a>
              </Button>
            ) : (
              <Button onClick={() => setDraft({ name: "", value: "" })}>
                <PlusIcon />
                Add variable
              </Button>
            )
          }
        />
      )}

      <Sheet open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <SheetContent className="gap-0 rounded-2xl border data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:h-auto data-[side=right]:w-[calc(100%-1rem)] data-[side=right]:sm:max-w-[480px]">
          <SheetHeader className="p-6 pb-5">
            <SheetTitle className="text-lg">{draft?.original ? "Edit variable" : "Add variable"}</SheetTitle>
            <SheetDescription>{envName} · {orgName}/{repoName}</SheetDescription>
          </SheetHeader>
          {draft && <VariableForm draft={draft} />}
        </SheetContent>
      </Sheet>

      <Toaster position="bottom-right" />
    </>
  );
}

export default VariableList;
