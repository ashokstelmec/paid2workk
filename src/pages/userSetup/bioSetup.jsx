import React, { useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import { useAuth } from "../../contexts/authContext";

// Assets
import Logo from "../../assets/Logo/p2w.png";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BioSetup = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState(() => ({
    bio: sessionStorage.getItem("userBio") || "",
  }));
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // 📌 Handle Input Changes
  const handleChange = (field, value) => {
    setErrors({});
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Save to sessionStorage as user types
    sessionStorage.setItem("userBio", value);
  };

  const validate = () => {
    const newErrors = {};

    if (!formValues.bio) newErrors.bio = "Bio is required.";
    if (formValues.bio.length < 15) newErrors.bio = "Bio is too Short.";
    if (formValues.bio.length > 3000) newErrors.bio = "Bio is too Long.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleProceed = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        const data = new FormData();
        data.append("nUserID", sessionStorage.getItem("NUserID"));
        data.append("Bio", formValues.bio);
        data.append("type", "Resume");
        data.append("progress", user.roleId === "0" ? "25%" : "15%");

        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/Updatebio",
          {
            method: "POST",
            body: data,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Keep the bio in sessionStorage even after successful submission
        sessionStorage.setItem("userBio", formValues.bio);
        navigate(user.roleId === "0" ? "/account-setup/5" : "/account-setup/3");
        const responseData = await response.json();
        // console.log("Update response:", responseData);
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error(`Failed to update profile: ${error.message}`, {
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
      toast.error(`Add a bio correctly!`, {
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

  // Update handleSkip to clear bio from sessionStorage
  const handleSkip = async (e) => {
    e.preventDefault();
    sessionStorage.removeItem("userBio");
    if (user) {
      setIsSubmitting(true);
      try {
        const data = new FormData();
        data.append("nUserID", sessionStorage.getItem("NUserID"));
        data.append("progress", user.roleId === "0" ? "25%" : "15%");

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
        navigate("/account-setup/3");
      } catch (error) {
        console.error("Failed to skip", error);
        toast.error(`Failed to skip: ${error.message}`, {
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
          <div className="text-start mb-8 px-4">
            <img
              src={Logo}
              alt="Paid2Workk Logo"
              className="h-24 mx-auto mb-8"
            />
            <h3 className="text-black/80 font-medium text-xl">
              Great. Now write a bio to tell the world about yourself.
            </h3>
            <span className="mb-8 mt-2 text-black/60 text-sm">
              Help people get to know you at a glance. What work do you do best?
              Tell them clearly, using paragraphs or bullet points. You can
              always edit later; just make sure you proofread now.
            </span>
          </div>

          <div className="mb-8">
            <TextField
              fullWidth
              label="Bio"
              rows={4}
              multiline
              value={formValues.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              error={!!errors.bio}
              helperText={
                errors.bio
                  ? errors.bio
                  : `${formValues.bio.length}/1000 characters`
              }
              variant="outlined"
            />
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
              {isSubmitting ? <CircularProgress /> : "Next"}
            </button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default BioSetup;
