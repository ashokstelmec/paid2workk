import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { IoMdOptions } from "react-icons/io";
import {
  FaAngleRight,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa6";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import FreelancerCard from "../../../freelancer/freelancerCard";

import { Chip, Collapse, Skeleton, Modal } from "@mui/material";
import { useAuth } from "../../../../contexts/authContext";

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

const experienceLevels = [
  { value: "1", label: "Entry Level" },
  { value: "2", label: "Intermediate" },
  { value: "3", label: "Expert" },
];

const FindFreelancers = () => {
  const { user, getCurrencySymbolId, currencies, isLoggedIn } = useAuth();

  const [searchFreelancer, setSearchFreelancer] = useState("");
  const [freelancerListings, setFreelancerListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    sort: "",
    minHourly: "",
    maxHourly: "",
    currency: " ",
    experience: "",
    skills: "",
    jobType: "",
  });
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);
  const [resultNumber, setResultNumber] = useState({
    total: 0,
    showing: 0,
  });
  const [sortOption, setSortOption] = useState("latest");
  const [likeClicked, setLikeClicked] = useState(false);
  const [initialSearchResults, setInitialSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [skillsOpen, setSkillsOpen] = useState(false);

  const [searchParams] = useSearchParams();

  const handleSkillSelect = (value) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills === value ? "" : value, // Toggle the skill (select/deselect)
    }));
    setSkillsOpen(false);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

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
    const { minHourly, maxHourly, skills, jobType, experience, currency } =
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

      if (searchFreelancer) url += `&search=${searchFreelancer}`;
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
          rating: user.rating ? user.rating : null,
          role: user.designation || "Freelancer",
          country: user.country || "",
          language: user.language || "",
          description: user.bio || "",
          tags: user.skill ? user.skill.split(",") : ["Freelancer"],
          services: "1 service",
          like: user.like || false,
          price: user.rate
            ? `${user.rate}${user.paidBy === "0" ? "/hr" : ""}`
            : "Price on request",
          hourlyRate: parseFloat(user.rate) || 0,
          image: user.photopath || "default-image-url",
          currency:
            getCurrencySymbolId(user.currency) || getCurrencySymbolId("2"),
          state: user.state || "",
        }));

        setFilteredData(transformedData);
        setFreelancerListings(transformedData);
        setIsFiltered(true);
        setTotalPages(Math.ceil(transformedData.length / itemsPerPage));
        setResultNumber({
          total: transformedData.length,
          showing: Math.min(transformedData.length, itemsPerPage),
        });
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredData([]);
      setFreelancerListings([]);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setIsOpen(false);
    }
  };

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
      // .then((data) => {
      // console.log("Like status updated:", data);
      // })
      .catch((error) => {
        console.error("Error updating like status:", error);
      });
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setIsLoading(true);
      searchFreelancers(searchQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      searchFreelancers(searchQuery);
    }
  }, [likeClicked]);

  const searchFreelancers = async (query) => {
    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetUsersByName?username=${query}&clientId=${sessionStorage.getItem("NUserID")}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        const transformedData = data?.map((user) => ({
          nUserID: user.nUserID,
          name: user.username || "Freelancer",
          rating: user.rating ? user.rating : null,
          role: user.designation || "Freelancer",
          country: user.country || "",
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
          state: user.state || "",
        }));

        // Store initial search results
        setInitialSearchResults(transformedData);
        setFreelancerListings(transformedData);
        setTotalPages(Math.ceil(transformedData.length / itemsPerPage));
        setResultNumber({
          total: data.length,
          showing: Math.min(data.length, itemsPerPage),
        });
      }
    } catch (error) {
      console.error("Error searching freelancers:", error);
      setFreelancerListings([]);
      setInitialSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Modify fetchAllFreelancers to store the initial data
  const fetchAllFreelancers = async () => {
    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetAllUsers?clientId=${sessionStorage.getItem("NUserID")}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        const transformedData = data.map((user) => ({
          nUserID: user.nUserID, // Ensure this is included
          name: user.username || "Freelancer",
          rating: user.rating ? user.rating : null,
          role: user.designation || "Freelancer",
          country: user.country || "",
          like: user.like || false,
          language: user.language || "",
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
          state: user.state || "",
        }));

        setFreelancerListings(transformedData);
        // Store the complete data set
        setInitialSearchResults([]); // Clear search results
        setTotalPages(Math.ceil(transformedData.length / itemsPerPage));
        setResultNumber({
          total: data.length,
          showing: Math.min(data.length, itemsPerPage),
        });
      }
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      setFreelancerListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataToUse = isFiltered ? filteredData : freelancerListings;
    return dataToUse.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    const dataLength = isFiltered
      ? filteredData.length
      : freelancerListings.length;
    const maxPages = Math.ceil(dataLength / itemsPerPage);

    if (pageNumber >= 1 && pageNumber <= maxPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Reset filters
  const handleFilterReset = () => {
    setFilters({
      sort: "",
      minHourly: "",
      maxHourly: "",
      currency: " ",
      experience: "",
      skills: "",
      jobType: "",
    });
    setIsFiltered(false);
    setFilteredData([]);
    setCurrentPage(1);
    fetchAllFreelancers();
    setIsOpen(false);
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    if (searchFreelancer === "") {
      fetchAllFreelancers();
      navigate({
        pathname: location.pathname,
        search: ``,
      });
      setIsOpen(false);
      return;
    } else {
      navigate({
        pathname: location.pathname,
        search: `?search=${encodeURIComponent(searchFreelancer)}`,
      });
      setIsOpen(false);
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

  // Render paginated job listings
  const paginatedFreelancers = freelancerListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //   const totalPages = Math.ceil(resultNumber.total / itemsPerPage);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery || isFiltered) {
      // Don't fetch all freelancers if we're displaying search or filtered results
      return;
    }
    setIsLoading(true);
    fetchAllFreelancers();
  }, [currentPage]);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery || isFiltered) {
      // Don't fetch all freelancers if we're displaying search or filtered results
      return;
    }

    fetchAllFreelancers();
  }, [likeClicked]);

  return (
    <div className="pb-10">
      {/* Search Bar */}
      <div className="mt-6">
        {/* Small Screen */}
        <div className="w-full md:hidden flex relative items-stretch rounded-xl p-x-2 py-2 overflow-hidden bg-back/30 shadow-lg shadow-black/10 border border-blue/5 ">
          <div className="w-4/5 ">
            <input
              type="text"
              id="searchInput2"
              placeholder={`Search freelancers...`}
              className="w-full p-1 pl-10  focus:outline-none rounded-l-lg"
              value={searchFreelancer}
              onChange={(e) => setSearchFreelancer(e.target.value)}
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
                placeholder={`Search freelancers...`}
                className="w-full p-1 pl-10 outline-none focus:outline-none bg-white rounded-lg hover:border-blue/10 border border-back/30 duration-500 ease-in-out"
                value={searchFreelancer}
                onChange={(e) => setSearchFreelancer(e.target.value)}
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
                      <SelectTrigger className="bg-white" id="experience">
                        <SelectValue placeholder="Select Experience Level" />
                      </SelectTrigger>
                      <SelectContent className="text-black">
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
                    <Popover>
                      <PopoverTrigger
                        className="bg-white hover:shadow transition-shadow duration-300"
                        asChild
                      >
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={!!filters.skills}
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
                      <PopoverContent
                        className="w-full p-0"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <Command className="w-[16.3rem] 2xl:w-[20.3rem] font-normal">
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
                          <Label htmlFor="hourly" className="text-black">Hourly Rate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="fixed" />
                          <Label htmlFor="fixed">Fixed Price</Label>
                        </div>
                      </div>
                    </RadioGroup>

                    <div className="grid grid-cols-2 gap-4 pt-3">
                      <div className="flex items-center col-span-2">
                        <Label className="w-full text-black" htmlFor="currency">
                          Currency
                        </Label>
                        <Select
                          className="w-1/2 text-black"
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
                          <SelectContent className="h-48 overflow-auto cursor-pointer text-black">
                            <SelectItem className="cursor-pointer text-black" value=" ">
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
                      <div className="pt-3 text-black">
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

      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from(new Array(6)).map((_, index) => (
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
          ) : getCurrentPageItems().length > 0 ? (
            getCurrentPageItems().map((freelancer, index) => (
              <FreelancerCard
                key={index}
                freelancer={freelancer}
                like={handleLike}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-black">
              No freelancers found
            </div>
          )}
        </div>
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

      {/* Filter Modal for small screen */}
      <Modal className="md:hidden" open={isModalOpen}>
        <div className="w-5/6 transition-all duration-500 ease-in-out p-6 bg-white text-black/80  rounded-xl shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
          <div className="w-full justify-between items-center flex mb-5">
            <h4 className="text-xl font-semibold ">Advance Options</h4>
            <button
              className="text-xl text-red bg-red/5 rounded-lg  p-1.5"
              onClick={() => setIsModalOpen(false)}
            >
              <RxCross2 />
            </button>
          </div>
          <div className="flex flex-col">
            {/* Experience level checkboxes */}
            <div className="mb-5 w-full experience-level ">
              <h5 className="text-lg font-medium text-black/80 mb-3">
                Experience level
              </h5>
              <div className="flex flex-col gap-1">
                {["entryLevel", "intermediateLevel", "expertLevel"].map(
                  (level) => (
                    <div
                      className="form-check flex flex-row w-full items-center gap-1"
                      key={level}
                    >
                      <input
                        className="form-check-input cursor-pointer "
                        type="checkbox"
                        id={level}
                        name={level}
                        checked={filters[level]}
                        onChange={handleFilterChange}
                      />
                      <label
                        className="form-check-label pl-1 pt-0.5 text-sm font-medium text-black/60"
                        htmlFor={level}
                      >
                        {level === "entryLevel"
                          ? "Entry Level"
                          : level === "intermediateLevel"
                          ? "Intermediate"
                          : "Expert"}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Job Type and Fixed Price inputs */}
            <div className="mb-5">
              <h5 className="text-lg font-medium text-black/80 mb-3">
                Job Type
              </h5>
              <div className="form-check flex items-center gap-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hourly"
                  name="hourly"
                  checked={filters.hourly}
                  onChange={handleFilterChange}
                />
                <label
                  className="form-check-label pl-1 pt-0.5 text-md font-medium text-black/60"
                  htmlFor="hourly"
                >
                  Hourly (259)
                </label>
              </div>
              {/* Hourly rate inputs */}
              <div className="mt-2">
                <div className="input-group mb-3 flex items-center gap-1 w-full">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control bg-grey/30 h-12 pr-4 pl-3 outline-none border border-grey cursor-pointer rounded-lg hover:shadow-md duration-300 ease-in-out text-black/60 font-medium appearance-none"
                    name="minHourly"
                    value={filters.minHourly}
                    placeholder="Min"
                    min="0"
                    onChange={handleFilterChange}
                  />
                  <span className="input-group-text">/hr</span>
                </div>
                <div className="input-group mb-3 flex items-center gap-1 w-full">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control bg-grey/30 h-12 pr-4 pl-3 outline-none border border-grey cursor-pointer rounded-lg hover:shadow-md duration-300 ease-in-out text-black/60 font-medium appearance-none"
                    name="maxHourly"
                    value={filters.maxHourly}
                    placeholder="Max"
                    min={0}
                    onChange={handleFilterChange}
                  />
                  <span className="input-group-text">/hr</span>
                </div>
              </div>

              <div className="form-check mb-3 flex items-center gap-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="fixedPrice"
                  name="fixedPrice"
                  checked={filters.fixedPrice}
                  onChange={handleFilterChange}
                />
                <label
                  className="form-check-label pl-1 pt-0.5 text-md font-medium text-black/60"
                  htmlFor="fixedPrice"
                >
                  Fixed-Price (148)
                </label>
              </div>
            </div>
            <div className="w-full flex justify-end pt-4 gap-4">
              <button
                className={`bg-back/60 hover:bg-back/30 border border-blue/10 text-blue/50 hover:text-blue/75 duration-500 rounded-lg ease-in-out font-medium px-6 py-2 flex items-center justify-center gap-3`}
                onClick={handleFilterReset}
              >
                Reset Filters
              </button>
              <button
                className={`bg-${isApplyDisabled ? "grey" : "blue"} ${
                  isApplyDisabled ? "" : "hover:brightness-125 hover:shadow-md"
                } cursor-pointer text-white duration-500 ease-in-out rounded-lg  px-6 py-2 font-medium`}
                onClick={handleFilterApply}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FindFreelancers;
