import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/authContext";
import {
  Badge,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Paper,
  Chip,
  Skeleton,
} from "@mui/material";
import {
  MoreVert,
  Visibility,
  AccessTime,
  Edit,
  FileCopy,
} from "@mui/icons-material";

// Icons
import { FiPaperclip } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { IconButton, Tooltip } from "@mui/material";
import { CircleX, Eye, Pencil, Upload, Users, Clock } from "lucide-react";
import { Bounce, toast } from "react-toastify";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { Button } from "../../../../components/ui/button";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "list",
  "ordered",
  "bullet",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
];

const getExperienceLevel = (exp) => {
  switch (exp) {
    case "1":
      return "Entry Level ( < 2 Years )";
    case "2":
      return "Intermediate ( 2-5 Years )";
    case "3":
      return "Expert ( 5+ Years )";
    default:
      return "Entry Level ( < 2 Years )";
  }
};

const PostedProjects = () => {
  const { user, getCurrencySymbolId, currencies } = useAuth();
  const [filter, setFilter] = useState(""); // Stores the selected filter (like project type)
  const [projects, setProjects] = useState([]); // Stores all fetched projects
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedProject, setSelectedProject] = useState(null); // Selected project for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [editSkills, setEditSkills] = useState([]); // Skills for editing
  const [skillInput, setSkillInput] = useState(""); // Input for adding skills
  const [skillRecommendations, setSkillRecommendations] = useState([]); // Skill recommendations
  const [file, setFile] = useState(null); // File input for project
  const [fileName, setFileName] = useState(""); // File name
  const [fileUrl, setFileUrl] = useState(""); // File URL
  const [resultNumber, setResultNumber] = useState({
    total: 0,
    showing: 0,
  }); // Total results for pagination
  const [cancellationModal, setCancellationModal] = useState(false); // Cancellation modal state
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 12; // Items per page for pagination
  const [filteredProjects, setFilteredProjects] = useState([]); // Stores filtered projects
  const [searchTerm, setSearchTerm] = useState(""); // Stores the search term
  const [handleClick, setHandleClick] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();

  const handleMenuClick = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  // Fetch projects on initial load and when filter changes
  const fetchProjects = async () => {
    setLoading(true);
    try {
      let type = "";
      if (filter !== "") {
        type = `&type=${filter}`;
      }

      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/api/Projects_/GetMYProject?userid=${sessionStorage.getItem(
          "NUserID"
        )}${type}&itemsPerPage=${itemsPerPage}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const transformedProjects = data.map((project) => {
        const daysAgo = project.createdAt
          ? Math.floor(
              (new Date() - new Date(project.createdAt)) / (1000 * 60 * 60 * 24)
            )
          : 0;

        return {
          id: project.id,
          nProjectId: project.nProjectId,
          status: project.status || "Open",
          client: project.clientName || "Unknown Client",
          title: project.title || "",
          description: project.description || "",
          lavel: project.lavel || "1",
          payStatus: project.payStatus || "0",
          currency: project.currency || "2",
          budget: project.budget || 0,
          maxBudget: project.maxBudget || 0,
          skills: project.skill || "",
          file: project.file || null,
          posted:
            daysAgo < 0
              ? "Recently"
              : daysAgo === 0
              ? "Today"
              : `${daysAgo} days ago`,
          location: project.location || "Remote",
          deadline: project.deadline,
          clientId: project.clientId,
          clientPhoto: project.clientPhoto,
          freelancers: project.freelancersCount || 1,
          appliedCount: project.appliedCount || "0",
          actionLabel:
            project.status === "Completed"
              ? "View project"
              : "Project activity",
        };
      });

      setProjects(transformedProjects);
      setFilteredProjects(transformedProjects); // Initialize filteredProjects with all projects
      setResultNumber({
        total: transformedProjects.length,
        showing: Math.min(transformedProjects.length, itemsPerPage),
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch skills recommendations
  const fetchSkills = async () => {
    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveSkills",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const skills = data.map((skill) => skill.skillName);
      setSkillRecommendations(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setSkillRecommendations([]);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
        (project) => regex.test(project.title) || regex.test(project.skills)
      );
      setFilteredProjects(results);
    }
    setCurrentPage(1); // Reset to first page when search is changed
    setHandleClick(!handleClick);
  };

  // Update filteredProjects based on filter and search
  useEffect(() => {
    let filtered = projects;

    // Apply filter
    if (filter) {
      let status = "";
      switch (filter) {
        case "":
          break;
        case "1":
          status = "Posted";
          break;

        case "2":
          status = "Ongoing";
          break;

        case "3":
          status = "Completed";
          break;

        case "4":
          status = "Cancelled";
          break;
        default:
          status = "Posted";
      }
      filtered = filtered.filter((project) => project.status === status);
    }

    // Apply search
    if (searchTerm) {
      const regex = new RegExp(searchTerm.replace(/[^a-zA-Z0-9\s]/g, ""), "i");
      filtered = filtered.filter(
        (project) => regex.test(project.title) || regex.test(project.skills)
      );
    }

    setFilteredProjects(filtered);
    setResultNumber({ total: filtered.length });
  }, [filter, handleClick, projects]); // Reapply filtering/search when any of these values change

  // Pagination logic: calculating which projects to display on the current page
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset pagination to first page when filter changes
  };

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, [filter, currentPage]); // Fetch projects and skills when filter or page changes

  // Render paginated project listings
  const paginatedProjectListings = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFileChange = (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileSize = (selectedFile.size / 1024).toFixed(2);
      const newFileName = `${selectedFile.name} (${fileSize} KB)`;
      setFileName(newFileName);
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
      sessionStorage.setItem("projectFileName", newFileName);
    } else {
      setFileName("Invalid file type. Please select a PDF.");
      setFile(null);
      setFileUrl("");
      sessionStorage.removeItem("projectFileName");
    }
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill && !editSkills.includes(newSkill)) {
        setEditSkills([...editSkills, newSkill]);
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditSkills(editSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleEditClick = (e, project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setEditSkills(
      project.skills
        ?.split(",")
        ?.map((skill) => skill.trim())
        ?.filter(Boolean)
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleEditSubmit = async (editedProject) => {
    try {
      const formData = new FormData();
      formData.append("nProjectId", editedProject.nProjectId);
      formData.append("ClientId", sessionStorage.getItem("NUserID"));
      formData.append("Title", editedProject.title);
      formData.append("Description", editedProject.description);
      formData.append("Skill", editSkills.join(","));
      formData.append("Currency", editedProject.currency);
      formData.append("Budget", editedProject.budget);
      formData.append("MaxBudget", editedProject.maxBudget);
      formData.append("Lavel", editedProject.lavel);
      formData.append("PayStatus", editedProject.payStatus);
      formData.append("Status", "Posted");
      if (file) formData.append("NFile", file);

      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/RegisterProject",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        await fetchProjects();
        handleCloseModal();
        toast.success("Project updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        const errorText = await response.text();
        throw new Error(
          `Project update failed: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error(
        error.message || "Failed to update project. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    }
  };

  const handleCancelProject = async () => {
    if (!selectedProject.nProjectId) {
      console.error("Project id not found!");
      return;
    }
    if (!sessionStorage.getItem("NUserID")) {
      console.error("Invalid User!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("nProjectId", selectedProject.nProjectId);
      formData.append("ClientId", sessionStorage.getItem("NUserID"));
      formData.append("Status", "Cancelled");
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/RegisterProject",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        await fetchProjects();
        setCancellationModal(false);
        toast.success("Project cancelled successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        const errorText = await response.text();
        throw new Error(
          `Project cancellation failed: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("Error cancelling project!", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...selectedProject,
    };
    handleEditSubmit(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCancelClick = (project) => {
    setCancellationModal(true);
    setSelectedProject(project);
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row w-full mt-6 justify-between items-stretch">
        {/* Search Bar */}
        <div className="relative w-full md:w-3/5 flex gap-4 rounded-xl p-2 overflow-hidden bg-back/30 shadow-lg shadow-black/10 border border-blue/5">
          <IoSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-black/50 text-xl" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full p-1 pl-10 outline-none focus:outline-none bg-white rounded-lg hover:border-blue/10 border border-back/30 duration-500 ease-in-out"
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />
          <button
            className="bg-blue hover:brightness-125 text-white text-sm font-normal px-5 py-1 rounded-lg duration-500 ease-in-out focus:outline-none"
            onClick={() => handleSearch({ target: { value: searchTerm } })}
          >
            Search
          </button>
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full md:w-2/5 border-none flex justify-end md:justify-end items-center">
          <div className="flex items-center justify-between md:justify-center gap-5 w-full md:w-auto mt-4 md:mt-0">
            <h4 className="text-sm text-black font-medium">Filter by:</h4>
            <select
              className="border border-gray-300 text-black text-sm rounded-lg p-2 cursor-pointer"
              onChange={(e) => handleFilterChange(e.target.value)}
              value={filter}
            >
              <option value="">All Projects</option>
              <option value="1">Open</option>
              <option value="2">Ongoing</option>
              <option value="3">Completed</option>
              <option value="4">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className=" mt-8 ">
        {loading ? (
          <div className="border rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="bg-gradient-to-t from-navy to-blue-800 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs sm:text-sm font-medium text-white tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-4 text-center text-xs sm:text-sm font-medium text-white tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4  text-center text-xs sm:text-sm font-medium text-white tracking-wider">
                      Proposals
                    </th>
                    <th className="px-6 py-4 text-right text-xs sm:text-sm font-medium text-white tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <tr
                      key={index}
                      className="group hover:bg-muted/40 transition-all duration-300 ease-in-out"
                    >
                      <td className="px-6 py-4">
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="text" width="60%" height={15} />
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center   ">
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={30}
                        />
                      </td>
                      <td className="px-6 py-4 ">
                        <div className="flex items-center justify-center">
                          <Skeleton variant="text" width="50%" height={20} />
                        </div>
                      </td>
                      <td className="px-6 py-4 flex items-center justify-end">
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={30}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : paginatedProjects.length === 0 ? (
          <div className="text-center p-6 text-black text-sm">
            No projects found
          </div>
        ) : (
          <>
            <div className="border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto">
                <table className="w-full min-w-5xl border border-gray-200 rounded-xl shadow-sm">
                  <thead className="bg-gradient-to-t from-navy to-blue-800 text-white text-xs sm:text-sm font-medium tracking-wider">
                    <tr>
                      <th className="px-4 py-3 w-[5%] text-center whitespace-nowrap">S. No.</th>
                      <th className="px-4 py-3 text-left whitespace-nowrap w-auto">Project</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Proposals</th>
                      <th className="px-4 py-3 text-right whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white text-sm">
                    {paginatedProjects.map((job, index) => (
                      <tr
                        key={job.nProjectId}
                        className="group hover:bg-gray-50 transition-all duration-300 ease-in-out"
                      >
                        {/* S. No. */}
                        <td className="px-2 py-4 text-center w-[5%] text-gray-700 font-medium">
                          {index + 1}
                        </td>

                        {/* Project */}
                        <td className="px-4 py-4 max-w-[220px]">
                          <div className="flex flex-col">
                            <h3 className="text-sm text-gray-900 leading-tight line-clamp-2">
                              {job.title}
                            </h3>
                            {/* <div className="flex sm:gap-2 gap-y-1 mt-1 text-xs text-gray-500 items-center"> */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-gray-500">

                              <Badge className=" text-grey-900 py-0.5 rounded-full">
                                {job.payStatus === "1"
                                  ? "Fixed Price"
                                  : "Hourly Rate"}
                              </Badge> •
                              {/* <span>
                                {getCurrencySymbolId(job.currency)} {job.budget}{" "}
                                - {job.maxBudget}
                              </span> */}
                              <div className="flex items-center gap-1 text-green-600                                                       py-1 rounded-full">
                                <span className="font-medium text-xs">
                                  {getCurrencySymbolId(job.currency)}{" "}
                                  {job.budget} - {job.maxBudget}
                                </span>
                              </div>•
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Posted {job.posted}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 text-center">
                          <Badge
                            className={`text-xs rounded-full px-2 py-0.5 border font-medium ${
                              job.status === "Completed"
                                ? "bg-green-50 text-green-700 border-green-300"
                                : job.status === "Cancelled"
                                ? "bg-red-50 text-red-700 border-red-300"
                                : job.status === "Ongoing"
                                ? "bg-purple-50 text-purple-700 border-purple-300"
                                : "bg-blue-50 text-blue-700 border-blue-300"
                            }`}
                          >
                            {job.status === "true" || job.status === "Posted"
                              ? "Open"
                              : job.status}
                          </Badge>
                        </td>

                        {/* Proposals */}
                        <td className="px-4 py-4 text-center">
                          <div
                            className="flex justify-center items-center gap-1 text-gray-800 cursor-pointer hover:underline"
                            onClick={() => {
                              navigate("/dashboard/projects/proposals", {
                                state: { projectId: job.nProjectId },
                              });
                            }}
                          >
                            <Users className="w-4 h-4" />
                            <span>
                              {job.appliedCount}{" "}
                              <span className="hidden sm:inline">
                                {job.appliedCount === "1"
                                  ? "Proposal"
                                  : "Proposals"}
                              </span>
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-right">
                          <div className="hidden lg:flex items-center justify-end gap-2">
                            {(job.status === "Posted" ||
                              job.status === "Open" ||
                              job.status === "true") && (
                              <>
                                <Tooltip title="Cancel Project">
                                  <IconButton
                                    onClick={() => handleCancelClick(job)}
                                  >
                                    <CircleX className="w-4 h-4 text-red-500" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Project">
                                  <IconButton
                                    onClick={(e) => handleEditClick(e, job)}
                                  >
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 px-2 py-1 text-xs"
                              onClick={() => {
                                window.location.href = `/projects/details/${job.nProjectId}`;
                              }}
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </Button>
                          </div>

                          {/* Mobile Menu */}
                          <div className="lg:hidden flex justify-center">
                            <IconButton
                              onClick={(event) => handleMenuClick(event, job)}
                              size="small"
                            >
                              <MoreVert style={{ fontSize: "20px" }} />
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
                                onClick={() => {
                                  window.location.href = `/projects/details/${job.nProjectId}`;
                                }}
                              >
                                <Eye className="text-black bg-gray-100 p-1 rounded-md" />
                                <span className="ml-2 text-sm text-gray-800">
                                  View Project
                                </span>
                              </MenuItem>
                              {(job.status === "Posted" ||
                                job.status === "Open" ||
                                job.status === "true") && [
                                <MenuItem
                                  key="edit"
                                  onClick={(e) => {
                                    handleEditClick(e, job);
                                    setAnchorEl(null);
                                  }}
                                >
                                  <Pencil className="text-black bg-gray-100 p-1 rounded-md" />
                                  <span className="ml-2 text-sm text-gray-800">
                                    Edit Project
                                  </span>
                                </MenuItem>,

                                <MenuItem
                                  key="cancel"
                                  onClick={() => {
                                    handleCancelClick(job);
                                    setAnchorEl(null);
                                  }}
                                >
                                  <CircleX className="text-red-600 bg-red-100 p-1 rounded-md" />
                                  <span className="ml-2 text-sm text-red-600">
                                    Cancel Project
                                  </span>
                                </MenuItem>,
                              ]}
                            </Menu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {!loading && (
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

      {/* Edit Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 md:px-0">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90dvh] overflow-auto motion-scale-in-[0.50] motion-translate-x-in-[0%] motion-translate-y-in-[150%] motion-opacity-in-[0%] motion-duration-[300ms]">
            <div className="sticky top-0 bg-white border-b border-grey flex justify-between items-center px-8 py-2 z-30">
              <h2 className="text-xl font-medium">Edit Project</h2>
              <IconButton onClick={() => setIsModalOpen(false)}>
                <RxCross2 className="text-red" />
              </IconButton>
            </div>
            <form className="px-8 py-4">
              <div className="space-y-4">
                {/* Title Section */}
                <div>
                  <label className="block font-medium text-black mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={selectedProject.title}
                    onChange={handleInputChange}
                    className="block w-full h-9 outline-none ring-1 ring-black/20 rounded-lg focus:ring-blue/50 duration-300 p-3"
                    required
                  />
                </div>
                {/* Description Section */}
                <div className="">
                  <label className="block font-medium text-black mb-1 ">
                    Description
                  </label>
                  <div className="w-full">
                    <ReactQuill
                      theme="snow"
                      value={selectedProject.description}
                      onChange={(value) =>
                        handleInputChange({
                          target: { name: "description", value },
                        })
                      }
                      modules={modules}
                      formats={formats}
                      className=" rounded-lg"
                      placeholder="Already have a description? Paste it here!"
                    />
                  </div>
                </div>
                {/* Skills Section */}
                <div className="">
                  <label className="block  font-medium text-black mb-1">
                    Skills Required
                  </label>
                  <div className="relative pt-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-grey rounded-full px-2 py-0.5"
                        >
                          <span className="text-xs">{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-black/60 hover:text-black/50"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillInputKeyDown}
                      placeholder="Type a skill and press Enter"
                      className="w-full h-9 border-none text-sm outline-none ring-1 ring-black/20 rounded-lg focus:ring-blue/50 duration-300 p-3 mt-1"
                    />

                    {/* Recommendations */}
                    {skillInput && (
                      <div className="dropdownn-menu absolute z-10 bg-white border border-gray rounded-b-md w-full max-h-52 overflow-y-auto shadow-lg">
                        {skillRecommendations
                          .filter((skill) =>
                            skill.toLowerCase().includes(skillInput)
                          )
                          .map((skill, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setEditSkills([...editSkills, skill]);
                                setSkillInput("");
                              }}
                              className="dropdown-item p-2 cursor-pointer hover:bg-gray duration-200"
                            >
                              {skill}
                            </div>
                          ))}

                        {/* Add Custom Skill */}
                        {skillInput &&
                          !skillRecommendations.some(
                            (skill) =>
                              skill.toLowerCase() === skillInput.toLowerCase()
                          ) && (
                            <div
                              className="dropdown-item custom-skill p-2 italic text-blue cursor-pointer hover:bg-gray-200"
                              onClick={() => {
                                setEditSkills([...editSkills, skillInput]);
                                setSkillInput("");
                              }}
                            >
                              Add "{skillInput}" as new skill
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Experience and Pay Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                  <div>
                    <div>
                      <label className="block font-medium text-black mb-1">
                        Experience Level
                      </label>
                      <select
                        name="lavel"
                        value={selectedProject.lavel || "1"}
                        onChange={handleInputChange}
                        className="block w-full  outline-none ring-1 ring-black/20 rounded-lg focus:ring-blue/50 duration-300 h-9 pl-3  "
                      >
                        <option value="1">{`Entry Level ( < 2 Years )`}</option>
                        <option value="2">{`Intermediate ( 2-5 Years )`}</option>
                        <option value="3">{`Expert ( 5+ Years )`}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-black mb-1">
                      Pay Type
                    </label>
                    <select
                      name="payStatus"
                      value={selectedProject.payStatus || "0"}
                      onChange={handleInputChange}
                      className="block w-full  outline-none ring-1 ring-black/20 rounded-lg focus:ring-blue/50 duration-300 h-9 pl-3 "
                    >
                      <option value="0">Hourly Rate</option>
                      <option value="1">Fixed Price</option>
                    </select>
                  </div>
                </div>
                {/* Budget Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-medium text-black mb-1">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={selectedProject.currency || "2"}
                      onChange={handleInputChange}
                      className="block w-full  outline-none ring-1 ring-black/20 rounded-lg focus:ring-blue/50 duration-300 pl-3  h-9"
                    >
                      {currencies.map((currency, index) => (
                        <option
                          key={index}
                          value={currency.currency_Id}
                        >{`${currency.currency} (${currency.symbol})`}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-black mb-1">
                      Minimum Budget
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={selectedProject.budget}
                      onChange={handleInputChange}
                      className="block w-full outline-none ring-1 ring-black/20 rounded-lg focus:ring-blue/50 duration-300 p-3 h-9"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-black mb-1">
                      Maximum Budget
                    </label>
                    <input
                      type="number"
                      name="maxBudget"
                      value={selectedProject.maxBudget}
                      onChange={handleInputChange}
                      className="block w-full  outline-none ring-1 ring-black/20 rounded-lg focus:ring-blue/50 duration-300 p-3 h-9"
                      min="0"
                      required
                    />
                  </div>
                </div>
                {/* Attachment */}
                <h3 className=" font-medium  text-black mb-2">Attachment</h3>
                {selectedProject?.file && (
                  <div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (file) {
                              window.open(
                                fileUrl,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            } else {
                              window.open(
                                selectedProject.file,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }
                          }}
                          className="w-40 text-sm flex items-center justify-center gap-1 px-3 py-1  font-medium text-blue bg-white border border-blue rounded-lg hover:bg-blue/10 ease-in-out duration-300"
                        >
                          <FiPaperclip /> View Attachment
                        </button>
                        <Tooltip title="Upload new attachment">
                          <label
                            htmlFor="file-input"
                            className="cursor-pointer"
                          >
                            <IconButton component="span">
                              <Upload className="text-blue w-5 h-5" />
                            </IconButton>
                          </label>
                          <input
                            type="file"
                            id="file-input"
                            className="file-input hidden"
                            accept=".pdf, image/*"
                            onChange={handleFileChange}
                          />
                        </Tooltip>
                      </div>

                      <span className="text-sm text-black/70">
                        {" "}
                        {file
                          ? `File Name: ${fileName}`
                          : `File Name: ${selectedProject.file?.split("/")[8]}`}
                      </span>
                    </div>
                  </div>
                )}
                {!selectedProject?.file && (
                  <>
                    <div className="w-40">
                      {" "}
                      <label htmlFor="file-input" className="w-40">
                        <span className="cursor-pointer w-40 flex items-center justify-center mt-1 gap-2 px-3 py-1.5 font-medium text-sm border-blue border hover:brightness-110 duration-300 ease-in-out text-blue rounded-md ">
                          <Upload className="text-blue w-5 h-5" />
                          Add Attachment
                        </span>
                      </label>
                      <input
                        type="file"
                        id="file-input"
                        className="file-input hidden"
                        accept=".pdf, image/*"
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFileChange(e);
                        }}
                      />
                    </div>

                    {file && (
                      <span className="text-sm text-black/70">
                        {" "}
                        {file
                          ? `File Name: ${fileName}`
                          : `File Name: ${selectedProject.file?.split("/")[8]}`}
                      </span>
                    )}
                  </>
                )}
              </div>
            </form>
            <div className="sticky bottom-0 flex justify-end bg-white px-8 py-3 gap-2 border-t border-gray">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-3 py-1 text-sm font-medium text-red bg-white rounded-md border border-red hover:bg-red/5 duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-1 text-sm font-medium text-white bg-blue rounded-md hover:brightness-125 duration-300 "
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {cancellationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Confirm Cancellation</h3>
            <p>Are you sure you want to mark this project as Cancelled?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray hover:bg-grey duration-300 ease-in-out px-4 py-2 rounded-lg"
                onClick={() => setCancellationModal(false)}
              >
                Discard
              </button>
              <button
                className="duration-300 ease-in-out bg-red hover:bg-red/5 border border-white text-white hover:text-red hover:border-red px-4 py-2 rounded-lg"
                onClick={() => {
                  handleCancelProject();
                  setCancellationModal(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostedProjects;
