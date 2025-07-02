import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/authContext";
import { Button } from "../../../../components/ui/button";

import {
  Badge,
  Menu,
  MenuItem,
  Grid,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import {
  Check,
  CircleX,
  Eye,
  Pencil,
  Trash,
  Upload,
  Users,
  Clock,
} from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { IoSearch } from "react-icons/io5";

const AppliedProjects = () => {
  const { user, getCurrencySymbolId } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 12; // Items per page for pagination
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null); // Selected project for editing
  const [filteredProjects, setFilteredProjects] = useState([]); // Stores filtered projects
  const [resultNumber, setResultNumber] = useState({
    total: 0,
    showing: 0,
  }); // Total results for pagination
  const [handleClick, setHandleClick] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Stores the search term
  const navigate = useNavigate();

  const handleMenuClick = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  useEffect(() => {
    fetchAppliedProjects();
  }, []);

  const fetchAppliedProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetBid?freelancerId=${sessionStorage.getItem(
          "NUserID"
        )}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        const transformedProjects = data.map((project) => ({
          id: project.projectId || null,
          // status: project.status || "In queue",
          client: project.clientname || "Unknown Client",
          title: project.projectTitle || "Project titled",
          posted: project.bidTimestamp
            ? getTimeAgo(project.bidTimestamp)
            : "N/A",
          location: project.location || "Remote",
          // level: project.level || "Not specified",
          // freelancers: project.freelancersCount || 1,
          budget: project.bidAmount
            ? `${project.bidAmount}`
            : "Budget not specified",
          status: project.projectStatus,
          actionLabel:
            project.status === "Completed"
              ? "Project activity"
              : "View project",
          background: getStatusBackground(project.status),
          color: getStatusColor(project.status),
          clientPhoto: project.clientPhotoPath,
          appliedCount: project.appliedCount,
          currency: project.currency,
          clientId: project.clientId,
        }));
        setProjects(transformedProjects);
        setFilteredProjects(transformedProjects); // Initialize filteredProjects with all projects
        setResultNumber({
          total: transformedProjects.length,
          showing: Math.min(transformedProjects.length, itemsPerPage),
        });
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBackground = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return "rgb(204, 229, 255)";
      case "completed":
        return "rgb(220, 250, 230)";
      default:
        return "rgb(255, 237, 237)";
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const pastDate = new Date(timestamp);

    const diffInMilliseconds = now - pastDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays === 0) return "Today";
    if (diffInMonths > 0)
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;

    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return "rgb(11, 107, 202)";
      case "completed":
        return "rgb(27, 133, 93)";
      default:
        return "rgb(77, 146, 214)";
    }
  };

  // Handle search when "Enter" key is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
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
          regex.test(project.client)
      );
      setFilteredProjects(results);
    }
    setCurrentPage(1); // Reset to first page when search is changed
    setHandleClick(!handleClick);
  };

  // Pagination logic: calculating which projects to display on the current page
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="pb-10 w-full">
        <div className="mt-6 w-full">
          <div className="relative mt-6 flex gap-4 rounded-xl p-2 overflow-hidden bg-back/30 shadow-lg shadow-black/10 border border-blue/5">
            <IoSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-black/50 text-xl" />
            <input
              type="text"
              placeholder="Search by Project Name or Client Name..."
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
          <div className=" mt-6">
            {isLoading ? (
              <div className="rounded-xl overflow-hidden shadow-md w-full border">
                <table className="table-auto w-full text-left text-sm md:text-base text-black/80">
                  <thead className="bg-blue/5 font-semibold">
                    <tr className="bg-gradient-to-t from-navy to-blue-800 border-b border-gray-200">
                      <th className="px-6 py-4 w-[40%]">Project</th>
                      <th className="px-4 py-4 text-center w-[20%]">Client</th>
                      <th className="px-4 py-4 text-center w-[20%]">
                        Proposals
                      </th>
                      <th className="px-4 py-4 text-end w-[20%]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(10)].map((_, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray/20 bg-white hover:bg-white"
                      >
                        <td className="px-6 py-5 ">
                          <Skeleton variant="text" width="80%" />
                          <Skeleton variant="text" width="60%" />
                        </td>
                        <td className="text-center">
                          <div className=" flex items-center justify-center gap-2">
                            <Skeleton
                              variant="circular"
                              width={32}
                              height={32}
                            />
                            <Skeleton variant="text" width="30%" />
                          </div>
                        </td>
                        <td className="text-center ">
                          <div className=" flex items-center justify-center">
                            <Skeleton variant="text" width={80} />
                          </div>
                        </td>
                        <td className="text-center ">
                          <div className="flex justify-end items-center pr-4">
                            <Skeleton
                              variant="rectangular"
                              width={70}
                              height={30}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : paginatedProjects.length === 0 ? (
              <div>No projects found</div>
            ) : (
              <>
                <div className="shadow-md w-full border rounded-xl overflow-auto">
                  <table className="table-auto w-full min-w-5xl text-sm md:text-base text-black">
                    {/* Table Header */}
                    <thead className="bg-blue/5 text-left font-semibold border-b">
                      <tr className="bg-gradient-to-t from-navy to-blue-800 border-b border-gray-200 text-sm">
                        <th className="px-4 py-4 w-[5%]  whitespace-nowrap text-white">
                          S No.
                        </th>
                        <th className="px-6 py-4 w-[35%]  whitespace-nowrap text-white">
                          Project
                        </th>
                        <th className="px-2 text-start w-[20%]  whitespace-nowrap text-white">
                          Client
                        </th>
                        <th className="px-2 text-center w-[20%]  whitespace-nowrap text-white">
                          Proposals
                        </th>
                        <th className="px-2 text-end w-[20%] pr-4  whitespace-nowrap text-white">
                          Action
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {paginatedProjects.map((job, index) => (
                        <tr
                          key={index}
                          className="group hover:bg-muted-foreground/5 bg-white hover:rounded-xl border-b last:border-0 transition-all duration-300 ease-in-out"
                        >
                          {/* S No. Column */}
                          <td className="px-4 py-5 text-sm font-medium text-black text-center">
                            {index + 1}
                          </td>

                          {/* Project Column */}
                          <td className="px-6 py-5">
                            <div className="text-sm text-black leading-tight line-clamp-2">
                              {job.title}
                            </div>
                            <div className="flex flex-wrap gap-1 md:gap-3 text-[10px] md:text-xs text-black mt-1">
                              <span>
                                {getCurrencySymbolId(job.currency)} {job.budget}
                              </span>
                              <span className="text-gray-800">•</span>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>Applied {job.posted}</span>
                              </div>
                            </div>
                          </td>

                          {/* Client Column */}
                          <td className="text-center px-2">
                            <div
                              className="flex items-center justify-start cursor-pointer gap-2"
                              onClick={() => {
                                navigate("/user/details", {
                                  state: {
                                    expertId: job.clientId,
                                    role: "client",
                                  },
                                });
                              }}
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={job.clientPhoto}
                                  alt={job.client}
                                />
                                <AvatarFallback>
                                  {job.client?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="hidden md:inline-block text-xs md:text-sm text-black truncate">
                                {job.client}
                              </span>
                            </div>
                          </td>

                          {/* Proposals Column */}
                          <td className="text-center px-2">
                            <div className="flex items-center justify-center gap-1 text-xs md:text-sm text-black/75">
                              <Users className="w-4 h-4" />
                              <span className="flex items-center gap-1">
                                {job.appliedCount}
                                <span className="hidden md:inline-block">
                                  {job.appliedCount === "1"
                                    ? "Proposal"
                                    : "Proposals"}
                                </span>
                              </span>
                            </div>
                          </td>

                          {/* Action Column */}
                          <td className="px-2 text-center pr-4">
                            {/* Desktop View Button */}
                            <div className="hidden lg:flex justify-end">
                              <Button
                                size="sm"
                                className="flex items-center gap-1.5 justify-center h-8 font-normal"
                                onClick={() => {
                                  window.location.href = `/projects/details/${job.id}`;
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View</span>
                              </Button>
                            </div>

                            {/* Mobile Dropdown Menu */}
                            <div className="flex lg:hidden justify-end">
                              <IconButton
                                onClick={(e) => handleMenuClick(e, job)}
                                size="small"
                              >
                                <MoreVert
                                  className="text-black/80"
                                  fontSize="small"
                                />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={
                                  Boolean(anchorEl) && selectedProject === job
                                }
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                              >
                                <MenuItem
                                  onClick={() =>
                                    (window.location.href = `/projects/details/${job.id}`)
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Eye className="text-black bg-gray p-1.5 rounded-md w-8 h-8" />
                                  <span className="text-black/80 text-sm font-medium">
                                    View Project
                                  </span>
                                </MenuItem>
                              </Menu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {!isLoading && (
                  <div className="flex justify-center mt-6">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex font-medium items-center justify-center gap-0.5 mx-1 pl-2 pr-3 py-0.5 text-sm rounded-lg ${
                        currentPage === 1
                          ? "bg-gray text-black/50 border-0"
                          : "bg-white text-blue"
                      } border border-blue duration-300 ease-in-out`}
                    >
                      <FaChevronLeft />
                      <span>Back</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => {
                        // Always show first page
                        if (pageNum === 1)
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-2 py-0.5 text-sm mx-1 rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-blue text-white no-underline"
                                  : "bg-white text-blue"
                              } border border-blue`}
                            >
                              {pageNum}
                            </button>
                          );

                        // Always show last page
                        if (pageNum === totalPages)
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-2 py-0.5 text-sm mx-1 rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-blue text-white no-underline"
                                  : "bg-white text-blue"
                              } border border-blue`}
                            >
                              {pageNum}
                            </button>
                          );

                        // Show current page and one page before and after current
                        if (
                          pageNum === currentPage ||
                          pageNum === currentPage - 1 ||
                          pageNum === currentPage + 1
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-2 py-0.5 text-sm mx-1 rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-blue text-white no-underline"
                                  : "bg-white text-blue"
                              } border border-blue`}
                            >
                              {pageNum}
                            </button>
                          );
                        }

                        // Show ellipsis after first page if needed
                        if (pageNum === 2 && currentPage > 3) {
                          return (
                            <span key={pageNum} className="px-2">
                              ...
                            </span>
                          );
                        }

                        // Show ellipsis before last page if needed
                        if (
                          pageNum === totalPages - 1 &&
                          currentPage < totalPages - 2
                        ) {
                          return (
                            <span key={pageNum} className="px-2">
                              ...
                            </span>
                          );
                        }

                        return null;
                      }
                    )}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex font-medium items-center justify-center gap-0.5 mx-1 pl-3 pr-2 py-0.5 text-sm rounded-lg ${
                        currentPage === totalPages
                          ? "bg-gray text-black/50 border-0"
                          : "bg-white text-blue"
                      } border border-blue duration-300 ease-in-out`}
                    >
                      <span>Next</span>
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppliedProjects;
