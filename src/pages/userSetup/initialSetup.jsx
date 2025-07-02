import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

// Assets
import Logo from "../../assets/Logo/p2w.png";
import Rookie from "../../assets/Setup/recruit.png";
import Intermediate from "../../assets/Setup/intermediate-level.png";
import Expert from "../../assets/Setup/badge.png";
import { Bounce, toast } from "react-toastify";

const InitialSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // const [selectedRole, setSelectedRole] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    sessionStorage.getItem("userLevel") || "0"
  );

  const handleOptionClick = (value) => {
    setSelectedRole(value);
    sessionStorage.setItem("userLevel", value);
  };

  // Handle form submission
  const handleProceed = async (e) => {
    e.preventDefault();

    if (user) {
      setIsSubmitting(true);
      try {
        const data = new FormData();
        data.append("nUserID", sessionStorage.getItem("NUserID"));
        data.append("Lavel", selectedRole);
        data.append("progress", "10%");

        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/Update_About",
          {
            method: "POST",
            body: data, // ✅ Using formValues, do NOT set "Content-Type"
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        // console.log("Update response:", responseData);

        // Refresh the page or update the UI as needed
        navigate("/account-setup/2");
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error(`Failed to update experience: ${error.message}`, {
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
    } else {
      toast.error(`Fill all the fields correctly!`, {
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
      // console.log("Validation failed.");
    }
  };

  // Handle Skip
  const handleSkip = async (e) => {
    e.preventDefault();

    if (user) {
      setIsSubmitting(true);
      try {
        const data = new FormData();
        data.append("nUserID", sessionStorage.getItem("NUserID"));
        data.append("progress", "10%");

        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/Update_About",
          {
            method: "POST",
            body: data, // ✅ Using formValues, do NOT set "Content-Type"
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refresh the page or update the UI as needed
        navigate("/account-setup/2");
      } catch (error) {
        console.error("Failed to skip", error);
        toast.error(`Failed to skip!`, {
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
    } else {
      // console.log("Validation failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
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
          <div className="text-start mb-8">
            <img
              src={Logo}
              alt="Paid2Workk Logo"
              className="h-24 mx-auto mb-8"
            />
            <h3 className="text-black/80 font-medium mb-8 text-xl">
              A few quick questions:
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {/* Client Card */}
            <label
              className={`p-4 gap-1 bg-white text-black cursor-pointer hover:shadow-md transition-shadow ${
                selectedRole === "1"
                  ? "border-blue border-2"
                  : "border-blue/10 border-2"
              } rounded-xl duration-300 ease-in-out flex flex-col items-center justify-center`}
              onClick={() => handleOptionClick("1")}
            >
              <input
                type="radio"
                name="userType"
                value="client"
                className="hidden"
              />
              <img
                src={Rookie}
                alt="client"
                className="w-10 h-10 md:w-14 md:h-14"
              />
              <span
                className={`text-black/80 font-medium text-sm md:text-base`}
              >
                I'm New to this.
              </span>
            </label>

            {/* Freelancer Card */}
            <label
              className={`p-4 gap-1 bg-white text-center text-black cursor-pointer hover:shadow-md transition-shadow ${
                selectedRole === "2"
                  ? "border-blue border-2"
                  : "border-blue/10 border-2"
              } rounded-xl duration-300 ease-in-out flex flex-col items-center justify-center`}
              onClick={() => handleOptionClick("2")}
            >
              <input
                type="radio"
                name="userType"
                value="freelancer"
                className="hidden"
              />
              <img
                src={Intermediate}
                alt="freelancer"
                className="w-10 h-10 md:w-14 md:h-14"
              />

              <span
                className={`text-black/80 font-medium text-sm md:text-base `}
              >
                I Have some experience.
              </span>
            </label>

            <label
              className={`p-4 gap-1 bg-white text-black cursor-pointer hover:shadow-md transition-shadow ${
                selectedRole === "3"
                  ? "border-blue border-2"
                  : "border-blue/10 border-2"
              } rounded-xl duration-300 ease-in-out flex flex-col items-center justify-center`}
              onClick={() => handleOptionClick("3")}
            >
              <input
                type="radio"
                name="userType"
                value="freelancer"
                className="hidden"
              />
              <img
                src={Expert}
                alt="freelancer"
                className="w-10 h-10 md:w-14 md:h-14"
              />

              <span
                className={`text-black/80 font-medium text-sm md:text-base`}
              >
                I'm an Expert.
              </span>
            </label>
          </div>

          <div className="flex gap-2 justify-end items-center">
            <button
              className="text-black/75 hover:text-blue/40 duration-300 px-8 py-2"
              onClick={(e) => handleSkip(e)}
            >
              Skip
            </button>
            <button
              className={`w-1/3 md:w-1/5 2xl:w-1/7 text-white ${
                true === "0"
                  ? "bg-grey cursor-not-allowed"
                  : "bg-blue hover:brightness-125"
              }  duration-300 rounded-lg ease-in-out px-8 py-2 justify-end`}
              onClick={(e) => {
                handleProceed(e);
              }}
            >
              {isSubmitting ? <CircularProgress /> : "Proceed"}
            </button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default InitialSetup;
