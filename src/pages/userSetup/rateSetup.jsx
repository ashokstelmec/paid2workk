import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

// Assets
import Logo from "../../assets/Logo/p2w.png";
import { Bounce, toast } from "react-toastify";

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

const RateSetup = () => {
  const { getCurrencySymbolId, currencies: allCurr } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currencies, setCurrencies] = useState([]);

  const [payType, setPayType] = useState(
    sessionStorage.getItem("payType") || "0"
  );

  const [currency, setCurrency] = useState(
    sessionStorage.getItem("currency") || "2"
  );

  const [rate, setRate] = useState(sessionStorage.getItem("rate") || "");

  // Save changes to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("payType", payType);
  }, [payType]);

  useEffect(() => {
    sessionStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    sessionStorage.setItem("rate", rate);
  }, [rate]);

  const [error, setError] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newError = {};
    if (!rate) newError.rate = "Rate is required.";

    setError(newError);

    return Object.keys(newError).length === 0;
  };

  useEffect(() => {
    // Fetch data from the API
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveCurrency"
        );
        // Extract only the 'currency' values
        const currencyList = response.data.map((item) => ({
          value: item.currency_Id,
          label: item.currency,
        }));
        setCurrencies(currencyList);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200, // Limit the height of the dropdown menu
      },
    },
  };

  // Handle form submission
  const handleProceed = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        const data = new FormData();
        data.append("nUserID", sessionStorage.getItem("NUserID"));
        data.append("PaidBy", payType);
        data.append("currency", currency);
        data.append("rate", rate);
        data.append("progress", "25%");

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

        navigate("/account-setup/5");
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

  // Handle Skip
  const handleSkip = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("nUserID", sessionStorage.getItem("NUserID"));
      data.append("progress", "25%");

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
      navigate("/account-setup/5");
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
              Now, let's set your hourly rate.
            </h3>
            <span className="mb-8 mt-2 text-black/60 text-sm">
              Clients will see this rate on your profile and in search results
              once you publish your profile. You can adjust your rate every time
              you submit a proposal.
            </span>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start pt-5 px-4 mb-5">
              <div className="relative flex flex-col items-start justify-center group w-full md:w-4/7 mb-5 lg:pr-10">
                <Typography
                  variant="h6"
                  className="text-black/80 font-semibold"
                >
                  Pay Type
                </Typography>
                <Typography variant="body2" className="text-black/60">
                  Choose how you'd like to be compensated for your work.
                </Typography>
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
                        <div className="py-0.5">
                          <Typography variant="subtitle2">
                            {type.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-black/50"
                          >
                            {type.description}
                          </Typography>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="grid grid-cols-3 gap-4">
                  <FormControl fullWidth>
                    <Select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      MenuProps={menuProps}
                    >
                      {currencies.map((curr) => (
                        <MenuItem
                          key={curr.value}
                          value={curr.value}
                          style={{
                            fontSize: "14px", // Adjust font size to make items smaller
                            // Adjust padding for smaller item height
                          }}
                        >
                          {curr.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    placeholder={
                      payType === "1" ? "Project rate" : "Hourly rate"
                    }
                    value={rate}
                    onChange={(e) => {
                      // Only allow numbers and at most one decimal point
                      const val = e.target.value;
                      if (/^\d*\.?\d*$/.test(val)) {
                        setRate(val);
                        // Clear error if previously set
                        if (error.rate)
                          setError((prev) => ({ ...prev, rate: undefined }));
                      }
                    }}
                    error={!!error.rate}
                    helperText={error.rate}
                    className="col-span-2"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {getCurrencySymbolId(
                            allCurr.find((c) => c.currency_Id === currency)
                              ?.currency_Id
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                {/* Pro Tip */}
                <div className="bg-blue/10 p-4 rounded-lg">
                  <Typography variant="body2" className="text-blue">
                    <span className="font-semibold">Pro tip:</span>{" "}
                    {payType === "1"
                      ? "When setting a fixed price, consider the project's scope and complexity to ensure fair compensation."
                      : "Set your hourly rate based on your experience level and the market rate for your skills in your region."}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end items-center">
            <button
              className="text-black/75 hover:text-blue/40 duration-300 px-4 py-2"
              onClick={() => navigate(-1)}
            >
              Back
            </button>

            <button
              className={` text-white ${
                true === "0"
                  ? "bg-grey cursor-not-allowed"
                  : "bg-blue hover:brightness-125"
              }  duration-300 rounded-lg ease-in-out px-4 py-0.5 justify-end`}
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

export default RateSetup;
