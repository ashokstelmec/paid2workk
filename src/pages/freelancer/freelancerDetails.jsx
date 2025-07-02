import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
import { Badge } from "../../components/ui/badge";
import { Tooltip, Skeleton, Grid } from "@mui/material";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useChat } from "../../contexts/chatContext";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Bounce, toast } from "react-toastify";
import Lottie from "react-lottie";
import lottieAnimation from "../../assets/Lotties/inviteLoad.json";
import lottieAnimation2 from "../../assets/Lotties/success.json";
import { useAuth } from "../../contexts/authContext";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

const getExperienceLevel = (exp) => {
  switch (exp) {
    case "1":
      return "< 2";
    case "2":
      return "2 - 5";
    case "3":
      return "5+";
    default:
      return "< 2";
  }
};

const ProfileCard = ({
  data,
  freelancerId,
  likeClicked,
  setLikeClicked,
  loading,
  sameUser,
  reviews,
  isLoggedIn,
}) => {
  const navigate = useNavigate();

  const getTotalReviews = () => {
    if (!Array.isArray(reviews)) return 0;

    return reviews.reduce((total, project) => {
      if (!project.allFeedBack) return total;
      const filteredReviews = project.allFeedBack.filter(
        (review) => !review.button
      );
      return total + filteredReviews.length;
    }, 0);
  };

  const handleLike = async (freelancerId, userId) => {
    // Call API to handle like
    const formData = new FormData();
    formData.append("FreelancerID", freelancerId);
    formData.append("UserID", userId);

    fetch(`https://paid2workk.solarvision-cairo.com/InsertLike`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLikeClicked(!likeClicked); // Toggle likeClicked state
      })
      .catch((error) => {
        console.error("Error updating like status:", error);
      });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border ">
      <div className="relative bg-gradient-to-r from-blue/70 to-blue h-24 xl:h-32">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        ) : sameUser ? (
          <Tooltip title="Edit Profile">
            <button
              className="absolute top-4 right-4"
              onClick={() => {
                navigate("/account-settings");
              }}
            >
              <Pencil className="w-5 h-5 text-white fill-back2/50 motion-preset-confetti" />
            </button>
          </Tooltip>
        ) : (
          data.roleId !== "0" && (
            <Tooltip title="Save Freelancer">
              <button
                className="absolute top-4 right-4"
                onClick={() => {
                  if (!isLoggedIn) {
                    window.location.href = "/login";
                    return;
                  } else {
                    handleLike(freelancerId, sessionStorage.getItem("NUserID"));
                  }
                }}
              >
                {data.like ? (
                  <FaHeart className="text-xl text-white motion-preset-confetti" />
                ) : (
                  <FaRegHeart className="text-xl text-white motion-preset-shake motion-duration-300" />
                )}
              </button>
            </Tooltip>
          )
        )}
      </div>
      <div className="px-6 pb-6">
        <div className="flex justify-center">
          <div className="relative -mt-12 xl:-mt-16">
            {loading ? (
              <Skeleton variant="circular" width={96} height={96} />
            ) : (
              <div className="rounded-full border-4 border-white shadow bg-white">
                <Avatar className="h-24 w-24 xl:h-32 xl:w-32">
                  <AvatarImage
                    src={data.photopath}
                    alt={data.username}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {data.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-5">
          {loading ? (
            <Skeleton variant="text" width="60%" />
          ) : (
            <h2 className=" font-medium text-lg text-black">{data.username}</h2>
          )}
          {loading ? (
            <Skeleton variant="text" width="40%" />
          ) : (
            <p className="text-black text-sm">{data.designation}</p>
          )}

          <div className="flex items-center justify-center mt-3">
            {loading ? (
              <Skeleton variant="text" width="20%" />
            ) : (
              <>
                <Star className="h-4 w-4 text-gold fill-gold" />
                <span className="ml-1 text-black font-medium text-sm">
                  {reviews?.rating || data.rating || "0.0"}
                </span>
                <span className="text-black ml-1 text-xs">
                  ({reviews?.totalFeedback || "0"} reviews)
                </span>
              </>
            )}
          </div>

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

          <div className="mt-1 flex items-center justify-center textblack text-sm">
            {loading ? (
              <Skeleton variant="text" width="30%" />
            ) : (
              <>
                <Globe className="h-4 w-4 mr-1" />
                <span>{data.language}</span>
              </>
            )}
          </div>

          <div className="mt-4 py-2 px-4 bg-blue/5 rounded-lg text-primary font-medium text-sm">
            {loading ? (
              <Skeleton variant="text" width="50%" />
            ) : (
              `${data.currency} ${data.rate} ${
                data.paidBy === "0" ? "/hr" : ""
              }`
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {loading ? (
              <>
                <Skeleton variant="rectangular" width="100%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={40} />
              </>
            ) : (
              <>
                <div className="bg-gray/40 rounded-lg p-2">
                  <div className="font-medium text-black">
                    {data.successRate}%
                  </div>
                  <div className="text-gray-500">Success</div>
                </div>
                <div className="bg-gray/40 rounded-lg p-2">
                  <div className="font-medium text-black">
                    {data.experienceLevel}
                  </div>
                  <div className="text-gray-500">Years</div>
                </div>
                <div className="bg-gray/40 rounded-lg p-2">
                  <div className="font-medium text-black">
                    {data.totalProjects}
                  </div>
                  <div className="text-gray-500">Jobs</div>
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
  selectContact,
  showInvite,
  setShowInvite,
  fetch,
  send,
  freelancerData,
  details,
  setDetails,
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
    await send("new", "send_new", null, freelancerData.userId, roomId);
    setShowInvite(false);
    setDetails({
      receiverId: freelancerData.userId,
      projectId: "",
      projectName: "",
      freelancerId: freelancerData.userId,
    });
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
              {sessionStorage.getItem("roleId") === "0" && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    fetch();
                    setShowInvite(true);
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Job Invitation
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className="w-full font-normal"
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

const SkillsCard = ({ skills, loading }) => {
  return (
    <div className="bg-white border  rounded-xl shadow-sm p-6">
      <h3 className="font-medium text-primary mb-2">Skills</h3>

      <div className="space-y-1">
        {loading ? (
          <>
            <Skeleton variant="rectangular" width="100%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={30} />
          </>
        ) : skills && skills.length > 0 ? (
          skills?.map((skill, index) => (
            <Badge key={index} className="m-1 cursor-default">
              {skill}
            </Badge>
          ))
        ) : (
          <Badge className="m-1 cursor-default">No Skill</Badge>
        )}
      </div>
    </div>
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

const AboutSection = ({ data, loading, educations }) => {
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="bg-gray/40 p-4 rounded-lg">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </div>
        ) : (
          educations &&
          educations.length > 0 && (
            <div className="bg-gray/40 p-4 rounded-lg w-fit">
              <h4 className="font-medium text-sm text-black mb-2">Education</h4>
              <p className="text-sm text-black">
                <strong>{educations[0].degree}</strong>
                <br />
                {educations[0].fieldOfStudy}
                <br />
                {educations[0].college}, {educations[0].graduationYear}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const ExperienceSection = ({ loading, exp }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border ${
        loading ? "block" : exp.length === 0 && "hidden"
      }`}
      id="experience"
    >
      <h3 className="font-medium text-primary text-base mb-2">
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
              {exp?.map((ex, index) => (
                <div
                  key={index}
                  className={`border-l-2 ${
                    ex.endDate === null
                      ? "border-blue"
                      : "border-blue/40 brightness-75"
                  } pl-4`}
                >
                  <h4 className="font-medium text-primary text-sm">
                    {ex.designation}
                  </h4>
                  <div className="flex items-center text-xs text-black/75 mt-0.5">
                    <Briefcase className="h-3 w-3 mr-1" />
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

const FreelancerDetails = () => {
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
  const [showInvite, setShowInvite] = useState(false);
  const [details, setDetails] = useState({
    receiverId: "",
    projectId: "",
    projectName: "",
    freelancerId: "",
  });
  const [projects, setProjects] = useState([]);
  const { sendInvite, sendProfileMessage, inviteLoading, setInviteLoading } =
    useChat();
  const [reviews, setReviews] = useState([]);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: lottieAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: "100%",
  };
  const defaultOptions2 = {
    loop: false,
    autoplay: true,
    animationData: lottieAnimation2,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Fetch Feedbacks
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

  // Fetch Basic Details
  const fetchFreelancerDetails = async () => {
    try {
      const userId = location.state?.expertId || cookies.selectedExpertId;
      // console.log("Fetching details for user:", userId);

      if (!userId) {
        throw new Error("No user ID found");
      }

      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?NUserID=${userId}&Myid=${sessionStorage.getItem(
          "NUserID"
        )}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const selectedData = data[0];

      if (!selectedData) {
        throw new Error("No data found for the given user ID");
      }

      // console.log(selectedData);

      const transformedData = {
        userId: selectedData.nUserID || "N/A",
        username: selectedData.username || "N/A",
        photopath: selectedData.photopath || "/default-profile.png",
        designation: selectedData.designation || "Freelancer",
        rating: selectedData.rating || "0.0",
        rate: selectedData.rate || "0",
        country: selectedData.country || "N/A",
        language: selectedData.language || "N/A",
        bio: selectedData.bio || "No description available",
        skills: selectedData.skill ? selectedData.skill.split(",") : [],
        state: selectedData.state || "N/A",
        experienceLevel: getExperienceLevel(selectedData.lavel) || "< 2",
        currency: getCurrencySymbolId(selectedData.currency) || "₹",
        like: selectedData.like || false,
        paidBy: selectedData.paidBy || "0",
        roleId: selectedData.roleId || "0",
        totalProjects: selectedData.totalproject || 0,
        successRate: selectedData.successRate || 0,
      };
      setFreelancerData(transformedData);
      setDetails((prev) => ({
        ...prev,
        receiverId: selectedData.nUserId,
        freelancerId: selectedData.nUserId,
      }));
      setSelectContact({
        id: `null_${sessionStorage.getItem("NUserID")}_${userId}`,
        name: selectedData.username,
        avatar: selectedData.photopath,
        projectName: "",
        lastMessage: "new",
        timestamp: new Date().toISOString(),
        readTime: null,
        button: false,
        unreadCount: "0",
        freelancerId: userId,
        ReceiverId: userId,
        forwardto: userId,
        SenderId: sessionStorage.getItem("NUserID"),
        projectId: "null",
      });
    } catch (error) {
      console.error("Error fetching freelancer details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Education Details
  const fetchEducation = async () => {
    const userId = location.state?.expertId || cookies.selectedExpertId;
    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetEducationByUserId?NUserID=${userId}`
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

        // console.log("Education data:", data);
        setEducations(data);
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
      console.error("Error fetching education:", error);
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

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/api/Projects_/GetMYProject?userid=${sessionStorage.getItem(
          "NUserID"
        )}&type=1`
      );

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSubmit = async () => {
    const auth = localStorage.getItem("authentication") === "true" ? true : false;;
    if (!auth) {
      // console.log("Authentication missing.");
      return;
    }

    if (details.message === undefined) {
      toast.error("Please enter a message to proceed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setInviteLoading({ load: true, complete: false });

    const inviteSuccess = await sendInvite(
      details.message,
      "jobInvite",
      null,
      details
    );

    if (inviteSuccess) {
      // Reset form only if invite was successful
      setDetails({
        receiverId: freelancerData.userId,
        projectId: "",
        projectName: "",
        freelancerId: freelancerData.userId,
      });
    }

    setInviteLoading({ load: true, complete: inviteSuccess });
  };

  useEffect(() => {
    const userId = location.state?.expertId || cookies.selectedExpertId;
    if (userId === sessionStorage.getItem("NUserID")) setSameUser(true);
    window.scrollTo({ top: 0 });
    setLoading(true);
    fetchFreelancerDetails();
    fetchEducation();
    fetchExperience();
    fetchReviews();
  }, [location.state?.expertId, cookies.selectedExpertId]);

  useEffect(() => {
    fetchFreelancerDetails();
  }, [likeClicked]);

  return (
    <>
      <div className="container max-w-7xl mx-auto pt-28 p-4 px-10 md:px-5 min-h-[90dvh]">
        <div className="flex h-auto mb-10 flex-col md:flex-row gap-6 justify-center">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
            {/* Left Column - Profile Card */}
            <div className="md:col-span-4 xl:col-span-3 space-y-6">
              <ProfileCard
                data={freelancerData}
                freelancerId={cookies.selectedExpertId}
                likeClicked={likeClicked}
                setLikeClicked={setLikeClicked}
                loading={loading}
                sameUser={sameUser}
                reviews={reviews}
                isLoggedIn={isLoggedIn}
              />
              {isLoggedIn && (
                <ContactCard
                  loading={loading}
                  sameUser={sameUser}
                  selectContact={selectContact}
                  showInvite={showInvite}
                  setShowInvite={setShowInvite}
                  fetch={fetchProjects}
                  send={sendProfileMessage}
                  freelancerData={freelancerData}
                  details={details}
                  setDetails={setDetails}
                  isLoggedIn={isLoggedIn}
                />
              )}

              <SkillsCard skills={freelancerData.skills} loading={loading} />
            </div>

            {/* Right Column - Main Content */}
            <div className="md:col-span-8 xl:col-span-9 space-y-6">
              <TabNavigation exp={entries} />

              <AboutSection
                data={freelancerData}
                loading={loading}
                educations={educations}
              />

              <ExperienceSection loading={loading} exp={entries} />
              <ReviewsSection loading={loading} reviews={reviews} />
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {showInvite && (
        <Dialog open={showInvite}>
          {!inviteLoading.load ? (
            <DialogContent className="max-h-[90dvh] w-[95vw] max-w-md sm:max-w-xl overflow-y-scroll">
              <DialogHeader>
                <DialogTitle className="p-4">Send Job Invitation</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2 px-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Select Project</Label>
                  <Select
                    value={details.projectId}
                    onValueChange={(value) => {
                      // Find the selected project from the projects array
                      const selectedProject = projects.find(
                        (project) => project.nProjectId === value
                      );

                      // Update the details state with both projectId and projectName
                      if (selectedProject) {
                        setDetails({
                          freelancerId: freelancerData.userId,
                          receiverId: freelancerData.userId,
                          projectId: selectedProject.nProjectId, // Update projectId
                          projectName: selectedProject.title, // Update projectName
                        });
                      }
                    }}
                  >
                    <SelectTrigger
                      id="project"
                      className="bg-background hover:shadow-black/0"
                    >
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent className="overflow-y-scroll max-h-48">
                      {projects?.map((project) => (
                        <SelectItem
                          key={project.nProjectId}
                          value={project.nProjectId}
                        >
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {details.projectId && (
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      value={details.message}
                      onChange={(e) =>
                        setDetails((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col gap-2 sticky bottom-0 bg-background p-4 border-t">
                <div className="flex gap-2 flex-col sm:flex-row justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowInvite(false);
                      setDetails({
                        receiverId: "",
                        projectId: "",
                        projectName: "",
                        freelancerId: "",
                      });
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="w-full sm:w-auto"
                    disabled={!details.projectId}
                  >
                    Send Invitation
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          ) : (
            <DialogContent>
              {!inviteLoading.complete ? (
                <div className="flex flex-col gap-3 py-10 justify-center items-center">
                  <div className="w-[9rem] h-[9-rem] overflow-hidden">
                    <div className="scale-[250%]">
                      <Lottie options={defaultOptions} />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium pb-5 ">Sending Invite</h3>
                </div>
              ) : (
                <div className="flex flex-col gap-3 py-10 justify-center items-center">
                  <Lottie
                    options={defaultOptions2}
                    height={"9rem"}
                    width={"9rem"}
                  />
                  <h3 className="text-xl font-medium pb-5 motion-scale-in-[0.85] motion-translate-x-in-[0%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-ease-spring-bouncier">
                    Invite Sent Successfully!
                  </h3>
                </div>
              )}
            </DialogContent>
          )}
        </Dialog>
      )}
    </>
  );
};

export default FreelancerDetails;
