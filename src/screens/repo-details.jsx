import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "../copmonents/not-found-page";
import {
  FiStar,
  FiGitBranch,
  FiEye,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";

const RepoDetail = () => {
  const { name } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);

  const token = process.env.REACT_APP_GITHUB_TOKEN;
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/jennykut12/${name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 404) {
          throw new Error(``);
        }
        if (!response.ok) {
          throw new Error("Failed to fetch repository details");
        }
        const data = await response.json();
        setRepo(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRepo();
  }, [name]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          repo?.branches_url.replace("{/branch}", ""),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    if (repo) {
      fetchBranches();
    }
  }, [repo, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!repo) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center">
        <h1 className="text-3xl font-semibold">{repo.full_name}</h1>
        <p className="text-gray-600">{repo.description}</p>
      </header>
      <section className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Repository Details</h2>
          <ul>
            <li>
              <FiAlertCircle className="inline-block mr-2 text-gray-500" />{" "}
              Owner: {repo.owner.login}
            </li>
            <li>
              <FiCalendar className="inline-block mr-2 text-gray-500" /> Last
              Updated: {new Date(repo.updated_at).toLocaleDateString()}
            </li>
            <li>
              <FiStar className="inline-block mr-2 text-gray-500" /> Stars:{" "}
              {repo.stargazers_count}
            </li>
            <li>
              <FiEye className="inline-block mr-2 text-gray-500" /> Watchers:{" "}
              {repo.watchers_count}
            </li>
            <li>
              <FiGitBranch className="inline-block mr-2 text-gray-500" />{" "}
              Branches: {branches.length}
            </li>
            <li>
              <strong>Language:</strong> {repo.language}
            </li>
            <li>
              <strong>License:</strong>{" "}
              {repo.license ? repo.license.name : "None"}
            </li>
            <li>
              <strong>Open Issues:</strong> {repo.open_issues_count}
            </li>
          </ul>
        </div>
        <div className=" rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Contributors</h2>
        </div>
      </section>
    </div>
  );
};

export default RepoDetail;
