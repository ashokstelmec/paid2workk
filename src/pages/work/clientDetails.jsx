import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import {
  MapPin,
  Globe,
  Send,
  Star,
  Briefcase,
  MessageSquare,
  Pencil,
} from "lucide-react";
import { useCookies } from "react-cookie";
import { Button } from "../../components/ui/button";
import { Tooltip, Skeleton, Grid } from "@mui/material";
import { useChat } from "../../contexts/chatContext";
import { useAuth } from "../../contexts/authContext";

// const getCurrencySymbolId = (currencyCode) => {
//   switch (currencyCode) {
//     case "1":
//       return "$";
//     case "3":
//       return "€";
//     case "4":
//       return "£";
//     case "2":
//       return "₹";
//     default:
//       return "₹";
//   }
// };

const ProfileCard = ({ data, loading, sameUser, isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border ">
      <div className="relative bg-gradient-to-r from-blue/70 to-blue h-24 xl:h-32">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        ) : (
          sameUser && (
            <Tooltip title="Edit Profile">
              <button
                className="absolute top-4 right-4"
                onClick={() => {
                  navigate("/account-settings");
                }}
              >
                <Pencil className="w-5 h-5 text-white motion-preset-confetti" />
              </button>
            </Tooltip>
          )
        )}
      </div>
      <div className="px-6 pb-6">
        <div className="flex justify-center">
          <div className="relative -mt-12 xl:-mt-16 bg-white rounded-full">
            {loading ? (
              <Skeleton variant="circular" width={96} height={96} />
            ) : (
              <img
                src={data.photopath}
                alt={data.username}
                className="rounded-full border-4 border-white shadow h-24 w-24 xl:h-32 xl:w-32 object-cover"
              />
            )}
          </div>
        </div>

        <div className="text-center mt-5">
          {loading ? (
            <Skeleton variant="text" width="60%" />
          ) : (
            <h2 className="text-lg font-medium text-black">{data.username}</h2>
          )}

          {/* {loading ? (
          <Skeleton variant="text" width="40%" />
        ) : (
          <p className="text-muted-foreground font-medium">
            {data.designation}
          </p>
        )} */}

          <div className="mt-4 flex items-center justify-center text-black text-sm">
            {loading ? (
              <Skeleton variant="text" width="30%" />
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {data.state}, {data.country}
                </span>
              </>
            )}
          </div>

          <div className="mt-2 flex items-center justify-center text-black text-sm">
            {loading ? (
              <Skeleton variant="text" width="30%" />
            ) : (
              <>
                <Globe className="h-4 w-4 mr-1" />
                <span>{data.language}</span>
              </>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
            {loading ? (
              <>
                <Skeleton variant="rectangular" width="100%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={40} />
              </>
            ) : (
              <>
                <div className="bg-gray/40 rounded-lg p-2">
                  <div className="font-bold text-gray-800">{data.projects}</div>
                  <div className="text-gray-500">Projects</div>
                </div>

                <div className="bg-gray/40 rounded-lg p-2">
                  <div className="font-bold flex items-center justify-center text-gray-800">
                    <Star className="h-3 w-3 text-gold fill-gold" />
                    <span className="ml-1 text-gray-700 font-medium">
                      {Number(data.rating).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-gray-500">Rating</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({
  loading,
  sameUser,
  send,
  freelancerData,
  isLoggedIn,
}) => {
  // const handleContactSelection = (contact) => {
  //   console.log("🖱️ Selecting contact:", contact);

  //   if (!contact) {
  //     console.error("❌ No contact selected.");
  //     return;
  //   }

  //   try {
  //     navigate("/messages", { state: { roomId: contact.id } });
  //   } catch (error) {
  //     console.error("❌ Error selecting contact:", error);
  //   }
  // };
  const handleContactSelection = async () => {
    const auth = localStorage.getItem("authentication") === "true" ? true : false;;
    if (!auth) {
      // console.log("here");
      return;
    }
    // console.log("new", "send_new", null, freelancerData.userId)
    const roomId = `null_${sessionStorage.getItem("NUserID")}_${
      freelancerData.userId
    }`;
    const altRoomId = `null_${freelancerData.userId}_${sessionStorage.getItem(
      "NUserID"
    )}`;
    await send(
      "new",
      "send_new",
      null,
      freelancerData.userId,
      roomId,
      altRoomId
    );
  };
  return (
    !sameUser && (
      <div className="bg-white rounded-xl border  shadow-sm p-6">
        <h3 className="font-medium text-primary mb-2">Contact</h3>

        <div className="space-y-2">
          {loading ? (
            <>
              <Skeleton variant="rectangular" width="100%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={40} />
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => handleContactSelection()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </>
          )}
        </div>
      </div>
    )
  );
};

const TabNavigation = ({ exp }) => {
  return (
    <div className="border-b border-gray">
      <nav className="-mb-px flex space-x-6 h-9 pt-2">
        <a
          href="#a"
          className="border-blue text-blue whitespace-nowrap  border-b-2 font-medium text-sm"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#x").scrollIntoView({ behavior: "smooth" });
          }}
        >
          About Me
        </a>

        {exp && exp.length > 0 && (
          <a
            href="#experience"
            className="border-transparent text-muted-foreground hover:text-muted-foreground hover:border-grey whitespace-nowrap border-b-2 font-medium text-sm"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector("#experience");
              if (target) {
                // Calculate an adjusted position considering the fixed header
                const offsetTop =
                  target.getBoundingClientRect().top + window.pageYOffset - 128;
                window.scrollTo({ top: offsetTop, behavior: "smooth" });
              }
            }}
          >
            Experience
          </a>
        )}

        <a
          href="#reviews"
          className="border-transparent text-muted-foreground hover:text-black/60 hover:border-grey whitespace-nowrap border-b-2 font-medium text-sm"
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector("#reviews");
            if (target) {
              // Calculate an adjusted position considering the fixed header
              const offsetTop =
                target.getBoundingClientRect().top + window.pageYOffset - 128;
              window.scrollTo({ top: offsetTop, behavior: "smooth" });
            }
          }}
        >
          Reviews
        </a>
      </nav>
    </div>
  );
};

