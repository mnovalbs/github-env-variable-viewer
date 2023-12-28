import type { Organization } from "@src/types/github";

interface OrganizationListProps {
  organizations: Organization[];
}

function OrganizationList({ organizations }: Readonly<OrganizationListProps>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Select Organization</div>

      <ul className="menu bg-base-100 rounded-box">
        {organizations.map((org) => (
          <li key={org.id}>
            <a href={`/${org.login}`}>{org.login}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrganizationList;
