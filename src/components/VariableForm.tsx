import { useState } from "react";
import type { ActionVariable } from "../types/github";

interface VariableFormProps {
  variable: ActionVariable;
  onSave(variable: ActionVariable): void;
}

function VariableForm({ variable, onSave }: VariableFormProps) {
  const [name, setName] = useState(variable.name ?? "");
  const [value, setValue] = useState(variable.value ?? "");

  return (
    <div className="flex flex-col gap-2">
      <input
        className="input input-bordered input-sm w-full"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered textarea-sm w-full leading-4 text-xs font-[monospace]"
        placeholder="Value"
        rows={8}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="flex justify-end">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            if (name.trim().length > 0 && value.trim().length > 0) {
              onSave({ name, value });
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default VariableForm;
