import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  MdOutlineVisibilityOff as VisibilityOff,
  MdOutlineVisibility as Visibility,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

import Background from "../../assets/backWall.jpg";
import Logo from "../../assets/Logo/p2w.png";
import lottieAnimation from "../../assets/Lotties/button.json";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../../contexts/authContext";
import { useCookies } from "react-cookie";
import { useChat } from "../../contexts/chatContext";
import { Button } from "../../components/ui/button";
import { googleClientId } from "../../config";
import paid2work_main from "../../assets/Backgrounds/paid2work_main.jpg";

const RECAPTCHA_SITE_KEY = "6LfRymsrAAAAAJQL0dSJsxQbHhqV7tRv7XtzxNEz";
// const RECAPTCHA_SECRET_KEY = '6LfRymsrAAAAAMCfGJw3qcZXMjcFzFFCUSlvCL2Z';

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

const Login = () => {
  const { ensureConnection } = useChat();
  const { user, setUser, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setCookie] = useCookies(["token"]);

  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState("");
  const recaptchaRef = useRef(null);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaError("");
  };

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setEmailError("");
  //   setPasswordError("");
  //   setCaptchaError("");
  //   setIsLoading(true);

  //   let hasError = false;

  //   // Email validation
  //   if (!email.trim()) {
  //     setEmailError("Email is required");
  //     hasError = true;
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  //     setEmailError("Invalid email format");
  //     hasError = true;
  //   }

  //   // Password validation
  //   if (!password.trim()) {
  //     setPasswordError("Password is required");
  //     hasError = true;
  //   } else if (password.length < 6) {
  //     setPasswordError("Password must be at least 6 characters");
  //     hasError = true;
  //   }

  //   // CAPTCHA validation
  //   if (!captchaToken) {
  //     setCaptchaError("Please complete the CAPTCHA");
  //     setIsLoading(false);
  //     return;
  //   }

  //   if (hasError) {
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append("Email", email);
  //     formData.append("Password", password);
  //     formData.append("CaptchaToken", captchaToken); // ✅ Added for backend

  //     const response = await fetch(
  //       "https://paid2workk.solarvision-cairo.com/Logina",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       if (response.status === 404) {
  //         setEmailError("Email not found. Please check your email or sign up.");
  //       } else if (response.status === 401) {
  //         setPasswordError("Incorrect password. Please try again.");
  //       } else {
  //         setEmailError(data.message || "Login failed. Please try again.");
  //       }

  //       // Reset CAPTCHA
  //       if (recaptchaRef.current) {
  //         recaptchaRef.current.reset();
  //         setCaptchaToken(null);
  //       }

  //       return;
  //     }

  //     // Set cookie using react-cookie
  //     setCookie("token", data.loginToken, {
  //       path: "/",
  //       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //     });

  //     setUser({ ...user, nUserID: data.user.nUserID });

  //     // Successful login
  //     login({
  //       username: data.user.username,
  //       skill: data.user.skill,
  //       nUserID: data.user.nUserID,
  //       progress: data.user.progress,
  //       photoPath: data.user.photopath,
  //       roleId: data.user.roleId,
  //       email: data.user.Email,
  //       currency: data.user.CurrencyID,
  //       balance: data.user.balance,
  //       contact: data.user.PhoneNumber,
  //     });

  //     localStorage.setItem("authentication", true);

  //     toast.success("Logged in Successfully!", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       theme: "light",
  //     });

  //     const progress = parseFloat(data.user.progress);
  //     setTimeout(() => {
  //       if (progress < 30) {
  //         window.location.href = "/account-setup";
  //       } else {
  //         window.location.href = "/dashboard";
  //       }
  //     }, 100);
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     toast.error("Login failed. Please try again.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       theme: "light",
  //     });

  //     // Reset CAPTCHA
  //     if (recaptchaRef.current) {
  //       recaptchaRef.current.reset();
  //       setCaptchaToken(null);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setCaptchaError("");
    setIsLoading(true);

    let hasError = false;

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
      hasError = true;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    // CAPTCHA validation
    if (!captchaToken) {
      setCaptchaError("Please complete the CAPTCHA");
      setIsLoading(false);
      return;
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/Logina",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: email,
            Password: password,
            CaptchaToken: captchaToken, // ✅ Must match backend property
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setEmailError("Email not found. Please check your email or sign up.");
        } else if (response.status === 401) {
          setPasswordError("Incorrect password. Please try again.");
        } else {
          setEmailError(data.message || "Login failed. Please try again.");
        }

        // Reset CAPTCHA on failure
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setCaptchaToken(null);
        }

        return;
      }

      // Set cookie using react-cookie
      setCookie("token", data.loginToken, {
        path: "/",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      setUser({ ...user, nUserID: data.user.nUserID });

      // Successful login
      login({
        username: data.user.username,
        skill: data.user.skill,
        nUserID: data.user.nUserID,
        progress: data.user.progress,
        photoPath: data.user.photopath,
        roleId: data.user.roleId,
        email: data.user.Email,
        currency: data.user.CurrencyID,
        balance: data.user.balance,
        contact: data.user.PhoneNumber,
      });

      localStorage.setItem("authentication", true);

      toast.success("Logged in Successfully!", {
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

      const progress = parseFloat(data.user.progress);
      setTimeout(() => {
        if (progress < 30) {
          window.location.href = "/account-setup";
        } else {
          window.location.href = "/dashboard";
        }
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.", {
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

      // Reset CAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleLoginWithGoogle = async (googleToken) => {
    if (!googleToken) {
      toast.error("Google login failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://paid2workk.solarvision-cairo.com/LoginWithGoogle",
        { token: googleToken }
      );
      await ensureConnection();

      const data = response.data;

      if (!response.status === 200 || !data?.user?.nUserID) {
        throw new Error("Invalid response from server");
      }

      // Set cookie using react-cookie
      setCookie("token", data.loginToken, { path: "/" });
      setUser({ ...user, nUserID: data.user.nUserID });

      // Successful login
      login({
        username: data.user.username,
        skill: data.user.skill,
        nUserID: data.user.nUserID,
        progress: data.user.progress,
        photoPath: data.user.photopath,
        roleId: data.user.roleId,
        email: data.user.Email,
        currency: data.user.CurrencyID,
        balance: data.user.balance,
        contact: data.user.PhoneNumber,
      });

      localStorage.setItem("authentication", true);

      toast.success("Logged in Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });

      const progress = parseFloat(data.user.progress);
      setTimeout(() => {
        if (progress < 30) {
          window.location.href = "/account-setup";
        } else {
          window.location.href = "/dashboard";
        }
      }, 100);
    } catch (error) {
      console.error(
        "Google login error:",
        error.response?.data || error.message
      );
      toast.error("Can't login. Please Sign Up First!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
      window.location.href = "/pre-signups";
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="flex flex-col md:flex-row h-dvh bg-gray-100">
        {/* Login Form Section */}
        <div className="w-full md:w-2/3 flex items-center justify-center relative h-screen overflow-hidden">
          {/* Gradient overlay to blend with image */}
          <div className="absolute inset-0 z-0 ">
            <img
              src={paid2work_main}
              alt="Login Side Image"
              className="h-full w-full object-cover object-right opacity-30 md:opacity-10"
              style={{ filter: "blur(20px)" }}
            />
          </div>

          <ThemeProvider theme={theme}>
            <Box className="relative z-10 w-full max-w-sm px-4 py-6 sm:px-8  mx-4 sm:mx-0 bg-white/90 rounded-xl shadow-lg backdrop-blur-md">
              <Stack width="100%" spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <img
                    onClick={() => navigate("/")}
                    src={Logo}
                    alt="Paid2Workk Logo"
                    width={250}
                    height={50}
                    className="cursor-pointer"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </Box>

                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ fontWeight: 500 }}
                >
                  Welcome back 👋
                </Typography>

                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
                  error={!!emailError}
                  helperText={emailError}
                  InputProps={{
                    sx: {
                      height: "43px",
                      "& .MuiInputBase-input": {
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.875rem",
                        padding: "0 14px",
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "0.875rem",
                      transform: "translate(14px, 13px)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    },
                  }}
                />

                {/* Password Field */}
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  error={!!passwordError}
                  helperText={passwordError}
                  InputProps={{
                    sx: {
                      height: "43px",
                      "& .MuiInputBase-input": {
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.875rem",
                        padding: "0 14px",
                      },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "0.875rem",
                      transform: "translate(14px, 13px)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Link
                    href="/forgot-password"
                    underline="none"
                    sx={{ color: "blue.main", fontSize: "0.9rem" }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  ref={recaptchaRef}
                />
                {captchaError && (
                  <Typography sx={{ fontSize: "0.85rem" }} color="error">
                    {captchaError}
                  </Typography>
                )}

                <Button onClick={handleSubmit} onKeyDown={handleKeyPress}>
                  {isLoading ? (
                    <Lottie
                      options={defaultOptions}
                      height={"1.9rem"}
                      width={"6rem"}
                    />
                  ) : (
                    <span>Log in</span>
                  )}
                </Button>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Divider sx={{ flex: 1 }} />
                  <Typography color="text.black">OR</Typography>
                  <Divider sx={{ flex: 1 }} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <GoogleLogin
                    text="Sign in with"
                    width="300px"
                    fullWidth
                    color="dark"
                    onSuccess={(credentialResponse) =>
                      handleLoginWithGoogle(credentialResponse.credential)
                    }
                    useOneTap
                  />
                </Box>

                <Typography
                  align="center"
                  color="text.black"
                  sx={{ fontSize: "0.85rem" }}
                >
                  Don’t have an account?{" "}
                  <Link
                    href="/pre-signup"
                    underline="none"
                    sx={{ color: "blue.main" }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </ThemeProvider>
        </div>

        {/* Image Section - show until md screens */}
        <div className="w-full md:w-1/3 hidden md:block relative">
          <img
            src={paid2work_main}
            alt="Login Side Image"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
