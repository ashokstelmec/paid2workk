import React, { useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import FreelancerHOC from "./freelancerHOC";
import ClientHOC from "./clientHOC";
import Footer from "@/components/footer";

const DashboardHOC = () => {
  const { user } = useAuth();
  const role = sessionStorage.getItem("roleId");

  return (
    <div>
      <div className="h-full container mx-auto max-w-7xl px-10 md:px-5 min-h-full">
        {role === "1" ? <FreelancerHOC /> : <ClientHOC />}
      </div>
      {location.pathname !== "/dashboard/projects/post-project" && <Footer />}
    </div>
  );
};

export default DashboardHOC;
