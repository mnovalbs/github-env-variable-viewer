import { LockIcon, PencilIcon } from "lucide-react";
import { Badge } from "@src/components/ui/badge";
import { isReadOnlyEnv } from "@src/lib/utils";

function EnvBadge({ envName }: Readonly<{ envName: string }>) {
  return isReadOnlyEnv(envName) ? (
    <Badge className="border-warning-border bg-warning text-warning-foreground">
      <LockIcon />
      Read-only
    </Badge>
  ) : (
    <Badge className="border-primary/20 bg-primary/10 text-primary">
      <PencilIcon />
      Editable
    </Badge>
  );
}

export default EnvBadge;
