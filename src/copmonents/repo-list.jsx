import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { Link, NavLink, Outlet } from "react-router-dom";
import ErrorHandling from "./error-boundary";
import { FaShareAlt, FaCode, FaStar } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import NotFoundPage from "./not-found-page";

const RepoList = ({ repos }) => {
  const [repo, setRepo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedRepo, setPaginatedRepo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRepo, setFilteredRepo] = useState([]);
  const [newRepoData, setNewRepoData] = useState({
    name: "",
    visibility: "",
    description: "",
    language: "",
  });

  const itemsPerPage = 2;

  const url = "https://api.github.com/users/jennykut12/repos";
  const token = process.env.REACT_APP_GITHUB_TOKEN;
  const getRepo = async () => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 404) {
        throw new Error("Repository not found");
      }
      if (response.status === 403) {
        throw new Error("Access forbidden");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }
      const data = await response.json();
      setRepo(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRepo();
  }, []);
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData =
      filteredRepo.length > 0 ? filteredRepo.slice(startIndex, endIndex) : [];
    setPaginatedRepo(paginatedData);
  }, [currentPage, filteredRepo]);

  useEffect(() => {
    const filtered = repo.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRepo(filtered);
    setLoading(false);
  }, [repo, searchQuery]);

  const handlePrev = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(repo.length / itemsPerPage))
    );
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRepoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRepoData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add repository");
      }
      await getRepo();
      setShowModal(false);
      setNewRepoData({
        name: "",
        visibility: "",
        description: "",
        language: "",
      });
      getRepo();
    } catch (error) {
      console.error("Error adding repository:", error);
    }
  };

  const handleDeleteRepo = async (name) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/jennykut12/${name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete repository: ${errorMessage}`);
      }
      const updatedRepo = repo.filter((r) => r.name !== name);
      setRepo(updatedRepo);
      setPaginatedRepo(
        updatedRepo.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      );
      console.log("Repository deleted successfully");
    } catch (error) {
      console.error("Error deleting repository:", error);
    }
  };

  return (
    <ErrorBoundary fallback={<ErrorHandling />}>
      <div className="flex flex-col">
        <div className=" w-1/2">
          <label className="input input-bordered mb-10 flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              onChange={handleSearchInputChange}
            />
            <kbd className="kbd kbd-sm">⌘</kbd>
          </label>
        </div>
        {loading ? (
          <div>Loading</div>
        ) : filteredRepo.length === 0 ? (
          <NotFoundPage />
        ) : (
          <div className="flex flex-col items-baseline lg:flex-row gap-5">
            {paginatedRepo.map((data, index) => (
              <div
                key={index}
                className="card border-2 border-gray-200 w-full bg-base-100 shadow-xl"
              >
                <Link to={`/screens/repo-details/${data.name}`}>
                  <div className="card-body">
                    <div className="flex justify-between items-center">
                      <h2 className="className= text-sm font-bold">
                        {data.name}
                      </h2>
                      <div className=" border-2 border-gray-200 px-3 py-1 rounded-2xl">
                        <p className=" text-xs">{data.visibility}</p>
                      </div>
                    </div>
                    <p className=" text-sm font-medium">{data.description}</p>
                  </div>
                </Link>
                <Outlet />
                <div className="shadow-2xl flex gap-5 border-t-grey-200 border-t-2 py-5 px-5 rounded-b-xl items-baseline">
                  <div className="flex gap-5  justify-self-end ">
                    <div className="flex gap-1 items-center">
                      <FaCode className="" />
                      <p className="text-sm">{data.language}</p>
                    </div>
                    <div className="flex gap-1 items-center ">
                      <FaStar className="" />
                      <p className="text-sm">{data.forks_count}</p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <FaShareAlt className="" />
                      <p className="text-sm">{data.forks}</p>
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-ghost "
                      onClick={() => handleDeleteRepo(data.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex ">
          <div className=" w-full my-10 flex justify-between items-center">
            <button
              onClick={() => {
                handlePrev();
              }}
              disabled={currentPage === 1}
            >
              <GrFormPrevious className=" text-4xl text-gray-200" />
            </button>
            <button
              onClick={() => {
                handleNext();
              }}
              disabled={currentPage * itemsPerPage >= repo.length}
            >
              <GrFormNext className=" text-4xl text-gray-200" />
            </button>
          </div>
          <button
            className="btn w-20 h-20 mt-40 rounded-full absolute border-2 border-gray-200"
            onClick={() => setShowModal(true)}
          >
            <MdAdd className="text-3xl text-gray-200" />
          </button>
          {showModal && (
            <dialog open={showModal} className="modal">
              <div className="modal-box">
                <div className="modal-action">
                  <form onSubmit={handleSubmit}>
                    <div className=" flex justify-between items-center">
                      <h3 className="font-bold text-lg">Create a new Repo</h3>
                      <button
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowModal(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <label className="input input-bordered flex items-center gap-2">
                      Name
                      <input
                        type="text"
                        name="name"
                        value={newRepoData.name}
                        onChange={handleInputChange}
                        className="grow"
                        placeholder="Enter repository name"
                      />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      Visibility
                      <input
                        type="text"
                        name="visibility"
                        value={newRepoData.visibility}
                        onChange={handleInputChange}
                        className="grow"
                        placeholder="Enter visibility"
                      />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      Description
                      <input
                        type="text"
                        name="description"
                        value={newRepoData.description}
                        onChange={handleInputChange}
                        className="grow"
                        placeholder="Enter description"
                      />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      Language
                      <input
                        type="text"
                        name="language"
                        value={newRepoData.language}
                        onChange={handleInputChange}
                        className="grow"
                        placeholder="Enter language"
                      />
                    </label>
                    <button className="btn" type="submit">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RepoList;
