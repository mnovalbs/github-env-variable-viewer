import { useEffect, useState } from "react";
import { octokit } from "../utils/octokit";
import { GITHUB_OWNER, GITHUB_REPO } from "../constants/config";
import EnvironmentList from "./EnvironmentList";

function Home() {
  const [repositoryId, setRepositoryId] = useState<number>();

  useEffect(() => {
    octokit
      .request("GET /repos/{owner}/{repo}", {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      .then(({ data }) => setRepositoryId(data.id));
  }, []);

  if (!repositoryId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <EnvironmentList repositoryId={repositoryId} />
    </div>
  );
}

export default Home