import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Chip,
  Box,
  CircularProgress,
  Grid,
  Badge,
  Skeleton,
} from "@mui/material";
import { MenuItem, FormControl, Select } from "@mui/material";
import { Users } from "lucide-react";
// import { useAuth } from "../../../contexts/authContext";
import { useAuth } from "../../../../contexts/authContext";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { IoSearch } from "react-icons/io5";

const MyProjects = () => {
  const [filter, setFilter] = useState("All projects");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Stores the search term
  const { user, getCurrencySymbolId } = useAuth();
  const [filteredProjects, setFilteredProjects] = useState([]); // Stores filtered projects
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [handleClick, setHandleClick] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("NUserID");
    setLoading(true);
    setError(null);

    fetch(
      `https://paid2workk.solarvision-cairo.com/api/Projects_/GetMYProjectALL?FreelancerId=${userId}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch projects");
        return response.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, filter, handleClick]); // ✅ Triggers API call when `user` changes

  useEffect(() => {
    let projectsFiltered = projects.filter((project) =>
      filter === "All projects" ? true : project.status === filter
    );
    setFilteredProjects(projectsFiltered);

    // Apply search
    if (searchTerm) {
      const regex = new RegExp(searchTerm.replace(/[^a-zA-Z0-9\s]/g, ""), "i");
      projectsFiltered = projectsFiltered.filter(
        (project) =>
          regex.test(project.title) ||
          regex.test(project.skills) ||
          regex.test(project.clientName)
      );
    }

    setFilteredProjects(projectsFiltered);
  }, [handleClick, filter, projects]);

  // Handle search when "Enter" key is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filter projects based on search term and filter type
  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredProjects(projects); // If search is empty, show all projects
    } else {
      const regex = new RegExp(searchTerm.replace(/[^a-zA-Z0-9\s]/g, ""), "i");
      const results = projects.filter(
        (project) =>
          regex.test(project.title) ||
          regex.test(project.skills) ||
          regex.test(project.clientName)
      );
      setFilteredProjects(results);
    }
    setCurrentPage(1); // Reset to first page when search is changed
    setHandleClick(!handleClick);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset pagination to first page when filter changes
  };

  return (
    <div className=" pb-10 w-full">
      <div className="mt-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between w-full">
          {/* Search Box */}
          <div className="relative flex w-full md:w-3/5 gap-4 rounded-xl p-2 overflow-hidden bg-back/30 shadow-lg shadow-black/10 border border-blue/5">
            <IoSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-black/50 text-xl" />
            <input
              type="text"
              placeholder="Search by Project Name or Client Name..."
              className="w-full p-1 pl-10 outline-none focus:outline-none bg-white rounded-lg hover:border-blue/10 border border-back/30 duration-500 ease-in-out"
              value={searchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
            />
            <button
              className="bg-blue hover:brightness-125 duration-500 text-sm rounded-lg ease-in-out text-white px-5 py-1"
              onClick={() => handleSearch({ target: { value: searchTerm } })}
            >
              Search
            </button>
          </div>

          {/* Filter Box */}
          <div className="relative border-none w-full md:w-2/5 flex justify-end">
            <div className="flex items-center justify-between md:justify-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <h4 className="text-sm font-medium text-black">Filter by:</h4>
              <select
                className="border border-gray-300 text-black text-sm rounded-lg p-2 cursor-pointer"
                onChange={(e) => handleFilterChange(e.target.value)}
                value={filter}
              >
                <option value="All projects">All Projects</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="w-full ">
            <div className="border rounded-lg shadow-sm w-full overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-blue/5 text-black/80 text-left">
                  <tr className="rounded-t-lg">
                    <th className="px-6 py-4 font-medium">Project</th>
                    <th className="px-4 py-4 text-center font-medium">
                      Status
                    </th>
                    <th className="px-4 py-4 text-center font-medium">
                      Client
                    </th>
                    <th className="px-4 py-4 text-center font-medium">
                      Proposals
                    </th>
                    <th className="px-6 py-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(12)].map((_, i) => (
                    <tr className="animate-pulse group hover:bg-muted/40 hover:rounded-xl transition-all duration-300 ease-in-out">
                      {/* Project */}
                      <td className="px-6 py-5">
                        <Skeleton variant="text" width="60%" height={20} />
                        <div className="flex flex-col md:flex-row gap-1 mt-1">
                          <Skeleton variant="text" width={100} height={14} />
                          <Skeleton variant="text" width={80} height={14} />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-5 text-center">
                        <Skeleton
                          variant="rounded"
                          width={70}
                          height={22}
                          sx={{ borderRadius: "999px", mx: "auto" }}
                        />
                      </td>

                      {/* Client */}
                      <td className="px-4 py-5 text-center">
                        <div className="flex items-center justify-center">
                          <Skeleton variant="circular" width={32} height={32} />
                          <Skeleton
                            variant="text"
                            width={80}
                            height={20}
                            className="ml-2 hidden lg:block"
                          />
                        </div>
                      </td>

                      {/* Proposals */}
                      <td className="px-4 py-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Skeleton variant="circular" width={16} height={16} />
                          <Skeleton variant="text" width={20} height={14} />
                          <Skeleton
                            variant="text"
                            width={60}
                            height={14}
                            className="hidden lg:block"
                          />
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        <Skeleton
                          variant="rounded"
                          width={80}
                          height={32}
                          sx={{ borderRadius: "8px", ml: "auto" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="w-full mt-6">
            <div className="border rounded-xl shadow-sm w-full overflow-x-auto">
              {filteredProjects?.length > 0 ? (
                <table className="w-full text-sm md:text-base">
                  <thead className="bg-blue/5 text-black text-left">
                    <tr className="bg-gradient-to-t from-navy to-blue-800 border-b border-gray-200 text-sm">
                      <th className="px-4 py-4 font-medium whitespace-nowrap text-white text-center w-[5%]">
                        S No.
                      </th>
                      <th className="px-6 py-4 font-medium whitespace-nowrap text-white w-[35%]">
                        Project
                      </th>
                      <th className="px-4 py-4 text-center font-medium whitespace-nowrap text-white w-[15%]">
                        Status
                      </th>
                      <th className="px-4 py-4 text-center font-medium whitespace-nowrap text-white w-[20%]">
                        Client
                      </th>
                      <th className="px-4 py-4 text-center font-medium whitespace-nowrap text-white w-[15%]">
                        Proposals
                      </th>
                      <th className="px-6 py-4 text-right font-medium whitespace-nowrap text-white w-[10%]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredProjects.map((project, index) => (
                      <tr
                        key={project.nProjectId}
                        className="group hover:bg-muted-foreground/5 bg-white hover:rounded-xl transition-all duration-300 ease-in-out"
                      >
                        {/* S No. */}
                        <td className="px-4 py-5 w-[5%] text-center font-medium text-black text-xs md:text-sm">
                          {index + 1}
                        </td>

                        {/* Project */}
                        <td className="px-6 py-5">
                          <h3 className=" leading-tight line-clamp-2 text-sm">
                            {project.title}
                          </h3>
                          <div className="flex flex-col md:flex-row gap-0.5 md:gap-2 text-[10px] md:text-xs mt-1 text-black/60">
                            <span>
                              {getCurrencySymbolId(project.currency)}{" "}
                              {project.budget} - {project.maxBudget}
                            </span>
                            <span>•</span>
                            <span>
                               Posted {moment(project.createdAt).fromNow()}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-5 text-center">
                          <span
                            className={`text-[10px] lg:text-sm rounded-full px-2.5 py-0.5 border font-medium ${
                              project.status === "Completed"
                                ? "bg-green/10 border-green text-green"
                                : project.status === "Cancelled"
                                ? "bg-red/10 border-red text-red"
                                : project.status === "Ongoing"
                                ? "bg-purple/10 border-purple text-purple"
                                : "bg-blue/10 border-blue text-blue"
                            }`}
                          >
                            {project.status === "true" ||
                            project.status === "Posted"
                              ? "Open"
                              : project.status}
                          </span>
                        </td>

                        {/* Client */}
                        <td className="px-4 py-5 text-center">
                          <div
                            className="flex items-center justify-center cursor-pointer"
                            onClick={() => {
                              navigate("/user/details", {
                                state: {
                                  expertId: project.clientId,
                                  role: "client",
                                },
                              });
                            }}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={project.clientPhoto}
                                alt={project.clientName}
                              />
                              <AvatarFallback>
                                {project.clientName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="ml-2 text-sm text-black/75 hidden lg:block font-medium">
                              {project.clientName}
                            </span>
                          </div>
                        </td>

                        {/* Proposals */}
                        <td className="px-4 py-5 text-center">
                          <div className="flex items-center justify-center gap-1 text-black/75 text-sm">
                            <Users className="w-4 h-4" />
                            <span>{project.appliedCount}</span>
                            <span className="hidden lg:block">Proposals</span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5 text-right">
                          <button
                            className="bg-blue text-white font-medium px-6 py-1 rounded-lg hover:brightness-125 duration-300 ease-in-out hover:shadow-lg shadow"
                            onClick={() =>
                              navigate(
                                `/projects/details/${project.nProjectId}`
                              )
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className=" flex py-4 justify-center items-center">
                  No Projects to show.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
