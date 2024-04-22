import React, { useState, useEffect } from "react";
import { MdOutlineSearch } from "react-icons/md";
import useDebounce from "../hooks/useDebounce";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [repoList, setRepoList] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const url = `https://api.github.com/users/jennykut12/repos`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        const filteredRepos = data.filter((repo) =>
          repo.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        setRepoList(filteredRepos);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    if (debouncedSearchTerm) {
      fetchRepos();
    } else {
      // Reset repository list when search term is empty
      setRepoList([]);
    }
  }, [debouncedSearchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
      <form className="flex flex-col items-start">
        <div className="gap-2 w-[35vw] flex items-center justify-between input input-md input-bordered">
          <input
            type="text"
            id="mySearch"
            name="repo"
            value={searchTerm}
            placeholder="Search"
            className="text-lg"
            onChange={handleChange}
          />
          <MdOutlineSearch className=" text-xl" />
        </div>
        <ul className=" p-5 rounded-lg">
        {repoList.map((repo) => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
      </form>
        );
};

export default Search;
