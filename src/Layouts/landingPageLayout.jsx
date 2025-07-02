import React from "react";
import HeroSearch from "../components/HeroComponents/heroSearch";
import Categories from "../components/HeroComponents/categories";
import Explorer from "../components/HeroComponents/explorer";
import Freelancers from "../components/HeroComponents/freelancers";
import Testimonials from "../components/HeroComponents/testimonials";
import Blogs from "../components/HeroComponents/blogs";

const LandingPageLayout = () => {
  return (
    <>
      <div className="pt-20  overflow-hidden">
        <HeroSearch />
        <Categories />
        <Explorer />
        <Freelancers />
        <Testimonials/>
        <Blogs/> 
      </div>
    </>
  );
};

export default LandingPageLayout;
