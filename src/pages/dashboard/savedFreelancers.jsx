import { Skeleton, Chip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAuth } from "../../contexts/authContext";

// Icons
import { FaHeart, FaStar } from "react-icons/fa";
import { IoLocationOutline, IoGlobeOutline, IoSearch } from "react-icons/io5";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Globe, MapPin, Star } from "lucide-react";

const SavedFreelancers = ({ freelancer }) => {
  const { user, getCurrencySymbolId } = useAuth();
  const [, setCookie] = useCookies(["selectedExpertId"]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [talentListings, setTalentListings] = useState([]);
  const [filteredTalents, setFilteredTalents] = useState(talentListings); // Initially showing all projects
  const [unsaveModal, setUnsaveModal] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);

  const navigate = useNavigate();

  const toggleModalOpen = () => {
    setUnsaveModal(true);
  };

  const toggleModalClose = () => {
    setUnsaveModal(false);
  };

  //   handle Freelancer like
  const handleLike = (freelancerId, clientId) => {
    // Call API to handle like
    const formData = new FormData();
    formData.append("FreelancerID", freelancerId);
    formData.append("UserID", clientId);

    fetch(`https://paid2workk.solarvision-cairo.com/InsertLike`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Like status updated:", data);
        setLikeClicked(!likeClicked);
      })
      .catch((error) => {
        console.error("Error updating like status:", error);
      })
      .finally(() => {
        toggleModalClose();
        sessionStorage.removeItem("freelancerId");
      });
  };

  useEffect(() => {
    setFilteredTalents(talentListings);
  }, [talentListings]);

  useEffect(() => {
    const fetchSavedFreelancers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/GetLikeUsers?clientId=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const data = await response.json();
        setTalentListings(data);
      } catch (error) {
        console.error("Error fetching saved projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFreelancers();
  }, [sessionStorage.getItem("NUserID"), likeClicked]);

  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredTalents(talentListings);
      return;
    }
    const regex = new RegExp(searchTerm.replace(/[^a-zA-Z0-9\s]/g, ""), "i");
    const results = talentListings.filter(
      (talent) => regex.test(talent.username) || regex.test(talent.skill)
    );
    setFilteredTalents(results);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClick = (freelancer) => {
    try {
      // console.log("Freelancer data:", freelancer);
      // console.log("nUserID:", freelancer.nUserID);

      if (!freelancer.nUserID) {
        throw new Error("No nUserID available");
      }

      setCookie("selectedExpertId", freelancer.nUserID.toString(), {
        path: "/",
        maxAge: 86400,
      });

      navigate("/user/details", {
        state: { expertId: freelancer.nUserID },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <>
      <div className="pb-10">
    
        <div className="relative mt-6 flex gap-4 rounded-xl px-2 py-2 overflow-hidden bg-back/30 shadow-lg shadow-black/10 border border-blue/5 w-full lg:w-3/5">
          <IoSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-black/50 text-xl" />
          <input
            type="text"
            placeholder="Search freelancers..."
            className="w-full p-1 pl-10 outline-none focus:outline-none bg-white rounded-lg hover:border-blue/10 border border-back/30 duration-500 ease-in-out"
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            fullWidth
          />
          <button
            className="bg-blue hover:brightness-125 text-white text-sm px-5 py-1 rounded-lg duration-500 ease-in-out focus:outline-none"
            onClick={() => handleSearch({ target: { value: searchTerm } })}
          >
            Search
          </button>
        </div>

        {/* Main Content */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-black/80">
              {Array.from(new Array(3)).map((_, idx) => (
                <div
                  key={idx}
                  className="flex relative flex-col h-96 justify-between bg-white shadow rounded-xl p-6 border border-blue/10 transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Skeleton variant="circular" width={80} height={80} />
                      <div className="ml-4">
                        <Skeleton variant="text" width={120} height={24} />
                        <Skeleton variant="text" width={100} height={20} />
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={24}
                          className="rounded-full mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="font-medium text-sm text-primary mb-1">
                    <Skeleton variant="text" width={180} height={20} />
                    <Skeleton variant="text" width={140} height={20} />
                  </div>

                  <div className="border rounded-lg p-3 mt-2 bg-muted-foreground/[2%]">
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} width="90%" />
                    <Skeleton variant="text" height={20} width="80%" />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex flex-nowrap gap-2 w-4/5">
                      {[...Array(4)].map((_, idx) => (
                        <Skeleton
                          key={idx}
                          variant="rectangular"
                          height={24}
                          width={60}
                          className="rounded-full"
                        />
                      ))}
                    </div>
                    <Skeleton variant="text" width={80} height={28} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTalents.length === 0 ? (
            <div className="text-center gap-4 h-96 flex flex-col justify-center items-center">
              <h2 className="font-normal text-base">
                No Freelancers match your search.
              </h2>
              <button
                onClick={() => navigate("/freelancers")}
                className="bg-blue text-white font-medium px-3 py-1 rounded-lg hover:brightness-125 duration-300 ease-in-out"
              >
                Explore Freelancers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTalents.map((freelancer, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(freelancer)}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer w-full max-w-sm flex flex-col duration-200 ease-in-out"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-tr from-blue/60 to-blue p-4 text-white flex items-center justify-between h-20 relative">
                    <Avatar className="w-24 h-24 -mb-12 z-10 border-4 border-white shadow-lg shadow-primary/20 bg-muted ">
                      <AvatarImage
                        src={freelancer.photopath}
                        alt={freelancer.name}
                      />
                      <AvatarFallback className="text-black font-semibold text-xl bg-muted">
                        {freelancer.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-0.5 text-right">
                      <h2 className="text-base">{freelancer.username}</h2>
                      <p className="text-xs">
                        {freelancer.designation || "Freelancer"}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative p-4 pt-12 text-sm text-gray-700 flex flex-col flex-grow bg-gradient-to-tl from-muted-foreground/5 to-white">
                    {/* Bio */}
                    <div className="border mb-2 bg-white/80 rounded-lg p-2">
                      <p className="text-xs text-gray-600 line-clamp-4 h-16">
                        {freelancer.bio || "No description available."}
                      </p>
                    </div>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-0 absolute top-0 right-0">
                      <div className=" bg-gradient-to-r from-gold to-ranger/20 bg-gold text-white pl-2 pr-2.5 py-0.5 rounded-full text-xs font-medium flex items-center w-fit">
                        <Star className="h-3 w-3 mr-1 fill-white" />
                        <span className="font-medium">
                          {freelancer.rating === null
                            ? "New"
                            : freelancer.rating}
                        </span>
                      </div>
                      {/* Heart Icon */}
                      <div className=" z-10">
                        <button
                          className="hover:bg-[#ff9292]/50 p-2 rounded-full duration-300 hover:text-[#ff4444]"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModalOpen();
                            sessionStorage.setItem(
                              "freelancerId",
                              freelancer.nUserID
                            );
                          }}
                        >
                          <FaHeart className="text-xl text-[#ff4444] motion-preset-confetti  transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-x-12 text-xs font-medium mt-2">
                      <span className="text-nowrap">
                        Rate:{" "}
                        <span className="font-normal text-xs">
                          {freelancer.price !== "Price on request" &&
                            getCurrencySymbolId(freelancer.currency)}
                          {freelancer.rate}
                          {freelancer.paidBy === "0" ? "/hr" : ""}
                        </span>
                      </span>
                      <div>
                        <span>Location: </span>
                        <span className="text-xs font-normal">
                          {freelancer.country || "No country"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 mt-2 font-medium">
                      <div className="text-nowrap text-xs">
                        <span>Language: </span>
                        <span className="text-xs font-normal">
                          {freelancer.language || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="px-4 py-3 bg-muted-foreground/[3%] border-t text-center text-xs text-gray-500">
                    <div className="flex flex-nowrap gap-2 justify-start relative overflow-clip w-full">
                      {freelancer.skill &&
                        freelancer.skill
                          .split(",")
                          .slice(0, 2)
                          .map((tag, idx) => (
                            <Chip key={idx} label={tag} size="small" />
                          ))}
                      {freelancer.skill?.split(",").length > 2 && (
                        <Chip
                          label={`+${freelancer.skill.split(",").length - 2}`}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {unsaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white rounded-lg p-6 w-96">
                    <h3 className="text-lg font-medium mb-4">
                      Unsave Freelancer
                    </h3>
                    <p>Are you sure you want to unsave this freelancer?</p>
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        className="bg-gray hover:bg-grey duration-300 ease-in-out px-4 py-2 rounded-lg"
                        onClick={toggleModalClose}
                      >
                        Cancel
                      </button>
                      <button
                        className="duration-300 ease-in-out bg-red hover:bg-red/5 border border-white text-white hover:text-red hover:border-red px-4 py-2 rounded-lg"
                        onClick={() => {
                          const freelancerId =
                            sessionStorage.getItem("freelancerId");
                          handleLike(
                            freelancerId,
                            sessionStorage.getItem("NUserID")
                          );
                        }}
                      >
                        Unsave
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedFreelancers;
