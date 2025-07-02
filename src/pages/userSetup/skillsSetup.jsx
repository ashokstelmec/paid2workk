import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

// Assets
import Logo from "../../assets/Logo/p2w.png";
import { Bounce, toast } from "react-toastify";

const SkillsSetup = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(
    () => sessionStorage.getItem("userSkills") || ""
  );
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  //   API Calls
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Replace this with your actual API endpoint
        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveSkills"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchSkills();
  }, []);

  // Handle form submission
  const handleProceed = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("nUserID", sessionStorage.getItem("NUserID"));
      data.append("skill", selectedSkills);
      data.append("progress", "20%");

      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/Update_About",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Save to sessionStorage before navigation
      sessionStorage.setItem("userSkills", selectedSkills);
      navigate("/account-setup/4");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(`Failed to add Skills!`, {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Autocomplete onChange to save to sessionStorage
  return (
    <div className="flex items-center justify-center min-h-screen  relative">
      <Box
        className="sm:bg-white bg-white/0 sm:shadow-md sm:rounded-xl p-5 sm:p-10 sm:border sm:border-blue/10"
        sx={{
          width: {
            xs: "90%", // Default width for mobile
            sm: "70%", // For small screens (sm)
            md: "75%", // For medium screens (md)
            lg: "60%", // For large screens (lg)
            xl: "55%", // For extra large screens (xl)
            xxl: "40%", // For screens wider than 1920px
          },
        }}
      >
        <div className="w-full">
          <div className="text-start mb-8 px-4">
            <img
              src={Logo}
              alt="Paid2Workk Logo"
              className="h-24 mx-auto mb-8"
            />
            <h3 className="text-black/80 font-medium text-xl">
              Nearly there! What work are you here to do?
            </h3>
            <span className="mb-8 mt-2 text-black/60 text-sm">
              Your skills show clients what you can offer, and help us choose
              which jobs to recommend to you. Add or remove the ones we've
              suggested, or start typing to pick more. It's up to you.
            </span>
          </div>

          <div className="mb-8">
            <div className="mb-6 bg-white">
              <Autocomplete
                multiple
                freeSolo
                options={skills.map((skill) => skill.skillName)}
                value={selectedSkills
                  .split(",")
                  .filter((skill) => skill.trim() !== "")}
                onChange={(event, newValue) => {
                  const filteredValues = newValue.filter(
                    (value) => !value.includes(",")
                  );
                  const joinedSkills = filteredValues.join(",");

                  if (joinedSkills.length === 0) {
                    setSelectedSkills("");
                    sessionStorage.removeItem("userSkills");
                  } else {
                    setSelectedSkills(joinedSkills);
                    sessionStorage.setItem("userSkills", joinedSkills);
                  }
                }}
                renderTags={(value, getTagProps) =>
                  selectedSkills
                    .split(",")
                    .filter((skill) => skill.trim() !== "")
                    .map(
                      (option, index) =>
                        option !== "-" &&
                        (selectedSkills.length === 0 ? (
                          <></>
                        ) : (
                          <Chip
                            color="blue"
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                          />
                        ))
                    )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Add skills and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === ",") {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />{" "}
            </div>
          </div>

          <div className="flex gap-2 justify-end items-center">
            <button
              className={`w-1/2 md:w-1/3 2xl:w-1/5  text-white ${
                selectedSkills.length === 0
                  ? "bg-grey cursor-not-allowed"
                  : "bg-blue hover:brightness-125"
              }  duration-300 rounded-lg ease-in-out px-8 py-2 justify-end`}
              onClick={(e) => {
                if (selectedSkills.length > 0) {
                  handleProceed(e);
                }
              }}
              disabled={selectedSkills.length === 0}
            >
              {isSubmitting ? <CircularProgress /> : "Save and Continue"}
            </button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default SkillsSetup;
