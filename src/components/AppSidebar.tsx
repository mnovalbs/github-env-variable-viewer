import type { ReactNode } from "react";
import { BracesIcon, KeyRoundIcon, LockIcon } from "lucide-react";
import { cn, isReadOnlyEnv } from "@src/lib/utils";
import type { ShellData } from "@src/utils/request";
import OrgAvatar from "./OrgAvatar";

interface AppSidebarProps {
  shell: ShellData;
  orgName?: string;
  repoName?: string;
  envName?: string;
}

function NavItem({ href, active, children }: Readonly<{ href: string; active: boolean; children: ReactNode }>) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-lg border border-transparent px-2 font-medium text-foreground/75 hover:bg-foreground/5 hover:text-foreground",
        active && "border-border bg-background text-foreground shadow-xs hover:bg-background"
      )}
    >
      {children}
    </a>
  );
}

function NavGroup({ label, children }: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="px-2 pb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function AppSidebar({ shell, orgName, repoName, envName }: Readonly<AppSidebarProps>) {
  return (
    <aside aria-label="Sidebar" className="flex grow basis-[220px] flex-col gap-6 p-2 pb-3">
      <a href="/" className="flex items-center gap-2.5 px-2 py-1 text-[15px] font-semibold tracking-tight">
        <span className="flex size-7.5 items-center justify-center rounded-[9px] bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]">
          <BracesIcon className="size-4" />
        </span>
        Env Variable Viewer
      </a>

      <nav aria-label="Main" className="flex flex-col gap-5">
        <NavGroup label="Organizations">
          {shell.organizations.map((org) => (
            <NavItem key={org.id} href={`/${org.login}`} active={org.login === orgName}>
              <OrgAvatar login={org.login} size="sm" />
              <span className="truncate">{org.login}</span>
            </NavItem>
          ))}
        </NavGroup>

        {repoName && shell.environments.length > 0 && (
          <NavGroup label={`${repoName} · environments`}>
            {shell.environments.map((env) => {
              const readOnly = isReadOnlyEnv(env.name);
              return (
                <NavItem
                  key={env.id}
                  href={`/${orgName}/${repoName}/${encodeURIComponent(env.name)}`}
                  active={env.name === envName}
                >
                  <span
                    aria-hidden="true"
                    className={cn("mx-1.5 size-2 rounded-full", readOnly ? "bg-amber-500" : "bg-primary")}
                  />
                  <span className="flex-1 truncate">{env.name}</span>
                  {readOnly && <LockIcon role="img" aria-label="Read-only" className="size-3.5 text-muted-foreground" />}
                </NavItem>
              );
            })}
          </NavGroup>
        )}
      </nav>

      <div className="mt-auto flex items-start gap-2.5 rounded-xl border bg-background/60 p-3">
        <KeyRoundIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground/70" />
        <div className="flex flex-col">
          <span className="text-[13px] font-medium">Server token</span>
          <span className="text-xs text-muted-foreground">Every action uses the app's GITHUB_TOKEN</span>
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;
