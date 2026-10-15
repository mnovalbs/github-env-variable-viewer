import type { components } from "@octokit/openapi-types";
import { octokit } from "./octokit";

export const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : String(e);

export const updateEnvironmentVariable = async (props: {
  name: string;
  updatedName: string;
  updatedValue: string;
  repositoryId: number;
  envName: string;
}) => {
  await octokit.request(
    "PATCH /repositories/{repository_id}/environments/{environment_name}/variables/{name}",
    {
      repository_id: props.repositoryId,
      environment_name: props.envName,
      name: props.name,
      // the route's `name` param is the current name; the body field is the new one
      data: { name: props.updatedName, value: props.updatedValue },
    }
  );
};

export const createEnvironmentVariable = async (props: {
  name: string;
  value: string;
  repositoryId: number;
  envName: string;
}) => {
  await octokit.request(
    "POST /repositories/{repository_id}/environments/{environment_name}/variables",
    {
      repository_id: props.repositoryId,
      environment_name: props.envName,
      name: props.name,
      value: props.value,
    }
  );
};

export const getRepository = async (props: {
  orgName: string;
  repoName: string;
}) => {
  const { data: repository } = await octokit.request(
    "GET /repos/{owner}/{repo}",
    { owner: props.orgName, repo: props.repoName }
  );

  return repository;
};

export const getVariables = (props: { repositoryId: number; envName: string }) =>
  // paginate unwraps `{ total_count, variables }` at runtime, but its types
  // don't list this route, so the item type is given explicitly
  octokit.paginate<components["schemas"]["actions-variable"]>(
    "GET /repositories/{repository_id}/environments/{environment_name}/variables",
    {
      repository_id: props.repositoryId,
      environment_name: props.envName,
      per_page: 30,
    }
  );
