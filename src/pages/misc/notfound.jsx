import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/Lotties/notFound.json";

const NotFound = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    renderer: "svg",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: "100%",
  };

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center cursor-default w-full md:w-[60%] px-6 
       max-w-md lg:max-w-2xl">
        <Lottie options={defaultOptions} />
        <h4 className="text-xl sm:text-2xl md:text-4xl font-bold -z-10 text-muted-foreground/20">
        Uh-oh! You've lost the path.</h4>
      </div>
    </>
  );
};

export default NotFound;
