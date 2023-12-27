import { useEffect, useState } from "react";
import { octokit } from "../utils/octokit";
import { GITHUB_TOKEN } from "../constants/config";
import VariableForm from "./VariableForm";
import type { ActionVariable } from "../types/github";

interface VariableListProps {
  repositoryId: number;
  environmentName: string;
}

function VariableList({ repositoryId, environmentName }: VariableListProps) {
  const modalName = `modal_${environmentName}`;

  const [variables, setVariables] = useState<ActionVariable[]>([]);

  const closeModal = () => {
    const modal = document.getElementById(modalName);
    if (modal) {
      // @ts-expect-error
      modal.close();
    }
  };

  const showModal = () => {
    const modal = document.getElementById(modalName);
    if (modal) {
      // @ts-expect-error
      modal.showModal();
    }
  };

  const fetchVariables = () => {
    octokit
      .request(
        "GET /repositories/{repository_id}/environments/{environment_name}/variables",
        {
          repository_id: repositoryId,
          environment_name: environmentName,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      )
      .then(({ data }) => setVariables(data.variables));
  };

  const onAdd = async (newVariable: ActionVariable) => {
    await octokit.request(
      "POST /repositories/{repository_id}/environments/{environment_name}/variables",
      {
        repository_id: repositoryId,
        environment_name: environmentName,
        name: newVariable.name,
        value: newVariable.value,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    closeModal();
    fetchVariables();
  };

  const onUpdate = async (
    variableName: string,
    updatedVariable: ActionVariable
  ) => {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(updatedVariable),
    };

    fetch(
      `https://api.github.com/repositories/${repositoryId}/environments/${environmentName}/variables/${variableName}`,
      options
    ).then(() => {
      closeModal();
      fetchVariables();
    });
  };

  useEffect(() => {
    fetchVariables();
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <button
          className="btn btn-xs btn-outline btn-primary mb-2"
          onClick={showModal}
        >
          Add New Variable
        </button>
      </div>

      {!variables.length && (
        <div role="alert" className="alert alert-info">
          <span>No variable found.</span>
        </div>
      )}

      {variables.map((variable, index) => (
        <div key={variable.name}>
          <VariableForm
            variable={variable}
            onSave={(updatedVariable) =>
              onUpdate(variable.name, updatedVariable)
            }
          />

          {index < variables.length - 1 && <div className="divider" />}
        </div>
      ))}

      <dialog id={modalName} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Add New Variable</h3>
          <p className="flex flex-col gap-2 py-4">
            <VariableForm
              variable={{ name: "", value: "" }}
              onSave={(variable) => onAdd(variable)}
            />
          </p>
        </div>
      </dialog>
    </div>
  );
}

export default VariableList;
