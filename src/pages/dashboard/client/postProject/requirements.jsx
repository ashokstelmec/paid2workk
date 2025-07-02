import { Radio } from "@mui/material";
import React, { useState, useEffect } from "react";

// Icons
import { FaRegClock } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useAuth } from "../../../../contexts/authContext";

const Requirements = () => {
  const [budgetType, setBudgetType] = useState(null);
  const [currency, setCurrency] = useState("2");
  const [experience, setExperience] = useState("1");
  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [budgetTypeError, setBudgetTypeError] = useState("");
  const [budgetFromError, setBudgetFromError] = useState("");
  const [budgetToError, setBudgetToError] = useState("");
  const { currencies, getCurrencySymbolId, getCurrencySymbolName } = useAuth();

  useEffect(() => {
    const savedBudgetFrom = sessionStorage.getItem("budgetFrom");
    const savedBudgetTo = sessionStorage.getItem("budgetTo");
    const savedCurrency = sessionStorage.getItem("projectCurrency");
    const savedBudgetType = sessionStorage.getItem("budgetType");

    if (savedBudgetFrom) setBudgetFrom(savedBudgetFrom);
    if (savedBudgetTo) setBudgetTo(savedBudgetTo);
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedBudgetType) setBudgetType(parseInt(savedBudgetType));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("projectCurrency", currency);
    sessionStorage.setItem("experienceLevel", experience);
    setExperience(sessionStorage.getItem("experienceLevel"));
    setCurrency(sessionStorage.getItem("projectCurrency"));
  }, []);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    sessionStorage.setItem("projectCurrency", e.target.value || "2");
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
    sessionStorage.setItem("experienceLevel", e.target.value || "1");
  };

  const handleBudgetFromChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 0) {
      setBudgetFrom(value);
      sessionStorage.setItem("budgetFrom", value);

      if (value === "") {
        setBudgetFromError("");
        setBudgetToError("");
        return;
      }

      if (budgetTo && parseFloat(value) > parseFloat(budgetTo)) {
        setBudgetFromError(
          "Minimum budget cannot be greater than maximum budget"
        );
      } else {
        setBudgetFromError("");
        setBudgetToError("");
      }
    }
  };

  const handleBudgetToChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 0) {
      setBudgetTo(value);
      sessionStorage.setItem("budgetTo", value);

      if (value === "") {
        setBudgetFromError("");
        setBudgetToError("");
        return;
      }

      if (budgetFrom && parseFloat(value) < parseFloat(budgetFrom)) {
        setBudgetToError("Maximum budget cannot be less than minimum budget");
      } else {
        setBudgetFromError("");
        setBudgetToError("");
      }
    }
  };

  const handleBudgetTypeChange = (type) => {
    setBudgetType(type);
    sessionStorage.setItem("budgetType", type.toString());
  };

  return (
    <div className="flex items-center justify-center px-2 pt-0  ">
      <div className="">
        <form className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Budget Type Section */}
          <div className="w-full md:w-1/2 px-0 md:px-4">
            <h2 className="text-xl font-medium text-black mb-4">
              Tell us about your budget
            </h2>
            <p className="text-base text-black/80 mb-6 md:mb-10">
              This helps us find the perfect talent for your requirements.
            </p>
          </div>

          {/* Budget Input Section */}
          <div className="w-full md:w-1/2 px-0 md:px-4 xl:px-12">
            <div className="flex justify-between gap-4 mb-8 font-medium">
              <div
                className={` flex items-center justify-center text-md cursor-pointer border bg-white rounded-lg w-1/2 pl-2 pr-3 h-20 ${
                  budgetType === 0
                    ? "border-blue text-blue"
                    : "border-black/30 text-black/50"
                }`}
                onClick={() => handleBudgetTypeChange(0)}
              >
                <Radio
                  checked={budgetType === 0}
                  onChange={() => handleBudgetTypeChange(0)}
                  value="hourly-rate"
                  name="budget-type"
                  inputProps={{ "aria-label": "Hourly rate" }}
                />
                <label
                  htmlFor="hourly-rate"
                  className="flex items-center gap-2 cursor-pointer text-black"
                >
                  <FaRegClock />
                  Hourly rate
                </label>
              </div>

              <div
                className={` flex items-center justify-center text-md cursor-pointer border bg-white rounded-lg w-1/2 pl-2 pr-3 h-20 ${
                  budgetType === 1
                    ? "border-blue text-blue"
                    : "border-black/30 text-black/50"
                }`}
                onClick={() => handleBudgetTypeChange(1)}
              >
                <Radio
                  checked={budgetType === 1}
                  onChange={() => handleBudgetTypeChange(1)}
                  value="fixed-price"
                  name="budget-type"
                  inputProps={{ "aria-label": "Fixed price" }}
                />
                <label
                  htmlFor="fixed-price"
                  className="flex items-center gap-2 cursor-pointer text-black"
                >
                  <MdOutlineLocalOffer />
                  Fixed price
                </label>
              </div>
            </div>
            {budgetTypeError && (
              <div className="text-red text-sm mb-4">{budgetTypeError}</div>
            )}

            <div className="mb-6">
              <label  
                htmlFor="budget-from"
                className="block font-medium text-black mb-2"
              >
                From
              </label>
              <div className="input-group flex gap-4 mb-2 md:mb-6 w-full">
                <select
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="outline-none  w-2/7 px-4 py-2 h-9 flex items-center text-sm rounded-lg border border-black/30 focus:border-blue/80 duration-300 ease-in-out"
                >
                  {currencies.map((currencyData) => (
                    <option
                      key={currencyData.currency_Id}
                      value={currencyData.currency_Id}
                      style={{minHeight: "50px"}}
                      
                    >
                     {currencyData.currency} ({currencyData.symbol})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  id="budget-from"
                  value={budgetFrom}
                  onChange={handleBudgetFromChange}
                  className="outline-none w-full px-4 py-2 h-9 rounded-lg border border-black/30 focus:border-blue/80 duration-300 ease-in-out"
                  placeholder="Enter min Budget"
                />
              </div>
              {budgetFromError && (
                <div className="text-red text-sm mt-1">{budgetFromError}</div>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="budget-to"
                className="block font-medium text-black mb-2"
              >
                To
              </label>
              <div className="input-group flex gap-4 mb-2 md:mb-6 w-full">
                <select
                  value={currency}
                  onChange={handleCurrencyChange}
                 className="outline-none  w-2/7 px-4 py-2 h-9 flex items-center text-sm rounded-lg border border-black/30 focus:border-blue/80 duration-300 ease-in-out"
                >
                  {currencies.map((currencyData) => (
                    <option
                      key={currencyData.currency_Id}
                      value={currencyData.currency_Id}
                      style={{minHeight: "50px"}}
                    >
                      {currencyData.currency} ({currencyData.symbol})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  id="budget-to"
                  value={budgetTo}
                  onChange={handleBudgetToChange}
                    className="outline-none w-full px-4 py-2 h-9 rounded-lg border border-black/30 focus:border-blue/80 duration-300 ease-in-out"
                  placeholder="Enter max Budget"
                />
              </div>
              {budgetToError && (
                <div className="text-red text-sm mt-1">{budgetToError}</div>
              )}
            </div>
          </div>
        </form>

        <form className="flex flex-col md:flex-row gap-6 md:gap-10 mt-8 mb-32">
          <div className="w-full md:w-1/2 px-0 md:px-4">
            <h2 className="text-xl font-medium text-black mb-4">
              How Experienced the Freelancer should be?
            </h2>
          </div>

          <div className="w-full md:w-1/2 px-0 md:px-4 xl:px-12">
            <label className="font-medium text-black">
              Experience Level
            </label>
            <select
              value={experience}
              onChange={handleExperienceChange}
              className="outline-none mt-2 w-full px-4 h-9 py-2 rounded-lg border text-sm border-black/30 focus:border-blue/80 duration-300 ease-in-out"
            >
              <option value="1">{`Entry Level ( < 2 Years )`}</option>
              <option value="2">{`Intermediate ( 2 - 5 Years )`}</option>
              <option value="3">{`Expert ( 5+ Years )`}</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Requirements;
