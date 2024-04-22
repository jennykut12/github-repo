import React, { useEffect, useState } from "react";
import RepoList from "./repo-list";
import { ErrorBoundary } from "react-error-boundary";
import ErrorHandling from "./error-boundary";
import Follower from "./follower";
import Following from "./following";

const Repo = () => {
  const [selectedTab, setSelectedTab] = useState("Repositories");

  const handleTabChange = (tabName) => {
    setSelectedTab(tabName);
  };
  return (
    <ErrorBoundary FallbackComponent={<ErrorHandling />}>
      <div className="min-h-[60vh]">
        <div role="tablist" className="tabs tabs-bordered  tabs-lg w-full">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab w-full"
            aria-label=" Repositories"
            checked={selectedTab === "Repositories"}
            onChange={() => handleTabChange("Repositories")}
          />
          <div role="tabpanel" className="tab-content p-10">
            <RepoList />
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Followers"
            checked={selectedTab === "Followers"}
            onChange={() => handleTabChange("Followers")}
          />
          <div role="tabpanel" className="tab-content p-10">
            <Follower />
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Following"
            checked={selectedTab === "Following"}
            onChange={() => handleTabChange("Following")}
          />
          <div role="tabpanel" className="tab-content p-10">
            <Following />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Repo;
