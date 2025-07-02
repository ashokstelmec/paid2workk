import React, { useEffect, useState } from "react";
import BasicInfo from "../postProject/basicInfo";
import Skills from "../postProject/skills";
import Requirements from "../postProject/requirements";
import JobDescription from "../postProject/jobDescription";
import { Stepper, Step, StepLabel } from "@mui/material";
import { FaChevronLeft } from "react-icons/fa6";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Bounce, toast } from "react-toastify";
import "./swipe.css";
import ReviewModal from "./reviewModal";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const theme = createTheme({
  palette: {
    blue: {
      main: "#0b64fc",
    },
  },
});

const steps = [
  "Basic Info",
  "Skills",
  "Budget & Experience",
  "Job Description",
];

const ProjectPosting = () => {
  const savedStep = sessionStorage.getItem("savedStep");
  const [errorField, setErrorField] = useState("0");
  const [activeStep, setActiveStep] = useState(() => {
    return savedStep !== null ? parseInt(savedStep, 10) : 0;
  });
  const [reviewModal, setReviewModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const stepComponents = [
    (props) => <BasicInfo {...props} errorField={errorField} />,
    Skills,
    Requirements,
    (props) => (
      <JobDescription {...props} handleFileChange={handleFileChange} />
    ),
  ];

  useEffect(() => {
    sessionStorage.setItem("projectFileName", "");
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileSize = (selectedFile.size / 1024).toFixed(2);
      const newFileName = `${selectedFile.name} (${fileSize} KB)`;
      setFileName(newFileName);
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile)); // Create an object URL for local preview
      sessionStorage.setItem("projectFileName", newFileName);
    } else {
      setFileName("Invalid file type. Please select a PDF.");
      setFile(null);
      setFileUrl("");
      sessionStorage.removeItem("projectFileName");
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (
        sessionStorage.getItem("projectTitle") === "" &&
        sessionStorage.getItem("masterCategory") === ""
      ) {
        setErrorField("3");
      } else if (sessionStorage.getItem("masterCategory") === "") {
        setErrorField("1");
      } else if (sessionStorage.getItem("projectTitle") === "") {
        setErrorField("2");
      } else if (sessionStorage.getItem("projectTitle").length > 65) {
        setErrorField("4");
      }

      if (
        sessionStorage.getItem("projectTitle") === "" ||
        sessionStorage.getItem("masterCategory") === ""
      ) {
        toast.error("Please fill all the details.", {
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
      } else if (sessionStorage.getItem("projectTitle").length > 65) {
        toast.error("Please use a shorter Title.", {
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
    } else if (activeStep === 1) {
      if (sessionStorage.getItem("projectSkills").length === 0) {
        toast.error("Please select some skills for your Project", {
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
    } else if (activeStep === 2) {
      if (
        sessionStorage.getItem("budgetType") === "" ||
        !sessionStorage.getItem("projectCurrency") ||
        sessionStorage.getItem("budgetFrom") === "" ||
        sessionStorage.getItem("budgetTo") === ""
      ) {
        toast.error("Please fill all necessary details.", {
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
      if (
        parseFloat(sessionStorage.getItem("budgetFrom")) >
        parseFloat(sessionStorage.getItem("budgetTo"))
      ) {
        toast.error("Max budget shouldn't be less than Min Budget.", {
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
    } else if (activeStep === 3) {
      if (
        sessionStorage.getItem("projectDescription") === "" ||
        sessionStorage.getItem("projectDescription") === "<p><br></p>"
      ) {
        toast.error("Please provide a Description.", {
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
      } else if (sessionStorage.getItem("projectDescription").length > 5000) {
        toast.error("Description is too long. Please shorten it.", {
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
      } else if (file === null) {
        setConfirmationModal(true);
        return;
      }
      setReviewModal(true);
      return;
    }

    setActiveStep((prevStep) => {
      const newStep = prevStep + 1;
      sessionStorage.setItem("savedStep", newStep);
      setErrorField("0");
      return newStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevStep) => {
      const newStep = prevStep - 1;
      sessionStorage.setItem("savedStep", newStep);
      return newStep;
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("projectTitle")) {
      return;
    } else {
      sessionStorage.setItem("projectTitle", "");
    }
    if (sessionStorage.getItem("masterCategory")) {
      return;
    } else {
      sessionStorage.setItem("masterCategory", "");
    }
    if (sessionStorage.getItem("projectSkills")) {
      return;
    } else {
      sessionStorage.setItem("projectSkills", []);
    }
    if (sessionStorage.getItem("budgetType")) {
      return;
    } else {
      sessionStorage.setItem("budgetType", "");
    }
    if (sessionStorage.getItem("projectCurrency")) {
      return;
    } else {
      sessionStorage.setItem("projectCurrency", "");
    }
    if (sessionStorage.getItem("budgetFrom")) {
      return;
    } else {
      sessionStorage.setItem("budgetFrom", "");
    }
    if (sessionStorage.getItem("budgetTo")) {
      return;
    } else {
      sessionStorage.setItem("budgetTo", "");
    }
    if (sessionStorage.getItem("experienceLevel")) {
      return;
    } else {
      sessionStorage.setItem("experienceLevel", "");
    }
    if (sessionStorage.getItem("projectDescription")) {
      return;
    } else {
      sessionStorage.setItem("projectDescription", "");
    }
  }, []);

  const CurrentStepComponent = stepComponents[activeStep];

  // Import motion from framer-motion at the top of your file:
  // import { motion, AnimatePresence } from "framer-motion";

  // Animation direction state
  const [direction, setDirection] = useState("next");

  // Wrap handleNext and handleBack to set direction
  const handleNextWithDirection = () => {
    if (activeStep !== 3) {
      setDirection(1);
    }

    handleNext();
  };

  const handleBackWithDirection = () => {
    setDirection(-1);
    handleBack();
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="h-full pt-20">
      <ThemeProvider theme={theme}>
        <div className="w-full  md:pt-6">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center">
              <div className="w-full md:w-2/5">
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel
                        sx={{
                          fontSize: { xs: "10px", sm: "12px", md: "14px" },
                        }}
                      >
                        <span className="text-xs">{label}</span>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-clip">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, type: "tween" }}
            className="relative"
          >
            <div className="absolute inset-0 w-full">
              <CurrentStepComponent />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Buttons */}
        <div className="fixed border-t border-grey bg-white shadow-lg md:shadow-white shadow-black w-full bottom-0 right-0">
          <div className=" flex items-center justify-end gap-4 container mx-auto max-w-7xl px-10 md:px-5 py-5">
            <button
              type="button"
              onClick={handleBackWithDirection}
              disabled={activeStep === 0}
              className={`px-4 pr-5 h-8 flex justify-center items-center gap-1 bg-gray rounded-md ${
                activeStep !== 0
                  ? `hover:brightness-90 text-black`
                  : `text-black/60 cursor-not-allowed`
              } transition-all duration-300 ease-in-out`}
            >
              <FaChevronLeft className="text-sm" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNextWithDirection}
              className="px-4 py-3 h-8 flex items-center justify-center bg-blue text-white rounded-md hover:brightness-125 transition-all duration-300"
            >
              {activeStep !== 3 ? `Next: ${steps[activeStep + 1]}` : `Review`}
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <Dialog open={confirmationModal}>
          <DialogContent className="max-w-lg ">
            <DialogHeader className="shadow-none px-6 py-4 rounded-t-xl">
              <DialogTitle>No Attachment Added</DialogTitle>
            </DialogHeader>
            <div className="text-primary text-sm px-6">
              Adding an attachment can help freelancers understand your project
              better. Would you like to add an attachment before proceeding?
            </div>
            <DialogFooter className="flex justify-end gap-1 mt-3 px-6 pb-4">
              <Button
                size="sm"
                variant="outline"
                className="text-red border-red hover:bg-red/5 duration-300 ease-in-out transition-colors"
                onClick={() => setConfirmationModal(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setReviewModal(true);
                  setConfirmationModal(false);
                }}
              >
                Continue Without Attachment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {reviewModal && (
        <ReviewModal
          open={reviewModal}
          onClose={() => setReviewModal(false)}
          fileUrl={fileUrl}
          fileName={fileName}
          file={file}
        />
      )}
    </div>
  );
};

export default ProjectPosting;
