import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField } from "@mui/material";
import lottieAnimation from "../../assets/Lotties/button.json";
import Lottie from "react-lottie";
import Background from "../../assets/backWall.jpg";
import Logo from "../../assets/Logo/p2w.png";
import Email from "../../assets/FlatIcons/email.jpg";
import { FaChevronLeft } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

// Replace with your actual site key
const RECAPTCHA_SITE_KEY = "6LfRymsrAAAAAJQL0dSJsxQbHhqV7tRv7XtzxNEz";

// ✅ Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ForgetPassword = () => {
  const [emailUsername, setEmailUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const recaptchaRef = useRef(null);

  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

const handleSendEmail = () => {
  const trimmedEmailUsername = emailUsername.trim();

  if (!trimmedEmailUsername) {
    toast.error("Please enter your email address.", {
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
    return;
  }

  if (!isValidEmail(trimmedEmailUsername)) {
    toast.error("Please enter a valid email address.", {
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
    return;
  }

  if (!captchaValue) {
    setCaptchaError("Please complete the reCAPTCHA.");
    return;
  }

  setLoading(true);

  const apiUrl = `https://paid2workk.solarvision-cairo.com/ForgotPassword`;

  const payload = {
    email: trimmedEmailUsername,
    captchaToken: captchaValue, // ✅ CAPTCHA passed in body
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message) {
        toast.success("An email has been sent to your registered mail Id.", {
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
        navigate("/login");
      } else if (result.error === "Token is expired") {
        toast.error("Token is expired.", {
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
        navigate("/login");
      } else {
        toast.error("Failed to send password reset email. Please try again.", {
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
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      toast.error("An error occurred while sending the password reset email.", {
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
    })
    .finally(() => {
      setLoading(false);
    });
};


  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendEmail(event);
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
      <div className="absolute top-3 flex justify-between items-center w-full px-8">
        <img
          src={Logo}
          alt="Paid2Workk"
          width={240}
          height={50}
          className="cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        />
        <button
          className="flex gap-1 items-center font-medium text-md text-black/80 hover:underline duration-300 ease-in-out"
          onClick={() => navigate("/login")}
        >
          <FaChevronLeft className="text-base" />
          <p>
            Go back to <span className="text-blue">Login</span>
          </p>
        </button>
      </div>
      <Box
        className="sm:bg-white bg-white/0 sm:shadow-md sm:rounded-xl sm:px-10 px-6 py-10 sm:border sm:border-blue/10"
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
        <img src={Email} alt="Envelope Icon" className="w-36 mx-auto mb-10" />
        <h2 className="text-2xl font-bold mb-3 text-center">
          Update your password
        </h2>
        <p className="text-opacity-80 mb-5 text-justify leading-6">
          Enter your email address and select Send Email.
        </p>

        <TextField
          id="email-username"
          label="Email"
          variant="outlined"
          value={emailUsername}
          onChange={(e) => setEmailUsername(e.target.value)}
          fullWidth
          margin="normal"
          onKeyPress={handleKeyPress}
          InputProps={{
            style: {
              borderRadius: "8px",
            },
          }}
        />

        {/* reCAPTCHA */}
        <div className="mt-4">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(value) => {
              setCaptchaValue(value);
              setCaptchaError("");
            }}
            ref={recaptchaRef}
          />
          {captchaError && (
            <p className="text-sm text-red-500 mt-2">{captchaError}</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="bg-blue text-white px-5 py-2 rounded-lg hover:brightness-125 font-medium duration-300 ease-in-out"
            onClick={handleSendEmail}
          >
            {loading ? (
              <Lottie
                options={defaultOptions}
                height={"1.4rem"}
                width={"5rem"}
              />
            ) : (
              <span>Send Email</span>
            )}
          </button>
        </div>
      </Box>
    </div>
  );
};

export default ForgetPassword;
