import React from "react";
import { useNavigate } from "react-router-dom";

// Assets
import Background from "../../assets/backWall.jpg";
import Logo from "../../assets/Logo/p2w.png";
import { Box } from "@mui/material";

const PasswordUpdated = () => {
  const navigate = useNavigate();

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
        className="text-center sm:bg-white bg-white/0 sm:shadow-md sm:rounded-xl sm:px-10 px-6 py-10 sm:border sm:border-blue/10"
        sx={{
          width: {
            xs: "90%",
            sm: "70%",
            md: "50%",
            lg: "40%",
            xl: "28%",
          },
        }}
      >
        <div className="email-icon mb-6">
          <img src={Logo} alt="Email Icon" className="w-4/5 mx-auto" />
        </div>

        <h3 className="text-2xl text-black/75 mb-10">
          Password Updated Successfully
        </h3>

        <span onClick={() => navigate("/login")}>
          <button className="bg-blue text-white py-2 px-6 rounded-lg text-lg hover:brightness-125 duration-300 ease-in-out">
            Login
          </button>
        </span>
      </Box>
    </div>
  );
};

export default PasswordUpdated;
