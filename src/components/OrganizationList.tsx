import { useState } from "react";
import { ArrowUpRightIcon, SearchIcon } from "lucide-react";
import type { Organization } from "@src/types/github";
import { Input } from "@src/components/ui/input";
import EmptyState from "./EmptyState";
import OrgAvatar from "./OrgAvatar";

interface OrganizationListProps {
  organizations: Organization[];
}

function OrganizationList({ organizations }: Readonly<OrganizationListProps>) {
  const [filter, setFilter] = useState("");
  const visible = organizations.filter((org) =>
    org.login.toLowerCase().includes(filter.trim().toLowerCase())
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[32px] leading-tight font-semibold tracking-tight">Organizations</h1>
          <p className="text-[15px] text-muted-foreground">
            Pick an organization to browse its repositories and environment variables.
          </p>
        </div>
        <div className="relative flex min-w-50 flex-[0_1_260px] items-center">
          <label htmlFor="org-filter" className="sr-only">Filter organizations</label>
          <SearchIcon aria-hidden="true" className="absolute left-3 size-4 text-muted-foreground" />
          <Input
            id="org-filter"
            type="search"
            placeholder="Filter organizations"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 pl-9"
          />
        </div>
      </div>

      {visible.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {visible.map((org) => (
            <a
              key={org.id}
              href={`/${org.login}`}
              className="flex flex-col gap-5 rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
            >
              <span className="flex items-start justify-between">
                <OrgAvatar login={org.login} />
                <ArrowUpRightIcon aria-hidden="true" className="size-4.5 text-muted-foreground" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[17px] font-semibold tracking-tight">{org.login}</span>
                <span className="font-mono text-xs text-muted-foreground">github.com/{org.login}</span>
              </span>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<SearchIcon />}
          title={filter ? `No organizations match “${filter}”` : "No organizations"}
          description="Only organizations the server token can access are listed."
        />
      )}
    </>
  );
}

export default OrganizationList;
