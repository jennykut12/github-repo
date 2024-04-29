import { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import Search from "./copmonents/search";
import { FaGithubAlt } from "react-icons/fa6";
import Repo from "./copmonents/repo";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./screens/home-page";
import RepoDetails from "./screens/repo-details";
import { ErrorBoundary } from "react-error-boundary";
import ErrorHandling from "./copmonents/error-boundary";
import RepoList from "./copmonents/repo-list";

function App() {
  const [activeTheme, setActiveTheme] = useState("light");

  useEffect(() => {
    themeChange(false && activeTheme === "dark");
  }, [activeTheme]);

  return (
    <div className="App font-inter min-h-[100vh] p-10">
      <header className="">
        <div className="navbar flex items-center justify-between">
          <div className="">
            <FaGithubAlt className=" text-6xl" />
          </div>
          <div className="w-24 p-2 justify-between flex border-2 rounded-3xl">
            <MdLightMode
              className={`text-[#48381a] text-3xl cursor-pointer ${
                activeTheme === "light" && "text-[#BE9E60]"
              }`}
              onClick={() => setActiveTheme("light")}
              data-set-theme="light"
              data-act-class="ACTIVECLASS"
            />
            <MdDarkMode
              className={`text-[#48381a] text-3xl cursor-pointer ${
                activeTheme === "dark" && "text-[#BE9E60]"
              }`}
              onClick={() => setActiveTheme("dark")}
              data-set-theme="dark"
              data-act-class="ACTIVECLASS"
            />
          </div>
        </div>
      </header>
      <ErrorBoundary fallback={<ErrorHandling />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/copmonents/repo" element={<Repo />} />
          <Route path="/screens/repo-details/:name" element={<RepoDetails />} />
          <Route path="/copmonents/repo-list" element={<RepoList />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
