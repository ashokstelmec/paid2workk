import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Avatar,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
} from "@mui/material";
import { Camera } from "lucide-react";
import { useAuth } from "../../../contexts/authContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    blue: {
      main: "#0b64fc",
    },
  },
});

const BasicInfo = () => {
  const { user, updateUser } = useAuth();
  const [imageLoading, setImageLoading] = useState(true);
  const [languages, setLanguages] = useState([]);

  const navigate = useNavigate();

  // Update initial profileImage state to check sessionStorage first
  const [profileImage, setProfileImage] = useState(
    sessionStorage.getItem("photoPath")
  );

  const [userInfo, setUserInfo] = useState({});

  // Initialize form values with empty strings
  const [formValues, setFormValues] = useState({
    username: "",
    companyTitle: "",
    country: "",
    city: "",
    state: "",
    address: "",
    postalCode: "",
    email: "",
    phone: "",
    language: "",
    bio: "",
  });

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  // const [errors, setErrors] = useState({});

  // Add new states for dropdown options
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Add state for first and last name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [wasSubmitted, setWasSubmitted] = useState(false);

  // Modify the useEffect for fetching initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user?.nUserID) return;

      try {
        setIsLoading(true);
        const sessionData = JSON.parse(
          sessionStorage.getItem("userSession") || "{}"
        );

        // First try to get names from session storage
        if (sessionData.firstName && sessionData.lastName) {
          setFirstName(sessionData.firstName);
          setLastName(sessionData.lastName);
        } else if (sessionData.username) {
          // Fall back to splitting username
          const [firstN = "", lastN = ""] = sessionData.username.split(" ");
          setFirstName(firstN);
          setLastName(lastN);
        }

        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?NUserId=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const userData = await response.json();
        const userDetails =
          Array.isArray(userData) && userData.length > 0 ? userData[0] : {};
        setUserInfo(userDetails);

        const languageResponse = await fetch(
          "https://paid2workk.solarvision-cairo.com/GetLanguages"
        );
        const languageData = await languageResponse.json();
        setLanguages(languageData);

        // First fetch countries
        const countriesResponse = await fetch(
          "https://paid2workk.solarvision-cairo.com/GetActiveCountry"
        );
        const countriesData = await countriesResponse.json();
        setCountries(countriesData);

        // Find matching country from the list
        const selectedCountry = countriesData.find(
          (c) => c.country_Name === userDetails.country
        );

        // Set initial form values
        setFormValues((prev) => ({
          ...prev,
          username: userDetails.username || "",
          companyTitle: userDetails.companyName || "",
          country: selectedCountry?.country_Id || "", // Use empty string as fallback
          state: "", // Will be set after states are loaded
          city: "", // Will be set after cities are loaded
          address: userDetails.address || "",
          postalCode: userDetails.pin || "",
          email: userDetails.email || user.email || "",
          phone: userDetails.phoneNumber || "",
          language: userDetails.language || "",
          bio: userDetails.bio || "",
        }));

        if (selectedCountry) {
          // Load states for selected country
          const statesResponse = await fetch(
            `https://paid2workk.solarvision-cairo.com/GetActiveState?CountryId=${selectedCountry.country_Id}`
          );
          const statesData = await statesResponse.json();
          setStates(statesData);

          // Find matching state
          const selectedState = statesData.find(
            (s) => s.state_Name === userDetails.state
          );

          if (selectedState) {
            // Update form with state ID
            setFormValues((prev) => ({
              ...prev,
              state: selectedState.state_Id,
            }));

            // Load cities for selected state
            const citiesResponse = await fetch(
              `https://paid2workk.solarvision-cairo.com/GetActiveCity?CountryId=${selectedCountry.country_Id}&State_Id=${selectedState.state_Id}`
            );
            const citiesData = await citiesResponse.json();
            setCities(citiesData);

            // Find matching city
            const selectedCity = citiesData.find(
              (c) => c.city_Name === userDetails.city
            );

            if (selectedCity) {
              // Update form with city ID
              setFormValues((prev) => ({
                ...prev,
                city: selectedCity.city_Id,
              }));
            }
          }
        }

        // Set name values
        if (userDetails.username) {
          const [firstN = "", lastN = ""] = userDetails.username.split(" ");
          setFirstName(firstN);
          setLastName(lastN);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setImageLoading(false);
      }
    };

    fetchInitialData();
  }, [user?.nUserID]);

  // 📌 Fetch Countries

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/GetActiveCountry"
      );
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      setErrorMessage("Failed to load countries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadStates = async (countryId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetActiveState?CountryId=${countryId}`
      );
      if (!response.ok) throw new Error("Failed to fetch states");
      const data = await response.json();
      // console.log("States loaded for country:", countryId, data);
      setStates(data);
      // Clear state and city selections when country changes
      setFormValues((prev) => ({
        ...prev,
        state: "",
        city: "",
      }));
    } catch (error) {
      console.error("Failed to load states:", error);
      setErrorMessage("Failed to load states. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update loadCities function to keep IDs as strings
  const loadCities = async (stateId, countryId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetActiveCity?CountryId=${countryId}&State_Id=${stateId}`
      );

      if (!response.ok) throw new Error("Failed to fetch cities");

      const data = await response.json();
      // Keep city_Id as string
      const formattedCities = data.map((city) => ({
        ...city,
        city_Id: city.city_Id.toString(),
      }));

      // console.log("Cities data:", formattedCities);
      setCities(formattedCities);
    } catch (error) {
      console.error("Error loading cities:", error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to sync profile image with session storage
  useEffect(() => {
    const handleStorageChange = () => {
      const sessionData = JSON.parse(
        sessionStorage.getItem("userSession") || "{}"
      );
      if (sessionData.photoPath) {
        setProfileImage(sessionData.photoPath);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateImageEverywhere = (imagePath) => {
    // Update local state first
    setProfileImage(imagePath);
    sessionStorage.setItem("photoPath", imagePath);

    // Update user context
    updateUser((prev) => ({
      ...prev,
      photoPath: imagePath,
    }));

    // Force navbar re-render
    window.dispatchEvent(new Event("storage"));
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload only JPG, JPEG or PNG files", {
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

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size should be less than 5MB", {
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

    if (!user?.nUserID) {
      toast.error(
        "Session information is missing. Please try logging in again.",
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
      return;
    }

    try {
      setImageLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "profile");
      formData.append("nUserId", sessionStorage.getItem("NUserID").toString());

      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/UploadPhoto",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Invalid server response format");
      }

      if (data && data.filePath) {
        updateImageEverywhere(data.filePath);
        toast.success("Image uploaded Successfully!", {
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
      } else {
        throw new Error("No valid file path in server response");
      }
    } catch (error) {
      toast.error(
        `Failed to upload image: ${error.message || "Unknown error occurred"}`,
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
    } finally {
      setImageLoading(false);
    }
  };

  // 📌 Handle Input Changes
  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 📌 Handle Country Change
  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setFormValues((prev) => ({
      ...prev,
      country: countryId,
      state: "",
      city: "",
    }));

    setStates([]);
    setCities([]);

    if (countryId) {
      await loadStates(countryId);
    }
  };

  // 📌 Handle State Change
  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    // console.log("State changed to:", stateId);

    setFormValues((prev) => ({
      ...prev,
      state: stateId,
      city: "", // Reset city when state changes
    }));

    setCities([]); // Clear cities while loading

    if (stateId && formValues.country) {
      await loadCities(stateId, formValues.country);
    }
  };

  // Add name change handlers
  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    handleChange("username", `${value} ${lastName}`.trim());
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    handleChange("username", `${firstName} ${value}`.trim());
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};

    if (!formValues.bio) newErrors.bio = "Bio is required.";
    if (formValues.bio.length < 15) newErrors.bio = "Bio is too Short.";
    if (formValues.bio.length > 3000) newErrors.bio = "Bio is too Long.";
    if (!formValues.country) newErrors.country = "Country is required.";
    if (!formValues.city) newErrors.city = "City is required.";
    if (!formValues.address) newErrors.address = "Address is required.";
    if (!formValues.postalCode) {
      newErrors.postalCode = "Postal code is required.";
    }
    // if (!formValues.email) {
    //   newErrors.email = "Email is required.";
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
    //   newErrors.email = "Email is invalid.";
    // }
    if (!formValues.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formValues.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!formValues.language.trim()) {
      newErrors.language = "Please enter at least one language.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Add submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setWasSubmitted(true);

    if (validate()) {
      setIsSubmitting(true);
      try {
        const selectedCountry = countries.find(
          (c) => c.country_Id === formValues.country
        );
        const selectedState = states.find(
          (s) => s.state_Id === formValues.state
        );
        const selectedCity = cities.find((c) => c.city_Id === formValues.city);

        const newUsername = `${firstName} ${lastName}`.trim();

        const data = new FormData();
        data.append("nUserID", sessionStorage.getItem("NUserID"));
        data.append("username", newUsername);
        data.append("Country", formValues.country);
        data.append("State", formValues.state);
        data.append("City", formValues.city);
        data.append("address", formValues.address);
        data.append("pin", formValues.postalCode);
        data.append("phoneNumber", formValues.phone);
        data.append("country", selectedCountry?.country_Name || "");
        data.append("state", selectedState?.state_Name || "");
        data.append("city", selectedCity?.city_Name || "");
        data.append("Bio", formValues.bio);
        data.append("language", formValues.language || "");

        // console.log("Sending update request:", [...data.entries()]);

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

        // After successful save, update session storage and trigger navbar update
        const sessionData = JSON.parse(
          sessionStorage.getItem("userSession") || "{}"
        );
        const updatedSessionData = {
          ...sessionData,
          username: newUsername,
          // Save first and last name separately to maintain them after reload
          firstName: firstName,
          lastName: lastName,
        };
        sessionStorage.setItem(
          "userSession",
          JSON.stringify(updatedSessionData)
        );

        // Update the user context
        updateUser((prev) => ({
          ...prev,
          username: newUsername,
        }));

        // Dispatch event for navbar to update
        window.dispatchEvent(new Event("profileSaved"));

        toast.success("Profile updated Successfully!", {
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
      // console.log("Validation failed.");
    }
  };

  // Update city selection handling
  const handleCityChange = (e) => {
    const cityId = e.target.value.toString();
    const selectedCity = cities.find((c) => c.city_Id === cityId);

    // console.log("City Selection:", {
    //   cityId,
    //   cityType: typeof cityId,
    //   selectedCity,
    // });

    setFormValues((prev) => ({
      ...prev,
      city: cityId,
    }));
  };

  const handleCancel = () => {
    setFormValues({
      username: userInfo.username || "",
      companyTitle: userInfo.companyName || "",
      country: userInfo.country || "", // Use empty string as fallback
      state: userInfo.state || "", // Will be set after states are loaded
      city: userInfo.city || "", // Will be set after cities are loaded
      address: userInfo.address || "",
      postalCode: userInfo.pin || "",
      email: userInfo.email || user.email || "",
      phone: userInfo.phoneNumber || "",
      bio: userInfo.bio || "",
    });
    navigate("/");
  };

  // Add specific language change handler
  const handleLanguageChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s,]/g, ""); // Allow letters, spaces, and commas
    handleChange("language", value);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="space-y-4 px-5 pb-5">
          <div className="flex flex-col md:flex-row gap-8 items-start pt-10 md:px-10">
            <div className="relative flex flex-col items-center gap-4 justify-center group w-full md:w-1/3 mb-10">
              {imageLoading ? (
                <Skeleton
                  variant="circular"
                  sx={{
                    width: { xs: 150, lg: 180 },
                    height: { xs: 150, lg: 180 },
                  }}
                />
              ) : (
                <Avatar
                  src={profileImage}
                  alt={user?.username || "Profile Picture"}
                  sx={{
                    width: { xs: 150, lg: 180 },
                    height: { xs: 150, lg: 180 },
                  }}
                />
              )}

              <input
                accept="image/*"
                className="hidden"
                id="icon-button-file"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="icon-button-file">
                <button
                  onClick={() =>
                    document.getElementById("icon-button-file").click()
                  }
                  aria-label="upload picture"
                  className="flex gap-2 items-center hover:bg-blue/5 text-blue duration-300 ease-in-out rounded-lg px-4 py-1"
                >
                  <Camera size={20} className="pb-0.5" />
                  <span>Upload Image</span>
                </button>
              </label>
            </div>
            <div className="md:pl-5 w-full md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 🔹 First Name */}
                <div>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        height: "43px",
                        "& .MuiInputBase-input": {
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          "&::placeholder": {
                            fontSize: "0.75rem",
                            opacity: 0.7,
                          },
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
                </div>

                {/* 🔹 Last Name */}
                <div>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        height: "43px",
                        "& .MuiInputBase-input": {
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          "&::placeholder": {
                            fontSize: "0.75rem",
                            opacity: 0.7,
                          },
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
                </div>

                {/* 🔹 Bio (full width) */}
                <div className="col-span-1 sm:col-span-2">
                  <TextField
                    fullWidth
                    label="Bio"
                    rows={3}
                    multiline
                    value={formValues.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    error={!!errors.bio}
                    helperText={errors.bio}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </div>

                {/* 🔹 Country Dropdown */}
                <div>
                  <FormControl fullWidth error={!!errors.country}>
                    <InputLabel
                      sx={{
                        fontSize: "0.875rem",
                        transform: "translate(14px, 13px)",
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -9px) scale(0.75)",
                        },
                      }}
                    >
                      Country
                    </InputLabel>
                    <Select
                      value={formValues.country || ""}
                      onChange={handleCountryChange}
                      disabled={loading}
                      label="Country"
                      sx={{
                        height: "43px",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          minHeight: "43px !important",
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: "20rem",
                          },
                        },
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem
                          key={country.country_Id}
                          value={country.country_Id}
                          sx={{
                            fontSize: "0.875rem",
                            minHeight: "43px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {country.country_Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* 🔹 State Dropdown */}
                <div>
                  <FormControl fullWidth error={!!errors.state}>
                    <InputLabel>State</InputLabel>
                    <Select
                      value={formValues.state}
                      onChange={handleStateChange}
                      disabled={!formValues.country || loading}
                      label="State"
                      sx={{
                        height: "43px",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          minHeight: "43px !important",
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: "20rem",
                          },
                        },
                      }}
                    >
                      {states.map((state) => (
                        <MenuItem key={state.state_Id} value={state.state_Id}>
                          {state.state_Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* 🔹 City Dropdown */}
                <div>
                  <FormControl fullWidth error={!!errors.city}>
                    <InputLabel>City</InputLabel>
                    <Select
                      value={formValues.city}
                      onChange={handleCityChange}
                      disabled={!formValues.state}
                      label="City"
                      sx={{
                        height: "43px",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          minHeight: "43px !important",
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: "20rem",
                          },
                        },
                      }}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.city_Id} value={city.city_Id}>
                          {city.city_Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* 🔹 Address */}
                <div>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formValues.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        height: "43px",
                        "& .MuiInputBase-input": {
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          "&::placeholder": {
                            fontSize: "0.75rem",
                            opacity: 0.7,
                          },
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
                </div>

                {/* 🔹 Postal Code */}
                <div>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={formValues.postalCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleChange("postalCode", value);
                    }}
                    error={
                      !!errors.postalCode ||
                      (formValues.postalCode.length > 0 &&
                        (formValues.postalCode.length < 4 ||
                          formValues.postalCode.length > 8))
                    }
                    helperText={
                      errors.postalCode ||
                      (formValues.postalCode.length > 0 &&
                      (formValues.postalCode.length < 4 ||
                        formValues.postalCode.length > 8)
                        ? "Postal code must be between 4 to 8 digits"
                        : "")
                    }
                    variant="outlined"
                    type="text"
                    InputProps={{
                      maxLength: 8,
                      pattern: "[0-9]{4,8}",
                      sx: {
                        height: "43px",
                        "& .MuiInputBase-input": {
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          "&::placeholder": {
                            fontSize: "0.75rem",
                            opacity: 0.7,
                          },
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
                </div>

                {/* 🔹 Email (Disabled) */}
                <div>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formValues.email}
                    variant="outlined"
                    disabled
                    InputProps={{
                      sx: {
                        height: "43px",
                        "& .MuiInputBase-input": {
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          "&::placeholder": {
                            fontSize: "0.75rem",
                            opacity: 0.7,
                          },
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
                </div>

                {/* 🔹 Phone */}
                <div>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formValues.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleChange("phone", value);
                    }}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    type="tel"
                    pattern="[1-9]{1}[0-9]{9}"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        height: "43px",
                        "& .MuiInputBase-input": {
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          "&::placeholder": {
                            fontSize: "0.75rem",
                            opacity: 0.7,
                          },
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
                </div>

                {/* 🔹 Language Multi-Select */}
                <div>
                  <FormControl
                    fullWidth
                    error={wasSubmitted && !!errors.language}
                  >
                    <InputLabel>Language</InputLabel>
                    <Select
                      label="Language"
                      multiple
                      value={formValues.language
                        .split(",")
                        .map((lang) => lang.trim())}
                      onChange={(e) => {
                        const { value } = e.target;
                        // Clean up the value by filtering empty items
                        const selectedLanguages = (
                          Array.isArray(value) ? value : [value]
                        ).filter((lang) => lang);

                        // Join only if there is more than one selected language
                        const languageString =
                          selectedLanguages.length > 1
                            ? selectedLanguages.join(", ")
                            : selectedLanguages[0] || "";

                        handleChange("language", languageString);
                      }}
                      renderValue={(selected) =>
                        selected.filter((lang) => lang).join(", ")
                      }
                      variant="outlined"
                      sx={{
                        height: "43px",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          padding: "0 14px",
                          minHeight: "43px !important",
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: "20rem",
                          },
                        },
                      }}
                    >
                      {languages.map((language) => (
                        <MenuItem key={language.id} value={language.name}>
                          {language.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {wasSubmitted && errors.language && (
                      <p style={{ color: "red", fontSize: "0.8rem" }}>
                        {errors.language}
                      </p>
                    )}
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 md:pr-10">
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="small"
              sx={{ color: "#ffffff" }}
              variant="contained"
              color="blue"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default BasicInfo;
