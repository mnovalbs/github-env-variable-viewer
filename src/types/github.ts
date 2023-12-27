import type { components } from "@octokit/openapi-types";

export type ActionVariable = Omit<
  components["schemas"]["actions-variable"],
  "created_at" | "updated_at"
>;
