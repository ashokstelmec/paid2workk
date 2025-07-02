import React, { useRef } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FaPen,
  FaCode,
  FaPaintBrush,
  FaBuilding,
  FaDollarSign,
  FaCamera,
  FaVideo,
} from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: <FaPaintBrush />, title: "UI/UX Design", services: 3, query: "1" },
  { icon: <FaPen />, title: "Data Entry", services: 4, query: "2" },
  { icon: <FaCode />, title: "Programming & Tech", services: 4, query: "3" },
  { icon: <FaBuilding />, title: "Branding", services: 4, query: "4" },
  {
    icon: <FaCamera />,
    title: "Photography & Editor",
    services: 4,
    query: "5",
  },
  {
    icon: <FaPaintBrush />,
    title: "Graphic & Design",
    services: 3,
    query: "6",
  },
  { icon: <FaCode />, title: "Web Development", services: 6, query: "7" },
  { icon: <FaVideo />, title: "Videography", services: 4, query: "8" },
];

const NavigationButton = styled(Box)(() => ({
  width: 28,
  height: 28,
  borderRadius: "50%",
  backgroundColor: "white",
  border: "2px solid #e0e0e0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  position: "absolute",
  top: "40%",
  transform: "translateY(-50%)",
  zIndex: 1,
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const Categories = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1050, settings: { slidesToShow: 4 } },
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 680, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } }, // Small phones like iPhone SE
      { breakpoint: 360, settings: { slidesToShow: 2 } }, // Extra small Androids
      { breakpoint: 320, settings: { slidesToShow: 2 } }, // Ensure 2 cards at 320px width
    ],
  };

  const handleClickCategory = (category) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/projects`, { state: { cat: category } });
  };

  return (
    <div className="bg-primary/[2%]">
      <div className="container max-w-7xl mx-auto pt-6 pb-2 px-10 md:px-5">
        <div className="flex flex-col items-start  font-medium">
          <h2 className="text-xl">Categories</h2>
          <span className="text-base text-prime font-normal">
            Explore the most popular categories
          </span>
        </div>
        <Box className="mt-4 relative overflow-visible">
          <Slider ref={sliderRef} {...settings}>
            {categories.map((category, index) => (
              <Box key={index} px={0.5} className="pb-6 overflow-visible" >
                <div
                  className="group relative cursor-pointer p-4 h-[6.2rem]  w-full border-opacity-10 rounded-lg border border-mute hover:border-cool hover:shadow-[0px_0px_55px_-35px_#0b64fc] transition-all duration-300  bg-white mx-auto"
                  onClick={() => handleClickCategory(category.query)}
                >
                  <div className="flex flex-col items-center justify-center h-full px-4 gap-2.5">
                    <div className="bg-light-background shadow shadow-mute hover:shadow-none rounded-lg w-10 h-10 flex items-center justify-center  transition-all duration-300 group-hover:bg-blue">
                      <div className="text-blue group-hover:text-white transition-all duration-300 text-lg ">
                        {category.icon}
                      </div>
                    </div>
                    <h3 className="text-sm text-prime text-center break-words overflow-hidden whitespace-nowrap text-ellipsis">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </Box>
            ))}
          </Slider>

          <NavigationButton
            onClick={previous}
            sx={{
              left: -10,
              boxShadow: "0 8px 16px rgba(180, 193, 214, 0.6)",
            }}
          >
            <MdChevronLeft className="text-prime" size={24} />
          </NavigationButton>

          <NavigationButton
            onClick={next}
            sx={{
              right: -10,
              boxShadow: "0 8px 16px rgba(180, 193, 214, 0.6)",
            }}
          >
            <MdChevronRight className="text-prime" size={24} />
          </NavigationButton>
        </Box>
      </div>
    </div>
  );
};

export default Categories;
