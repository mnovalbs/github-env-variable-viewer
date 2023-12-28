import type { Environment } from "@src/types/github";

interface EnvironmentListProps {
  orgName: string
  repoName: string
  environments: Environment[];
}

function EnvironmentList({ orgName, repoName, environments }: Readonly<EnvironmentListProps>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Select Environment</div>

      <ul className="menu bg-base-100 rounded-box">
        {environments.map((env) => (
          <li key={env.id}>
            <a href={`/${orgName}/${repoName}/${env.name}`}>{env.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EnvironmentList;
