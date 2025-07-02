import React, { useState } from "react";
import { Box, Checkbox, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// Assets
import Background from "../../assets/backWall.jpg";
import Logo from "../../assets/Logo/p2w.png";
import FreelancerImage from "../../assets/FlatIcons/freelancer.png";
import ClientImage from "../../assets/FlatIcons/business-man.png";
import { googleClientId } from "../../config";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";

const SignupSelections = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState("3");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [, setCookie] = useCookies(["token"]);

  const handleOptionClick = (value) => {
    setSelectedRole(value);
    sessionStorage.setItem("selectedRole", value);
    validateForm(value, isChecked);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    validateForm(selectedRole, e.target.checked);
  };

  const validateForm = (role, checked) => {
    if (role !== "3" && checked) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  const handleGoogleSignup = async (credential) => {
    if (selectedRole === "3" || !isChecked) {
      toast.error("Please select a role and agree to the terms.");
      return;
    }

    try {
      const response = await axios.post(
        "https://paid2workk.solarvision-cairo.com/SignWithGoogle",
        {
          token: credential,
          roleId: selectedRole,
        }
      );

      if (response.status !== 200 || !response.data?.user?.nUserID) {
        throw new Error("Sign-Up failed. Invalid response from server.");
      }

      const data = response.data;

      // Store token in cookies
      setCookie("token", data.loginToken, { path: "/" });

      // Set user data in auth context
      login({
        username: data.user.username,
        skill: data.user.skill,
        nUserID: data.user.nUserID,
        progress: data.user.progress,
        photoPath: data.user.photopath,
        roleId: data.user.roleId,
        email: data.user.Email,
      });

      toast.success("Signed up successfully!");

      // Navigate based on progress
      const progress = parseFloat(data.user.progress);
      if (progress < 30) {
        navigate("/account-setup");
      } else {
        navigate("/dashboard"); // Always navigate to dashboard
      }
    } catch (error) {
      console.error("Sign-Up Error:", error);
      toast.error("Sign-Up failed. Please try again!");
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
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
              xs: "90%",
              sm: "70%",
              md: "50%",
              lg: "40%",
              xl: "33%",
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
                <img
                  src={ClientImage}
                  alt="client"
                  className="w-14 h-14 mb-4"
                />
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
                <span className={`text-black/60 text-sm`}>
                  looking for Work
                </span>
              </label>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="py-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  name="terms"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <p className="text-sm text-black/75">
                  Yes, I understand and agree to the{" "}
                  <Link href="#" className="text-[#0b64fc] hover:underline">
                    Paid2Workk Terms of Service
                  </Link>
                  , including the{" "}
                  <Link href="#" className="text-[#0b64fc] hover:underline">
                    User Agreement
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#0b64fc] hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* Google Sign-Up Button */}
            <div className="flex flex-col gap-3 items-center justify-start">
              <Box
                className="w-full flex justify-end"
              >
                <Button
                  className="flex items-center justify-center gap-2 "
                  onClick={() => {
                    const googleButton =
                      document.querySelector('div[role="button"]');
                    if (googleButton) {
                      googleButton.click();
                    }
                  }}
                  disabled={!isButtonEnabled}
                >
                  Proceed <ArrowRight className="w-4 h-4"/>
                </Button>
                <div style={{ display: "none" }}>
                  <GoogleLogin
                    width="400px"
                    text="signup_with"
                    type="standard"
                    shape="rectangular"
                    useOneTap={false}
                    auto_select={false}
                    onSuccess={(credentialResponse) => {
                      handleGoogleSignup(credentialResponse.credential);
                    }}
                    onError={() => {
                      toast.error("Google Sign-up failed");
                    }}
                  />
                </div>
              </Box>
            </div>
          </div>
        </Box>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignupSelections;
