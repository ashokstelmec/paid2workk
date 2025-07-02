import React, { useState, useEffect } from "react";
import {
  Grid,
  CardMedia,
  Typography,
  Chip,
  createTheme,
  ThemeProvider,
  Skeleton,
  Card,
  Box,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { useAuth } from "../../contexts/authContext";
import { Badge } from "../ui/badge";
import { Star, StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCookies } from "react-cookie";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1600,
      xxl: 1920,
    },
  },
});

const Freelancers = () => {
  const { getCurrencySymbolId } = useAuth();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
   const [cookies, setCookie] = useCookies(["selectedExpertId"]);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/GetAllUsers"
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        const transformedData = data.map((user) => ({
          nUserID: user.nUserID, // Add this line
          name: user.username || "Freelancer",
          role: user.designation || "Freelancer",
          bio: user.bio || "No bio available",
          country: user.country || "India",
          language: user.language || "N/A",
          rating: user.rating ? user.rating : null,
          price: user.rate
            ? `${user.rate} ${user.paidBy === "0" ? " /hr" : ""}`
            : "Price on request",
          tags: user.skill,
          image: user.photopath || "default-image-url",
          currency:
            getCurrencySymbolId(user.currency) || getCurrencySymbolId("1"),
        }));

        setFreelancers(transformedData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      setLoading(false);
    }
  };

  // Add click handler for freelancer cards
  const handleFreelancerClick = (freelancer) => {
    setCookie("selectedExpertId", freelancer.nUserID.toString(), {
      path: "/",
      maxAge: 86400,
    });
    navigate("/user/details", {
      state: { expertId: freelancer.nUserID },
    });
  };

  const displayedFreelancers = freelancers.slice(0, 8);

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-primary/[2%] text-black py-6">
        <div className="container max-w-7xl mx-auto px-10 md:px-5">
          <div className="flex w-full justify-between mb-4 ">
            <h2 className="text-prime font-medium text-xl">Explore Top Talents</h2>
            <a
              className="flex items-center justify-center w-fit gap-0.5 cursor-pointer text-blue hover:underline"
              onClick={() =>
                navigate("/freelancers", { state: { selectTalents: true } })
              }
            >
              <span className="duration-200 ease-in-out text-sm ">
                Explore all Talents
              </span>
              <FaChevronRight className="text-sm duration-200 ease-in-out pb-0.5" />
            </a>
          </div>
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from(new Array(8)).map((_, index) => (
                  <div key={index} className="w-full max-w-sm mx-auto">
                    <Card
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: 3,
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          boxShadow: 6,
                        },
                      }}
                    >
                      {/* Header */}
                      <Box
                        sx={{
                          color: "#fff",
                          px: 2,
                          py: 2,
                          height: 80,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Skeleton
                          variant="circular"
                          width={100}
                          height={100}
                          sx={{
                            border: "4px solid white",
                            boxShadow: 2,
                            zIndex: 10,
                            position: "relative",
                            top: 20,
                          }}
                        />
                        <Box sx={{ textAlign: "right", flexGrow: 1, ml: 2 }}>
                          <Skeleton width="60%" height={16} />
                          <Skeleton width="40%" height={14} />
                        </Box>
                      </Box>
                      {/* Body */}
                      <CardContent
                        sx={{
                          pt: 6,
                          pb: 2,
                          px: 2,
                          display: "flex",
                          flexDirection: "column",
                          background:
                            "linear-gradient(to top left, rgba(0,0,0,0.03), white)",
                          flexGrow: 1,
                          position: "relative",
                        }}
                      >
                        {/* Bio Section */}
                        <Box
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            px: 1.5,
                            py: 1,
                            mb: 2,
                            bgcolor: "rgba(255,255,255,0.8)",
                          }}
                        >
                          <Skeleton height={12} />
                          <Skeleton height={12} />
                          <Skeleton height={12} width="80%" />
                        </Box>
                        {/* Grid Fields */}
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 3,
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            px: 0.5,
                          }}
                        >
                          <Skeleton width="80%" height={16} />
                          <Skeleton width="60%" height={16} />
                          <Skeleton width="70%" height={16} />
                          <Skeleton width="50%" height={16} />
                        </Box>
                      </CardContent>
                      {/* Tags */}
                      <Box
                        sx={{
                          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                          px: 2,
                          py: 1.5,
                          display: "flex",
                          flexWrap: "nowrap",
                          gap: 1,
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                        }}
                      >
                        {[1, 2, 3].map((i) => (
                          <Skeleton
                            key={i}
                            variant="rounded"
                            width={60}
                            height={24}
                            sx={{ borderRadius: "9999px" }}
                          />
                        ))}
                      </Box>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedFreelancers.map((freelancer, index) => (
                  <div key={index} className="w-full max-w-sm mx-auto">
                    <div
                      onClick={() => handleFreelancerClick(freelancer)}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer w-full flex flex-col duration-200 ease-in-out"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-tr from-blue/60 to-blue p-4 text-white flex items-center justify-between h-20">
                        <Avatar className="w-24 h-24 -mb-12 z-10 border-4 border-white shadow-lg shadow-primary/20 bg-muted ">
                          <AvatarImage
                            src={freelancer.image}
                            alt={freelancer.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-black font-semibold text-xl bg-muted">
                            {freelancer.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="mt-1 text-right">
                          <h2 className="text-base">{freelancer.name}</h2>
                          <p className="text-xs">{freelancer.role}</p>
                        </div>
                      </div>
                      {/* Body */}
                      <div className="relative p-4 pt-12 text-sm text-prime flex flex-col flex-grow bg-gradient-to-tl from-muted-foreground/5 to-white">
                        {/* Bio */}
                        <div className="border mb-2 bg-white/80 rounded-lg p-2">
                          <p className="text-xs text-prime line-clamp-4 h-16">
                            {freelancer.bio && freelancer.bio !== "No Bio"
                              ? freelancer.bio
                              : "No bio Available."}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-gold to-ranger/20 bg-gold text-white pl-2 pr-2.5 py-0.5 rounded-full text-xs font-medium flex items-center w-fit">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          <span className="font-medium">
                            {freelancer.rating === null
                              ? "New"
                              : freelancer.rating}
                          </span>
                        </div>
                        <>
                          <div className="grid grid-cols-2 grid-row-2 gap-x-12 text-xs font-medium mt-2 pl-2.5">
                            <span className="text-nowrap">
                              Rate:{" "}
                              <span className="font-normal text-xs">
                                {freelancer.currency} {freelancer.price}
                              </span>
                            </span>
                            <div>
                              <span>Country: </span>
                              <span className="text-xs font-normal">
                                {freelancer.country || "N/A"}
                              </span>
                            </div>
                          </div>
                          {/* Language + Country */}
                          <div className="grid grid-cols-2 gap-x-12 mt-2 font-medium pl-2.5">
                            <div className="text-nowrap text-xs">
                              <span>Language: </span>
                              <span className="text-xs font-normal">
                                {freelancer.language || "N/A"}
                              </span>
                            </div>
                          </div>
                        </>
                      </div>
                      {/* Tags */}
                      <div className="px-4 py-3 bg-muted-foreground/[3%] border-t text-center text-xs text-prime">
                        <div className="flex flex-nowrap gap-2 justify-start">
                          {freelancer.tags &&
                            freelancer.tags
                              .split(",")
                              .slice(0, 2)
                              .map((tag, idx) => (
                                <Badge
                                  variant="skill"
                                  className="text-nowrap bg-mute text-prime text-xs"
                                  key={idx}
                                >
                                  {tag}
                                </Badge>
                              ))}
                          {freelancer.tags &&
                            freelancer.tags.split(",").length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-nowrap font-normal text-xs"
                              >{`+${
                                freelancer.tags.split(",").length - 2
                              }`}</Badge>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Freelancers;
