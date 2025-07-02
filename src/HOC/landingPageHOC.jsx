import React from "react";
import LandingPageLayout from "../Layouts/landingPageLayout";
import Footer from "../components/footer";
import SideButtonNavigation from "../components/HeroComponents/sideButtonNav";

const LandingPageHOC = () => {
  return (
    <>
      {/* {loggedIn && (
          <Navigations/>
        )} */}

      <SideButtonNavigation />
      <LandingPageLayout />
      <Footer />
    </>
  );
};

export default LandingPageHOC;
