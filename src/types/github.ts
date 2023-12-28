import type { components } from "@octokit/openapi-types";
import type { Endpoints } from "@octokit/types";

export type Organization =
  Endpoints["GET /user/orgs"]["response"]["data"][number];

export type Repository =
  Endpoints["GET /orgs/{org}/repos"]["response"]["data"][number];

export type Environment = NonNullable<
  Endpoints["GET /repos/{owner}/{repo}/environments"]["response"]["data"]["environments"]
>[number];

export type SearchRepository =
  Endpoints["GET /search/repositories"]["response"]["data"]["items"][number];

export type EnvironmentVariable = Omit<
  Endpoints["GET /repos/{owner}/{repo}/actions/organization-variables"]["response"]["data"]["variables"][number],
  "created_at" | "updated_at"
>;

export type ActionVariable = Omit<
  components["schemas"]["actions-variable"],
  "created_at" | "updated_at"
>;
