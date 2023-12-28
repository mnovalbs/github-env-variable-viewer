import type { EnvironmentVariable } from "../types/github";

interface VariableFormProps {
  variable: EnvironmentVariable;
}

function VariableForm({ variable }: Readonly<VariableFormProps>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="input input-bordered input-sm w-full"
        placeholder="Name"
        defaultValue={variable.name}
        name="updatedName"
        required
      />
      <textarea
        className="textarea textarea-bordered textarea-sm w-full leading-4 text-xs font-[monospace]"
        placeholder="Value"
        rows={8}
        defaultValue={variable.value}
        name="updatedValue"
        required
      />

      <div className="flex justify-end">
        <button type="submit" className="btn btn-sm btn-primary">
          Save
        </button>
      </div>
    </div>
  );
}

export default VariableForm;
