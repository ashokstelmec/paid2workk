import React from "react";
import { useAuth } from "../contexts/authContext";
import FreelancerProfile from "../pages/profile/freelancer/freelancerProfile";
import ClientProfile from "../pages/profile/client/clientProfile";

const ProfileHOC = () => {
  const { user } = useAuth();
  const role = sessionStorage.getItem('roleId')

  return (
    <>
      <div id="profile" className="min-h-dvh ">
        {role === "1" ? <FreelancerProfile /> : <ClientProfile />}
      </div>
    </>
  );
};

export default ProfileHOC;
