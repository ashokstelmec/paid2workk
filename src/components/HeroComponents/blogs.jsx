import React from "react";
import { useNavigate } from "react-router-dom";

const blogData = [
  {
    title: "20 Companies with Location-Agnostic Pay in 2024",
    category: "Speaking",
    date: "July 10, 2024",
    image: "felan_12.png", // Replace with the actual image URL
  },
  {
    title: "13 Graphic Design Interview Questions",
    category: "Learn",
    date: "July 10, 2024",
    image: "felan_13.png", // Replace with the actual image URL
  },
  {
    title: "How to Research a Company for an Interview",
    category: "Learn",
    date: "July 10, 2024",
    image: "felan_14.png", // Replace with the actual image URL
  },
];

const Blogs = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-primary/[2%] text-black py-6">
      <div className="container max-w-7xl mx-auto px-10 md:px-5 ">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-medium text-black">
            Latest From Our Blog
          </h2>
          <p className="text-sm  text-black">
            Get interesting insights, articles, and news
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {blogData.map((blog, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-transform transform duration-300 cursor-pointer"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48  object-cover"
              />
              <div className="p-4 sm:p-6">
                <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                  <span className="text-blue font-medium">
                    {blog.category}
                  </span>{" "}
                  · <span>{blog.date}</span>
                </div>
                <h3 className="text-sm sm:text-base font-medium text-black">
                  {blog.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* View All Blogs Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/blogs")}
            className="bg-blue text-white text-sm px-3 py-2 rounded-lg shadow-md hover:bg-blue/80 transition duration-300"
          >
            View All Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
