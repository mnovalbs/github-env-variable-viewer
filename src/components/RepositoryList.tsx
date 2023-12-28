import type { SearchRepository } from "@src/types/github";

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
        <input
          name="keyword"
          className="input flex-1 input-md"
          placeholder="Enter keyword..."
          defaultValue={defaultKeyword}
        />
        <button className="btn btn-primary">Search</button>
      </form>

      {!repositories.length ? (
        <div role="alert" className="alert alert-warning">
          <span>No Repository Found</span>
        </div>
      ) : (
        <ul className="menu bg-base-100 rounded-box flex-1 flex-nowrap max-h-full overflow-y-auto">
          {repositories.map((repo) => (
            <li key={repo.id}>
              <a href={`/${repo.owner?.login}/${repo.name}`}>{repo.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RepositoryList;
