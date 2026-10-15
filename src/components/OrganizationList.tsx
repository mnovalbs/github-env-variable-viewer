import type { Organization } from "@src/types/github";
import LinkList from "./LinkList";

interface OrganizationListProps {
  organizations: Organization[];
}

function OrganizationList({ organizations }: Readonly<OrganizationListProps>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Select Organization</div>

      <LinkList
        emptyMessage="No Data Found"
        links={organizations.map((org) => ({
          key: org.id,
          href: `/${org.login}`,
          label: org.login,
        }))}
      />
    </div>
  );
}

export default OrganizationList;
