import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";

const InsideSearch = ({ image }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTalent, setSearchTalent] = useState("");
  const [dropdownSelection, setDropdownSelection] = useState(() => {
    return location.pathname === "/freelancers" ? "Talents" : "Projects";
  });
  const [searchQuery, setSearchQuery] = useState(
    () => sessionStorage.getItem("lastSearch") || ""
  );
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const savedSearch = sessionStorage.getItem("lastSearch");

    if (savedSearch) {
      setSearchQuery(savedSearch);
    }

    // Clear last search on page reload
    window.onbeforeunload = () => {
      sessionStorage.removeItem("lastSearch");
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    // Check if we should select Talents from navigation state
    if (location.state?.selectTalents) {
      setDropdownSelection("Talents");
    }
  }, [location]);

  useEffect(() => {
    // Set dropdown to "Talents" only when initially navigating to freelancers page
    if (
      location.pathname === "/freelancers" &&
      !location.state?.manualSelection
    ) {
      setDropdownSelection("Talents");
    }
  }, [location.pathname]);

  // Add new useEffect for handling path changes
  useEffect(() => {
    if (
      location.pathname === "/freelancers" &&
      !sessionStorage.getItem("userSelectedDropdown")
    ) {
      setDropdownSelection("Talents");
    }
  }, [location.pathname]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  // Update handleDropdownSelect to remember user's choice
  const handleDropdownSelect = (selection) => {
    setDropdownSelection(selection);
    sessionStorage.setItem("userSelectedDropdown", selection);
    handleClose();
  };

  const handleSearch = () => {
    if (!searchTalent) return;

    if (dropdownSelection === "Talents") {
      // Update URL with encoded search parameter
      window.location.href = `/freelancers?search=${encodeURIComponent(
        searchTalent
      )}`;
    } else {
      // For projects, keep existing behavior
      window.location.href = `/projects?projectName=${encodeURIComponent(
        searchTalent
      )}`;
    }

    // Store search term in session storage
    sessionStorage.setItem("lastSearch", searchTalent);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear user selection when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("userSelectedDropdown");
    };
  }, []);

  const talents = ["Projects", "Talents"];

  return (
    <div className="relative h-[250px] bg-back2">
      <div className="absolute inset-0 overflow-hidden brightness-50">
        <img
          className="w-full h-full object-cover"
          src={image}
          alt="Background"
        />
      </div>

      <div className="container mx-auto flex justify-center items-center h-full py-16 px-10 relative z-10">
        {/* Small Screen */}
        <div className="w-full md:hidden relative flex flex-row items-stretch rounded-md overflow-hidden bg-white">
          <div className="w-3/5 flex-1 ">
            <input
              type="text"
              id="searchInput2"
              placeholder={
                dropdownSelection === "Talents"
                  ? `Search talents...`
                  : `Search projects...`
              }
              className="w-full p-3 focus:outline-none bg-white"
              value={searchTalent}
              onChange={(e) => setSearchTalent(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="relative border-l border-b border-grey">
            <button
              className="flex w-full justify-between items-center px-3 pt-3.5 gap-1 cursor-pointer bg-white text-sm"
              onClick={() => setIsOpen(!isOpen)}
              ref={dropdownRef2}
            >
              {dropdownSelection}
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
                    setDropdownSelection(talent);
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
        <div className="hidden md:flex flex-col md:flex-row items-stretch rounded-md overflow-hidden w-full max-w-4xl">
          {/* Search Input */}
          <div className="relative flex-1 border-b md:border-b-0 border-grey">
            <IoSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-black/50 text-xl" />
            <input
              type="text"
              placeholder={
                dropdownSelection === "Talents"
                  ? `Search talents...`
                  : `Search projects...`
              }
              className="w-full p-3 pl-10 bg-white focus:outline-none"
              value={searchTalent}
              onChange={(e) => setSearchTalent(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Updated Dropdown */}
          <div className="relative min-w-[150px] border-l border-grey">
            <button
              className="flex w-full justify-between items-center px-4 py-3 bg-white cursor-pointer"
              onClick={handleClick}
              ref={dropdownRef}
            >
              {dropdownSelection}
              <FaChevronDown
                className={`transform transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <Menu
            className="hidden md:block"
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                style: {
                  minWidth: "150px",
                },
              }}
            >
              {talents.map((talent) => (
                <MenuItem
                  key={talent}
                  onClick={() => handleDropdownSelect(talent)}
                  selected={talent === dropdownSelection}
                >
                  {talent}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Search Button */}
          <button
            className="bg-blue text-white px-6 py-3 hover:brightness-150 duration-200 ease-in-out"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsideSearch;
