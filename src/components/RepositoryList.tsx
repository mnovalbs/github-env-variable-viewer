import { ArrowRightIcon, BookMarkedIcon, SearchIcon } from "lucide-react";
import type { SearchRepository } from "@src/types/github";
import { Button } from "@src/components/ui/button";
import EmptyState from "./EmptyState";
import OrgAvatar from "./OrgAvatar";

interface RepositoryListProps {
  orgName: string;
  repositories: SearchRepository[];
  defaultKeyword?: string;
}

function RepositoryList({
  orgName,
  repositories,
  defaultKeyword = "",
}: Readonly<RepositoryListProps>) {
  return (
    <>
      <div className="flex items-center gap-4">
        <OrgAvatar login={orgName} size="lg" />
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] leading-tight font-semibold tracking-tight">{orgName}</h1>
          <p className="text-[15px] text-muted-foreground">Choose a repository to manage its environments.</p>
        </div>
      </div>

      <form
        method="GET"
        className="flex h-13 items-center gap-2 rounded-2xl border bg-background pr-1.5 pl-4 shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20"
      >
        <SearchIcon aria-hidden="true" className="size-4.5 text-muted-foreground" />
        <label htmlFor="repo-search" className="sr-only">Search repositories</label>
        <input
          id="repo-search"
          name="keyword"
          type="search"
          placeholder={`Search repositories in ${orgName}`}
          defaultValue={defaultKeyword}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none"
        />
        <Button type="submit" className="h-10 rounded-xl px-4.5">Search</Button>
      </form>

      {repositories.length ? (
        <section aria-labelledby="results-heading" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="results-heading" className="flex items-center gap-2 text-[15px] font-semibold">
              Repositories
              <span className="rounded-full bg-muted px-2 text-xs leading-5 font-medium text-foreground/70">
                {repositories.length}
              </span>
            </h2>
            <span className="text-xs text-muted-foreground">Showing the top 10 matches</span>
          </div>
          <ul className="divide-y overflow-hidden rounded-2xl border">
            {repositories.map((repo) => (
              <li key={repo.id}>
                <a
                  href={`/${repo.owner?.login}/${repo.name}`}
                  className="group flex items-center gap-3.5 px-4 py-3.5 hover:bg-muted/50"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-muted text-foreground/70">
                    <BookMarkedIcon aria-hidden="true" className="size-4.5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[15px] font-semibold">{repo.name}</span>
                    <span className="truncate font-mono text-xs text-muted-foreground">{repo.full_name}</span>
                  </span>
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-4.5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <EmptyState
          tone="primary"
          icon={<SearchIcon />}
          title={defaultKeyword ? `No repositories match “${defaultKeyword}”` : "No repositories"}
          description={
            defaultKeyword
              ? "Check the spelling, or search with part of the repository name."
              : "The server token can't see any repositories in this organization."
          }
          action={
            defaultKeyword && (
              <Button variant="outline" asChild>
                <a href={`/${orgName}`}>Clear search</a>
              </Button>
            )
          }
        />
      )}
    </>
  );
}

export default RepositoryList;
