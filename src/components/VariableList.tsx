import type { EnvironmentVariable } from "@src/types/github";
import VariableForm from "./VariableForm";

interface VariableListProps {
  variables: EnvironmentVariable[];
  defaultKeyword?: string;
}

const MODAL_NAME = "modal_create";

function VariableList({ variables }: Readonly<VariableListProps>) {
  const closeModal = () => {
    const modal = document.getElementById(MODAL_NAME);
    if (modal) {
      // @ts-expect-error
      modal.close();
    }
  };

  const showModal = () => {
    const modal = document.getElementById(MODAL_NAME);
    if (modal) {
      // @ts-expect-error
      modal.showModal();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 max-h-full">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Environment Variables</div>
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={showModal}
          >
            Add New Variable
          </button>
        </div>

        {!variables.length ? (
          <div role="alert" className="alert alert-warning">
            <span>No Data Found</span>
          </div>
        ) : (
          <div className="bg-base-100 rounded-box">
            <div className="join join-vertical w-full">
              {variables.map((variable) => (
                <div
                  key={variable.name}
                  className="collapse collapse-arrow join-item border border-base-300"
                >
                  <input type="radio" name="my-accordion" />
                  <div className="collapse-title text-sm font-medium flex items-center">
                    {variable.name}
                  </div>
                  <div className="collapse-content">
                    <form method="POST">
                      <input type="hidden" name="name" value={variable.name} />
                      <VariableForm variable={variable} />
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <dialog id={MODAL_NAME} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5"
            onClick={closeModal}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Add New Variable</h3>
          <form method="POST" className="mt-4">
            <VariableForm variable={{ name: "", value: "" }} />
          </form>
        </div>
      </dialog>
    </>
  );
}

export default VariableList;
