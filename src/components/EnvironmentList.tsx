import { useEffect, useState } from "react";
import { octokit } from "../utils/octokit";
import { GITHUB_OWNER, GITHUB_REPO } from "../constants/config";
import type { components } from "@octokit/openapi-types";
import VariableList from "./VariableList";

interface EnvironmentListProps {
  repositoryId: number;
}

function EnvironmentList({ repositoryId }: EnvironmentListProps) {
  const [environments, setEnvironments] = useState<
    components["schemas"]["environment"][]
  >([]);

  useEffect(() => {
    octokit
      .request("GET /repos/{owner}/{repo}/environments", {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      .then(({ data }) => setEnvironments(data.environments ?? []));
  }, []);

  return (
    <div>
      <div className="join join-vertical w-full">
        {environments.map((environment) => (
          <div
            key={environment.id}
            className="collapse collapse-arrow join-item border border-base-300"
          >
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title text-xl font-medium">
              {environment.name}
            </div>
            <div className="collapse-content">
              <VariableList
                repositoryId={repositoryId}
                environmentName={environment.name}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnvironmentList;
