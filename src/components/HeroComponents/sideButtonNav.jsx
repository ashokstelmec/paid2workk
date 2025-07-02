import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext";

// Icons
import { useNavigate } from "react-router-dom";
import { Alert, Tooltip } from "@mui/material";
import { Pencil, Search } from "lucide-react";

const SideButtonNavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState(null);

  const handleSearch = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      document.getElementById("searchInput").focus();
    }, 800);
  };
  const handleSearch2 = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      document.getElementById("searchInput2").focus();
    }, 800);
  };

  const handlePost = () => {
    if (!user) {
      navigate("/login");
    } else if (user && user.roleId === "0") {
      window.location.href = "/dashboard/projects/post-project";
    } else {
      setAlertMsg(
        <Alert
          variant="filled"
          className=" motion-translate-x-in-[10%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-duration-[300ms]/translate motion-duration-[300ms]/opacity motion-ease-spring-bounciest "
          severity="error"
        >
          Freelancers are not authorized to post a project
        </Alert>
      );

      setTimeout(() => {
        setAlertMsg(null);
      }, 3000);
    }
  };

  return (
    <>
      {/* Mobile Screen */}
      <div className="md:hidden flex
       gap-2 flex-col-reverse fixed right-4 bottom-[3.1rem] mb-2 z-20  ">
        <button
          className="flex items-center justify-center p-3 text-lg rounded-full bg-white text-blue border border-blue/10 shadow duration-300 ease-in-out"
          onClick={handleSearch2}
        >
          <Search className="w-4 h-4"/>
        </button>

        <button
          className="flex items-center justify-center p-2.5 rounded-full bg-white  text-blue  border-blue/10 border shadow duration-300 ease-in-out"
          onClick={handlePost}
        >
          <Pencil className="w-4 h-4"/>
        </button>
        {/* <button
          className="flex items-center justify-center rounded-full px-3 py-[13px] bg-white  text-blue border-blue/10 border shadow duration-300 ease-in-out text-xl"
          onClick={handleSupport}
        >
          <MdContactSupport />
        </button> */}
      </div>

      {/* Large Screens */}
      <div className="hidden md:flex flex-col fixed right-0 top-1/2 z-20 rounded-l-lg  border-blue/10 drop-shadow-md -translate-y-1/2">
        <Tooltip title="Search" placement="left" enterDelay={500}  arrow>
          <button
            className="flex items-center justify-center p-2.5 text-lg rounded-ss-lg hover:bg-blue bg-white hover:text-white text-blue border-b border-blue/10 duration-300 ease-in-out"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4"/>
          </button>
        </Tooltip>
        <Tooltip title="Post Project" placement="left" enterDelay={500} arrow>
          <button
            className="flex items-center justify-center p-2.5 rounded-bl-lg hover:bg-blue bg-white hover:text-white text-blue duration-300 ease-in-out"
            onClick={handlePost}
          >
            <Pencil className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {/* Alert */}
      <div className="fixed z-40  right-4 top-28">{alertMsg}</div>
    </>
  );
};

export default SideButtonNavigation;
