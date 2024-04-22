import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { Link, Outlet } from 'react-router-dom';
import ErrorHandling from './error-boundary';
import { FaShareAlt, FaCode, FaStar } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const RepoList = ({ repos }) => {
    const [repo, setRepo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedRepo, setPaginatedRepo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRepo, setFilteredRepo] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newRepoData, setNewRepoData] = useState({
        name: '',
        visibility: '',
        description: '',
        language: ''
    });

    const itemsPerPage = 2;
    const token = process.env.REACT_APP_GITHUB_TOKEN;

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredRepo.length > 0 ? filteredRepo.slice(startIndex, endIndex) : [];
        setPaginatedRepo(paginatedData);
    }, [currentPage, filteredRepo]);

    useEffect(() => {
        const fetchRepo = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/jennykut12/repos`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }
                const data = await response.json();
                setRepo(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching repositories:', error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchRepo();
    }, [token]);

    useEffect(() => {
        // Filter repositories based on search query
        const filtered = repo.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredRepo(filtered);
    }, [repo, searchQuery]);

    const handlePrev = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredRepo.length / itemsPerPage)));
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDeleteRepo = async (repoId) => {
        try {
            const response = await fetch(`https://api.github.com/repos/jennykut12/${repoId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete repository");
            }
            // Refresh repository list after deleting a repository
            const updatedRepo = repo.filter(item => item.id !== repoId);
            setRepo(updatedRepo);
            setFilteredRepo(updatedRepo); // Update filteredRepo as well
        } catch (error) {
            console.error("Error deleting repository:", error);
            // Handle error state or display error message
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRepoData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to add new repository
        console.log("New repository data:", newRepoData);
        // You can send a POST request to add the new repository
        // After adding, refresh the repository list
        setShowModal(false);
    };

    return (
        <ErrorBoundary fallback={<ErrorHandling />}>
            <div className="flex flex-col">
                <div className=" w-1/2">
                    <label className="input input-bordered mb-10 flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Search" onChange={handleSearchInputChange} />
                        <kbd className="kbd kbd-sm">⌘</kbd>
                    </label>
                </div>
                {loading ? (
                    <div>Loading</div>
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
                                <div className="shadow-2xl border-t-grey-200 border-t-2 flex gap-5 py-5 rounded-b-xl px-5 justify-self-end items-baseline">
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
                                    <div>
                                        <button onClick={() => handleDeleteRepo(data.id)} className="">
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
                            disabled={currentPage * itemsPerPage >= filteredRepo.length}
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
                    {/* Modal */}
                    {showModal && (
                        <dialog open={showModal} className="modal">
                            <div className="modal-box">
                                <div className="modal-action">
                                    <form onSubmit={handleSubmit}>
                                        <h3 className="font-bold text-lg">Create a new Repo</h3>
                                        {/* Name input */}
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
                                        {/* Visibility input */}
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
                                        {/* Description input */}
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
                                        {/* Language input */}
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
                                        {/* Submit button */}
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
}

export default RepoList;



// import React, { useEffect, useState } from "react";
// import { ErrorBoundary } from "react-error-boundary";
// import { GrFormPrevious, GrFormNext } from "react-icons/gr";
// import { Link, NavLink, Outlet } from "react-router-dom";
// import ErrorHandling from "./error-boundary";
// import { FaShareAlt, FaCode, FaStar } from "react-icons/fa";
// import { MdAdd } from "react-icons/md";

// const RepoList = ({ repos }) => {
//   const [repo, setRepo] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [paginatedRepo, setPaginatedRepo] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//     const [filteredRepo, setFilteredRepo] = useState([]);
//   const [newRepoData, setNewRepoData] = useState({
//     name: "",
//     visibility: "",
//     description: "",
//     language: "",
//   });

//   const itemsPerPage = 2;

//   const url = "https://api.github.com/users/jennykut12/repos";
//   const token = process.env.REACT_APP_GITHUB_TOKEN;
//   const getRepo = async () => {
//     try {
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.status === 404) {
//         throw new Error("Repository not found");
//       }
//       if (response.status === 403) {
//         throw new Error("Access forbidden");
//       }
//       if (!response.ok) {
//         throw new Error("Failed to fetch repositories");
//       }
//       const data = await response.json();
//       setRepo(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching repositories:", error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getRepo();
//   }, []);
//   // useEffect(() => {
//   //   const startIndex = (currentPage - 1) * itemsPerPage;
//   //   const endIndex = startIndex + itemsPerPage;
//   //   const paginatedData =
//   //     repo.length > 0 ? repo.slice(startIndex, endIndex) : [];
//   //   setPaginatedRepo(paginatedData);
//   //   setLoading(false);
//   // }, [currentPage, repo]);
//   useEffect(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const paginatedData = repo.length > 0 ? repo.slice(startIndex, endIndex) : [];
//     setPaginatedRepo(paginatedData);
// }, [currentPage, repo]);


//   // const handlePrev = () => {
//   //   setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
//   // };

//   // const handleNext = () => {
//   //   setCurrentPage((prevPage) =>
//   //     Math.min(prevPage + 1, Math.ceil(repo.length / itemsPerPage))
//   //   );
//   // };
//   useEffect(() => {
//     // Filter repositories based on search query
//     const filtered = repo.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));
//     setFilteredRepo(filtered);
// }, [repo, searchQuery]);

// const handlePrev = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
// };

// const handleNext = () => {
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredRepo.length / itemsPerPage)));
// };

// const handleSearchInputChange = (e) => {
//     setSearchQuery(e.target.value);
// };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRepoData({ ...newRepoData, [name]: value });
//   };

//   const handleSubmit = async (name, description) => {
//     try {
//       const response = await fetch("https://api.github.com/user/repos", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ name, description }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add repository");
//       }
//       // Refresh repository list after adding a repository
//       getRepo();
//     } catch (error) {
//       console.error("Error adding repository:", error);
//       // Handle error state or display error message
//     }
//   };

//   const handleDeleteRepo = async (name) => {
//     try {
//       const response = await fetch(`https://api.github.com/repos/jennykut12/${name}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete repository");
//       }
//       // Refresh repository list after deleting a repository
//       getRepo();
//     } catch (error) {
//       console.error("Error deleting repository:", error);
//       // Handle error state or display error message
//     }
//   };

//   return (
//     <ErrorBoundary fallback={<ErrorHandling />}>
//       <div className="flex flex-col">
//         <div className=" w-1/2">
//           <label className="input input-bordered mb-10 flex items-center gap-2">
//             <input type="text" className="grow" placeholder="Search" />
//             <kbd className="kbd kbd-sm">⌘</kbd>
//           </label>
//         </div>
//         {loading ? (
//           <div>Loading</div>
//         ) : (
//           <div className="flex flex-col items-baseline lg:flex-row gap-5">
//             {paginatedRepo.map((data, index) => (
//               <div
//                 key={index}
//                 className="card border-2 border-gray-200 w-full bg-base-100 shadow-xl"
//               >
//                 <Link to={`/screens/repo-details/${data.name}`}>
//                   <div className="card-body">
//                     <div className="flex justify-between items-center">
//                       <h2 className="className= text-sm font-bold">
//                         {data.name}
//                       </h2>
//                       <div className=" border-2 border-gray-200 px-3 py-1 rounded-2xl">
//                         <p className=" text-xs">{data.visibility}</p>
//                       </div>
//                     </div>
//                     <p className=" text-sm font-medium">{data.description}</p>
//                   </div>
//                 </Link>
//                 <Outlet />
//                 <div className="shadow-2xl border-t-grey-200 border-t-2 flex gap-5 py-5 rounded-b-xl px-5 justify-self-end items-baseline">
//                   <div className="flex gap-1 items-center">
//                     <FaCode className="" />
//                     <p className="text-sm">{data.language}</p>
//                   </div>
//                   <div className="flex gap-1 items-center ">
//                     <FaStar className="" />
//                     <p className="text-sm">{data.forks_count}</p>
//                   </div>
//                   <div className="flex gap-1 items-center">
//                     <FaShareAlt className="" />
//                     <p className="text-sm">{data.forks}</p>
//                   </div>
//                   <div>
//                     <button onClick={handleDeleteRepo} className="">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         <div className="flex ">
//           <div className=" w-full my-10 flex justify-between items-center">
//             <button
//               onClick={() => {
//                 handlePrev();
//               }}
//               disabled={currentPage === 1}
//             >
//               <GrFormPrevious className=" text-4xl text-gray-200" />
//             </button>
//             <button
//               onClick={() => {
//                 handleNext();
//               }}
//               disabled={currentPage * itemsPerPage >= repo.length}
//             >
//               <GrFormNext className=" text-4xl text-gray-200" />
//             </button>
//           </div>
//           <button
//             className="btn w-20 h-20 mt-40 rounded-full absolute border-2 border-gray-200"
//             onClick={() => setShowModal(true)}
//           >
//             <MdAdd className="text-3xl text-gray-200" />
//           </button>
//           {/* Modal */}
//           {showModal && (
//             <dialog open={showModal} className="modal">
//               <div className="modal-box">
//                 <div className="modal-action">
//                   <form onSubmit={handleSubmit}>
//                     <h3 className="font-bold text-lg">Create a new Repo</h3>
//                     {/* Name input */}
//                     <label className="input input-bordered flex items-center gap-2">
//                       Name
//                       <input
//                         type="text"
//                         name="name"
//                         value={newRepoData.name}
//                         onChange={handleInputChange}
//                         className="grow"
//                         placeholder="Enter repository name"
//                       />
//                     </label>
//                     {/* Visibility input */}
//                     <label className="input input-bordered flex items-center gap-2">
//                       Visibility
//                       <input
//                         type="text"
//                         name="visibility"
//                         value={newRepoData.visibility}
//                         onChange={handleInputChange}
//                         className="grow"
//                         placeholder="Enter visibility"
//                       />
//                     </label>
//                     {/* Description input */}
//                     <label className="input input-bordered flex items-center gap-2">
//                       Description
//                       <input
//                         type="text"
//                         name="description"
//                         value={newRepoData.description}
//                         onChange={handleInputChange}
//                         className="grow"
//                         placeholder="Enter description"
//                       />
//                     </label>
//                     {/* Language input */}
//                     <label className="input input-bordered flex items-center gap-2">
//                       Language
//                       <input
//                         type="text"
//                         name="language"
//                         value={newRepoData.language}
//                         onChange={handleInputChange}
//                         className="grow"
//                         placeholder="Enter language"
//                       />
//                     </label>
//                     {/* Submit button */}
//                     <button className="btn" type="submit">
//                       Submit
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             </dialog>
//           )}

//           {/* Open the modal using document.getElementById('ID').showModal() method */}
//           {/* <button
//             className="btn w-20 h-20 mt-40  rounded-full absolute border-2 border-gray-200"
//             onClick={() => document.getElementById("my_modal_1").showModal()}
//           >
//             <MdAdd className=" text-3xl text-gray-200" />
//           </button>
//           <dialog id="my_modal_1" className="modal">
//             <div className="modal-box">
//               <div className="modal-action">
//                 <form method="dialog">
//                 <h3 className="font-bold text-lg">Create a new Repo</h3>
//                   <label className="input input-bordered flex items-center gap-2">
//                     Name
//                     <input type="text" className="grow" placeholder="Daisy" />
//                   </label>
//                   <label className="input input-bordered flex items-center gap-2">
//                   visibility
//                     <input type="text" className="grow" placeholder="Daisy" />
//                   </label>
//                   <label className="input input-bordered flex items-center gap-2">
//                   description
//                     <input type="text" className="grow" placeholder="Daisy" />
//                   </label>
//                   <label className="input input-bordered flex items-center gap-2">
//                   language
//                     <input type="text" className="grow" placeholder="Daisy" />
//                   </label>
                  
//                   <button className="btn">Submit</button>
//                 </form>
//               </div>
//             </div>
//           </dialog> */}
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default RepoList;
