import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../../contexts/authContext";
import { Bounce, toast } from "react-toastify";
import axios from "axios";

const theme = createTheme({
  palette: {
    blue: {
      main: "#0b64fc",
    },
  },
});

const ProfessionalInfo = () => {
  const { user, getCurrencySymbolId } = useAuth();

  const [currencies, setCurrencies] = useState([]);

  const [userInfo, setUserInfo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("1");
  const [payType, setPayType] = useState("0");
  const [currency, setCurrency] = useState("2");
  const [rate, setRate] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState("");
  const [saved, setSaved] = useState(false);

  const experienceLevels = [
    {
      value: "1",
      label: "Entry Level (<2 Years)",
      description: "Perfect for those starting their professional journey",
    },
    {
      value: "2",
      label: "Intermediate (2-5 Years)",
      description: "Solid experience in the field",
    },
    {
      value: "3",
      label: "Expert (5+ Years)",
      description: "Extensive experience and deep expertise",
    },
  ];

  const payTypes = [
    {
      value: "0",
      label: "Hourly Rate",
      description: "Charge by the hour for your work",
    },
    {
      value: "1",
      label: "Fixed Price",
      description: "Set a fixed price for the entire project",
    },
  ];

  const suggestions = [
    "Senior Full Stack Developer",
    "UI/UX Designer",
    "Digital Marketing Specialist",
    "Project Manager",
  ];

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveCurrency"
        );
        // Extract only the 'currency' values
        const currencyList = response.data.map((item) => ({
          value: item.currency_Id,
          label: item.currency,
          symbol: item.symbol,
        }));
        setCurrencies(currencyList);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Replace this with your actual API endpoint
        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveSkills"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    const fetchUserData = async () => {
      if (!user?.nUserID) return;

      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?NUserId=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const userData = await response.json();
        const userDetails =
          Array.isArray(userData) && userData.length > 0 ? userData[0] : {};
        setUserInfo(userDetails);
        setTitle(userDetails?.designation || "");
        setExperienceLevel(userDetails?.lavel || "1");
        setPayType(userDetails?.paidBy || "0");
        setCurrency(userDetails?.currency || "2");
        setRate(userDetails?.rate || "");
        setSelectedSkills(userDetails?.skill || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchSkills();
    fetchUserData();
  }, [saved]);

  const handleCancel = () => {
    setTitle(userInfo?.designation || "");
    setExperienceLevel(userInfo?.lavel || "1");
    setPayType(userInfo?.paidBy || "0");
    setCurrency(userInfo?.currency || "2");
    setRate(userInfo?.rate || "");
    setSelectedSkills(userInfo?.skill || "");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      setIsSubmitting(true);
      try {
        const data = new FormData();
        data.append("nUserID", sessionStorage.getItem("NUserID"));
        data.append("Designation", title);
        data.append("Lavel", experienceLevel);
        data.append("PaidBy", payType);
        data.append("currency", currency);
        data.append("rate", rate);
        data.append("skill", selectedSkills);

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

        // Refresh the page or update the UI as needed
        // window.location.reload();
        setSaved(!saved);
        toast.success("Profile updated successfully!", {
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

  return (
    <ThemeProvider theme={theme}>
      <div className="space-y-6 px-5 pb-5">
        {/* Professional Title */}
        <div className="flex flex-col md:flex-row items-start pt-10 px-3 md:px-10">
          <div className="relative flex flex-col items-start justify-center group w-full md:w-4/7 mb-5 lg:pr-10">
            <h6 className="text-black font-medium ">Professional Title</h6>
            <span className="text-muted-foreground text-sm">
              Make a great first impression with your professional title. This
              helps clients quickly understand your expertise.
            </span>
          </div>
          <div className="md:pl-5 flex flex-col gap-3 w-full md:w-3/7">
            {/* Input Field */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="E.g., Senior Full Stack Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              helperText="Your title will be displayed prominently on your profile"
            />

            {/* Suggestions Section */}

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue" />
                <span className="text-blue text-xs">
                  Popular professional titles
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Chip
                    key={suggestion}
                    label={suggestion}
                    size="small"
                    onClick={() => setTitle(suggestion)}
                    className="bg-grey hover:bg-gray cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <Box className="bg-blue/10 px-3 py-2 rounded-lg">
              <span className="text-blue text-xs">
                <span className="font-semibold">Pro tip:</span> Be specific with
                your title. Instead of "Developer," try "React Native Mobile
                Developer" or "Python Backend Developer."
              </span>
            </Box>
          </div>
        </div>

        {/* Experience Level */}
        <div className="flex flex-col md:flex-row items-start pt-5 px-3 md:px-10">
          <div className="relative flex flex-col items-start justify-center group w-full md:w-4/7 mb-5 lg:pr-10">
            <h6 className="text-black font-medium">Experience Level</h6>
            <Typography variant="body2" className="text-muted-foreground">
              Let clients know your expertise level in your field.
            </Typography>
          </div>

          <div className="md:pl-5 flex flex-col gap-3 w-full md:w-3/7">
            <FormControl fullWidth>
              <Select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="bg-gray-50 gap-2"
              >
                {experienceLevels.map((level, idx) => (
                  <MenuItem
                    sx={{
                      marginBottom: idx !== experienceLevels.length - 1 ? 1 : 0,
                    }}
                    key={level.value}
                    value={level.value}
                  >
                    <div className="flex flex-col">
                      <span className="text-black text-sm">{level.label}</span>
                      <span className="text-muted-foreground text-xs">
                        {level.description}
                      </span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Pay Type */}
        <div className="flex flex-col md:flex-row items-start pt-5 px-3 md:px-10 mb-5">
          <div className="relative flex flex-col items-start justify-center group w-full md:w-4/7 mb-5 lg:pr-10">
            <h6 className="text-black font-medium">Pay Type</h6>
            <span className="text-muted-foreground text-sm">
              Choose how you'd like to be compensated for your work.
            </span>
          </div>

          <div className="md:pl-5 flex flex-col gap-3 w-full md:w-3/7">
            <FormControl fullWidth>
              <Select
                value={payType}
                onChange={(e) => setPayType(e.target.value)}
                className="bg-gray-50"
              >
                {payTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <div className="flex flex-col ">
                      <span className="text-black text-sm">{type.label}</span>
                      <span className="text-muted-foreground text-xs">
                        {type.description}
                      </span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="grid grid-cols-3 gap-4">
              <FormControl>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
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
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {currencies.map((curr) => (
                    <MenuItem key={curr.value} value={curr.value}>
                      {curr.label} ({curr.symbol})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                type="number"
                placeholder={payType === "1" ? "Project rate" : "Hourly rate"}
                value={rate}
                onChange={(e) =>
                  setRate(e.target.value.replace(/[^0-9.]/g, ""))
                }
                className="col-span-2"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getCurrencySymbolId(currency)}
                    </InputAdornment>
                  ),
                  inputProps: { min: 1 },
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
            {/* Pro Tip */}
            <div className="bg-blue/10 p-4 rounded-lg">
              <Typography variant="body2" className="text-blue">
                <span className="font-semibold">Pro tip:</span>{" "}
                {payType === "1"
                  ? "When setting a fixed price, consider the project's scope and complexity to ensure fair compensation for your work."
                  : "Set your hourly rate based on your experience level and the market rate for your skills in your region."}
              </Typography>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-col md:flex-row items-start pt-5 px-3 md:px-10">
          <div className="relative flex flex-col items-start justify-center group w-full md:w-4/7 lg:pr-10">
            <h6 className="text-black font-medium">Skills</h6>
            <span className="text-muted-foreground text-sm">
              Add skills to showcase your expertise.
            </span>
          </div>

          <div className="md:pl-5 flex flex-col gap-3 w-full md:w-3/7">
            <div className="mb-6 bg-white">
              <Autocomplete
                multiple
                freeSolo
                options={skills.map((skill) => skill.skillName)}
                value={selectedSkills?.split(",")}
                onChange={(event, newValue) => {
                  const filteredValues = newValue.filter(
                    (value) => !value.includes(",")
                  );
                  const joinedSkills = filteredValues.join(",");

                  if (joinedSkills.length === 0 && joinedSkills === "") {
                    setSelectedSkills("");
                  } else {
                    setSelectedSkills(joinedSkills);
                  }
                }}
                renderTags={(value, getTagProps) =>
                  selectedSkills
                    ?.split(",")
                    .map(
                      (option, index) =>
                        option !== "-" && (
                          <Chip
                            color="blue"
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                          />
                        )
                    )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Add skills"
                    onKeyDown={(e) => {
                      if (e.key === ",") {
                        e.preventDefault();
                      }
                    }}
                    
                  />
                )}
              />{" "}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pr-3 md:pr-10">
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
  );
};

export default ProfessionalInfo;
