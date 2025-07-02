import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Alert,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import Lottie from "react-lottie";
import lottieAnimation from "../../assets/Lotties/button.json";

// Assets
import Logo from "../../assets/Logo/p2w.png";
import Background from "../../assets/backWall.jpg";
import Password from "../../assets/FlatIcons/password-entry.png";
import { FaChevronLeft } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    blue: {
      main: "#0b64fc",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
  },
});

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Function to get query parameters by name
  const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

    if (!password) {
      setPasswordError(""); // No error if empty
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter.");
    } else if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter.");
    } else if (!/\d/.test(password)) {
      setPasswordError("Password must contain at least one number.");
    } else if (!/\W/.test(password)) {
      setPasswordError("Password must contain at least one special character.");
    } else {
      setPasswordError("");
    }

    setIsPasswordValid(passwordRegex.test(password));
  };

  useEffect(() => {
    if (newPassword) {
      validatePassword(newPassword);
    } else {
      // Reset password error if password field is cleared
      setPasswordError("");
      setIsPasswordValid(false);
    }

    // Set alert if confirm password is filled and does not match
    setAlertVisible(confirmPassword !== "" && newPassword !== confirmPassword);
  }, [newPassword, confirmPassword]);

  // Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  // Event listener for the Update Password button
  const handleUpdatePassword = () => {
    const email = getQueryParam("email");
    const token = getQueryParam("token");

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not Match!", {
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
    setLoading(true);
    fetch(`https://paid2workk.solarvision-cairo.com/ChangePass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email,
        password: newPassword,
        token,
      }).toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success("Password updated successfully!", {
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

          // window.location.href = 'nextPage.html';
          navigate("/password-success");
        } else {
          toast.error("Error updating password: " + data.message, {
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
        toast.error("An error occurred while updating your password.", {
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
      handleUpdatePassword(event);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50  px-4 sm:px-6 lg:px-8">
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
          className="w-32 md:w-48 h-auto cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        />
        <button
          className="flex gap-1 items-center font-medium text-sm md:text-base text-black/80 hover:underline duration-300 ease-in-out"
          onClick={() => navigate("/login")}
        >
          <FaChevronLeft className="text-base" />
          <p>
            Go back to <span className="text-blue">Login</span>
          </p>
        </button>
      </div>
      <div className="flex flex-col gap-3 sm:bg-white bg-white/0 sm:shadow-md sm:rounded-xl sm:px-10 p-6 py-8 sm:border sm:border-blue/10">
        <div className="flex flex-col w-full justify-center items-center">
          <img src={Password} alt="update password" className="w-32 mb-10" />
          <h2 className="text-2xl font-bold mb-3 text-center">
            Update your password
          </h2>
          <p className="text-opacity-80 mb-5 text-justify leading-6">
            Enter your new password and confirm it below.
          </p>
        </div>
        <ThemeProvider theme={theme}>
          <div className="flex flex-col  items-center">
            <TextField
              type={showPassword ? "text" : "password"}
              label="New Password"
              variant="outlined"
              fullWidth
              margin="normal"
              onKeyPress={handleKeyPress}
              value={newPassword}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                    className="text-black/60"
                  >
                    {showPassword ? (
                      <VisibilityOff size={20} />
                    ) : (
                      <Visibility size={20} />
                    )}
                  </button>
                ),
                minLength: 10,
              }}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red text-sm mt-1 self-start">
                Passwords do not match
              </p>
            )}
            <TextField
              type={showCnfPassword ? "text" : "password"}
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onKeyPress={handleKeyPress}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCnfPassword((prev) => !prev);
                    }}
                    className="text-black/60"
                  >
                    {showCnfPassword ? (
                      <VisibilityOff size={20} />
                    ) : (
                      <Visibility size={20} />
                    )}
                  </button>
                ),
              }}
            />

            <div style={{ marginTop: "20px" }}>
              <Button
                sx={{ color: "white" }}
                variant="contained"
                color="blue"
                fullWidth
                onClick={handleUpdatePassword}
                disabled={!isPasswordValid}
              >
                {loading ? (
                  <Lottie
                    options={defaultOptions}
                    height={"1.7rem"}
                    width={"6rem"}
                  />
                ) : (
                  <span>Update Password</span>
                )}
              </Button>
            </div>
          </div>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default UpdatePassword;
