import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip as MuiChip,
} from "@mui/material";
import { Interweave } from "interweave";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import React from "react";
import { FiPaperclip } from "react-icons/fi";
import { useAuth } from "../../../../contexts/authContext";

const getExperienceLevel = (exp) => {
  switch (exp) {
    case "1":
      return "Entry Level ( < 2 Years )";
    case "2":
      return "Intermediate ( 2-5 Years )";
    case "3":
      return "Expert ( 5+ Years )";
    default:
      return "Entry Level ( < 2 Years )";
  }
};

const getBudgetType = (type) => {
  switch (type) {
    case "0":
      return "Hourly Rate";
    case "1":
      return "Fixed Price";
    default:
      return "Fixed Price";
  }
};

const ReviewModal = ({ open, onClose, fileName, fileUrl, file }) => {
  const [masterCategories, setMasterCategories] = useState([]);

  const { getCurrencySymbolId } = useAuth();

  const transform = (node, children) => {
  const classMap = {
    h1: "text-base text-black font-semibold my-1",
    h2: "text-base text-black font-medium my-1",
    p: "text-black text-sm my-0 w-full",
    span: "text-black my-0 w-full",
    ul: "list-disc text-black pl-6 space-y-1 text-sm m-0 mt-1",
    ol: "list-decimal text-black pl-6 space-y-1 text-sm m-0 mt-1", // ✅ added ordered list styling
    li: "marker:text-black text-black text-sm my-0",
    a: "text-blue hover:text-blue/80 underline",
  };

  const tag = node.tagName?.toLowerCase();

  if (classMap[tag]) {
    return React.createElement(
      tag,
      {
        ...node.attributes,
        className: classMap[tag],
      },
      children
    );
  }

  return undefined; // Let Interweave handle tags not in classMap
};

  useEffect(() => {
    const fetchMasterCategories = async () => {
      try {
        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/Getlists"
        );
        const data = await response.json();
        setMasterCategories(data);
      } catch (error) {
        console.error("Error fetching master categories:", error);
      }
    };

    fetchMasterCategories();
  }, []);

  const getMasterCategoryName = (id) => {
    const category = masterCategories.find(
      (cat) => cat.masterCategory.id === Number(id)
    );
    return category ? category.masterCategory.name : "Unknown Category";
  };

  const projectDetails = {
    title: sessionStorage.getItem("projectTitle"),
    masterCategory: getMasterCategoryName(
      sessionStorage.getItem("masterCategory")
    ),
    skills: sessionStorage.getItem("projectSkills"),
    budgetType: getBudgetType(sessionStorage.getItem("budgetType")),
    currency: getCurrencySymbolId(sessionStorage.getItem("projectCurrency")),
    budgetFrom: sessionStorage.getItem("budgetFrom"),
    budgetTo: sessionStorage.getItem("budgetTo"),
    experienceLevel: getExperienceLevel(
      sessionStorage.getItem("experienceLevel")
    ),
    description: sessionStorage.getItem("projectDescription"),
  };

  const handlePostProject = async () => {
    const projectData = {
      title: projectDetails.title,
      masterCategory: sessionStorage.getItem("masterCategory"),
      skills: projectDetails.skills,
      budgetType: sessionStorage.getItem("budgetType"),
      currency: sessionStorage.getItem("projectCurrency"),
      budgetFrom: projectDetails.budgetFrom,
      budgetTo: projectDetails.budgetTo,
      experienceLevel: sessionStorage.getItem("experienceLevel"),
      description: projectDetails.description,
    };

    const formData = new FormData();
    formData.append("ClientId", sessionStorage.getItem("NUserID"));
    formData.append("Title", projectData.title);
    formData.append("master_Categories", projectData.masterCategory);
    formData.append("Skill", projectData.skills);
    formData.append("Budget", projectData.budgetFrom);
    formData.append("MaxBudget", projectData.budgetTo);
    formData.append("PayStatus", projectData.budgetType);
    formData.append("Currency", projectData.currency);
    formData.append("Lavel", projectData.experienceLevel);
    formData.append("Description", projectData.description);
    formData.append("Status", "Posted");
    if (file) formData.append("NFile", file);

    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/RegisterProject",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post project");
      }

      const result = await response.json();
      // console.log("Project posted successfully:", result);
      onClose(); // Close the modal after successful post
    } catch (error) {
      console.error("Error posting project:", error);
    } finally {
      window.location.href = "/dashboard/projects/my-projects";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="overflow-visible"
    >
      <div className="bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <DialogTitle className="sticky top-0 bg-white flex items-center justify-between border-b border-gray p-6">
          <h2 className="text-xl font-medium text-black">Review Details</h2>
          <IconButton onClick={onClose} size="small">
            <RxCross2 className="h-5 w-5 text-red" />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent>
          <div className="space-y-8 p-4 my-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm md:text-lg font-medium  text-black mb-1">
                  Project Title
                </h3>
                <p className="text-base text-black">{projectDetails.title}</p>
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-medium text-black mb-1">
                  Category
                </h3>
                <p className="text-base text-black">
                  {projectDetails.masterCategory}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-sm md:text-lg font-medium text-black mb-2">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {(projectDetails.skills || "")?.split(",").map((skill) => (
                  <MuiChip
                    key={skill.trim()}
                    label={skill.trim()}
                    className="bg-blue/10 text-blue"
                  />
                ))}
              </div>
            </div>

            {/* Budget Information */}
            <div className=" rounded-lg space-y-4">
              <h3 className="text-sm md:text-lg font-medium  text-black">
                Budget Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm md:text-base font-medium text-black">
                    Type
                  </p>
                  <p className="text-sm text-black/90">
                    {projectDetails.budgetType}
                  </p>
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-black">
                    Currency
                  </p>
                  <p className="text-sm text-black/90">
                    {projectDetails.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-black">
                    Range
                  </p>
                  <p className="text-sm text-black/90">
                    {projectDetails.currency
                      ? `${
                          projectDetails.currency
                            ?.split("(")[1]
                            ?.split(")")[0] || ""
                        } ${projectDetails.budgetFrom} - ${
                          projectDetails.currency
                            ?.split("(")[1]
                            ?.split(")")[0] || ""
                        } ${projectDetails.budgetTo}`
                      : `${projectDetails.budgetFrom} - ${projectDetails.budgetTo}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <h3 className="text-sm md:text-lg font-semibold text-black mb-1">
                Experience Level
              </h3>
              <p className="text-base text-black">
                {projectDetails.experienceLevel}
              </p>
            </div>

            {/* Project Description */}
            <div>
              <h3 className="text-sm md:text-lg font-semibold  text-black mb-2">
                Description
              </h3>
              <div className="prose  prose-sm w-full text-black ql-editor">
                <Interweave
                  content={projectDetails.description || ""}
                  transform={transform}
                />
              </div>
            </div>

            {/* File Preview */}
            {fileUrl && (
              <div>
                <h3 className="text-sm md:text-lg font-semibold  text-black/80 mb-2">
                  Attachment
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      if (fileUrl) {
                        window.open(fileUrl, "_blank");
                      }
                    }}
                    className="w-40 flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-blue bg-white border border-blue rounded-lg hover:brightness-90 ease-in-out duration-300"
                  >
                    <FiPaperclip /> View Attachment
                  </button>
                  <span className="text-sm text-black/70">{fileName}</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray bg-white p-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm h-8 text-blue bg-white border border-blue rounded-lg hover:bg-blue/10 duration-300 ease-in-out"
          >
            Go Back
          </button>
          <button
            className="px-3 py-1 text-sm h-8 text-white bg-blue rounded-lg hover:brightness-125 ease-in-out duration-300"
            onClick={handlePostProject}
          >
            Post Project
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ReviewModal;