const AboutSection = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-xl border  shadow-sm p-6" id="aboutme">
      <h3 className="font-medium text-black text-base mb-2">About Me</h3>

      <div className="prose max-w-none text-sm text-black">
        {loading ? (
          <>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
          </>
        ) : (
          <p>{data.bio}</p>
        )}
      </div>
    </div>
  );
};

const ProjectsSection = ({ loading, exp }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border ${
        loading ? "block" : exp.length === 0 && "hidden"
      }`}
      id="experience"
    >
      <h3 className="font-semibold text-primary text-lg mb-4">
        Work Experience
      </h3>

      <div className="space-y-6">
        {loading ? (
          <div className="bg-gray/40 p-4 rounded-lg">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="100%" />
          </div>
        ) : (
          exp &&
          exp.length > 0 && (
            <div className="space-y-6">
              {exp.map((ex, index) => (
                <div
                  key={index}
                  className={`border-l-2 ${
                    ex.endDate === null
                      ? "border-blue"
                      : "border-blue/40 brightness-75"
                  } pl-4`}
                >
                  <h4 className="font-medium text-primary">{ex.designation}</h4>
                  <div className="flex items-center text-sm text-black/75 mt-1">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{ex.company}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {new Date(ex.startDate)
                        .toLocaleString("default", {
                          month: "short",
                          year: "numeric",
                        })
                        .split(" ")
                        .join(", ")}{" "}
                      -{" "}
                      {ex.endDate === null
                        ? "Present"
                        : new Date(ex.endDate)
                            .toLocaleString("default", {
                              month: "short",
                              year: "numeric",
                            })
                            .split(" ")
                            .join(", ")}
                    </span>
                  </div>
                  <p className="mt-2 text-grey text-sm">{ex.description}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const ReviewsSection = ({ loading, reviews }) => {
  const getTotalReviews = () => {
    if (!reviews) return 0;
    return reviews.totalFeedback || 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6" id="reviews">
      <div className="flex justify-between  items-center mb-2">
        <h3 className="font-medium text-primary ">Recent Reviews</h3>
        {loading ? (
          <Skeleton variant="text" width="20%" />
        ) : (
          <span className="text-sm text-gray-500">
            {getTotalReviews()} total reviews
          </span>
        )}
      </div>

      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={120} />
        ) : !reviews?.allFeedBack?.length ? (
          <div className="text-center text-gray-500 py-8 text-sm">
            <p>No reviews yet</p>
          </div>
        ) : (
          reviews.allFeedBack
            .filter((review) => !review.button)
            .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
            .map((review) => (
              <div
                key={review.feedbackId}
                className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        review.userImage ||
                        `https://via.placeholder.com/40?text=${review?.userrName?.charAt(
                          0
                        )}`
                      }
                      alt={review.userrName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-primary">
                        {review.userrName}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdOn)}
                      </span>
                    </div>
                    <p className="text-sm text-gray/500 font-medium">
                      {review.projectName}
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-gold fill-gold"
                              : "text-grey"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-gray-600">{review.description}</p>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

const ClientDetails = () => {
  const { getCurrencySymbolId, isLoggedIn } = useAuth();
  const location = useLocation();
  const [cookies] = useCookies(["selectedExpertId"]);
  const [freelancerData, setFreelancerData] = useState({});
  const [likeClicked, setLikeClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [educations, setEducations] = useState([]);
  const [entries, setEntries] = useState([]);
  const [sameUser, setSameUser] = useState(false);
  const [selectContact, setSelectContact] = useState({
    ReceiverId: "",
    SenderId: "",
    projectId: null,
  });
  const [details, setDetails] = useState({
    receiverId: "",
    projectId: "",
    projectName: "",
    freelancerId: "",
  });
  const { sendProfileMessage } = useChat();

  const [reviews, setReviews] = useState([]);

  // Fetch Basic Details
  const fetchFreelancerDetails = async () => {
    try {
      // Get ID from location state or cookies
      const userId = location.state?.expertId || cookies.selectedExpertId;
      // console.log("Fetching details for user:", userId);

      if (!userId) {
        throw new Error("No user ID found");
      }

      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?nUserID=${userId}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const selectedData = data[0];

      // console.log(selectedData);

      // Transform the data to match your component's needs
      const transformedData = {
        userId: selectedData.nUserID || "N/A",
        username: selectedData.username || "N/A",
        photopath: selectedData.photopath || "/default-profile.png",
        designation: selectedData.companyName || "",
        rating: selectedData.rating || "0.0",
        rate: selectedData.rate || "0",
        country: selectedData.country || "N/A",
        language: selectedData.language || "N/A",
        bio: selectedData.bio || "No description available",
        skills: selectedData.skill ? selectedData.skill.split(",") : [],
        state: selectedData.state || "N/A",
        experienceLevel: selectedData.experience || "0",
        currency: getCurrencySymbolId(selectedData.currency) || "₹",
        like: selectedData.like || false,
        paidBy: selectedData.paidBy || "0",
        roleId: selectedData.roleId || "0",
        projects: selectedData.totalproject || "0",
        // Add other fields as needed
      };
      setFreelancerData(transformedData);
    } catch (error) {
      console.error("Error fetching freelancer details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Work Experience
  const fetchExperience = async () => {
    const userId = location.state?.expertId || cookies.selectedExpertId;
    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/ShowExperience?nUserID=${userId}`
      );

      if (response.ok) {
        const text = await response.text();
        let data = {};
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }

        setEntries(data);
      } else {
        const errorData = await response.text();
        let errorMessage = "Something went wrong!";
        try {
          errorMessage = JSON.parse(errorData).message || errorMessage;
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add this new function after other fetch functions
  const fetchReviews = async () => {
    const userId = location.state?.expertId || cookies.selectedExpertId;
    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetFeedbackByUserId?NUserID=${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const userId = location.state?.expertId || cookies.selectedExpertId;
    if (userId === sessionStorage.getItem("NUserID")) setSameUser(true);
    window.scrollTo({ top: 0 });
    setLoading(true);
    fetchFreelancerDetails();
    fetchExperience();
    fetchReviews(); // Add this line
  }, [location.state?.expertId, cookies.selectedExpertId]);

  useEffect(() => {
    fetchFreelancerDetails();
  }, [likeClicked]);

  return (
    <>
      <div className="container max-w-7xl mx-auto pt-28 p-4 px-10 md:px-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10 justify-center">
          {/* Left Column - Profile Card */}
          <div className="md:col-span-4 xl:col-span-3 space-y-6">
            <ProfileCard
              data={freelancerData}
              loading={loading}
              sameUser={sameUser}
              isLoggedIn={isLoggedIn}
            />

            <ContactCard
              loading={loading}
              sameUser={sameUser}
              selectContact={selectContact}
              send={sendProfileMessage}
              freelancerData={freelancerData}
              details={details}
              setDetails={setDetails}
              isLoggedIn={isLoggedIn}
            />
          </div>

          {/* Right Column - Main Content */}
          <div className="md:col-span-8 xl:col-span-9 space-y-6">
            <TabNavigation exp={entries} />

            <AboutSection
              data={freelancerData}
              loading={loading}
              educations={educations}
            />

            <ReviewsSection loading={loading} reviews={reviews} />
            <ProjectsSection loading={loading} exp={entries} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClientDetails;
