import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/heroSearchIllustration.png";
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
    <div className="text-black/80 font-sans bg-gradient-to-b from-back/50 to-white/10">
      <div className="flex flex-row justify-start items-center py-2 container mx-auto md:px-5 max-w-7xl">
        <div className="w-full md:w-1/2 p-4">
          <div className="motion-translate-x-in-[0%] motion-translate-y-in-[45%] motion-opacity-in-[0%] motion-duration-[500ms]/opacity">
            <div className="flex flex-col">
              <h2 className="text-5xl font-medium mb-4 text-black"> Hire the best <span className="italic text-blue w-fit font-extrabold text-5xl">Freelancers</span></h2>
              {/* <h2 className="text-blue w-fit font-extrabold text-5xl pb-1">
                <span className="italic">Freelancers </span>
              </h2> */}
                <h4 className="text-2xl text-black font-medium mb-2">Fast and Easy</h4>
            </div>

            <ul className="text-lg text-gray-600 mb-6 list-disc pl-10">
              <li>Best freelancers for any job</li>
              <li>Pay after once your job is done</li>
              <li>Save time & money up to 96%</li>
            </ul>
          </div>

          {/* Small Screen */}
          <div className="w-full md:hidden relative flex flex-row items-stretch rounded-md overflow-hidden border-l border-t border-r md:border-r-0 border-grey motion-translate-x-in-[0%] motion-translate-y-in-[45%] motion-opacity-in-[0%] motion-duration-[500ms]/opacity motion-delay-300">
            <div className="w-3/5 flex-1 border-grey border-b md:border-b-0">
              <input
                type="text"
                id="searchInput2"
                placeholder={
                  selectedTalent === "Talents"
                    ? `Search talents...`
                    : `Search projects...`
                }
                className="w-full p-3 focus:outline-none"
                value={searchTalent}
                onChange={(e) => setSearchTalent(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>

            <div className="relative border-l border-b border-grey">
              <button
                className="flex w-full justify-between items-center px-3 pt-3.5 gap-1 cursor-pointer bg-white/60 text-sm"
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
              className="bg-blue hover:bg-blue/80 duration-200 ease-in-out text-white px-6 py-3"
              onClick={handleSearch}
            >
              <IoSearch />
            </button>
          </div>

          {/* Large Screen */}
          <div className="hidden md:flex flex-col md:flex-row items-stretch rounded-md overflow-hidden border-l border-t border-b border-r md:border-r-0 border-grey motion-translate-x-in-[0%] motion-translate-y-in-[45%] motion-opacity-in-[0%] motion-duration-[500ms]/opacity motion-delay-300">
            <div className="w-3/5 lg:w-full relative flex-1 border-grey border-b md:border-b-0">
              <IoSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-black/50 text-xl" />
              <input
                type="text"
                id="searchInput"
                placeholder={
                  selectedTalent === "Talents"
                    ? `Search talents...`
                    : `Search projects...`
                }
                className="w-full p-3 pl-10 focus:outline-none"
                value={searchTalent}
                onChange={(e) => setSearchTalent(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="relative  border-l border-grey">
              <button
                className="flex  justify-between gap-1 items-center px-4 py-3 cursor-pointer bg-white/60"
                onClick={() => setIsOpen(!isOpen)}
                ref={dropdownRef}
              >
                {selectedTalent}
                <FaChevronDown
                  className={`transform transition-transform text-smd ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <Menu
                className="hidden md:block"
                anchorEl={dropdownRef.current}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
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
              className="bg-blue hover:bg-blue/80 duration-200 ease-in-out text-white px-6 py-3"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        <div className="hidden mt-8 md:mt-0 z-0 md:w-1/2 md:flex justify-end items-center p-4 ">
          <img
            src={Image}
            alt="illustration"
            className="max-h-[96] w-auto z-0 lg:scale-125 motion-translate-x-in-[37%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[1000ms] motion-ease-spring-smooth"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
