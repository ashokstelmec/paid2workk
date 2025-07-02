import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/Backgrounds/kino2.jpg";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";

const HeroSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTalent, setSearchTalent] = useState("");
  const [selectedTalent, setSelectedTalent] = useState("Projects");
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);
  const navigate = useNavigate(); // Navigation hook

  // Load last search from sessionStorage
  useEffect(() => {
    const savedSearch = sessionStorage.getItem("lastSearch");
    if (savedSearch) {
      setSearchTalent(savedSearch);
    }

    // Clear last search on page reload
    window.onbeforeunload = () => {
      sessionStorage.removeItem("lastSearch");
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // List of talents
  const talents = ["Projects", "Talents"];

  // Handle the search logic
  const handleSearch = () => {
    if (!searchTalent) return;

    // Save search term to sessionStorage
    sessionStorage.setItem("lastSearch", searchTalent);

    if (selectedTalent === "Talents") {
      // Redirect to freelancer search page
      navigate(`/freelancers?search=${encodeURIComponent(searchTalent)}`);
    } else {
      // Redirect to projects search page
      navigate(`/projects?projectName=${encodeURIComponent(searchTalent)}`);
    }
  };

  // Handle key press for enter key
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-primary/[2%] text-black font-sans pt-8">
      <div className="container mx-auto max-w-7xl px-4 md:px-5">
        <div className="relative h-[480px] min-h-[300px] border rounded-xl shadow-lg bg-light-background overflow-hidden flex flex-col justify-center items-start gap-6 p-4 md:p-6">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={Image}
              alt="Freelancer working"
              className="w-full h-full object-cover object-[center_65%] md:object-[center_30%] brightness-[135%]"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-customBlack via-customBlack/20 to-customBlack/0 "></div>
          </div>
          {/* Content */}
          <div className="relative z-10 max-w-2xl md:pl-5">
            {/* Headings */}
            <div className="flex flex-col gap-2 mb-1">
              <h2 className="text-3xl md:text-5xl font-medium leading-tight text-light-background">
                Hire the best{" "}
                <span className="italic text-blue-200 font-extrabold">
                  Freelancers
                </span>
              </h2>
              <h4 className="text-lg md:text-2xl font-medium text-light-background">
                Fast and Easy
              </h4>
            </div>

            {/* Bullet Points */}
            <ul className="text-base text-light-background mb-3 list-disc pl-6">
              <li>Best freelancers for any job</li>
              <li>Pay once your job is done</li>
              <li>Save time & money up to 96%</li>
            </ul>
          </div>
          {/* Search Bar */}
          <div className=" w-full md:hidden relative flex flex-row items-stretch rounded-md overflow-hidden  bg-light-background motion-translate-x-in-[0%] motion-translate-y-in-[45%] motion-opacity-in-[0%] motion-duration-[500ms]/opacity motion-delay-300">
            <div className="w-3/5 flex-1">
              <input
                type="text"
                id="searchInput2"
                placeholder={
                  selectedTalent === "Talents"
                    ? `Search talents...`
                    : `Search projects...`
                }
                className="w-full p-3 text-prime  focus:outline-none"
                value={searchTalent}
                onChange={(e) => setSearchTalent(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>

            <div className="relative border-l border-b border-grey">
              <button
                className="flex text-prime w-full justify-between items-center px-3 pt-3.5 gap-1 cursor-pointer bg-light-background/60 text-sm"
                onClick={() => setIsOpen(!isOpen)}
                ref={dropdownRef2}
              >
                {selectedTalent}
                <FaChevronDown
                  className={`text-xs transform transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <Menu
                className="md:hidden"
                anchorEl={dropdownRef2.current}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                anchorOrigin={{
                  vertical: "bottom", // Ensure dropdown opens below the button
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top", // Aligns the top of the menu with the button's bottom
                  horizontal: "left",
                }}
              >
                {talents.map((talent) => (
                  <MenuItem
                    key={talent}
                    onClick={() => {
                      setSelectedTalent(talent);
                      setSearchTalent(""); // Clear the search term
                      setIsOpen(false);
                    }}
                  >
                    {talent}
                  </MenuItem>
                ))}
              </Menu>
            </div>

            <button
              className="bg-blue hover:bg-blue/80 duration-200 ease-in-out text-light-background px-6 py-3"
              onClick={handleSearch}
            >
              <IoSearch />
            </button>
          </div>
          <div className=" ml-5 relative z-10 w-full md:w-1/2 hidden md:flex flex-wrap md:flex-nowrap items-center rounded-md overflow-hidden bg-light-background">
            {/* Search Input */}
            <div className="relative flex-grow border-r border-grey">
              <IoSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-black/50 text-xl" />
              <input
                type="text"
                id="searchInput"
                aria-label="Search"
                placeholder={
                  selectedTalent === "Talents"
                    ? "Search talents..."
                    : "Search projects..."
                }
                className="w-full text-prime p-3 pl-10 focus:outline-none"
                value={searchTalent}
                onChange={(e) => setSearchTalent(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>

            {/* Dropdown Selector */}
            <div className="relative border-r border-grey">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                ref={dropdownRef}
                className="text-prime flex items-center justify-between gap-2 px-4 py-3 w-full h-full bg-light-background cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                {selectedTalent}
                <FaChevronDown
                  className={`transition-transform text-sm ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <Menu
                anchorEl={dropdownRef.current}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                {talents.map((talent) => (
                  <MenuItem
                    key={talent}
                    onClick={() => {
                      setSelectedTalent(talent);
                      setSearchTalent("");
                      setIsOpen(false);
                    }}
                  >
                    {talent}
                  </MenuItem>
                ))}
              </Menu>
            </div>

            {/* Search Button */}
            <button
              type="button"
              className="bg-blue text-light-background px-6 py-3 hover:bg-blue/80 transition-colors duration-200"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
