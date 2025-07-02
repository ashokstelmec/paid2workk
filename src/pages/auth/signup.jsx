import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import {
  Button,
  Box,
  CardContent,
  CardHeader,
  Checkbox,
  TextField,
  Link,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  MdOutlineVisibilityOff as VisibilityOff,
  MdOutlineVisibility as Visibility,
} from "react-icons/md";

import Logo from "../../assets/Logo/p2w.png";
import Background from "../../assets/backWall.jpg";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

// Create custom theme with blue blue color
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

const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState(
    sessionStorage.getItem("selectedRole") || "1"
  );
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "1",
    tips: false,
    terms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const RECAPTCHA_SITE_KEY = "6LfRymsrAAAAAJQL0dSJsxQbHhqV7tRv7XtzxNEz"; // Use the same key as login page
  const recaptchaRef = useRef(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedRole) {
      navigate("/verify-email");
      return;
    }

    // Fetch active countries
    fetch("https://paid2workk.solarvision-cairo.com/GetActiveCountry")
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching country data:", error));
  }, [selectedRole]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    sessionStorage.setItem("selectedRole", role);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

    if (!passwordRegex.test(password)) {
      if (!password) {
        setPasswordError(""); // No error if empty
      } else if (password.length < 8) {
        setPasswordError("Must be at least 8 characters long.");
      } else if (!/[A-Z]/.test(password)) {
        setPasswordError("Must contain at least one uppercase letter.");
      } else if (!/[a-z]/.test(password)) {
        setPasswordError("Must contain at least one lowercase letter.");
      } else if (!/\d/.test(password)) {
        setPasswordError("Must contain at least one number.");
      } else if (!/\W/.test(password)) {
        setPasswordError("Must contain at least one special character.");
      } else {
        setPasswordError("Set a strong password."); // fallback (if needed)
      }
    } else {
      setPasswordError("");
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setErrorMessage("");
  //   setEmailError("");

  //   // Check for password validation error first
  //   if (passwordError) {
  //     toast.error("Please set a strong password before submitting.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Bounce,
  //     });
  //     setIsLoading(false);
  //     return;
  //   }

  //   // Validation
  //   if (
  //     !formData.firstName ||
  //     !formData.lastName ||
  //     !formData.email ||
  //     !formData.password ||
  //     !formData.terms
  //   ) {
  //     toast.error(
  //       "Please fill out all required fields and agree to the terms.",
  //       {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: false,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //         transition: Bounce,
  //       }
  //     );

  //     setIsLoading(false);
  //     return;
  //   }

  //   const submissionData = new FormData();
  //   submissionData.append("userID", null);
  //   submissionData.append(
  //     "username",
  //     `${formData.firstName} ${formData.lastName}`
  //   );
  //   submissionData.append("email", formData.email);
  //   submissionData.append("password", formData.password);
  //   submissionData.append("roleId", parseInt(selectedRole, 10));
  //   submissionData.append("privacy", formData.tips);
  //   submissionData.append("mailsubs", formData.tips);
  //   submissionData.append("country", formData.country);

  //   fetch("https://paid2workk.solarvision-cairo.com/addRegistration", {
  //     method: "POST",
  //     body: submissionData,
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.text().then((text) => {
  //           if (text.includes("Successfully Saved")) {
  //             return { success: true };
  //           }
  //           throw new Error("Unexpected response format.");
  //         });
  //       } else if (response.status === 400) {
  //         throw new Error("This Email Id Already Exists");
  //       } else {
  //         throw new Error(`Unexpected response status: ${response.status}`);
  //       }
  //     })
  //     .then((result) => {
  //       if (result.success) {
  //         sessionStorage.setItem("email", formData.email);
  //         navigate("/verify-email");
  //       }
  //     })
  //     .catch((error) => {
  //       if (error.message === "This Email Id Already Exists") {
  //         setEmailError(error.message);
  //       } else {
  //         toast.error(`${error.message}`, {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: false,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //           transition: Bounce,
  //         });
  //       }
  //       console.error(error);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setEmailError("");

    // CAPTCHA check
    if (!captchaValue) {
      setCaptchaError("Please complete the CAPTCHA.");
      toast.error("Please complete the CAPTCHA.", {
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
      setIsLoading(false);
      return;
    }

    // Password validation
    if (passwordError) {
      toast.error("Please set a strong password before submitting.", {
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
      setIsLoading(false);
      return;
    }

    // Field validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.terms
    ) {
      toast.error(
        "Please fill out all required fields and agree to the terms.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
      setIsLoading(false);
      return;
    }

    const submissionData = new FormData();
    submissionData.append("userID", null);
    submissionData.append(
      "username",
      `${formData.firstName} ${formData.lastName}`
    );
    submissionData.append("email", formData.email);
    submissionData.append("password", formData.password);
    submissionData.append("roleId", parseInt(selectedRole, 10));
    submissionData.append("privacy", formData.tips);
    submissionData.append("mailsubs", formData.tips);
    submissionData.append("country", formData.country);

    fetch("https://paid2workk.solarvision-cairo.com/addRegistration", {
      method: "POST",
      body: submissionData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text().then((text) => {
            if (text.includes("Successfully Saved")) {
              return { success: true };
            }
            throw new Error("Unexpected response format.");
          });
        } else if (response.status === 400) {
          throw new Error("This Email Id Already Exists");
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      })
      .then((result) => {
        if (result.success) {
          sessionStorage.setItem("email", formData.email);
          navigate("/verify-email");
        }
      })
      .catch((error) => {
        if (error.message === "This Email Id Already Exists") {
          setEmailError(error.message);
        } else {
          toast.error(`${error.message}`, {
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
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
        recaptchaRef.current?.reset(); // Reset captcha
        setCaptchaValue(null); // Clear local state
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="absolute -z-10 inset-0">
        <img
          src={Background}
          alt="Background"
          className="sm:block hidden h-full w-full object-cover"
        />
      </div>
      <ThemeProvider theme={theme}>
        <Box
          className="sm:bg-white max-w-md w-96 bg-white/0 sm:shadow-md sm:rounded-xl sm:px-10 px-6 py-1 sm:border sm:border-blue/10"
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
          <CardHeader
            title={
              <div className="space-y-1">
                <div className="flex justify-center">
                  <img
                    onClick={() => {
                      navigate("/");
                    }}
                    className="cursor-pointer"
                    src={Logo}
                    alt="Paid2Workk Logo"
                    width={250}
                    height={50}
                  />
                </div>
                <div className="flex rounded-lg overflow-hidden font-medium text-lg">
                  <button
                    onClick={() => handleRoleChange("0")}
                    className={`flex-1 py-2 text-center transition-colors ${
                      selectedRole === "0"
                        ? "bg-[#0b64fc] text-white"
                        : "bg-gray text-black/60"
                    }`}
                  >
                    Client
                  </button>
                  <button
                    onClick={() => handleRoleChange("1")}
                    className={`flex-1 py-2 text-center transition-colors ${
                      selectedRole === "1"
                        ? "bg-[#0b64fc] text-white"
                        : "bg-gray text-black/60"
                    }`}
                  >
                    Freelancer
                  </button>
                </div>
              </div>
            }
          />
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!emailError}
                  helperText={emailError}
                />
              </div>

              <div className="my-2">
                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!passwordError}
                  helperText={passwordError}
                  InputProps={{
                    endAdornment: (
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-black/60"
                      >
                        {showPassword ? (
                          <VisibilityOff size={20} />
                        ) : (
                          <Visibility size={20} />
                        )}
                      </button>
                    ),
                  }}
                />
              </div>

              <div className="mt-4">
                <FormControl fullWidth className="mt-2">
                  <InputLabel id="country-label" className="bg-white">
                    <span className="text-white">i</span>Country
                    <span className="text-white">i</span>
                  </InputLabel>
                  <Select
                    labelId="country-label"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    sx={{
                      borderRadius: "8px", // Adjust the border radius as needed
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px", // Ensures the border radius is applied to the outline
                      },
                    }}
                  >
                    {countries.map((country) => (
                      <MenuItem
                        key={country.country_Id}
                        value={country.country_Id}
                      >
                        {country.country_Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(value) => {
                  setCaptchaValue(value);
                  setCaptchaError(""); // Clear any old errors
                }}
                ref={recaptchaRef}
              />

              {captchaError && (
                <p className="text-sm text-red-500 mt-1">{captchaError}</p>
              )}
              <div className="py-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
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

              <Button
                sx={{ color: "white" }}
                className="w-full"
                variant="contained"
                color="blue"
                size="large"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <div className="text-black/70 my-3 flex justify-center w-full">
            <span>Already have an account?</span>
            <button
              className="ml-1 text-[#0b64fc] hover:text-[#0a58e9] underline"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default SignUp;
