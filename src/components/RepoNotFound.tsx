import { ArrowLeftIcon, CircleAlertIcon } from "lucide-react";
import { Button } from "@src/components/ui/button";
import EmptyState from "./EmptyState";

function RepoNotFound({ orgName, repoName }: Readonly<{ orgName: string; repoName: string }>) {
  return (
    <EmptyState
      tone="destructive"
      icon={<CircleAlertIcon />}
      title="Repository not found"
      description={
        <>
          <span className="font-mono text-foreground/80">{orgName}/{repoName}</span> doesn't exist, or the server token can't access it.
        </>
      }
      action={
        <Button variant="outline" asChild>
          <a href={`/${orgName}`}>
            <ArrowLeftIcon />
            Back to {orgName}
          </a>
        </Button>
      }
    />
  );
}

export default RepoNotFound;
