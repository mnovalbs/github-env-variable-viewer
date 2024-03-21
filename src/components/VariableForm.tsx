import type { EnvironmentVariable } from "../types/github";

interface VariableFormProps {
  variable: EnvironmentVariable;
  disabled?: boolean;
}

function VariableForm({ variable, disabled }: Readonly<VariableFormProps>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="input input-bordered input-sm w-full"
        placeholder="Name"
        defaultValue={variable.name}
        name="updatedName"
        disabled={disabled}
        required
      />
      <textarea
        className="textarea textarea-bordered textarea-sm w-full leading-4 text-xs font-[monospace]"
        placeholder="Value"
        rows={8}
        defaultValue={variable.value}
        name="updatedValue"
        disabled={disabled}
        required
      />

      <div className="flex justify-end">
        <button
          disabled={disabled}
          type="submit"
          className="btn btn-sm btn-primary"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default VariableForm;
