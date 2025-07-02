import React, { useState, useEffect } from "react";
import Slider from "react-slick";

const carouselContent = [
  {
    quote:
      "The platform has completely transformed how I manage my online business. The intuitive interface and powerful features have made it incredibly easy to scale my operations.",
    name: "Susie G. Lucas",
    role: "Online Store Owner",
    image: "felan_9.png", // Replace with image path
  },
  {
    quote:
      "I've tried many solutions, but this one stands out for its reliability and excellent customer support. It's been instrumental in growing our online presence.",
    name: "Nav Tran",
    role: "E-Commerce Manager",
    image: "felan_10.png", // Replace with image path
  },
  {
    quote:
      "The analytics features have given me insights I never had before. It's helped me make better decisions and improve our customer experience significantly.",
    name: "Alex T.",
    role: "Digital Entrepreneur",
    image: "felan_11.png", // Replace with image path
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const totalItems = carouselContent.length;

  // Handle next slide
  const handleNext = () => {
    if (currentIndex === totalItems - 1) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Handle previous slide
  const handlePrev = () => {
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalItems - 1);
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  // Reset transition state after an instant switch
  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(true);
      }, 0);
    }
  }, [isTransitioning]);

  return (
    <div className="bg-primary/[2%] text-black py-6">
      <div className="container max-w-7xl mx-auto px-10 md:px-5  ">
        <div className="mb-2 flex flex-col gap-1 justify-center items-center text-center">
          <h1 className="text-xl font-medium text-black/90">
            What Users Say About Us
          </h1>
          <p className="text-black max-w-2xl text-sm">
            Trusted by thousands of satisfied customers worldwide.
          </p>
        </div>
        <div className="flex justify-center w-full">
          <div className="flex flex-col w-full xl:w-4/5 justify-center md:flex-row items-center">
            <div className="h-48 w-full md:w-1/3 xl:w-1/4 px-4 md:px-0">
              <div className="bg-white px-4 py-6 h-full w-full hover:shadow-md cursor-pointer rounded-xl border border-blue/10 duration-300 ease-in-out flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-1">Rating</h2>
                <div className="text-base font-bold text-black mb-2">
                  <span className="text-black">4.2/5</span>
                </div>
                <div className="text-xl text-green">
                  ★★★★<span className="text-grey">★</span>
                </div>
                <p className="text-black text-xs w-full text-center">
                  Based on 1,254 reviews
                </p>
                <div className="text-green font-semibold mt-2">
                  ★ Trustpilot
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 xl:w-3/4 pt-2 md:pt-2 md:p-2">
              <Slider
                dots={false}
                arrows={false}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={5000}
                beforeChange={() => setIsTransitioning(true)}
                afterChange={(current) => {
                  setCurrentIndex(current);
                  setIsTransitioning(false);
                }}
              >
                {carouselContent.map((item, index) => (
                  <div key={index} className="p-4 overflow-visible">
                    <div className=" h-48 w-full bg-white  hover:shadow-md cursor-pointer rounded-xl border border-blue/10 duration-300 ease-in-out p-4 overflow-visible">
                      <div className="flex flex-col items-center gap-4 justify-between md:justify-evenly h-full">
                        <div className="italic text-black/80 text-center text-sm sm:text-base mb-2 max-h-[72px] sm:max-h-none overflow-hidden overflow-ellipsis line-clamp-3">
                          "{item.quote}"
                        </div>

                        <div className="flex items-center gap-4 md:w-full">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-base">{item.name}</h3>
                            <p className="text-black/60 text-sm">{item.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
