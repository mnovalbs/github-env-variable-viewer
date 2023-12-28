import { GITHUB_TOKEN } from "@src/constants/config";
import { octokit } from "./octokit";

export const updateEnvironmentVariable = async (props: {
  name: string;
  updatedName: string;
  updatedValue: string;
  repositoryId: number;
  envName: string;
}) => {
  const { name, updatedName, updatedValue, repositoryId, envName } = props;

  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      name: updatedName,
      value: updatedValue,
    }),
  };

  await fetch(
    `https://api.github.com/repositories/${repositoryId}/environments/${envName}/variables/${name}`,
    options
  );
};

export const getRepository = async (props: {
  orgName: string;
  repoName: string;
}) => {
  const { data: repository } = await octokit.request(
    "GET /repos/{owner}/{repo}",
    {
      owner: props.orgName,
      repo: props.repoName,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return repository;
};

export const getVariables = async (props: {
  repositoryId: number;
  envName: string;
}) => {
  try {
    const {
      data: { variables = [] },
    } = await octokit.request(
      "GET /repositories/{repository_id}/environments/{environment_name}/variables",
      {
        repository_id: props.repositoryId,
        environment_name: props.envName,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return variables;
  } catch (e) {
    return [];
  }
};
