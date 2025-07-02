import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { User, SearchCheck, Briefcase, Shield, Bell } from "lucide-react";
import { FiCheckCircle } from "react-icons/fi";
import BasicInfo from "./basicInfoProfile";
import Education from "./educationProfile";
import Experience from "./experienceProfile";
import Skills from "./skillsProfile";

const theme = createTheme({
  palette: {
    blue: {
      main: "#0b64fc",
    },
  },
});

function CustomTab({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex hover:shadow items-center justify-center gap-2 px-4 py-2 text-xs md:text-sm border duration-500 transition-all rounded-md  ${
        isActive
          ? "text-white bg-blue shadow-md border-blue"
          : "text-black/60 hover:text-blue border border-white/50 hover:border-blue bg-white hover:bg-white/50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

const ClientProfile = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Basic Info", icon: <User size={20} />, component: <BasicInfo /> },
    {
      label: "Identity verification",
      icon: <FiCheckCircle size={20} />,
      component: <Education />,
    },
    {
      label: "Notification",
      icon: <Bell size={20} />,
      component: <Experience />,
    },
    {
      label: "Privacy & Security",
      icon: <Shield size={20} />,
      component: <Skills />,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div className="pt-20   ">
               <div className=" container max-w-7xl mx-auto py-6 px-10 md:px-5">
          <div className="mb-4 pl-0.5">
                   
                     <h3 className="text-xl font-medium">Account Settings</h3>
         
                     <Typography variant="body2" className="text-black/70">
                       Manage your profile and preferences
                     </Typography>
                   </div>

          <div className="p-4 bg-white shadow-lg rounded-xl border border-blue/10">
            <div className="flex bg-back2/40 w-full rounded-lg p-2 gap-2 overflow-y-auto">
              {tabs.map((tab, index) => (
                <CustomTab
                  key={index}
                  icon={tab.icon}
                  label={tab.label}
                  isActive={activeTab === index}
                  onClick={() => setActiveTab(index)}
                />
              ))}
            </div>
            <Box className="mt-4">{tabs[activeTab].component}</Box>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ClientProfile;
