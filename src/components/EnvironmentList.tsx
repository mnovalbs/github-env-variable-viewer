import type { Environment } from "@src/types/github";
import LinkList from "./LinkList";

interface EnvironmentListProps {
  orgName: string;
  repoName: string;
  environments: Environment[];
}

function EnvironmentList({
  orgName,
  repoName,
  environments,
}: Readonly<EnvironmentListProps>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Select Environment</div>

      <LinkList
        emptyMessage="No Data Found"
        links={environments.map((env) => ({
          key: env.id,
          href: `/${orgName}/${repoName}/${encodeURIComponent(env.name)}`,
          label: env.name,
        }))}
      />
    </div>
  );
}

export default EnvironmentList;
