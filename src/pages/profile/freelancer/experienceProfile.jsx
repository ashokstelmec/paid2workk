import React, { useEffect, useState } from "react";
import { Modal, Box, Skeleton } from "@mui/material";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { Plus, Trash2, MapPin, Pencil, Blocks } from "lucide-react";
import { PiBuildings } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { toast, Bounce } from "react-toastify";
import { useAuth } from "../../../contexts/authContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";

export default function Experience() {
  const { user } = useAuth();

  // Data
  const [entries, setEntries] = useState([]);
  const [educations, setEducations] = useState([]);

  // Modals
  const [expDeleteModal, setExpDeleteModal] = useState(false);
  const [eduDeleteModal, setEduDeleteModal] = useState(false);
  const [expEditModal, setExpEditModal] = useState(false);
  const [eduEditModal, setEduEditModal] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);

  // Id
  const [jobId, setJobId] = useState("");
  const [eduId, setEduId] = useState("");

  // Loadings
  const [expLoading, setExpLoading] = useState(false);
  const [eduLoading, setEduLoading] = useState(false);

  // Refreshers
  const [reFetchExp, setReFetchExp] = useState(false);
  const [reFetchEdu, setReFetchEdu] = useState(false);

  // formData
  const [newExperience, setNewExperience] = useState({
    jobTitle: "",
    company: "",
    location: "",
    from: "",
    to: "",
    current: false,
  });
  const [experience, setExperience] = useState({
    job: "",
    jobTitle: "",
    company: "",
    location: "",
    from: "",
    to: "",
    current: false,
  });
  const [newEducation, setNewEducation] = useState({
    instituteName: "",
    degree: "",
    fieldOfStudy: "",
    from: "",
    to: "",
    current: false,
    graduationYear: "",
  });
  const [education, setEducation] = useState({
    instituteName: "",
    degree: "",
    fieldOfStudy: "",
    from: "",
    to: "",
    current: false,
    graduationYear: "",
  });

  const handleExpOpen = () => setExpOpen(true);
  const handleEduOpen = () => setEduOpen(true);
  const handleExpClose = () => setExpOpen(false);
  const handleEduClose = () => setEduOpen(false);

  const validateExperience = () => {
    if (!newExperience.jobTitle) {
      toast.error("Job Title is required.");
      return false;
    }
    if (!newExperience.company) {
      toast.error("Company is required.");
      return false;
    }
    if (!newExperience.location) {
      toast.error("Location is required.");
      return false;
    }
    if (!newExperience.from) {
      toast.error("Start date is required.");
      return false;
    }
    if (!newExperience.current && !newExperience.to) {
      toast.error("End date is required or mark it as 'Currently work here'.");
      return false;
    }
    return true;
  };

  const validateEducation = () => {
    if (!newEducation.instituteName) {
      toast.error("Institute Name is required.");
      return false;
    }
    if (!newEducation.degree) {
      toast.error("Degree is required.");
      return false;
    }
    if (!newEducation.fieldOfStudy) {
      toast.error("Field of Study is required.");
      return false;
    }
    if (!newEducation.from) {
      toast.error("Start date is required.");
      return false;
    }
    if (!newEducation.current && !newEducation.to) {
      toast.error(
        "End date is required unless 'Currently studying here' is checked."
      );
      return false;
    }

    return true;
  };

  // Handle Experience Add
  const handleNewExperience = async () => {
    if (validateExperience()) {
      const formData = {
        nUserID: sessionStorage.getItem("NUserID"),
        company: newExperience.company,
        designation: newExperience.jobTitle,
        duration: `${newExperience.from} - ${newExperience.to}`,
        location: newExperience.location,
        startDate: new Date(newExperience.from).toISOString(),
        endDate: !newExperience.current
          ? new Date(newExperience.to).toISOString()
          : null,
        active: true,
      };
      try {
        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/InsertExperience",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set content type to application/json
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          // Handle successful submission
          const text = await response.text();
          let data = {};
          if (text) {
            try {
              data = JSON.parse(text);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }

          // console.log("Experience submitted successfully:", data);

          // Reset the form after submission
          setNewExperience({
            jobTitle: "",
            company: "",
            location: "",
            from: "",
            to: "",
          });

          toast.success("Experience Added Successfully!", {
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
          // Handle error
          const errorData = await response.text();
          let errorMessage = "Something went wrong!";
          try {
            errorMessage = JSON.parse(errorData).message || errorMessage;
          } catch (error) {
            console.error("Error parsing error response:", error);
          }
          toast.error(`Error: ${errorMessage}`, {
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
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while submitting your experience.", {
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
        setReFetchExp(!reFetchExp);
        setExpOpen(false);
      }
    }
  };

  // Handle Experience Add
  const handleNewEducation = async () => {
    if (validateEducation()) {
      const formData = {
        nUserID: sessionStorage.getItem("NUserID"),
        degree: newEducation.degree,
        fieldOfStudy: newEducation.fieldOfStudy,
        college: newEducation.instituteName,
        graduationYear:
          newEducation.graduationYear !== ""
            ? newEducation.graduationYear
            : new Date().getFullYear().toString(),
        startDate: new Date(newEducation.from).toISOString(),
        endDate: !newEducation.current
          ? new Date(newEducation.to).toISOString()
          : null,
        active: true,
      };

      try {
        // console.log(JSON.stringify(formData));

        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/InsertEducation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set content type to application/json
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          // Handle successful submission
          const text = await response.text();
          let data = {};
          if (text) {
            try {
              data = JSON.parse(text);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }

          // Reset the form after submission
          setNewEducation({
            instituteName: "",
            degree: "",
            fieldOfStudy: "",
            from: "",
            to: "",
            current: false,
            graduationYear: "",
          });

          toast.success("Education Added Successfully!", {
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
          // Handle error
          const errorData = await response.text();
          let errorMessage = "Something went wrong!";
          try {
            errorMessage = JSON.parse(errorData).message || errorMessage;
          } catch (error) {
            console.error("Error parsing error response:", error);
          }
          toast.error(`Error: ${errorMessage}`, {
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
      } catch (error) {
        console.error("Error submitting education:", error);
        toast.error("An error occurred while submitting your education.", {
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
        setReFetchEdu(!reFetchEdu);
        setEduOpen(false);
      }
    }
  };

  // Handle Education Edit
  const handleEditEducation = async () => {
    if (
      !education.instituteName ||
      !education.degree ||
      !education.fieldOfStudy ||
      !education.from ||
      !education.graduationYear
    ) {
      toast.error("Please fill in all required fields.", {
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

    const formData = {
      eduId: eduId,
      nUserID: sessionStorage.getItem("NUserID"),
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      college: education.instituteName,
      graduationYear: education.graduationYear,
      startDate: new Date(education.from).toISOString(),
      endDate: !education.current ? new Date(education.to).toISOString() : null,
      active: true,
    };

    try {
      // console.log(JSON.stringify(formData));

      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/UpdateEducation",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Set content type to application/json
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Handle successful submission
        const text = await response.text();
        let data = {};
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }

        // console.log("Education updated successfully:", data);

        // Reset the form after submission
        setEducation({
          instituteName: "",
          degree: "",
          fieldOfStudy: "",
          from: "",
          to: "",
          current: false,
          graduationYear: "",
        });

        toast.success("Education updated Successfully!", {
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
        // Handle error
        const errorData = await response.text();
        let errorMessage = "Something went wrong!";
        try {
          errorMessage = JSON.parse(errorData).message || errorMessage;
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        toast.error(`Error: ${errorMessage}`, {
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
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting your education.", {
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
      setReFetchEdu(!reFetchEdu);
      setEduEditModal(false);
    }
  };

  // Handle Experience Edit
  const handleEditExperience = async () => {
    if (
      !experience.jobTitle ||
      !experience.company ||
      !experience.location ||
      !experience.from
    ) {
      toast.error("Please fill in all required fields.", {
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

    const formData = {
      jobId: jobId,
      nUserID: sessionStorage.getItem("NUserID"),
      company: experience.company,
      designation: experience.jobTitle,
      duration: `${experience.from} - ${experience.to}`,
      location: experience.location,
      startDate: new Date(experience.from).toISOString(),
      endDate: !experience.current
        ? new Date(experience.to).toISOString()
        : null,
      active: true,
    };

    try {
      // console.log(JSON.stringify(formData));

      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/UpdateExperience",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Set content type to application/json
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Handle successful submission
        const text = await response.text();
        let data = {};
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }

        // console.log("Experience updated successfully:", data);

        // Reset the form after submission
        setExperience({
          jobTitle: "",
          company: "",
          location: "",
          from: "",
          to: "",
          current: false,
        });

        toast.success("Experience updated Successfully!", {
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
        // Handle error
        const errorData = await response.text();
        let errorMessage = "Something went wrong!";
        try {
          errorMessage = JSON.parse(errorData).message || errorMessage;
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        toast.error(`Error: ${errorMessage}`, {
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
    } catch (error) {
      console.error("Error submitting experience:", error);
      toast.error("An error occurred while submitting your experience.", {
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
      setReFetchExp(!reFetchExp);
      setExpEditModal(false);
    }
  };

  // Handle Education Remove
  const handleDeleteEducation = async (eduId) => {
    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/DeleteEducation?EduId=${eduId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const text = await response.text();
        let data = {};
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }

        toast.success("Education Deleted Successfully!", {
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
        const errorData = await response.text();
        let errorMessage = "Something went wrong!";
        try {
          errorMessage = JSON.parse(errorData).message || errorMessage;
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        toast.error(`Error: ${errorMessage}`, {
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
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("An error occurred while deleting your education.", {
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
      setReFetchEdu(!reFetchEdu);
    }
  };

  // Handle Experience Remove
  const handleDeleteExperience = async (jobId) => {
    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/DeleteExperience?jobId=${jobId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const text = await response.text();
        let data = {};
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }

        toast.success("Experience Deleted Successfully!", {
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
        const errorData = await response.text();
        let errorMessage = "Something went wrong!";
        try {
          errorMessage = JSON.parse(errorData).message || errorMessage;
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("An error occurred while deleting your experience.", {
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
      setReFetchExp(!reFetchExp);
    }
  };

  // Fetch Experience
  useEffect(() => {
    const fetchExperience = async () => {
      setExpLoading(true);
      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/ShowExperience?nUserID=${sessionStorage.getItem(
            "NUserID"
          )}`
        );

        if (response.ok) {
          const text = await response.text();
          let data = {};
          if (text) {
            try {
              data = JSON.parse(text);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }

          setEntries(data);
        } else {
          const errorData = await response.text();
          let errorMessage = "Something went wrong!";
          try {
            errorMessage = JSON.parse(errorData).message || errorMessage;
          } catch (error) {
            console.error("Error parsing error response:", error);
          }
          toast.error(`Error: ${errorMessage}`, {
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
      } catch (error) {
        console.error("Error fetching experience:", error);
        toast.error("An error occurred while fetching your experience.", {
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
        setExpLoading(false);
      }
    };

    fetchExperience();
  }, [reFetchExp]);

  // Fetch Education
  useEffect(() => {
    const fetchEducation = async () => {
      setEduLoading(true);
      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/GetEducationByUserId?NUserID=${sessionStorage.getItem(
            "NUserID"
          )}`
        );

        if (response.ok) {
          const text = await response.text();
          let data = {};
          if (text) {
            try {
              data = JSON.parse(text);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }

          // console.log("Education data:", data);
          setEducations(data);
        } else {
          const errorData = await response.text();
          let errorMessage = "Something went wrong!";
          try {
            errorMessage = JSON.parse(errorData).message || errorMessage;
          } catch (error) {
            console.error("Error parsing error response:", error);
          }
          toast.error(`Error: ${errorMessage}`, {
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
      } catch (error) {
        console.error("Error fetching education:", error);
        toast.error("An error occurred while fetching your education.", {
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
        setEduLoading(false);
      }
    };

    fetchEducation();
  }, [reFetchEdu]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <div className="space-y-6 px-5 pb-5">
          {/* Experience */}
          <div className="flex flex-col md:flex-row items-start pt-10 px-3 md:px-10">
            <div className="relative flex flex-col items-start justify-center group w-full md:w-3/5 xl:w-7/12 mb-5 lg:pr-20">
              <h6 className="text-black font-medium">Work Experience</h6>
              <span className="text-muted-foreground text-sm">
                Highlight your key experiences to showcase your expertise. This
                helps clients understand your background and the value you can
                bring to their projects.
              </span>
            </div>
            <div className="md:pl-5 flex flex-col gap-3 w-full md:w-3/5 xl:w-5/12">
              <Button
                startIcon={<Plus size={20} />}
                onClick={handleExpOpen}
                variant="outlined"
                size="small"
                sx={{ width: "fit-content", alignSelf: "flex-end" }}
              >
                Add Experience
              </Button>
              {expLoading ? (
                <div className="flex flex-col gap-4 sm:gap-2 sm:flex-row justify-between shadow border border-grey rounded p-4">
                  {/* Skeleton for job title */}
                  <div className="flex flex-col w-full gap-0.5">
                    <Skeleton variant="text" width="80%" height={20} />
                    {/* Skeleton for company */}
                    <Skeleton variant="text" width="50%" height={15} />
                    {/* Skeleton for location */}
                    <Skeleton variant="text" width="40%" height={15} />
                  </div>
                  <div className="flex flex-col justify-between">
                    {/* Skeleton for dates */}
                    <div className="pt-0.5 flex items-start justify-start sm:justify-end">
                      <Skeleton variant="text" width="140px" height={15} />
                    </div>
                    {/* Skeleton for buttons */}
                    <div className="flex items-center justify-center mt-2 sm:mt-0 sm:justify-end">
                      <Skeleton variant="rectangular" width={100} height={20} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {entries.map((entry) => (
                    <>
                      <div
                        key={entry.id}
                        className="flex flex-col gap-4 sm:gap-2 sm:flex-row justify-between shadow border border-grey hover:border-blue hover:shadow-lg duration-300 rounded p-4 cursor-default"
                      >
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-sm xl:text-base font-medium text-black">
                            {entry.designation}
                          </h4>
                          <span className="flex items-center gap-1 text-xs  text-muted-foreground">
                            <PiBuildings className="w-3 h-3 mb-0.5" />
                            {entry.company}
                          </span>
                          <span className="flex items-center gap-1 text-xs  text-muted-foreground ">
                            <MapPin className="w-3 h-3 mb-0.5 " />
                            {entry.location}
                          </span>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className="pt-0.5 flex items-start justify-start sm:justify-end  ">
                            <span className="text-xs  text-muted-foreground">
                              {new Date(entry.startDate)
                                .toLocaleString("default", {
                                  month: "short",
                                  year: "numeric",
                                })
                                .split(" ")
                                .join(", ")}
                            </span>
                            <span className="text-xs  text-muted-foreground px-1">
                              -
                            </span>
                            {entry.endDate === null ? (
                              <span className="text-xs  text-muted-foreground">
                                Present
                              </span>
                            ) : (
                              <span className="text-xs  text-muted-foreground">
                                {new Date(entry.endDate)
                                  .toLocaleString("default", {
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .split(" ")
                                  .join(", ")}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-center mt-2 sm:mt-0 sm:justify-end">
                            <button
                              className="text-blue  hover:text-blue/70 duration-300 flex gap-1 items-center"
                              onClick={() => {
                                setJobId(entry.jobId);
                                setExperience({
                                  jobId: entry.jobId,
                                  jobTitle: entry.designation,
                                  company: entry.company,
                                  location: entry.location,
                                  current: entry.endDate === null,
                                  from: new Date(
                                    new Date(entry.startDate).setDate(
                                      new Date(entry.startDate).getDate() + 1
                                    )
                                  )
                                    .toISOString()
                                    .substring(0, 7),
                                  to:
                                    entry.endDate !== null
                                      ? new Date(
                                          new Date(entry.endDate).setDate(
                                            new Date(entry.endDate).getDate() +
                                              1
                                          )
                                        )
                                          .toISOString()
                                          .substring(0, 7)
                                      : null,
                                });
                                setExpEditModal(true);
                              }}
                            >
                              <Pencil className="w-3 h-3  pb-0.5" />{" "}
                              <span className="text-xs">Edit</span>
                            </button>
                            <span className="text-gray px-1.5">|</span>
                            <button
                              className="text-red hover:text-red/70 duration-300 flex gap-1 items-center"
                              onClick={() => {
                                setJobId(entry.jobId);
                                setExpDeleteModal(true);
                              }}
                            >
                              <Trash2 className="w-3 h-3 pb-0.5" />{" "}
                              <span className="text-xs">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="flex flex-col md:flex-row items-start pt-10 px-3 md:px-10">
            <div className="relative flex flex-col items-start justify-center group  w-full md:w-3/5 xl:w-7/12 mb-5 lg:pr-20">
              <h6 className="text-black font-medium">Education</h6>
              <span className="text-muted-foreground text-sm">
                Showcase your educational background to highlight the foundation
                of your skills. This helps clients understand your
                qualifications and knowledge.
              </span>
            </div>
            <div className="md:pl-5 flex flex-col gap-3 w-full md:w-3/5 xl:w-5/12">
              <Button
                startIcon={<Plus size={20} />}
                onClick={handleEduOpen}
                variant="outlined"
                size="small"
                sx={{ width: "fit-content", alignSelf: "flex-end" }}
              >
                Add Education
              </Button>
              {eduLoading ? (
                <div className="flex flex-col gap-4 sm:gap-2 sm:flex-row justify-between shadow border border-grey rounded p-4">
                  {/* Skeleton for job title */}
                  <div className="flex flex-col w-full gap-0.5">
                    <Skeleton variant="text" width="80%" height={20} />
                    {/* Skeleton for company */}
                    <Skeleton variant="text" width="50%" height={15} />
                    {/* Skeleton for location */}
                    <Skeleton variant="text" width="40%" height={15} />
                  </div>
                  <div className="flex flex-col justify-between">
                    {/* Skeleton for dates */}
                    <div className="pt-0.5 flex items-start justify-start sm:justify-end">
                      <Skeleton variant="text" width="140px" height={15} />
                    </div>
                    {/* Skeleton for buttons */}
                    <div className="flex items-center justify-center mt-2 sm:mt-0 sm:justify-end">
                      <Skeleton variant="rectangular" width={100} height={20} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {educations.map((edu) => (
                    <>
                      <div
                        key={edu.id}
                        className="flex flex-col gap-4 sm:gap-2 sm:flex-row justify-between shadow border border-grey hover:border-blue hover:shadow-lg duration-300 rounded p-4 cursor-default"
                      >
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-sm xl:text-base font-medium text-black">
                            {edu.degree}{" "}
                            <span className="text-xs text-muted-foreground">
                              ({edu.graduationYear})
                            </span>
                          </h4>
                          <span className="flex items-center gap-1 text-xs  text-muted-foreground">
                            <Blocks className="w-3 h-3 mb-0.5" />
                            {edu.fieldOfStudy}
                          </span>
                          <span className="flex items-center gap-1 text-xs  text-muted-foreground ">
                            <MapPin className="w-3 h-3 mb-0.5 " />
                            {edu.college}
                          </span>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className="pt-0.5 flex items-start justify-start sm:justify-end  ">
                            <span className="text-xs  text-muted-foreground">
                              {new Date(edu.startDate)
                                .toLocaleString("default", {
                                  month: "short",
                                  year: "numeric",
                                })
                                .split(" ")
                                .join(", ")}
                            </span>
                            <span className="text-xs  text-muted-foreground px-1">
                              {" "}
                              -{" "}
                            </span>
                            {edu.endDate === null ? (
                              <span className="text-xs  text-muted-foreground">
                                Present
                              </span>
                            ) : (
                              <span className="text-xs  text-muted-foreground">
                                {new Date(edu.endDate)
                                  .toLocaleString("default", {
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .split(" ")
                                  .join(", ")}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-center mt-2 sm:mt-0 sm:justify-end">
                            <button
                              className="text-blue hover:text-blue/70 duration-300 flex gap-1 items-center"
                              onClick={() => {
                                setEduId(edu.eduId);
                                setEducation({
                                  instituteName: edu.college,
                                  degree: edu.degree,
                                  fieldOfStudy: edu.fieldOfStudy,
                                  graduationYear: edu.graduationYear,
                                  current: edu.endDate === null,
                                  from: new Date(
                                    new Date(edu.startDate).setDate(
                                      new Date(edu.startDate).getDate() + 1
                                    )
                                  )
                                    .toISOString()
                                    .substring(0, 7),
                                  to:
                                    edu.endDate !== null
                                      ? new Date(
                                          new Date(edu.endDate).setDate(
                                            new Date(edu.endDate).getDate() + 1
                                          )
                                        )
                                          .toISOString()
                                          .substring(0, 7)
                                      : null,
                                });
                                setEduEditModal(true);
                              }}
                            >
                              <Pencil className="w-3 h-3  pb-0.5" />{" "}
                              <span className="text-xs ">Edit</span>
                            </button>
                            <span className="text-gray px-1.5 ">|</span>
                            <button
                              className="text-red hover:text-red/70 duration-300 flex gap-1 items-center"
                              onClick={() => {
                                setEduId(edu.eduId);
                                setEduDeleteModal(true);
                              }}
                            >
                              <Trash2 className="w-3 h-3  pb-0.5" />{" "}
                              <span className="text-xs ">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Experience Modal */}
        <Modal open={expOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: {
                xs: "90dvw",
                sm: "70dvw",
                md: "50dvw",
                lg: "35dvw",
                xl: "25dvw",
              },
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
            }}
          >
            <div className="flex w-full justify-between items-center mb-5">
              <h6 className="text-lg font-medium">Add Experience</h6>
              <IconButton onClick={() => handleExpClose()}>
                <RxCross2 className="h-6 w-6 text-red" />
              </IconButton>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNewExperience();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <TextField
                    fullWidth
                    label="Job Title"
                    InputProps={{
                      sx: {
                        minHeight: "43px",
                        "& .MuiInputBase-input": {
                          minHeight: "43px",
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
                    value={newExperience.jobTitle}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        jobTitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    InputProps={{
                      sx: {
                        minHeight: "43px",
                        "& .MuiInputBase-input": {
                          minHeight: "43px",
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
                    label="Company"
                    value={newExperience.company}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        company: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextField
                    fullWidth
                    InputProps={{
                      sx: {
                        minHeight: "43px",
                        "& .MuiInputBase-input": {
                          minHeight: "43px",
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
                    label="Location"
                    value={newExperience.location}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <DatePicker
                    views={["year", "month"]}
                    label="From"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputProps: {
                          sx: {
                            minHeight: "43px",
                            "& .MuiInputBase-input": {
                              minHeight: "43px",
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
                        },
                        InputLabelProps: {
                          sx: {
                            fontSize: "0.875rem",
                            transform: "translate(14px, 13px)",
                            "&.MuiInputLabel-shrink": {
                              transform: "translate(14px, -9px) scale(0.75)",
                            },
                          },
                        },
                      },
                    }}
                    value={
                      newExperience.from
                        ? parse(newExperience.from, "yyyy-MM", new Date())
                        : null
                    }
                    minDate={new Date(1990, 0)}
                    maxDate={new Date(2099, 11)}
                    onChange={(date) => {
                      if (date) {
                        const formatted = format(date, "yyyy-MM");
                        setNewExperience({ ...newExperience, from: formatted });
                        if (
                          newExperience.to &&
                          new Date(formatted) > new Date(newExperience.to)
                        ) {
                          setNewExperience({ ...newExperience, to: "" });
                        }
                      }
                    }}
                  />
                </div>
                <div>
                  <DatePicker
                    views={["year", "month"]}
                    label="To"
                    disabled={newExperience.current}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputProps: {
                          sx: {
                            minHeight: "43px",
                            "& .MuiInputBase-input": {
                              minHeight: "43px",
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
                        },
                        InputLabelProps: {
                          sx: {
                            fontSize: "0.875rem",
                            transform: "translate(14px, 13px)",
                            "&.MuiInputLabel-shrink": {
                              transform: "translate(14px, -9px) scale(0.75)",
                            },
                          },
                        },
                      },
                    }}
                    value={
                      newExperience.current || !newExperience.to
                        ? null
                        : parse(newExperience.to, "yyyy-MM", new Date())
                    }
                    minDate={
                      newExperience.from
                        ? parse(newExperience.from, "yyyy-MM", new Date())
                        : new Date(1990, 0)
                    }
                    maxDate={new Date(2099, 11)}
                    onChange={(date) => {
                      if (date) {
                        const formatted = format(date, "yyyy-MM");
                        setNewExperience({ ...newExperience, to: formatted });
                      }
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newExperience.current}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            current: e.target.checked,
                          })
                        }
                      />
                    }
                    label="I currently work here"
                  />
                </div>
              </div>
              <div className="w-full flex justify-end mt-3">
                <button
                  type="submit"
                  className="bg-blue hover:brightness-125 px-4 py-1 text-white font-medium shadow hover:shadow-lg rounded-lg duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </Box>
        </Modal>
        <Modal open={eduOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: {
                xs: "90dvw",
                sm: "70dvw",
                md: "50dvw",
                lg: "35dvw",
                xl: "25dvw",
              },
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
            }}
          >
            <div className="flex w-full justify-between items-center mb-5">
              <h6 className="text-lg font-medium">Add Education</h6>
              <IconButton onClick={() => handleEduClose()}>
                <RxCross2 className="h-6 w-6 text-red" />
              </IconButton>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNewEducation();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <TextField
                    InputProps={{
                      sx: {
                        minHeight: "43px",
                        "& .MuiInputBase-input": {
                          minHeight: "43px",
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
                    value={newEducation.instituteName}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        instituteName: e.target.value,
                      })
                    }
                    fullWidth
                    label="Institute Name"
                  />
                </div>
                <div>
                  <TextField
                    InputProps={{
                      sx: {
                        minHeight: "43px",
                        "& .MuiInputBase-input": {
                          minHeight: "43px",
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
                    value={newEducation.degree}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        degree: e.target.value,
                      })
                    }
                    fullWidth
                    label="Degree"
                  />
                </div>
                <div>
                  <TextField
                    InputProps={{
                      sx: {
                        minHeight: "43px",
                        "& .MuiInputBase-input": {
                          minHeight: "43px",
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
                    value={newEducation.fieldOfStudy}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        fieldOfStudy: e.target.value,
                      })
                    }
                    fullWidth
                    label="Field of Study"
                  />
                </div>
                <div>
                  <DatePicker
                    views={["year", "month"]}
                    label="From"
                    value={
                      newEducation.from
                        ? parse(newEducation.from, "yyyy-MM", new Date())
                        : null
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputProps: {
                          sx: {
                            minHeight: "43px",
                            "& .MuiInputBase-input": {
                              minHeight: "43px",
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
                        },
                        InputLabelProps: {
                          sx: {
                            fontSize: "0.875rem",
                            transform: "translate(14px, 13px)",
                            "&.MuiInputLabel-shrink": {
                              transform: "translate(14px, -9px) scale(0.75)",
                            },
                          },
                        },
                      },
                    }}
                    minDate={new Date(1990, 0)}
                    maxDate={new Date(2099, 11)}
                    onChange={(date) => {
                      if (date) {
                        const formatted = format(date, "yyyy-MM");
                        setNewEducation({ ...newEducation, from: formatted });
                      }
                    }}
                  />
                </div>
                <div>
                  <DatePicker
                    views={["year", "month"]}
                    label="To"
                    disabled={newEducation.current}
                    value={
                      newEducation.current || !newEducation.to
                        ? null
                        : parse(newEducation.to, "yyyy-MM", new Date())
                    }
                    minDate={
                      newEducation.from
                        ? parse(newEducation.from, "yyyy-MM", new Date())
                        : new Date(1990, 0)
                    }
                    maxDate={new Date(2099, 11)}
                    onChange={(date) => {
                      if (date) {
                        const formatted = format(date, "yyyy-MM");
                        if (new Date(formatted) < new Date(newEducation.from)) {
                          setNewEducation({ ...newEducation, to: "" });
                        } else {
                          setNewEducation({ ...newEducation, to: formatted });
                        }
                      }
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newEducation.current}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            current: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Currently studying here"
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextField
                    select
                    InputProps={{
                      sx: {
                        minHeight: "43px",
                        "& .MuiInputBase-input": {
                          minHeight: "43px",
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
                    value={newEducation.graduationYear}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        graduationYear:
                          e.target.value || new Date().getFullYear(),
                      })
                    }
                    fullWidth
                    label="Graduation Year"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    {Array.from(new Array(35), (v, i) => (
                      <option
                        key={i}
                        defaultValue={new Date().getFullYear() - i}
                        value={new Date().getFullYear() - i}
                      >
                        {new Date().getFullYear() - i}
                      </option>
                    ))}
                  </TextField>
                </div>
              </div>
              <div className="w-full flex justify-end mt-3">
                <button
                  type="submit"
                  className="bg-blue hover:brightness-125 px-4 py-1 text-white font-medium shadow hover:shadow-lg rounded-lg duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </Box>
        </Modal>
        {/* Edit Experience Modal */}
        <Modal open={expEditModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: {
                xs: "90dvw",
                sm: "70dvw",
                md: "50dvw",
                lg: "35dvw",
                xl: "25dvw",
              },
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
            }}
          >
            <div className="flex w-full justify-between items-center mb-5">
              <Typography variant="h6">Edit Experience</Typography>
              <IconButton onClick={() => setExpEditModal(false)}>
                <RxCross2 className="h-6 w-6 text-red" />
              </IconButton>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    sx: {
                      minHeight: "43px",
                      "& .MuiInputBase-input": {
                        minHeight: "43px",
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
                  fullWidth
                  label="Job Title"
                  value={experience.jobTitle}
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      jobTitle: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  InputProps={{
                    sx: {
                      minHeight: "43px",
                      "& .MuiInputBase-input": {
                        minHeight: "43px",
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
                  label="Company"
                  value={experience.company}
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      company: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  InputProps={{
                    sx: {
                      minHeight: "43px",
                      "& .MuiInputBase-input": {
                        minHeight: "43px",
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
                  label="Location"
                  value={experience.location}
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      location: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        sx: {
                          minHeight: "43px",
                          "& .MuiInputBase-input": {
                            minHeight: "43px",
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
                      },
                      InputLabelProps: {
                        sx: {
                          fontSize: "0.875rem",
                          transform: "translate(14px, 13px)",
                          "&.MuiInputLabel-shrink": {
                            transform: "translate(14px, -9px) scale(0.75)",
                          },
                        },
                      },
                    },
                  }}
                  views={["year", "month"]}
                  label="From"
                  value={
                    experience.from
                      ? parse(experience.from, "yyyy-MM", new Date())
                      : null
                  }
                  minDate={new Date(1990, 0)}
                  maxDate={new Date(2099, 11)}
                  onChange={(date) => {
                    if (date) {
                      const formatted = format(date, "yyyy-MM");
                      setExperience({ ...experience, from: formatted });
                    }
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        sx: {
                          minHeight: "43px",
                          "& .MuiInputBase-input": {
                            minHeight: "43px",
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
                      },
                      InputLabelProps: {
                        sx: {
                          fontSize: "0.875rem",
                          transform: "translate(14px, 13px)",
                          "&.MuiInputLabel-shrink": {
                            transform: "translate(14px, -9px) scale(0.75)",
                          },
                        },
                      },
                    },
                  }}
                  views={["year", "month"]}
                  label="To"
                  disabled={experience.current}
                  value={
                    experience.current || !experience.to
                      ? null
                      : parse(experience.to, "yyyy-MM", new Date())
                  }
                  minDate={
                    experience.from
                      ? parse(experience.from, "yyyy-MM", new Date())
                      : new Date(1990, 0)
                  }
                  maxDate={new Date(2099, 11)}
                  onChange={(date) => {
                    if (date) {
                      const formatted = format(date, "yyyy-MM");
                      setExperience({ ...experience, to: formatted });
                    }
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={experience.current}
                      onChange={(e) => {
                        setExperience({
                          ...experience,
                          current: e.target.checked,
                        });
                      }}
                    />
                  }
                  label="I currently work here"
                />
              </Grid>
            </Grid>
            <div className="w-full flex justify-end">
              <button
                onClick={handleEditExperience}
                className="bg-blue hover:brightness-125 px-4 py-1 text-white font-medium shadow hover:shadow-lg rounded-lg duration-300"
              >
                Save
              </button>
            </div>
          </Box>
        </Modal>
        {/* Edit Education Modal */}
        <Modal open={eduEditModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: {
                xs: "90dvw",
                sm: "70dvw",
                md: "50dvw",
                lg: "35dvw",
                xl: "25dvw",
              },
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
            }}
          >
            <div className="flex w-full justify-between items-center mb-5">
              <h6 className="text-lg font-medium">Edit Education</h6>
              <IconButton onClick={() => setEduEditModal(false)}>
                <RxCross2 className="h-6 w-6 text-red" />
              </IconButton>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={education.instituteName}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      instituteName: e.target.value,
                    })
                  }
                  fullWidth
                  InputProps={{
                    sx: {
                      minHeight: "43px",
                      "& .MuiInputBase-input": {
                        minHeight: "43px",
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
                  label="Institute Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    sx: {
                      minHeight: "43px",
                      "& .MuiInputBase-input": {
                        minHeight: "43px",
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
                  value={education.degree}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      degree: e.target.value,
                    })
                  }
                  fullWidth
                  label="Degree"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    sx: {
                      minHeight: "43px",
                      "& .MuiInputBase-input": {
                        minHeight: "43px",
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
                  value={education.fieldOfStudy}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      fieldOfStudy: e.target.value,
                    })
                  }
                  fullWidth
                  label="Field of Study"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  views={["year", "month"]}
                  label="From"
                  value={
                    education.from
                      ? parse(education.from, "yyyy-MM", new Date())
                      : null
                  }
                  minDate={new Date(1990, 0)}
                  maxDate={new Date(2099, 11)}
                  onChange={(date) => {
                    if (date) {
                      const formatted = format(date, "yyyy-MM");
                      setEducation({ ...education, from: formatted });
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        sx: {
                          minHeight: "43px",
                          "& .MuiInputBase-input": {
                            minHeight: "43px",
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
                      },
                      InputLabelProps: {
                        sx: {
                          fontSize: "0.875rem",
                          transform: "translate(14px, 13px)",
                          "&.MuiInputLabel-shrink": {
                            transform: "translate(14px, -9px) scale(0.75)",
                          },
                        },
                      },
                    },
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        sx: {
                          minHeight: "43px",
                          "& .MuiInputBase-input": {
                            minHeight: "43px",
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
                      },
                      InputLabelProps: {
                        sx: {
                          fontSize: "0.875rem",
                          transform: "translate(14px, 13px)",
                          "&.MuiInputLabel-shrink": {
                            transform: "translate(14px, -9px) scale(0.75)",
                          },
                        },
                      },
                    },
                  }}
                  views={["year", "month"]}
                  label="To"
                  disabled={education.current}
                  value={
                    education.current || !education.to
                      ? null
                      : parse(education.to, "yyyy-MM", new Date())
                  }
                  minDate={
                    education.from
                      ? parse(education.from, "yyyy-MM", new Date())
                      : new Date(1990, 0)
                  }
                  maxDate={new Date(2099, 11)}
                  onChange={(date) => {
                    if (date) {
                      const formatted = format(date, "yyyy-MM");
                      setEducation({
                        ...education,
                        to: education.current ? null : formatted,
                      });
                    } else if (education.current) {
                      setEducation({ ...education, to: null });
                    }
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={education.current}
                      onChange={(e) =>
                        setEducation({
                          ...education,
                          current: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Currently studying here"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  InputProps={{
                    sx: {
                      minHeight: "43px",
                      "& .MuiInputBase-input": {
                        minHeight: "43px",
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
                  value={education.graduationYear}
                  onChange={(e) => {
                    // console.log(education);
                    setEducation({
                      ...education,
                      graduationYear: e.target.value,
                    });
                  }}
                  fullWidth
                  label="Graduation Year"
                  SelectProps={{
                    native: true,
                  }}
                >
                  {Array.from(new Array(35), (v, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <div className="w-full flex justify-end mt-3">
              <button
                onClick={handleEditEducation}
                className="bg-blue hover:brightness-125 px-4 py-1 text-white font-medium shadow hover:shadow-lg rounded-lg duration-300"
              >
                Save
              </button>
            </div>
          </Box>
        </Modal>
        {/* Delete Education Modal */}
        {eduDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="font-medium ">Delete Education</h3>
              <p className="text-sm">
                Are you sure you want to delete the Education?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="bg-gray hover:bg-grey duration-300 ease-in-out px-3 py-1 text-sm rounded-lg"
                  onClick={() => setEduDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="duration-300 ease-in-out bg-red hover:bg-red/5 border border-white text-white hover:text-red hover:border-red px-3 py-1 text-sm rounded-lg"
                  onClick={() => {
                    handleDeleteEducation(eduId);
                    setEduDeleteModal(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Experience Modal */}
        {expDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="font-medium ">Delete Experience</h3>
              <p className="text-sm">
                Are you sure you want to delete the Experience?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="bg-gray hover:bg-grey duration-300 ease-in-out px-3 py-1 text-sm rounded-lg"
                  onClick={() => setExpDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="duration-300 ease-in-out bg-red hover:bg-red/5 border border-white text-white hover:text-red hover:border-red px-3 py-1 text-sm rounded-lg"
                  onClick={() => {
                    handleDeleteExperience(jobId);
                    setExpDeleteModal(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </>{" "}
    </LocalizationProvider>
  );
}
