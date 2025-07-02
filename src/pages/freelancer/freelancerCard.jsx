import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { IoLocationOutline, IoGlobeOutline } from "react-icons/io5";
import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Badge } from "../../components/ui/badge";

import { useAuth } from "../../contexts/authContext";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Globe, MapPin, Star } from "lucide-react";

const FreelancerCard = ({ freelancer, like }) => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["selectedExpertId"]);

  const { user } = useAuth();

  const handleClick = (e) => {
    try {
      if (!freelancer.nUserID) {
        throw new Error("No nUserID available");
      }

      // Set cookie using react-cookie
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
    <div
      onClick={() => handleClick()}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer w-full max-w-sm flex flex-col duration-200 ease-in-out"
    >
      {/* Header */}
      <div className="bg-gradient-to-tr from-blue/60 to-blue p-4 text-white flex items-center justify-between h-20 relative">
        <Avatar className="w-24 h-24 -mb-12 z-10 border-4 border-white shadow-lg shadow-primary/20 bg-muted ">
          <AvatarImage src={freelancer.image} alt={freelancer.name} className="object-cover"/>
          <AvatarFallback className="text-black font-semibold text-xl bg-muted">{freelancer.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="mt-0.5 text-right">
          <h2 className="text-base">{freelancer.name}</h2>
          <p className="text-xs">{freelancer.role}</p>
        </div>
      </div>

      {/* Body */}
      <div className="relative p-4 pt-12 text-sm text-gray-700 flex flex-col flex-grow bg-gradient-to-tl from-muted-foreground/5 to-white">
        {/* Bio */}
        <div className="border mb-2 bg-white/80 rounded-lg p-2">
          <p className="text-xs text-gray-600 line-clamp-4  h-16">
            {freelancer.description && freelancer.description !== "No Bio"
              ? freelancer.description
              : "No bio Available."}
          </p>
        </div>

        <div className="absolute top-2 right-2 flex gap-2 items-center">
          <div className=" bg-gradient-to-r from-gold to-ranger/20 bg-gold text-white pl-2 pr-2.5 py-0.5 rounded-full text-xs font-medium flex items-center w-fit">
            <Star className="h-3 w-3 mr-1 fill-white" />

            <span className="font-medium">
              {freelancer.rating === null ? "New" : freelancer.rating}
            </span>
          </div>
          {/* Heart Icon */}
          <div
            className=" z-10"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              if (!user) {
                window.location.href = "/login";
                return;
              } else {
                like(freelancer.nUserID, sessionStorage.getItem("NUserID"));
              }
            }}
          >
            {user?.nUserID !== freelancer.nUserID &&
              (freelancer.like ? (
                <FaHeart className="text-xl text-[#ff4444] motion-preset-confetti  transition-transform" />
              ) : (
                <FaRegHeart className="text-xl hover:text-[#ff4444] transition-transform motion-preset-shake" />
              ))}
          </div>
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
        {/* Rate + Rating */}

        {/* Spacer that pushes tags down ONLY IF needed
                        <div className="flex-grow"></div> */}
      </div>
      {/* Tags */}
      <div className="px-4 py-3 bg-muted-foreground/[3%] border-t text-center text-xs text-gray-500">
        <div className="flex flex-nowrap gap-2 justify-start">
          {freelancer.tags &&
            freelancer.tags.slice(0, 2).map((tag, idx) => (
              // <Chip
              //   size="small"
              //   className="md:chip-medium "
              //   key={idx}
              //   label={tag}
              // />
              <Badge variant="skill" className="text-nowrap text-xs">
                {tag}
              </Badge>
            ))}
          {freelancer.tags && freelancer.tags.length > 2 && (
            // <Chip
            //   label={`+${
            //     freelancer.tags.split(",").length - 2
            //   } more`}
            //   variant="outlined"
            //   size="small"
            //   className="md:chip-medium"
            // />
            <Badge
              variant="outline"
              className="text-nowrap font-normal text-xs"
            >{`+${freelancer.tags.length - 2}`}</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerCard;
