import React from "react";

import { useCookies } from "react-cookie";
import ClientDetails from "../pages/work/clientDetails";
import FreelancerDetails from '../pages/freelancer/freelancerDetails';
import { useLocation } from "react-router-dom";

const ProfileDetailsHOC = () => {
  const location = useLocation();
  const role = location.state?.role;

  return (
    <>
      <div className="h-full" id="x">
        {role === "client" ? <ClientDetails /> : <FreelancerDetails />}
      </div>
    </>
  );
};

export default ProfileDetailsHOC;
