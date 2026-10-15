import { Octokit } from "octokit";
import { GITHUB_TOKEN } from "../constants/config";

export const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  // plugin-retry's defaults plus 409: a conflict ("already exists") never
  // succeeds on retry and otherwise stalls the save for ~14s of backoff
  retry: { doNotRetry: [400, 401, 403, 404, 409, 422, 451] },
});
