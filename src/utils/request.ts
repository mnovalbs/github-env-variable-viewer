import type { components } from "@octokit/openapi-types";
import { octokit } from "./octokit";

export const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : String(e);

export const isNotFound = (e: unknown) =>
  typeof e === "object" && e !== null && "status" in e && e.status === 404;

// Sidebar data shared by every page; pages also reuse `environments` for
// their own content so it is fetched once per request.
export const getShellData = async (props: {
  orgName?: string;
  repoName?: string;
}) => {
  const [organizations, environments] = await Promise.all([
    octokit.paginate("GET /user/orgs", { per_page: 100 }),
    props.orgName && props.repoName
      ? octokit
          .paginate("GET /repos/{owner}/{repo}/environments", {
            owner: props.orgName,
            repo: props.repoName,
            per_page: 100,
          })
          // a missing repo has no environments; the page reports the 404 itself
          .catch((e) => (isNotFound(e) ? [] : Promise.reject(e)))
      : [],
  ]);

  return { organizations, environments };
};

export type ShellData = Awaited<ReturnType<typeof getShellData>>;

export const emptyShell: ShellData = { organizations: [], environments: [] };

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

export const getVariableCount = async (props: {
  repositoryId: number;
  envName: string;
}) => {
  const { data } = await octokit.request(
    "GET /repositories/{repository_id}/environments/{environment_name}/variables",
    {
      repository_id: props.repositoryId,
      environment_name: props.envName,
      per_page: 1,
    }
  );

  return data.total_count;
};
