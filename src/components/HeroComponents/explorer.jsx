import React, { useState, useEffect } from "react";
import { Chip, Skeleton } from "@mui/material";
import { FaRegHeart, FaHeart, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { Interweave } from "interweave";
import { transform1 } from "../../utils/transform";

const Explorer = () => {
  const [filter, setFilter] = useState("Newest");
  const navigate = useNavigate();
  const [likeClicked, setLikeClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, getCurrencySymbolId, getCurrencySymbolName } = useAuth();

  const [services, setServices] = useState([]);
  const userId = user ? sessionStorage.getItem("NUserID") : null;
  const roleId = sessionStorage.getItem("roleId");

  // Map filter to orderId
  const getOrderId = () => {
    switch (filter) {
      case "Newest":
        return "0";
      case "Featured":
        return "1";
      case "Top rate":
        return "2";
      default:
        return "0";
    }
  };

  const filteredServices = () => services;

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = `https://paid2workk.solarvision-cairo.com/api/Projects_/FilterProjects?userId=${userId}&order=${getOrderId()}`;

      // If filter is "Newest" and user is freelancer (roleId === "1"), add projectName param
      // if (filter === "Featured" && user && roleId === "1" && user.skill) {
      //   const skill = user.skill.split(",")[0];
      //   url += `&projectName=${encodeURIComponent(skill)}`;
      // }

      const response = await fetch(url);
      const data = await response.json();
      const projectsArray = Array.isArray(data) ? data : [];
      setServices(projectsArray);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter) {
      setLoading(true);
      fetchServices();
    }
  }, [filter]);

  useEffect(() => {
    fetchServices();
  }, [likeClicked]);

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

  const toggleSaveProject = async (projectId, isSaving) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setLikeClicked(!likeClicked);
      const url = `https://paid2workk.solarvision-cairo.com/api/Projects_/SaveProject/`;

      const formData = new FormData();
      formData.append("NProjectId", projectId);
      formData.append("FreelancerId", sessionStorage.getItem("NUserID"));
      formData.append("Like", !isSaving);

      await fetch(url, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleJobClick = (nProjectId) => {
    navigate(`/projects/details/${nProjectId}`);
  };

  return (
    <>
      <div className="bg-mute/15 text-prime py-6">
        <div className="container max-w-7xl mx-auto px-10 md:px-5">
          <h2 className="text-xl font-medium text-center">Explore Projects</h2>
          <div className="flex justify-center gap-2 mb-6 mt-4">
            <button
              className={`${
                filter === "Newest"
                  ? "bg-blue text-white"
                  : "bg-white text-blue"
              } border border-blue hover:bg-blue/90 hover:text-white text-sm rounded-full px-3 py-0.5 duration-300 ease-in-out`}
              onClick={() => setFilter("Newest")}
            >
              Newest
            </button>

            <button
              className={`${
                filter === "Featured"
                  ? "bg-blue text-white"
                  : "bg-white text-blue"
              } border border-blue hover:bg-blue/90 hover:text-white text-sm rounded-full px-3 py-0.5 duration-300 ease-in-out`}
              onClick={() => setFilter("Featured")}
            >
              Relevant
            </button>

            <button
              className={`${
                filter === "Top rate"
                  ? "bg-blue text-white"
                  : "bg-white text-blue"
              } border border-blue hover:bg-blue/90 hover:text-white text-sm rounded-full px-3 py-0.5 duration-300 ease-in-out`}
              onClick={() => setFilter("Top rate")}
            >
              Top rate
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading
              ? Array.from(new Array(6)).map((_, index) => (
                  <div
                    key={index}
                    className="flex relative flex-col h-96 justify-between bg-white shadow-md hover:shadow-lg rounded-xl p-6 border border-blue/10 duration-300 ease-in-out"
                  >
                    <div>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={20}
                      />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={20}
                      />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={60}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Skeleton
                          variant="rectangular"
                          width={60}
                          height={30}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={60}
                          height={30}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={60}
                          height={30}
                        />
                      </div>
                      <div className="flex justify-between bottom-0 w-full items-center mt-6">
                        <div className="flex gap-2 items-center w-full">
                          <Skeleton variant="circular" width={32} height={32} />
                          <Skeleton variant="text" width="60%" />
                        </div>
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={30}
                        />
                      </div>
                    </div>
                  </div>
                ))
              : filteredServices()
                  .slice(0, 6)
                  .map((job) => (
                    <div
                      key={job.id}
                      className="group flex relative flex-col h-92 hover:border-blue/25 justify-between bg-white shadow hover:shadow-lg rounded-xl p-4 border border-blue/10 duration-300 ease-in-out"
                    >
                      {user && user.roleId === "0" ? (
                        <></>
                      ) : (
                        <div className="absolute right-3 top-3">
                          <button
                            className="hover:bg-[#ff9292]/50 p-2 rounded-full duration-300 hover:text-[#ff4444] "
                            onClick={() => {
                              toggleSaveProject(job.nProjectId, job.like);
                            }}
                          >
                            {job.like ? (
                              <FaHeart className="text-xl text-[#ff4444] motion-preset-confetti " />
                            ) : (
                              <FaRegHeart
                                className="text-xl motion-preset-shake motion-duration-300
 "
                              />
                            )}
                          </button>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-prime/40">
                          Posted {formatTimeAgo(job.createdAt)}
                        </p>

                        <a href={`/projects/details/${job.nProjectId}`}>
                          <h3 className="truncate pr-4 text-base mt-2 font-medium  hover:text-blue duration-300 ease-in-out hover:underline">
                            {job.title}
                          </h3>
                        </a>

                        <p className="text-xs text-prime/50 mt-1">
                          {job.payStatus === "0"
                            ? "Hourly Rate"
                            : "Fixed Price"}
                        </p>
                        <p className="text-sm text-prime mt-1 mb-1">
                          {getCurrencySymbolId(job.currency)}
                          {job.budget} - {job.maxBudget}{" "}
                          {getCurrencySymbolName(job.currency)}
                        </p>
                        <span className="font-medium text-sm ">
                          {" "}
                          Description
                        </span>
                        <div className="relative prose w-full break-words h-32 pt-0 overflow-y-hidden">
                          <Interweave
                            content={job.description}
                            transform={transform1}
                          />
                          <div className="absolute w-full h-12 bottom-0 bg-gradient-to-t from-white to-white/0 "></div>
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
                              label={`+${job.skill.split(",").length - 1}`}
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
                              label={`+${job.skill.split(",").length - 1} more`}
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
                            className="lg:flex hidden font-medium bg-white group-hover:bg-blue text-sm px-4 py-1 rounded-md text-blue group-hover:text-white duration-300 ease-in-out"
                            onClick={() => {
                              handleJobClick(job.nProjectId);
                              sessionStorage.setItem("post", job.clientId);
                            }}
                          >
                            View Job
                          </button>
                          <button
                            className="flex lg:hidden bg-white group-hover:bg-blue text-sm px-4 py-1 rounded-md text-blue group-hover:text-white duration-300 ease-in-out"
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

          <div className="flex items-center justify-center w-full mt-6">
            <a
              className="flex items-center justify-center w-fit gap-0.5 text-blue hover:underline"
              href="/projects"
            >
              <span className="duration-200 text-sm ease-in-out">View All</span>
              <FaChevronRight className="text-sm duration-200 ease-in-out pb-0.5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Explorer;
