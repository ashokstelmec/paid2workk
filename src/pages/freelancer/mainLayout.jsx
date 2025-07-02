import React, { useEffect, useState } from "react";
import { CircularProgress, Skeleton } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import FreelancerCard from "./freelancerCard";
import { MdFilterAlt } from "react-icons/md";
import { useAuth } from "../../contexts/authContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"; // Add this import at the top
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";

const experienceLevels = [
  { value: "1", label: "Entry Level" },
  { value: "2", label: "Intermediate" },
  { value: "3", label: "Expert" },
];

const MainLayout = () => {
  const { getCurrencySymbolId, currencies } = useAuth();
  const isLoggedIn = localStorage.getItem("authentication") === "true";
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    sort: "",
    minHourly: "",
    maxHourly: "",
    currency: " ",
    experience: "",
    skills: "",
    jobType: "",
  });
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [likeClicked, setLikeClicked] = useState(true);
  const [error, setError] = useState("");
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resultNumber, setResultNumber] = useState({
    total: 0,
    showing: 0,
  });
  const itemsPerPage = 12;
  const [searchParams] = useSearchParams();
  const [freelancerData, setFreelancerData] = useState([]);
  const [initialSearchResults, setInitialSearchResults] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false); // Add this new state
  const [filteredData, setFilteredData] = useState([]); // Add this new state
  const [searchResults, setSearchResults] = useState([]); // Add this state
  const [searchCount, setSearchCount] = useState(null); // Add this new state
  const [filterReset, setFilterReset] = useState(false);

  const handleSkillSelect = (value) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills === value ? "" : value, // Toggle the skill (select/deselect)
    }));
    setSkillsOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (event.type === "click" && event.target.tagName === "INPUT") {
      return;
    }
    setDrawerOpen(open);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  //   handle Freelancer like
  const handleLike = (freelancerId, clientId) => {
    setLikeClicked(!likeClicked);

    // Call API to handle like
    const formData = new FormData();
    formData.append("FreelancerID", freelancerId);
    formData.append("UserID", clientId);

    fetch(`https://paid2workk.solarvision-cairo.com/InsertLike`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Like status updated:", data);
      })
      .catch((error) => {
        console.error("Error updating like status:", error);
      });
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveSkills"
      );
      const categories = await response.json();
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Validate minBudget and maxBudget
    if (name === "minHourly" || name === "maxHourly") {
      newValue = parseFloat(newValue);
      if (newValue < 0) {
        newValue = 0;
      }
    }

    const newFilters = {
      ...filters,
      [name]: newValue,
    };

    if (
      (name === "minHourly" && isNaN(newValue)) ||
      (name === "maxHourly" && isNaN(newValue))
    ) {
      setIsApplyDisabled(true);
    } else if (
      (name === "minHourly" && newValue > 0 && !filters.maxHourly) ||
      (name === "maxHourly" && newValue > 0 && !filters.minHourly)
    ) {
      setIsApplyDisabled(true);
    } else if (newFilters.minHourly > newFilters.maxHourly) {
      setIsApplyDisabled(true);
    } else {
      setIsApplyDisabled(false);
    }

    // Ensure maxHourly is not less than minHourly
    let error = "";
    if (
      name === "minHourly" &&
      newFilters.maxHourly &&
      newFilters.maxHourly < newValue
    ) {
      error = "Max hourly rate should not be less than min hourly rate";
    } else if (
      name === "maxHourly" &&
      newFilters.minHourly &&
      newFilters.minHourly > newValue
    ) {
      error = "Max hourly rate should not be less than min hourly rate";
    }

    setFilters(newFilters);
    setError(error);
    setIsApplyDisabled(error);
  };

  // Replace the existing handleFilterApply function
  const handleFilterApply = async () => {
    const { jobType, experience, currency, skills, minHourly, maxHourly } =
      filters;

    if (minHourly > 0 && maxHourly > 0 && minHourly > maxHourly) {
      setError("Minimum rate cannot be greater than maximum rate");
      return;
    }

    setCurrentPage(1);
    setIsLoading(true);

    try {
      let url = `https://paid2workk.solarvision-cairo.com/GetUsersByName?`;
      const auth = localStorage.getItem("authentication") === "true" ? true : false;;

      if (searchParams.get("search"))
        url += `username=${searchParams.get("search")}&`;
      if (minHourly > 0) url += `minBudget=${minHourly}&`;
      if (maxHourly > 0) url += `maxBudget=${maxHourly}&`;
      if (auth) url += `clientId=${sessionStorage.getItem("NUserID")}&`;
      if (jobType) url += `paidBy=${jobType}&`;
      if (currency) url += `Currency=${currency}&`;
      if (experience) url += `Lavel=${experience}&`;
      if (skills) url += `skill=${encodeURIComponent(skills)}&`;

      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        const transformedData = data.map((user) => ({
          nUserID: user.nUserID,
          name: user.username || "Freelancer",
          state: user.state || "",
          country: user.country || "",
          role: user.designation || "Freelancer",
          rating: user.rating ? user.rating : null,
          title: user.designation || "Freelancer",
          location: user.country || "",
          language: user.language || "",
          like: user.like || false,
          description: user.bio || "",
          tags: user.skill ? user.skill.split(",") : ["Freelancer"],
          services: "1 service",
          price: user.rate
            ? `${user.rate}${user.paidBy === "0" ? "/hr" : ""}`
            : "Price on request",
          hourlyRate: parseFloat(user.rate) || 0,
          image: user.photopath || "default-image-url",
          currency:
            getCurrencySymbolId(user.currency) || getCurrencySymbolId("2"),
        }));

        setSearchResults(transformedData); // Update search results
        setFreelancerData(transformedData); // Update main data
        setFilteredData(transformedData); // Update filtered data
        setIsFiltered(true);
        setTotalPages(Math.ceil(transformedData.length / itemsPerPage));
        setResultNumber({
          total: transformedData.length,
          showing: Math.min(transformedData.length, itemsPerPage),
        });
        setSearchCount(transformedData.length); // Update search count
      } else {
        setSearchResults([]);
        setFreelancerData([]);
        setFilteredData([]);
        setIsFiltered(true);
        setTotalPages(0);
        setResultNumber({ total: 0, showing: 0 });
        setSearchCount(0);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setSearchResults([]);
      setFreelancerData([]);
      setFilteredData([]);
      setTotalPages(0);
      setResultNumber({ total: 0, showing: 0 });
      setSearchCount(0);
    } finally {
      setIsLoading(false);
      setDrawerOpen(false);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setIsLoading(true);
      searchFreelancers(searchQuery);
    }
  }, [searchParams, filterReset]);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      searchFreelancers(searchQuery);
    } else {
      fetchAllFreelancers();
    }
  }, [likeClicked]);

  const searchFreelancers = async (query) => {
    const auth = localStorage.getItem("authentication") === "true" ? true : false;;
    try {
      let url = `https://paid2workk.solarvision-cairo.com/GetUsersByName?username=${query}&`;
      if (auth) url += `clientId=${sessionStorage.getItem("NUserID")}&`;
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        const transformedData = data.map((user) => ({
          nUserID: user.nUserID,
          name: user.username || "Freelancer",
          state: user.state || "",
          country: user.country || "",
          role: user.designation || "Freelancer",
          rating: user.rating ? user.rating : null,
          title: user.designation || "Freelancer",
          location: user.country || "",
          language: user.language || "",
          like: user.like || false,
          description: user.bio || "",
          tags: user.skill ? user.skill.split(",") : ["Freelancer"],
          services: "1 service",
          price: user.rate
            ? `${user.rate}${user.paidBy === "0" ? "/hr" : ""}`
            : "Price on request",
          hourlyRate: parseFloat(user.rate) || 0,
          image: user.photopath || "default-image-url",
          currency:
            getCurrencySymbolId(user.currency) || getCurrencySymbolId("2"),
        }));

        // Update all relevant state variables
        setSearchResults(transformedData);
        setFreelancerData(transformedData);
        setFilteredData(transformedData);
        setIsFiltered(true);
        setCurrentPage(1);
        setSearchCount(transformedData.length);
        setTotalPages(Math.ceil(transformedData.length / itemsPerPage));
        setResultNumber({
          total: transformedData.length,
          showing: Math.min(transformedData.length, itemsPerPage),
        });
      } else {
        // Reset all states if no results
        setSearchResults([]);
        setFreelancerData([]);
        setFilteredData([]);
        setIsFiltered(true);
        setSearchCount(0);
        setTotalPages(0);
        setResultNumber({ total: 0, showing: 0 });
      }
    } catch (error) {
      console.error("Error searching freelancers:", error);
      // Reset states on error
      setSearchCount(0);
      setSearchResults([]);
      setFreelancerData([]);
      setFilteredData([]);
      setTotalPages(0);
      setResultNumber({ total: 0, showing: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery || isFiltered) {
      return;
    }
    setIsLoading(true);
    fetchAllFreelancers();
  }, [currentPage]);

  // Modify fetchAllFreelancers to store the initial data
  const fetchAllFreelancers = async () => {
    const auth = localStorage.getItem("authentication") === "true" ? true : false;;
    let url = `https://paid2workk.solarvision-cairo.com/GetAllUsers?`;
    if (auth) url += `clientId=${sessionStorage.getItem("NUserID")}&`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        const transformedData = data.map((user) => ({
          nUserID: user.nUserID, // Ensure this is included
          state: user.state || "",
          country: user.country || "",
          role: user.designation || "Freelancer",
          name: user.username || "Freelancer",
          rating: user.rating ? user.rating : null,
          title: user.designation || "Freelancer",
          location: user.country || "",
          language: user.language || "",
          like: user.like || false,
          description: user.bio || "",
          tags: user.skill ? user.skill.split(",") : ["Freelancer"],
          services: "1 service",
          price: user.rate
            ? `${user.rate}${user.paidBy === "0" ? "/hr" : ""}`
            : "Price on request",
          hourlyRate: parseFloat(user.rate) || 0, // Make sure this is included
          image: user.photopath || "default-image-url",
          currency:
            getCurrencySymbolId(user.currency) || getCurrencySymbolId("2"),
        }));

        setFreelancerData(transformedData);
        // Store the complete data set
        setInitialSearchResults([]); // Clear search results
        const totalItems = transformedData.length;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));

        // Update result numbers to show total available results
        setResultNumber({
          total: totalItems,
          showing: totalItems,
        });
      }
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      setFreelancerData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Only fetch once when mounting or resetting filters, not when changing page
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setIsLoading(true);
      searchFreelancers(searchQuery);
    } else {
      setIsLoading(true);
      fetchAllFreelancers();
    }
  }, [filterReset]); // Remove currentPage from dependencies

  // Keep this pagination function simple, no fetching here
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataToUse = isFiltered ? filteredData : freelancerData;
    const paginatedItems = dataToUse.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total: dataToUse.length,
      showing: paginatedItems.length,
    };
  };

  // Clean handlePageChange
  const handlePageChange = (pageNumber) => {
    const dataLength = isFiltered ? filteredData.length : freelancerData.length;
    const maxPages = Math.max(1, Math.ceil(dataLength / itemsPerPage));

    if (pageNumber >= 1 && pageNumber <= maxPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Add reset functionality to clear filters
  const resetFilters = () => {
    setFilters({
      sort: "",
      minHourly: "",
      maxHourly: "",
      currency: " ",
      experience: "",
      skills: "",
      jobType: "",
    });
    navigate("/freelancers");
    setIsFiltered(false);
    setFilteredData([]);
    fetchAllFreelancers();
    setSearchCount(null);
  };

  return (
    <>
      <div className="bg-back/30 min-h-[calc(100dvh-250px)]">
        <div className="container max-w-7xl mx-auto  py-6 px-10 md:px-5">
          {/* Filter */}
          <div className="rounded-xl text-black flex justify-between mb-5">
            <div className="flex gap-3 md:gap-7 items-center">
              <button
                className="bg-blue hover:shadow-md hover:bg-blue/80 duration-300 ease-in-out rounded-lg px-1.5 md:px-2.5 py-0.5 md:py-1 text-white font-medium flex items-center gap-1"
                onClick={toggleDrawer(true)}
              >
                <MdFilterAlt />
                <span className="hidden md:block">Filter</span>
              </button>
              <h3 className="text-xl font-medium">
                {`Showing "${
                  searchCount !== null ? searchCount : resultNumber.total
                }" results`}
              </h3>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from(new Array(12)).map((_, index) => (
                <div
                  key={index}
                  className="flex relative flex-col h-96 justify-between bg-white shadow rounded-xl p-6 border border-blue/10 transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Skeleton variant="circular" width={80} height={80} />
                      <div className="ml-4">
                        <Skeleton variant="text" width={120} height={24} />
                        <Skeleton variant="text" width={100} height={20} />
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={24}
                          className="rounded-full mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="font-medium text-sm text-primary mb-1">
                    <Skeleton variant="text" width={180} height={20} />
                    <Skeleton variant="text" width={140} height={20} />
                  </div>

                  <div className="border rounded-lg p-3 mt-2 bg-muted-foreground/[2%]">
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} width="90%" />
                    <Skeleton variant="text" height={20} width="80%" />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex flex-nowrap gap-2 w-4/5">
                      {[...Array(4)].map((_, idx) => (
                        <Skeleton
                          key={idx}
                          variant="rectangular"
                          height={24}
                          width={60}
                          className="rounded-full"
                        />
                      ))}
                    </div>
                    <Skeleton variant="text" width={80} height={28} />
                  </div>
                </div>
              ))
            ) : getCurrentPageItems().items.length > 0 ? (
              getCurrentPageItems().items.map((freelancer, index) => (
                <FreelancerCard
                  key={index}
                  freelancer={freelancer}
                  like={handleLike}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No freelancers found
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && freelancerData.length > 0 && (
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

        {/* Filter Drawer */}
        <Drawer
          dismissible={true}
          direction="left"
          open={drawerOpen}
          onOpenChange={toggleDrawer(false)}
        >
          <DrawerContent className="w-80 2xl:w-96 h-full py-12 text-black">
            <DrawerHeader>
              <div className="p-2 px-3">
                <DrawerTitle className="text-base font-medium text-black">
                  Filter Freelancers
                </DrawerTitle>
                <DrawerDescription className="text-black">
                  Customize your freelancer search with filters
                </DrawerDescription>
              </div>
            </DrawerHeader>
            <div className="overflow-y-auto pb-4 px-7">
              <div className="space-y-6">
                {/* Experience Level Dropdown */}
                <div className="space-y-2">
                  <Label
                    className="text-base font-medium text-black"
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
                    <SelectContent className="font-normal text-black">
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
                  <Label className="text-base font-medium text-black">
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
                        className="w-full justify-between border-gray text-black font-normal hover:shadow hover:border-black/10 hover:bg-gray hover:brightness-105 duration-300 ease-in-out transition-all"
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
                          <CommandEmpty className="text-black">
                            No skill found.
                          </CommandEmpty>
                          <CommandGroup>
                            {categories.map((skill) => (
                              <CommandItem
                                className="text-black"
                                key={skill.skillID}
                                onSelect={() =>
                                  handleSkillSelect(skill.skillName)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 font-normal text-black",
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
                  <Label className="text-base font-medium text-black">
                    Job Type
                  </Label>
                  <RadioGroup
                    value={filters.jobType}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, jobType: value }))
                    }
                  >
                    <div className="flex gap-6 text-black">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="hourly" />
                        <Label htmlFor="hourly" className="text-black">
                          Hourly Rate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="fixed" />
                        <Label htmlFor="fixed" className="text-black">
                          Fixed Price
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="grid grid-cols-2 gap-4 pt-3">
                    <div className="flex items-center col-span-2 space-y-2">
                      <Label className="w-full text-black" htmlFor="currency">
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
                        <SelectContent className="h-48 overflow-auto cursor-pointer font-normal">
                          <SelectItem
                            className="cursor-pointer text-black"
                            value=" "
                          >
                            Any
                          </SelectItem>
                          {currencies.map((currency) => (
                            <SelectItem
                              className="cursor-pointer text-black"
                              key={currency.currency_Id}
                              value={currency.currency_Id}
                            >
                              {currency.currency} ({currency.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-3 text-black">
                      <Label htmlFor="minHourly" className="text-black">
                        Min
                      </Label>
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
                      <Label htmlFor="maxHourly" className="text-black">
                        Max
                      </Label>
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
            <DrawerFooter>
              <div className="px-3 flex flex-col w-full gap-2">
                <Button disabled={isApplyDisabled} onClick={handleFilterApply}>
                  Apply Filters
                </Button>
                <DrawerClose asChild>
                  <Button onClick={resetFilters} variant="outline_danger">
                    Reset Filters
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default MainLayout;
