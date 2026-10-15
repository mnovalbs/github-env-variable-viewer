import type { SearchRepository } from "@src/types/github";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import LinkList from "./LinkList";

interface RepositoryListProps {
  repositories: SearchRepository[];
  defaultKeyword?: string;
}

function RepositoryList({
  repositories,
  defaultKeyword = "",
}: Readonly<RepositoryListProps>) {
  return (
    <div className="flex flex-col gap-4 max-h-full">
      <div className="text-2xl font-bold">Select Repository</div>

      <form method="GET" className="flex gap-2">
        <Input
          name="keyword"
          className="flex-1"
          placeholder="Enter keyword..."
          defaultValue={defaultKeyword}
        />
        <Button type="submit">Search</Button>
      </form>

      <LinkList
        className="flex-1"
        emptyMessage="No Repository Found"
        links={repositories.map((repo) => ({
          key: repo.id,
          href: `/${repo.owner?.login}/${repo.name}`,
          label: repo.name,
        }))}
      />
    </div>
  );
}

export default RepositoryList;
