import { Octokit } from "octokit";
import { GITHUB_TOKEN } from "../constants/config";

export const octokit = new Octokit({ auth: GITHUB_TOKEN });