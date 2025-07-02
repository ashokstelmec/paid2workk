import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/Lotties/construction.json";

const MiscPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderer: "svg",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: "100%",
  };

  return (
    <div className="container mx-auto max-w-7xl px-10 md:px-5">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center cursor-default w-full md:w-[60%] max-w-5xl">
        <Lottie options={defaultOptions} />
        <h4 className="text-2xl md:text-6xl font-bold -z-10 text-muted-foreground/20">
        Under Construction.</h4>
      </div>
    </div>
  );
};

export default MiscPage;
