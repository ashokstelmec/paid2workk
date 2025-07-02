import React, { useEffect, useState } from "react";
import { Skeleton, Chip } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/authContext";

// Icons
import { FaHeart } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { Interweave } from "interweave";
import { transform1 } from "../../../../utils/transform";

const SavedProjects = () => {
  const { user, getCurrencySymbolId, getCurrencySymbolName } = useAuth();
  const [likeClicked, setLikeClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobListings, setJobListings] = useState([]);
  const [unsaveModal, setUnsaveModal] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [like, setLike] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(jobListings);

  const navigate = useNavigate();

  // Fetch saved projects
  useEffect(() => {
    const fetchSavedProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/api/Projects_/SaveProjects?UserID=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const data = await response.json();
        setJobListings(data);
      } catch (error) {
        console.error("Error fetching saved projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedProjects();
  }, [likeClicked]);

  // Handle opening and closing the modal save modal
  const toggleModalOpen = (projectId, isSaved) => {
    setUnsaveModal(true);
    setProjectId(projectId);
    setLike(isSaved);
  };

  const toggleModalClose = () => {
    setUnsaveModal(false);
  };

  // Handle saving or unsaving a project
  const toggleSaveProject = async (projectId, isSaved) => {
    try {
      const url = `https://paid2workk.solarvision-cairo.com/api/Projects_/SaveProject/`;

      const formData = new FormData();
      formData.append("NProjectId", projectId);
      formData.append("FreelancerId", sessionStorage.getItem("NUserID"));
      formData.append("Like", isSaved);

      await fetch(url, {
        method: "POST",
        body: formData,
      });

      // Re-fetch saved projects to ensure consistency (optimistic UI could be implemented)
      setIsLoading(true);
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/api/Projects_/SaveProjects?UserID=${sessionStorage.getItem(
          "NUserID"
        )}`
      );
      const updatedData = await response.json();
      setJobListings(updatedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const timeDiff = now - date;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (days === -1) return "Recently";
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  // const formatTimeAgo = (dateString) => {
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const timeDiff = now - date;
  //   const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  //   if (days === 0) return "Today";
  //   if (days === 1) return "Yesterday";
  //   if (days < 7) return `${days} day(s) ago`;
  //   if (days < 30) return `${Math.floor(days / 7)} week(s) ago`;
  //   return `${Math.floor(days / 30)} month(s) ago`;
  // };

  const handleJobClick = (projectId) => {
    navigate(`/projects/details/${projectId}`);
  };

  useEffect(() => {
    setFilteredProjects(jobListings);
  }, [jobListings]);

  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredProjects(jobListings);
      return;
    }
    const regex = new RegExp(searchTerm.replace(/[^a-zA-Z0-9\s]/g, ""), "i");
    const results = jobListings.filter(
      (job) => regex.test(job.title) || regex.test(job.skill)
    );
    setFilteredProjects(results);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className=" pb-10">
        <div className="relative mt-6 flex gap-4 rounded-xl p-2 overflow-hidden bg-back/30 shadow-lg shadow-black/10 border border-blue/5 w-full lg:w-3/5">
          <IoSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-black/50 text-xl" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full p-1 pl-10 outline-none focus:outline-none bg-white rounded-lg hover:border-blue/10 border border-back/30 duration-500 ease-in-out"
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            fullWidth
          />
          <button
            className="bg-blue hover:brightness-125 text-sm duration-500 rounded-lg ease-in-out text-white px-5 py-1"
            onClick={() => handleSearch({ target: { value: searchTerm } })}
          >
            Search
          </button>
        </div>
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="flex relative flex-col h-96 justify-between bg-white shadow-md hover:shadow-lg rounded-2xl p-6 border border-blue/10 duration-300 ease-in-out"
                >
                  <div>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="rectangular" width="100%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={60} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Skeleton variant="rectangular" width={60} height={30} />
                      <Skeleton variant="rectangular" width={60} height={30} />
                      <Skeleton variant="rectangular" width={60} height={30} />
                    </div>
                    <div className="flex justify-between bottom-0 w-full items-center mt-6">
                      <div className="flex gap-2 items-center w-full">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="text" width="60%" />
                      </div>
                      <Skeleton variant="rectangular" width={80} height={30} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center gap-4 pt-32 h-96 flex flex-col justify-center items-center">
              <h2 className="font-medium text-sm">
                No projects match your search.
              </h2>
              <NavLink
                to="/dashboard/projects/explore"
                className="bg-blue text-white font-medium  px-3 py-1 rounded-lg hover:brightness-125 duration-300 ease-in-out"
              >
                Explore Projects
              </NavLink>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((job) => (
                <div
                  key={job.id}
                  className="group flex relative flex-col h-96 justify-between bg-white shadow hover:shadow-lg rounded-xl p-6 border border-blue/10 duration-300 ease-in-out"
                >
                  {user && user.roleId === "0" ? null : (
                    <div className="absolute right-3 top-3">
                      <button
                        className="hover:bg-[#ff9292]/50 p-2 rounded-full duration-300 hover:text-[#ff4444]"
                        onClick={() => {
                          toggleModalOpen(job.nProjectId, false);
                        }}
                      >
                        <FaHeart className="text-xl text-[#ff4444]" />
                      </button>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-black/40">
                      Posted {formatTimeAgo(job.createdAt)}
                    </p>

                    <a href={`/projects/details/${job.nProjectId}`}>
                      <h3 className="truncate pr-4 text-base font-medium mt-2 hover:text-blue duration-300 ease-in-out hover:underline">
                        {job.title}
                      </h3>
                    </a>

                    <p className="text-xs text-black/50 mt-1">
                      {job.payStatus === "0" ? "Hourly Rate" : "Fixed Price"}
                    </p>

                    <p className="text-sm text-black mt-1 mb-1">
                      {getCurrencySymbolId(job.currency)}
                      {job.budget} - {job.maxBudget}{" "}
                      {getCurrencySymbolName(job.currency)}
                    </p>

                    <div className="relative prose w-full break-words h-32 pt-0 overflow-y-hidden">
                      <Interweave
                        content={job.description}
                        transform={transform1}
                      />
                      <div className="absolute w-full h-12 bottom-0 bg-gradient-to-t from-white to-white/0"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="hidden md:flex flex-nowrap overflow-clip gap-2 mt-4">
                      {job.skill &&
                        job.skill
                          .split(",")
                          .slice(0, 3)
                          .map((skills, index) => (
                            <Chip
                              key={index}
                              label={skills.trim()}
                              variant="filled"
                              size="small"
                            />
                          ))}
                      {job.skill && job.skill.split(",").length > 3 && (
                        <Chip
                          label={`+${job.skill.split(",").length - 3} more`}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </div>

                    <div className="md:hidden flex flex-nowrap overflow-clip gap-2 mt-2">
                      {job.skill &&
                        job.skill
                          .split(",")
                          .slice(0, 3)
                          .map((skills, index) => (
                            <Chip
                              key={index}
                              label={skills.trim()}
                              variant="filled"
                              size="small"
                            />
                          ))}
                      {job.skill && job.skill.split(",").length > 3 && (
                        <Chip
                          label={`+${job.skill.split(",").length - 3} more`}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </div>

                    <div className="flex justify-between bottom-0 w-full items-center mt-3">
                      <div className="flex gap-2 items-center">
                        <img
                          src={job.clientPhoto}
                          alt={job.clientName}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="ml-3 text-sm truncate">
                          {job.clientName}
                        </span>
                      </div>

                      <button
                        className="lg:flex hidden bg-blue hover:bg-blue/90 text-sm px-3 py-1 rounded-lg text-white group-hover:text-white duration-300 ease-in-out"
                        onClick={() => {
                          handleJobClick(job.nProjectId);
                          sessionStorage.setItem("post", job.clientId);
                        }}
                      >
                        View Job
                      </button>
                      <button
                        className="flex lg:hidden bg-blue hover:bg-blue/90  text-sm px-4 py-1 rounded-lg text-white group-hover:text-white duration-300 ease-in-out"
                        onClick={() => {
                          handleJobClick(job.nProjectId);
                          sessionStorage.setItem("post", job.clientId);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {unsaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-medium mb-4">Unsave Project</h3>
              <p>Are you sure you want to unsave this project?</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="bg-gray hover:bg-grey duration-300 ease-in-out px-4 py-2 rounded-lg"
                  onClick={toggleModalClose}
                >
                  Cancel
                </button>
                <button
                  className="duration-300 ease-in-out bg-red hover:bg-red/5 border border-white text-white hover:text-red hover:border-red px-4 py-2 rounded-lg"
                  onClick={() => {
                    toggleSaveProject(projectId, like);
                    toggleModalClose();
                  }}
                >
                  Unsave
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SavedProjects;
