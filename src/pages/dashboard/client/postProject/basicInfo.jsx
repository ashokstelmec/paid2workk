import React, { useState, useEffect } from "react";

import useProjectForm from "../../../../hooks/useProjectForm";

const BasicInfo = ({ errorField }) => {
  const { formData, updateFormData } = useProjectForm("step1");

  const [masterCategories, setMasterCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const savedCategory = sessionStorage.getItem("masterCategory");
  sessionStorage.setItem('savedStep', '0')

  useEffect(() => {
    // Load saved title from session storage when component mounts
    const savedTitle = sessionStorage.getItem("projectTitle");

    if (savedTitle) {
      updateFormData("step1", {
        title: savedTitle,
        masterCategory: savedCategory,
      });
    }
  }, []);

  // useEffect(() => {
  //   console.log("Error Field: ", errorField);
  // }, [errorField]);

  useEffect(() => {
    const fetchMasterCategories = async () => {
      try {
        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/Getlists"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch master categories");
        }
        const data = await response.json();
        // console.log(data);

        setMasterCategories(data);
      } catch (error) {
        setErrorMessage(
          "An error occurred while fetching master categories: " + error.message
        );
      }
    };

    fetchMasterCategories();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update both form data and session storage
    updateFormData("step1", { [name]: value });
    if (name === "title") {
      sessionStorage.setItem("projectTitle", value);
    } else if (name === "masterCategory") {
      sessionStorage.setItem("masterCategory", value);
    }
  };

  return (
    <>
      <div className=" flex items-center justify-center pt-0 md:pt-5">
        <div className="mb-20 lg:mb-0">
          <form
            className="flex flex-col md:flex-row px-4 md:px-0 gap-2 md:gap-10"
          >
            {/* Title Section */}
            <div className="w-full px-0 md:px-4">
              <h1 className=" text-xl font-medium text-black leading-tight mb-4">
                Let's start with a strong title.
              </h1>
              <p className="hidden md:block text-base text-black/90 mb-10">
                This helps your job post stand out to the right candidates. It's
                the first thing they'll see, so make it count!
              </p>
            </div>

            <div className="w-full px-0 md:px-4">
              {/* Select Masterclass */}
              <div className="mb-8">
                <label
                  htmlFor="master-category"
                  className="block text-lg font-medium text-black mb-2"
                >
                  Select Category
                </label>
                <select
                  id="master-category"
                  name="masterCategory"
                  value={savedCategory}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 h-9 rounded-md cursor-pointer outline-none ring-1  focus:ring-blue/80  ${
                    errorField === "1" || errorField === "3"
                      ? "ring-red"
                      : "ring-black/30"
                  } duration-300`}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {masterCategories.map((category) => (
                    <option
                    className="cursor-pointer"
                      key={category.masterCategory.id}
                      value={category.masterCategory.id}
                    >
                      {category.masterCategory.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Section */}
              <div className="mb-8">
                <label
                  htmlFor="job-title"
                  className="block text-lg font-medium text-black mb-2"
                >
                  Write a title for your job post
                </label>
                <input
                  type="text"
                  id="job-title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  placeholder="Title of your Job"
                  className={`w-full px-4 py-2 h-9 rounded-md outline-none ring-1  ${
                    errorField === "2" || errorField === "3" || errorField === "4"
                      ? "ring-red"
                      : "ring-black/30"
                  } focus:ring-blue/80 duration-300`}
                />
                {errorMessage && (
                  <div className="text-red text-sm mt-2">{errorMessage}</div>
                )}
              </div>

              {/* Example Titles */}
              <div className="mb-10">
                <h2 className="text-lg font-medium text-black mb-3">
                  Example titles
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-base text-black/70">
                  <li>
                    Build responsive WordPress site with booking/payment
                    functionality
                  </li>
                  <li>
                    AR experience needed for virtual product demos (ARCore)
                  </li>
                  <li>
                    Developer needed to update Android app UI for new OS/device
                    specs
                  </li>
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BasicInfo;
