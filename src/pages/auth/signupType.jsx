import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Assets
import Background from "../../assets/backWall.jpg";
import Logo from "../../assets/Logo/p2w.png";
import FreelancerImage from "../../assets/FlatIcons/freelancer.png";
import ClientImage from "../../assets/FlatIcons/business-man.png";

const SignupSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("3");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleOptionClick = (value) => {
    setSelectedRole(value);
    sessionStorage.setItem("selectedRole", value);
    setIsButtonEnabled(true);
  };

  const handleCreateAccountClick = () => {
    if (isButtonEnabled) {
      navigate("/signup");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="absolute -z-10 inset-0">
        <img
          src={Background}
          alt="Background"
          className="sm:block hidden h-full w-full object-cover"
        />
      </div>
      <Box
        className="sm:bg-white bg-white/0 sm:shadow-md sm:rounded-xl p-5 sm:p-10 sm:border sm:border-blue/10"
        sx={{
          width: {
            xs: "90%", // 0px to 600px
            sm: "70%", // 600px to 960px
            md: "50%", // 960px to 1280px
            lg: "40%", // 1280px to 1920px
            xl: "33%", // 1920px and up
          },
        }}
      >
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <img
              src={Logo}
              alt="Paid2Workk Logo"
              className="h-24 mx-auto mb-8"
            />
            <h3 className="text-black/80 font-medium mb-8 text-3xl">
              Join as a Client or Freelancer
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Client Card */}
            <label
              className={`p-6 bg-white text-black cursor-pointer hover:shadow-md transition-shadow ${
                selectedRole === "0"
                  ? "border-blue border-2"
                  : "border-blue/10 border-2"
              } rounded-xl duration-300 ease-in-out flex flex-col items-center`}
              onClick={() => handleOptionClick("0")}
            >
              <input
                type="radio"
                name="userType"
                value="client"
                className="hidden"
              />
              <img src={ClientImage} alt="client" className="w-14 h-14 mb-4" />
              <span className="font-medium text-lg mb-1">I'm a Client,</span>
              <span className={`text-black/60 text-sm`}>
                hiring for a Project
              </span>
            </label>

            {/* Freelancer Card */}
            <label
              className={`p-6 bg-white text-black cursor-pointer hover:shadow-md transition-shadow ${
                selectedRole === "1"
                  ? "border-blue border-2"
                  : "border-blue/10 border-2"
              } rounded-xl duration-300 ease-in-out flex flex-col items-center`}
              onClick={() => handleOptionClick("1")}
            >
              <input
                type="radio"
                name="userType"
                value="freelancer"
                className="hidden"
              />
              <img
                src={FreelancerImage}
                alt="freelancer"
                className="w-14 h-14 mb-4"
              />
              <span className="font-medium text-lg mb-1">
                I'm a Freelancer,
              </span>
              <span className={`text-black/60 text-sm`}>looking for Work</span>
            </label>
          </div>

          <div className="flex flex-col gap-3 items-center">
            <button
              className={`w-1/2 text-white font-medium ${
                selectedRole === "3"
                  ? "bg-grey cursor-not-allowed"
                  : "bg-blue hover:brightness-125"
              }  duration-300 rounded-lg ease-in-out mb-4 px-8 py-2 justify-end`}
              onClick={handleCreateAccountClick}
            >
              Proceed
            </button>

            <div className="bg-grey/30 rounded-full h-0.5 w-full"></div>
            <div className="text-black/70 my-3 flex justify-center w-full">
              <span>Already have an account?</span>
              <button
                className="ml-1 text-[#0b64fc] hover:text-[#0a58e9] underline"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default SignupSelection;
