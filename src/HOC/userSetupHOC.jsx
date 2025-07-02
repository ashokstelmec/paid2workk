import React, { lazy, useEffect, useState } from "react";
import SetupLoadable from "../components/SetupLoadable";
import { useAuth } from "../contexts/authContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1600,
      xxl: 1920, // Adding custom breakpoint
    },
  },
});

// Phases
const InfoSetup = SetupLoadable(
  lazy(() => import("../pages/userSetup/infoSetup"))
);
const BioSetup = SetupLoadable(
  lazy(() => import("../pages/userSetup/bioSetup"))
);
const RateSetup = SetupLoadable(
  lazy(() => import("../pages/userSetup/rateSetup"))
);
const SkillsSetup = SetupLoadable(
  lazy(() => import("../pages/userSetup/skillsSetup"))
);
const InitialSetup = SetupLoadable(
  lazy(() => import("../pages/userSetup/initialSetup"))
);

const UserSetupHOC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState("");

  let phase = "";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.nUserID) return;

      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?NUserId=${sessionStorage.getItem("NUserID")}`
        );
        const userData = await response.json();
        const selectedUser = userData[0];
        // console.log(selectedUser)
        setProgress(selectedUser.progress);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [user?.nUserID]);

  switch (progress) {
    case "05%":
      phase = "/1";
      break;
    case "10%":
      phase = "/2";
      break;
    case "15%":
      phase = "/3";
      break;
    case "20%":
      phase = "/4";
      break;
    case "25%":
      phase = "/5";
      break;

    default:
      break;
  }

    useEffect(() => {
      navigate(`/account-setup${phase}`);
    }, [progress]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/1" element={<InitialSetup />} />
          <Route path="/2" element={<BioSetup />} />
          <Route path="/3" element={<SkillsSetup />} />
          <Route path="/4" element={<RateSetup />} />
          <Route path="/5" element={<InfoSetup />} />
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default UserSetupHOC;
