import { Alert, AlertDescription } from "@src/components/ui/alert";
import { Card } from "@src/components/ui/card";

interface LinkListProps {
  links: { key: string | number; href: string; label: string }[];
  emptyMessage: string;
  className?: string;
}

function LinkList({ links, emptyMessage, className }: Readonly<LinkListProps>) {
  if (!links.length) {
    return (
      <Alert>
        <AlertDescription>{emptyMessage}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`gap-0 py-0 overflow-y-auto ${className ?? ""}`}>
      <ul className="divide-y">
        {links.map((link) => (
          <li key={link.key}>
            <a href={link.href} className="block px-4 py-2 text-sm hover:bg-accent">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default LinkList;
