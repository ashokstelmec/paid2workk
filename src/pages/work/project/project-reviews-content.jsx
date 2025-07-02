import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react"; // Add this import
import ReviewForm from "./review-form";
import ReviewCard from "./review-card";
import NoReviewsPrompt from "./no-reviews-prompt";
import axios from "axios";
import { Skeleton, Tooltip, Avatar } from "@mui/material";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../contexts/authContext";

const ProjectReviewsContent = ({ project }) => {
  const { id: projectId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [otherFeedback, setOtherFeedback] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  // Relative time function
  const getRelativeTime = (dateString) => {
    const currentDate = new Date();
    const feedbackDate = new Date(dateString);

    const diffInMs = currentDate - feedbackDate; // Difference in milliseconds
    const diffInSec = Math.floor(diffInMs / 1000); // Convert ms to seconds
    const diffInMin = Math.floor(diffInSec / 60); // Convert sec to minutes
    const diffInHours = Math.floor(diffInMin / 60); // Convert min to hours
    const diffInDays = Math.floor(diffInHours / 24); // Convert hours to days
    const diffInWeeks = Math.floor(diffInDays / 7); // Convert days to weeks
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate months
    const diffInYears = Math.floor(diffInDays / 365); // Approximate years

    // Return relative time
    if (diffInSec < 60) {
      return "Just now";
    } else if (diffInMin < 60) {
      return `${diffInMin} minute${diffInMin > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    }
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const userId = sessionStorage.getItem("NUserID");
        // console.log(
        //   "Checking feedback for Project:",
        //   projectId,
        //   "User:",
        //   userId
        // );

        const response = await axios.get(
          `https://paid2workk.solarvision-cairo.com/GetFeedbackByUserId?NUserID=${userId}`
        );

        // console.log("Full API Response:", response.data);

        if (response.data && response.data.allFeedBack) {
          // Check if current user has submitted feedback for this project
          const userFeedback = response.data.allFeedBack.find(
            (f) =>
              String(f.nProjectId) === String(projectId) &&
              String(f.userID) === String(userId)
          );

          // console.log("Matching feedback found:", userFeedback);

          if (userFeedback) {
            setFeedback(userFeedback);
            setHasSubmittedFeedback(true);
          }

          // Find other party's feedback
          const otherPartyFeedback = response?.data?.allFeedBack?.find(
            (f) =>
              String(f.nProjectId) === String(projectId) &&
              String(f.userID) !== String(userId)
          );
          // console.log("OTHERR", otherPartyFeedback);

          if (otherPartyFeedback) {
            setOtherFeedback(otherPartyFeedback);
          }
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchFeedback();
  }, [projectId, refresh]);

  if (loading)
    return <Skeleton variant="rectangular" width="100%" height={200} />;

  return (
    <div className="">

      {/* Other Party's Feedback */}
      {otherFeedback && (
        <div className="w-full mb-6">
          <h2 className="font-bold text-xl mb-5">Their Review</h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
            <div className="flex items-start gap-4">
              <Avatar
                src={otherFeedback.userImage}
                alt={otherFeedback.userrName || "User"}
                sx={{
                  width: 56,
                  height: 56,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  border: "2px solid #f1f1f1",
                }}
              />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {otherFeedback.userrName || "Unnamed User"}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {otherFeedback?.projectName || "Project"}
                    </p>
                  </div>

                  <span className="text-sm text-gray-400">
                    {getRelativeTime(otherFeedback.createdOn)}
                  </span>
                </div>

                <div className="flex items-center mt-2 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (parseInt(otherFeedback.rating) || 0)
                          ? "text-gold fill-gold"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-4 text-[15px] text-gray-700 leading-relaxed">
                  {otherFeedback.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasSubmittedFeedback ? (
        <ReviewForm
          key={feedback.feedbackId}
          existingFeedback={feedback}
          onSubmit={(data) => setFeedback(data)}
          onCancel={() => navigate(-1)}
          selectedProject={project}
          setRefresh={setRefresh}
        />
      ) : (
        <>
          <NoReviewsPrompt
            projectComplete={project.status}
            userType={user?.roleId === "0" ? "client" : "freelancer"}
            targetName={
              user?.roleId === "1"
                ? project?.clientName
                : project?.freelancerPName
            }
            onAddReview={() => setShowForm(true)}
          />
          {showForm && (
            <div className="mt-4">
              <ReviewForm
                onSubmit={(data) => {
                  setFeedback(data);
                  setHasSubmittedFeedback(true);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
                selectedProject={project}
                setRefresh={setRefresh}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectReviewsContent;
