import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
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
import { useAuth } from "../../contexts/authContext";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Assets
import Logo from "../../assets/Logo/p2w.png";

const InfoSetup = () => {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Update initial profileImage state to check sessionStorage first
  const [profileImage, setProfileImage] = useState(() => {
    const sessionData = JSON.parse(
      sessionStorage.getItem("userSession") || "{}"
    );
    return sessionData.photoPath || user?.photoPath || "";
  });

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
    bio: "",
    experience: "",
    dob: "",
    language: "",
  });

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  // const [errors, setErrors] = useState({});

  // Add new states for dropdown options
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Add state for first and last name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [wasSubmitted, setWasSubmitted] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("infoFormValues", JSON.stringify(formValues));
  }, [formValues]);

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

    // Update session storage
    const sessionData = JSON.parse(
      sessionStorage.getItem("userSession") || "{}"
    );
    const updatedSessionData = {
      ...sessionData,
      photoPath: imagePath,
    };
    sessionStorage.setItem("userSession", JSON.stringify(updatedSessionData));

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

  // 📌 Handle Country Change
  const handleExperienceChange = async (e) => {
    const experience = e.target.value;
    setFormValues((prev) => ({
      ...prev,
      experience: experience,
    }));
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

  // Validate form fields
  const validate = () => {
    const newErrors = {};

    if (!formValues.dob) newErrors.dob = "Date of Birth is required.";
    if (!formValues.experience)
      newErrors.experience = "Experience is required.";
    // if (!formValues.bio) newErrors.bio = "Bio is required.";
    if (!formValues.country) newErrors.country = "Country is required.";
    if (!formValues.city) newErrors.city = "City is required.";
    if (!formValues.address) newErrors.address = "Address is required.";
    if (!formValues.postalCode) {
      newErrors.postalCode = "Postal code is required.";
    }
    if (!formValues.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formValues.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!formValues.language.trim()) {
      newErrors.language = "Please enter at least one language.";
    } else {
      const languages = formValues.language
        .split(",")
        .map((lang) => lang.trim());
      const invalidLanguages = languages.filter(
        (lang) => !/^[a-zA-Z\s]{2,}$/.test(lang)
      );

      if (invalidLanguages.length > 0) {
        newErrors.language =
          "Please enter valid language names (letters and spaces only)";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleProceed = async (e) => {
    e.preventDefault();
    setWasSubmitted(true);

    if (!validate()) {
      // Show error toast if validation fails
      if (errors.language) {
        toast.error(errors.language, {
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
      return;
    }

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

        const data = new FormData();
        data.append("nUserID", sessionStorage.getItem("NUserID"));
        data.append("Country", formValues.country);
        data.append("State", formValues.state);
        data.append("City", formValues.city);
        data.append("address", formValues.address);
        data.append("pin", formValues.postalCode);
        data.append("phoneNumber", formValues.phone);
        data.append("country", selectedCountry?.country_Name || "");
        data.append("state", selectedState?.state_Name || "");
        data.append("city", selectedCity?.city_Name || "");
        data.append("DateOfBirth", formValues.dob);
        data.append("language", formValues.language);
        data.append("Experince", formValues.experience);
        data.append("progress", "30%");

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

        // Dispatch event for navbar to update
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error(`Failed to add profile details!`, {
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

  const populateExperienceLevels = () => {
    const experienceOptions = [];
    for (let i = 0; i <= 10; i++) {
      experienceOptions.push({
        value: i.toString(), // Ensure value is a string
        label: `${i} ${i === 1 ? "year" : "years"}`,
      });
    }
    return experienceOptions;
  };

  // Add specific language change handler
  const handleLanguageChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s,]/g, ""); // Allow letters, spaces, and commas
    handleChange("language", value);
  };

  return (
    <div className="flex items-center justify-center min-h-dvh py-10 bg-gray-100 relative">
      <Box
        className="sm:bg-white bg-white/0 sm:shadow-md sm:rounded-xl p-5 sm:p-10 sm:border sm:border-blue/10"
        sx={{
          width: {
            xs: "90%", // Default width for mobile
            sm: "70%", // For small screens (sm)
            md: "75%", // For medium screens (md)
            lg: "60%", // For large screens (lg)
            xl: "55%", // For extra large screens (xl)
            // For screens wider than 1920px
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
              A few last details, then you can check and publish your profile.
            </h3>
            <span className="mb-8 mt-2 text-black/60 text-sm">
              A professional photo helps you build trust with your clients. To
              keep things safe and simple, they’ll pay you through us - which is
              why we need your personal information.
            </span>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start pt-10 md:px-4">
              <div className="relative flex flex-col items-center gap-6 justify-center group w-full md:w-1/3 mb-10">
                {imageLoading ? (
                  <Skeleton
                    variant="circular"
                    sx={{
                      width: { xs: 150 },
                      height: { xs: 150 },
                    }}
                  />
                ) : (
                  <Avatar
                    src={profileImage}
                    alt={user?.username || "Profile Picture"}
                    sx={{
                      width: { xs: 150 },
                      height: { xs: 150 },
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
              <div className="w-full md:w-2/3">
                <form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* 🔹 Experience Level */}
                    <div>
                      <FormControl fullWidth error={!!errors.experience}>
                        <InputLabel>Experience</InputLabel>
                        <Select
                          value={formValues.experience || ""}
                          onChange={handleExperienceChange}
                          error={!!errors.experience}
                          helperText={errors.experience}
                          disabled={loading}
                          label="Experience"
                        >
                          {populateExperienceLevels().map((exp) => (
                            <MenuItem key={exp.value} value={exp.value}>
                              {exp.label}
                            </MenuItem>
                          ))}
                          <MenuItem value="11">{`> 10 Years`}</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    {/* 🔹 Date of Birth */}
                    <div>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formValues.dob || ""}
                        onChange={(e) => handleChange("dob", e.target.value)}
                        error={!!errors.dob}
                        helperText={errors.dob}
                        variant="outlined"
                      />
                    </div>

                    {/* 🔹 Country Dropdown */}
                    <div>
                      <FormControl fullWidth error={!!errors.country}>
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={formValues.country || ""}
                          onChange={handleCountryChange}
                          disabled={loading}
                          label="Country"
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

                    {/* 🔹 State Dropdown */}
                    <div>
                      <FormControl fullWidth error={!!errors.state}>
                        <InputLabel>State</InputLabel>
                        <Select
                          value={formValues.state}
                          onChange={handleStateChange}
                          disabled={!formValues.country || loading}
                          label="State"
                        >
                          {states.map((state) => (
                            <MenuItem
                              key={state.state_Id}
                              value={state.state_Id}
                            >
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
                        >
                          {cities.map((city) => (
                            <MenuItem key={city.city_Id} value={city.city_Id}>
                              {city.city_Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    {/* Language */}
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
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: "20rem",
                              },
                            },
                          }}
                        >
                          {languages.map((language) => {
                            const selectedLanguages = formValues.language
                              .split(",")
                              .map((lang) => lang.trim());

                            const isSelected = selectedLanguages.includes(
                              language.name
                            );

                            return (
                              <MenuItem
                                key={language.id}
                                value={language.name}
                                sx={{
                                  backgroundColor: isSelected
                                    ? "#1976d2 !important"
                                    : "inherit",
                                  color: isSelected
                                    ? "#fff !important"
                                    : "inherit",
                                  "&:hover": {
                                    backgroundColor: "#1976d2",
                                    color: "#fff !important",
                                  },
                                  marginBottom: "0.1rem",
                                }}
                              >
                                {language.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {wasSubmitted && errors.language && (
                          <p style={{ color: "red", fontSize: "0.8rem" }}>
                            {errors.language}
                          </p>
                        )}
                      </FormControl>
                    </div>

                    {/* 🔹 Postal Code */}
                    <div>
                      <TextField
                        fullWidth
                        label="Postal Code"
                        value={formValues.postalCode}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,8}$/.test(value)) {
                            handleChange("postalCode", value);
                          }
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
                        type="number"
                        inputProps={{
                          maxLength: 8,
                          pattern: "[0-9]{4,8}",
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
                      />
                    </div>

                    {/* 🔹 Address */}
                    <div className="sm:col-span-2">
                      <TextField
                        fullWidth
                        label="Address"
                        value={formValues.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        error={!!errors.address}
                        helperText={errors.address}
                        variant="outlined"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end items-center px-4">
            <button
              className={`w-1/3 text-white font-medium ${
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

export default InfoSetup;
