import React from "react";
import InsideSearch from "../components/HeroComponents/insideSearch";
import MainLayout from "../pages/freelancer/mainLayout";
import Felon from '../assets/TempData/felan_13.png'

const Freelancer = () => {
  return (
    <div className="pt-20 ">
      <InsideSearch image={Felon}/>
      <MainLayout />
    </div>
  );
};

export default Freelancer;
