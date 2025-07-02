import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Edit2 } from "lucide-react"; // Add Edit2 icon import
import { Button } from "../../../components/ui/button";
import { toast } from "react-toastify";
import { Dialog, Avatar, Tooltip } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { useChat } from "../../../contexts/chatContext";

export default function ReviewForm({
  onCancel,
  onSubmit,
  existingFeedback,
  selectedProject,
  setRefresh,
}) {
  // Initialize state with existingFeedback values directly
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { sendFeedbackMessage, sendMilestoneNotificationFromDetails } =
    useChat();

  const { id: projectId } = useParams();
  const userId = sessionStorage.getItem("NUserID");

  // Use useEffect to update form when existingFeedback changes
  useEffect(() => {
    if (existingFeedback) {
      // console.log("Setting form with feedback:", existingFeedback);
      setRating(Number(existingFeedback.rating) || 0);
      setReviewText(existingFeedback.description || "");
    }
  }, [existingFeedback]);

  const getRelativeTime = (dateString) => {
    const currentDate = new Date();
    const feedbackDate = new Date(dateString);
    const diffInMs = currentDate - feedbackDate;
    const diffInSec = Math.floor(diffInMs / 1000);
    const diffInMin = Math.floor(diffInSec / 60);
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSec < 60) return "Just now";
    if (diffInMin < 60)
      return `${diffInMin} minute${diffInMin > 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    if (diffInWeeks < 4)
      return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
    if (diffInMonths < 12)
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!rating) {
      setError("Please select a rating.");
      return;
    }

     if (reviewText.split(" ").length > 50) {
          toast.error("Feedback is too long");
          return;
        }

    const feedbackData = {
      userID: userId,
      description: reviewText,
      status: true,
      nProjectId: projectId,
      rating: rating.toString(),
      createdOn: existingFeedback?.createdOn || new Date().toISOString(), // Preserve or set new date
      // Preserve other existing feedback data
      userrName: existingFeedback?.userrName,
      userImage: existingFeedback?.userImage,
      projectName: existingFeedback?.projectName,
    };

    if (existingFeedback?.feedbackId) {
      feedbackData.feedbackId = existingFeedback.feedbackId;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/${
          existingFeedback ? "UpdateFeedback" : "InsertFeedback"
        }`,
        {
          method: existingFeedback ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedbackData),
        }
      );

      const receiver =
        userId === selectedProject.freelancerId
          ? selectedProject.clientId
          : selectedProject.freelancerId;

      const result = await response.json();
      if (response.ok) {
        toast.success(
          existingFeedback
            ? "Review updated successfully!"
            : "Review submitted successfully!"
        );
        setIsEditModalOpen(false);
        if (!existingFeedback) {
          await sendFeedbackMessage(
            userId,
            receiver,
            selectedProject.nProjectId,
            selectedProject.title,
            "Gave you a Feedback",
            "feedback",
            selectedProject.freelancerId,
            result.id,
            parseInt(rating),
            reviewText
          );
          await sendMilestoneNotificationFromDetails(
            `Gave you a Feedback on Project ${selectedProject.title}!`,
            "feedback",
            userId,
            receiver,
            selectedProject.nProjectId
          );
        }

        if (onSubmit) onSubmit({ ...feedbackData, ...result }); // Pass complete feedback data
      } else {
        toast.error(result.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting review.");
    } finally {
      setRefresh((prev) => !prev); // Refresh the feedback list if needed
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="font-medium text-base mb-5">Your Review</h2>
      {existingFeedback ? (
        <div className="w-full mb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
            <div className="flex items-start gap-4">
              <Tooltip title={existingFeedback.userrName} arrow>
                <Avatar
                  src={existingFeedback.userImage}
                  alt={existingFeedback.userrName || "User"}
                  sx={{
                    width: 64,
                    height: 64,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    border: "2px solid #f1f1f1",
                  }}
                />
              </Tooltip>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-black">
                      {existingFeedback.userrName || "Your Review"}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {existingFeedback?.projectName || "Project"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {getRelativeTime(existingFeedback.createdOn)}
                  </span>
                </div>

                <div className="flex items-center mt-2 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (parseInt(existingFeedback.rating) || 0)
                          ? "text-gold fill-gold"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm text-black leading-relaxed">
                  {existingFeedback.description}
                </p>

                {/* Edit Icon */}
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center text-sm gap-1 text-blue p-2 rounded-lg hover:bg-blue/5 transition-colors"
                  >
                    Edit
                    <Edit2 className="w-3 h-3 text-blue bg-hrey" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Leave a Review
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5]?.map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "text-gold fill-gold"
                          : "text-gray"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="reviewText"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Review
              </label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Share your experience working on this project..."
              ></textarea>
            </div>

            {error && <p className="text-red mb-3">{error}</p>}

            <div className="flex justify-end gap-3">
              <Button
                onClick={onCancel}
                variant="outline"
                className="border-red text-red hover:bg-red/5"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Submitting..."
                  : existingFeedback
                  ? "Update Review"
                  : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ borderRadius: 5 }}
      >
        <div className="bg-white p-6">
          <h2 className="text-base font-medium text-black mb-4">
            Edit Your Review
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-black mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= (hoveredRating || rating)
                          ? "text-gold fill-gold"
                          : "text-gray"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="reviewText" className="block text-black mb-3">
                Your Review
              </label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Share your experience working on this project..."
              ></textarea>
            </div>

            {error && <p className="text-red mb-3">{error}</p>}

            <div className="flex justify-end gap-3">
              <Button
                type="button" // Changed to type="button" to prevent form submission
                onClick={() => {
                  setReviewText(existingFeedback.description || "");
                  setRating(Number(existingFeedback.rating) || 0);
                  setIsEditModalOpen(false);
                }} // Just close the modal
                variant="outline"
                className="border-red text-red hover:bg-red/5"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Review"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}
