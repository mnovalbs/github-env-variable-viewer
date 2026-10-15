import type { EnvironmentVariable } from "@src/types/github";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Textarea } from "@src/components/ui/textarea";

interface VariableFormProps {
  variable: EnvironmentVariable;
  disabled?: boolean;
}

function VariableForm({ variable, disabled }: Readonly<VariableFormProps>) {
  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Name"
        defaultValue={variable.name}
        name="updatedName"
        disabled={disabled}
        required
      />
      <Textarea
        className="font-mono text-xs min-h-32"
        placeholder="Value"
        defaultValue={variable.value}
        name="updatedValue"
        disabled={disabled}
        required
      />

      <div className="flex justify-end">
        <Button disabled={disabled} type="submit" size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}

export default VariableForm;
