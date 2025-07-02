import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { IoMdOptions } from "react-icons/io";
import {
  FaAngleRight,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa6";
import { Chip, Collapse, Skeleton } from "@mui/material";
import { useAuth } from "../../../../contexts/authContext";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../../lib/utils";

import { Interweave } from "interweave";
import { transform1 } from "../../../../utils/transform";

const experienceLevels = [
  { value: "1", label: "Entry Level" },
  { value: "2", label: "Intermediate" },
  { value: "3", label: "Expert" },
];

const ExploreProjects = () => {
  const [searchProject, setSearchProject] = useState("");
  const [jobListings, setJobListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterCategories, setMasterCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filtersApply, setFiltersApply] = useState(false);
  const [filters, setFilters] = useState({
    category: " ",
    sort: "",
    minHourly: "",
    maxHourly: "",
    currency: " ",
    experience: "",
    skills: "",
    jobType: "",
  });
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultNumber, setResultNumber] = useState({
    total: 0,
    showing: 0,
  });
  const [sortOption, setSortOption] = useState("latest");
  const [likeClicked, setLikeClicked] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);

  const {
    user,
    getCurrencySymbolId,
    getCurrencySymbolName,
    currencies,
    isLoggedIn,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = 12;

  const urlParams = new URLSearchParams(window.location.search);
  const projectName = urlParams.get("projectName");
  const searchQuery = urlParams.get("search");

  const handleSortChange = (event) => {
    const selectedValue = event.target.value; // Get the selected value
    setSortOption(selectedValue); // Update the state
  };

  const handleSkillSelect = (value) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills === value ? "" : value, // Toggle the skill (select/deselect)
    }));
    setSkillsOpen(false);
  };

  useEffect(() => {
    // Set loading state to true only when actual filters, search query, or sort option changes
    if (sortOption || searchQuery || filtersApply) {
      setIsLoading(true);
    }

    fetchCategories();
    fetchJobListings();

    // Ensure that likeClicked does not reset the loading state
  }, [sortOption, searchQuery, filtersApply]);

  useEffect(() => {
    fetchJobListings();
  }, [likeClicked]);

  useEffect(() => {
    // Clear search value on component unmount or page reload
    return () => {
      sessionStorage.removeItem("lastSearch");
    };
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveSkills"
      );
      const categories = await response.json();
      setCategories(categories);
      const masterResponse = await fetch(
        "https://paid2workk.solarvision-cairo.com/Getlists"
      );
      const masterCategories = await masterResponse.json();
      setMasterCategories(masterCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch job listings
  const fetchJobListings = async (updatedFilters = filters, page = 1) => {
    // if(sortOption || searchQuery || filters) setIsLoading(true);
    const {
      sort,
      category,
      minHourly,
      maxHourly,
      fixedPrice,
      lessThan100,
      hourly,
      entryLevel,
      intermediateLevel,
      expertLevel,
      jobType,
      experience,
      skills,
      currency,
    } = updatedFilters;

    let order = "";
    if (sortOption === "latest") {
      order = "0";
    } else if (sortOption === "oldest") {
      order = "1";
    } else if (sortOption === "rating") {
      order = "2";
    }

    try {
      let url = `https://paid2workk.solarvision-cairo.com/api/Projects_/FilterProjects?page=${page}&itemsPerPage=${itemsPerPage}&order=${order}&`;

      const auth = isLoggedIn;

      if (auth) url += `userId=${sessionStorage.getItem("NUserID")}&`;

      // Add search or project filters
      if (searchQuery) url += `projectName=${encodeURIComponent(searchQuery)}&`;
      if (projectName) url += `projectName=${encodeURIComponent(projectName)}&`;

      // Add filter-specific parameters
      if (sort) url += `sort=${sort}&`;
      if (skills) url += `skills=${encodeURIComponent(skills)}&`;
      if (minHourly) url += `minBudget=${minHourly}&`;
      if (maxHourly) url += `maxBudget=${maxHourly}&`;
      if (jobType) url += `paidBy=${jobType}&`;
      if (experience) url += `lavel=${experience}&`;
      if (category) url += category !== " " ? `categories=${category}&` : "";
      if (currency) url += currency !== " " ? `Currency=${currency}&` : "";

      const response = await fetch(url);
      const projects = await response.json();

      const projectsArray = Array.isArray(projects) ? projects : [];

      setJobListings(projectsArray);

      setResultNumber({
        total: projects.length,
        showing: Math.min(projects.length, itemsPerPage),
      });
    } catch (error) {
      console.error("Error fetching job listings:", error);
      setJobListings([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "minHourly" || name === "maxHourly") {
      newValue = parseFloat(newValue) || 0; // Default to 0 if invalid
    }

    const newFilters = {
      ...filters,
      [name]: newValue,
    };

    // Validate filters
    let error = "";
    if (
      name === "minHourly" &&
      newFilters.maxHourly &&
      newFilters.maxHourly < newValue
    ) {
      error = "Min hourly rate cannot exceed max hourly rate.";
    } else if (
      name === "maxHourly" &&
      newFilters.minHourly &&
      newFilters.minHourly > newValue
    ) {
      error = "Max hourly rate cannot be less than min hourly rate.";
    }

    setFilters(newFilters);
    setIsApplyDisabled(!!error);
  };

  // Apply filters
  const handleFilterApply = () => {
    setCurrentPage(1); // Reset pagination
    fetchJobListings(filters, 1); // Fetch with updated filters
    setIsOpen(false);
    setIsModalOpen(false);
    setFiltersApply(!filtersApply);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    const totalPages = Math.ceil(resultNumber.total / itemsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    setIsLoading(true);
    fetchJobListings(filters, pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Handle saving a job
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

  // Render paginated job listings
  const paginatedJobListings = jobListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(resultNumber.total / itemsPerPage);

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

  const handleJobClick = (projectId) => {
    navigate(`/projects/details/${projectId}`);
  };

  // Reset filters
  const handleFilterReset = () => {
    const resetFilters = {
      category: " ",
      sort: "",
      minHourly: "",
      maxHourly: "",
      currency: " ",
      experience: "",
      skills: "",
      jobType: "",
    };
    setCurrentPage(1); // Reset pagination
    setFilters(resetFilters);
    setIsOpen(false);
    setIsModalOpen(false);
    fetchJobListings(resetFilters, 1); // Fetch with updated filters instantly
  };

  const handleSearch = () => {
    if (searchProject) {
      // Update the URL with the search term
      navigate({
        pathname: location.pathname,
        search: `?search=${encodeURIComponent(searchProject)}`,
      });
      setIsOpen(false);
      fetchJobListings(filters, 1, searchProject);
    }
  };

  // Handle Advanced Options
  const handleAdvanceOptions = () => {
    setIsOpen(!isOpen);
  };

  const handleAdvanceOptionsSmall = () => {
    setIsModalOpen(!isOpen);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search when Enter is pressed
    }
  };

  return (
    <>
      <div className="pb-10">

        {/* Search Bar */}
        <div className="mt-6">
          {/* Small Screen */}
          <div className="w-full md:hidden flex relative items-stretch rounded-xl p-x-2 py-2 overflow-hidden bg-back/30 shadow-lg shadow-black/10 border border-blue/5 ">
            <div className="w-4/5 ">
              <input
                type="text"
                id="searchInput2"
                placeholder={`Search projects...`}
                className="w-full p-1 pl-10 focus:outline-none rounded-l-lg"
                value={searchProject}
                onChange={(e) => setSearchProject(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>

            <button
                  className="bg-blue text-sm hover:bg-blue/80 duration-200 ease-in-out text-white px-3 py-1 rounded-r-lg "
              onClick={handleSearch}
            >
              <IoSearch />
            </button>
            <button
               className="bg-white hover:bg-grey/30 border border-blue/10 text-blue/50 hover:text-blue/75 duration-500 rounded-lg ease-in-out font-medium px-3 py-1 ml-2 flex items-center justify-center gap-3"
              onClick={handleAdvanceOptionsSmall}
            >
              <IoMdOptions />
            </button>
          </div>

          {/* Large Screen */}
       <div className="hidden md:flex flex-col items-stretch rounded-xl px-2 py-2 overflow-hidden bg-back/30 shadow-lg shadow-black/10 border border-blue/5">
            {/* Wrapper div */}
            <div className="flex items-center gap-2 w-full">
              {/* Search Input */}
              <div className="w-3/5 lg:w-full relative flex-1 border-grey border-b md:border-b-0">
                <IoSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-black/50 text-xl" />
                <input
                  type="text"
                  id="searchInput"
                  placeholder={`Search projects...`}
                  className="w-full p-1 pl-10 outline-none focus:outline-none bg-white rounded-lg hover:border-blue/10 border border-back/30 duration-500 ease-in-out"
                  value={searchProject}
                  onChange={(e) => setSearchProject(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              {/* Search Button */}
              <button
                 className="bg-blue h-8 hover:brightness-125 text-sm duration-500 rounded-lg ease-in-out text-white px-3 py-1"
                onClick={handleSearch}
              >
                Search
              </button>

              {/* Advance Options Button */}
              <button
                 className="bg-white h-9 hover:brightness-110 border border-blue/10 text-blue transform duration-300 rounded-lg ease-in-out font-medium px-3 py-1 flex items-center justify-center gap-3"
                onClick={handleAdvanceOptions}
              >
                <IoMdOptions className="rotate-90" />
                Advance Options
                <FaAngleRight
                  className={`text-sm ${
                    isOpen ? "rotate-90" : ""
                  } transition-all duration-500 ease-in-out`}
                />
              </button>
            </div>

            {/* Collapse menu */}
            <Collapse in={isOpen}>
              <div className="transition-all duration-500 ease-in-out mt-10 px-3 pb-3 text-black/80">
                <div className="flex flex-row gap-20 w-full">
                  <div className="flex flex-col space-y-6 w-full">
                    {/* Category Select */}
                    <div className="space-y-2">
                      <Label
                        className="text-lg font-semibold text-black/80"
                        htmlFor="category"
                      >
                        Category
                      </Label>
                      <Select
                        value={filters.category}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger id="category" className="bg-white">
                          <SelectValue placeholder="Select Categories" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          <SelectItem value={" "}>All</SelectItem>
                          {masterCategories.map((category) => (
                            <SelectItem
                              key={category.masterCategory.id}
                              value={category.masterCategory.id}
                            >
                              {category.masterCategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Experience Level Dropdown */}
                    <div className="space-y-2">
                      <Label
                        className="text-lg font-semibold text-black/80"
                        htmlFor="experience"
                      >
                        Experience Level
                      </Label>
                      <Select
                        value={filters.experience}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, experience: value }))
                        }
                      >
                        <SelectTrigger className="bg-white" id="experience">
                          <SelectValue placeholder="Select Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Skills Single-select */}
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-black/80">
                        Skills
                      </Label>
                      <Popover>
                        <PopoverTrigger
                          className="bg-white hover:shadow transition-shadow duration-300"
                          asChild
                        >
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={!!filters.skills}
                            className="w-full justify-between border-gray text-black/80 hover:shadow hover:border-black/10 hover:bg-gray hover:brightness-105 duration-300 ease-in-out transition-all"
                          >
                            {filters.skills !== ""
                              ? categories.find(
                                  (skill) => skill.skillName === filters.skills
                                )?.skillName
                              : "Select a skill..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full p-0"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <Command className="w-[16.3rem] 2xl:w-[20.3rem]">
                            <CommandInput placeholder="Search skills..." />
                            <CommandList>
                              <CommandEmpty>No skill found.</CommandEmpty>
                              <CommandGroup>
                                {categories.map((skill) => (
                                  <CommandItem
                                    key={skill.skillID}
                                    onSelect={() =>
                                      handleSkillSelect(skill.skillName)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        filters.skills === skill.skillName
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {skill.skillName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-6 w-full">
                    {/* Job Type Radio */}
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-black/80">
                        Job Type
                      </Label>
                      <RadioGroup
                        value={filters.jobType}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, jobType: value }))
                        }
                      >
                        <div className="flex gap-6 text-black/60">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="hourly" />
                            <Label htmlFor="hourly">Hourly Rate</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="fixed" />
                            <Label htmlFor="fixed">Fixed Price</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      <div className="grid grid-cols-2 gap-4 pt-3">
                        <div className="flex items-center col-span-2">
                          <Label className="w-full" htmlFor="currency">
                            Currency
                          </Label>
                          <Select
                            className="w-1/2"
                            value={filters.currency}
                            onValueChange={(value) =>
                              setFilters((prev) => ({
                                ...prev,
                                currency: value,
                              }))
                            }
                          >
                            <SelectTrigger id="currency" className="bg-white">
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent className="h-48 overflow-auto cursor-pointer">
                              <SelectItem className="cursor-pointer" value=" ">
                                Any
                              </SelectItem>
                              {currencies.map((currency) => (
                                <SelectItem
                                  className="cursor-pointer"
                                  key={currency.currency_Id}
                                  value={currency.currency_Id}
                                >
                                  {currency.currency} ({currency.symbol})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="pt-3">
                          <Label htmlFor="minHourly">Min</Label>
                          <Input
                            id="minHourly"
                            type="number"
                            name="minHourly"
                            value={filters.minHourly}
                            onChange={handleFilterChange}
                            placeholder="0"
                          />
                        </div>
                        <div className="pt-3">
                          <Label htmlFor="maxHourly">Max</Label>
                          <Input
                            id="maxHourly"
                            name="maxHourly"
                            type="number"
                            value={filters.maxHourly}
                            onChange={handleFilterChange}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-end gap-4 pt-10">
                      <button
                        className="bg-back/60 hover:bg-back/30 border border-blue/10 text-blue/50 hover:text-blue/75 duration-500 rounded-lg ease-in-out font-medium px-6 py-2 flex items-center justify-center gap-3"
                        onClick={handleFilterReset}
                      >
                        Reset Filters
                      </button>
                      <button
                        disabled={isApplyDisabled}
                        className={`bg-${isApplyDisabled ? "grey" : "blue"} ${
                          isApplyDisabled
                            ? "cursor-not-allowed"
                            : "hover:brightness-125 hover:shadow-md cursor-pointer"
                        }  text-white duration-500 ease-in-out rounded-lg px-6 py-2 font-medium`}
                        onClick={handleFilterApply}
                      >
                        Apply Filters
                      </button>
                    </div>{" "}
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </div>

        <div className="mt-6  ">
          {/* Result and Sort */}
          <div className="rounded-xl  text-black flex justify-between mb-4">
            <div className="flex  gap-3 md:gap-7 items-center">
              <h3 className="font-medium">{`Showing "${
                resultNumber.total || 0
              }" results`}</h3>
            </div>

            <div className="relative">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="bg-grey/30 text-sm h-8 pr-3 md:pr-8 pl-3 outline-none border border-grey cursor-pointer  rounded-lg hover:shadow-md duration-300 ease-in-out text-black appearance-none"
              >
                <option value="latest">Recent</option>
                <option value="oldest">Oldest</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-grey">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
              {Array.from(new Array(12)).map((_, index) => (
                <div
                  key={index}
                  className="flex relative flex-col h-96 justify-between bg-white shadow-md hover:shadow-lg rounded-xl p-6 border border-blue/10 duration-300 ease-in-out"
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
          ) : paginatedJobListings.length === 0 ? (
            <div className="text-center">{`No result for searched Term.`}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedJobListings.map((job) => (
                <div
                  key={job.id}
                  className="group flex relative flex-col h-96 justify-between bg-white shadow hover:shadow-lg rounded-xl p-6 border border-blue/10 duration-300 ease-in-out"
                >
                  {user && user.roleId === "0" ? null : (
                    <div className="absolute right-3 top-3">
                      <button
                        className="hover:bg-[#ff9292]/50 p-2 rounded-full duration-300 hover:text-[#ff4444]"
                        onClick={() => {
                          toggleSaveProject(job.nProjectId, job.like);
                        }}
                      >
                        {job.like ? (
                          <FaHeart className="text-xl text-[#ff4444] motion-preset-confetti" />
                        ) : (
                          <FaRegHeart className="text-lg motion-preset-shake motion-duration-300" />
                        )}
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
                        className="lg:flex hidden bg-blue hover:bg-blue/90 text-sm px-4 py-1.5 rounded-lg text-white group-hover:text-white duration-300 ease-in-out"
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
        </div>

        <div
          className={`fixed md:hidden inset-0 z-50 flex items-center justify-center ${
            isModalOpen ? "flex md:hidden" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-lg w-5/6 p-6">
            <div className="flex flex-col space-y-6">
              <div className="overflow-y-auto pb-4">
                <div className="space-y-6">
                  {/* Category Select */}
                  <div className="space-y-2">
                    <Label
                      className="text-lg font-semibold text-black/80"
                      htmlFor="category"
                    >
                      Category
                    </Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select Categories" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        <SelectItem value={" "}>All</SelectItem>
                        {masterCategories.map((category) => (
                          <SelectItem
                            key={category.masterCategory.id}
                            value={category.masterCategory.id}
                          >
                            {category.masterCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Level Dropdown */}
                  <div className="space-y-2">
                    <Label
                      className="text-lg font-semibold text-black/80"
                      htmlFor="experience"
                    >
                      Experience Level
                    </Label>
                    <Select
                      value={filters.experience}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, experience: value }))
                      }
                    >
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select Experience Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Skills Single-select */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-black/80">
                      Skills
                    </Label>
                    <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                      <PopoverTrigger
                        className="bg-gray/30 hover:shadow transition-shadow duration-300"
                        asChild
                      >
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={skillsOpen}
                          className="w-full justify-between border-gray text-black/80 hover:shadow hover:border-black/10 hover:bg-gray hover:brightness-105 duration-300 ease-in-out transition-all"
                        >
                          {filters.skills !== ""
                            ? categories.find(
                                (skill) => skill.skillName === filters.skills
                              )?.skillName
                            : "Select a skill..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command className="w-[16.3rem] 2xl:w-[20.3rem]">
                          <CommandInput placeholder="Search skills..." />
                          <CommandList>
                            <CommandEmpty>No skill found.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((skill) => (
                                <CommandItem
                                  key={skill.skillID}
                                  onSelect={() =>
                                    handleSkillSelect(skill.skillName)
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      filters.skills === skill.skillName
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {skill.skillName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Job Type Radio */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-black/80">
                      Job Type
                    </Label>
                    <RadioGroup
                      value={filters.jobType}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, jobType: value }))
                      }
                    >
                      <div className="flex gap-6 text-black/60">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="hourly" />
                          <Label htmlFor="hourly">Hourly Rate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="fixed" />
                          <Label htmlFor="fixed">Fixed Price</Label>
                        </div>
                      </div>
                    </RadioGroup>

                    <div className="grid grid-cols-2 gap-4 pt-3">
                      <div className="flex items-center col-span-2">
                        <Label className="w-full" htmlFor="currency">
                          Currency
                        </Label>
                        <Select
                          className="w-1/2"
                          value={filters.currency}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, currency: value }))
                          }
                        >
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent className="h-48 overflow-auto cursor-pointer">
                            <SelectItem className="cursor-pointer" value=" ">
                              Any
                            </SelectItem>
                            {currencies.map((currency) => (
                              <SelectItem
                                className="cursor-pointer"
                                key={currency.currency_Id}
                                value={currency.currency_Id}
                              >
                                {currency.currency} ({currency.symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-3">
                        <Label htmlFor="minHourly">Min</Label>
                        <Input
                          id="minHourly"
                          type="number"
                          name="minHourly"
                          value={filters.minHourly}
                          onChange={handleFilterChange}
                          placeholder="0"
                        />
                      </div>
                      <div className="pt-3 ">
                        <Label htmlFor="maxHourly">Max</Label>
                        <Input
                          id="maxHourly"
                          name="maxHourly"
                          type="number"
                          value={filters.maxHourly}
                          onChange={handleFilterChange}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset & Apply Filters */}
              <div className="w-full flex justify-end pt-4 gap-4">
                <button
                  className="w-full bg-back/60 hover:bg-back/30 border border-blue/10 text-blue/50 hover:text-blue/75 duration-500 rounded-lg ease-in-out font-medium px-6 py-2 flex items-center justify-center gap-3"
                  onClick={handleFilterReset}
                >
                  Reset
                </button>
                <button
                  disabled={isApplyDisabled}
                  className={`bg-${isApplyDisabled ? "grey" : "blue"} ${
                    isApplyDisabled
                      ? "cursor-not-allowed"
                      : "hover:brightness-125 hover:shadow-md cursor-pointer"
                  } text-white duration-500 ease-in-out rounded-lg px-6 py-2 font-medium w-full`}
                  onClick={handleFilterApply}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreProjects;
