import { useState } from "react";
import { CircleAlertIcon, CopyIcon, InfoIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { SheetClose, SheetFooter } from "@src/components/ui/sheet";
import { Textarea } from "@src/components/ui/textarea";

export interface VariableDraft {
  // the variable's current name on GitHub; absent when adding a new one
  original?: string;
  name: string;
  value: string;
  // set when the last save failed, so the sheet reopens with the reason
  error?: string;
}

function VariableForm({ draft }: Readonly<{ draft: VariableDraft }>) {
  const [saving, setSaving] = useState(false);
  const copyValue = () => {
    const value = (document.getElementById("var-value") as HTMLTextAreaElement | null)?.value ?? "";
    navigator.clipboard.writeText(value).then(() => toast.success("Value copied"));
  };

  return (
    <form method="POST" className="flex min-h-0 flex-1 flex-col" onSubmit={() => setSaving(true)}>
      {draft.original && <input type="hidden" name="name" value={draft.original} />}
      <div className="flex flex-1 flex-col gap-5.5 overflow-y-auto px-6 pb-6">
        {draft.error && (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Couldn't save {draft.name || "variable"}</AlertTitle>
            <AlertDescription>{draft.error} Your changes are still in the form below.</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="var-name" className="font-medium">Name</label>
          <Input
            id="var-name"
            name="updatedName"
            defaultValue={draft.name}
            required
            autoFocus={!draft.original}
            className="h-11 font-mono text-[13px]"
          />
          <span className="text-xs text-muted-foreground">
            Letters, digits and underscores.
            {draft.original && " Renaming also renames it on GitHub, so update any workflow that uses the old name."}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="var-value" className="font-medium">Value</label>
            <Button type="button" variant="outline" size="sm" onClick={copyValue}>
              <CopyIcon />
              Copy
            </Button>
          </div>
          <Textarea
            id="var-value"
            name="updatedValue"
            defaultValue={draft.value}
            required
            className="min-h-72 bg-muted/40 font-mono text-[13px] leading-relaxed"
          />
        </div>
        <div className="flex items-start gap-2.5 rounded-xl bg-muted px-3.5 py-3 text-xs text-foreground/75">
          <InfoIcon aria-hidden="true" className="mt-px size-3.5 shrink-0" />
          Variables are stored as plain text and readable by anyone with access to the repository. Use a secret for credentials.
        </div>
      </div>
      <SheetFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
        <SheetClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </SheetClose>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2Icon className="animate-spin" />}
          {saving ? "Saving…" : draft.original ? "Save changes" : "Add variable"}
        </Button>
      </SheetFooter>
    </form>
  );
}

export default VariableForm;
