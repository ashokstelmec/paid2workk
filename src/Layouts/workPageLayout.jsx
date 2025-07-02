import React from "react";
import InsideSearch from "../components/HeroComponents/insideSearch";
import MainLayout from "../pages/work/mainLayout";
import Background from '../assets/Backgrounds/desktop.jpg'

const WorkPageLayout = () => {

  return (
    <div className="pt-20 ">
      <InsideSearch image={Background}/>
      <MainLayout />
    </div>
  );
};

export default WorkPageLayout;
