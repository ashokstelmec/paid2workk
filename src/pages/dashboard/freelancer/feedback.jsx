import React, { useState, useEffect } from "react";
import {
  Tooltip,
  Avatar,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Menu,
  IconButton,
  Modal,
  Box,
  TextField,
  Rating,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Button } from "../../../components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Feedback = () => {
  const [sortBy, setSortBy] = useState("latest");
  const [feedbacks, setFeedbacks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 10;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMenuClick = (event, feedback) => {
    setAnchorEl(event.currentTarget);
    setEditingFeedback(feedback);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (feedback) => {
    setOpenModal(true);
    setEditingFeedback(feedback);
    handleCloseMenu();
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setEditingFeedback(null);
  };

  const handleEditChange = (field, value) => {
    setEditingFeedback((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();

    const loggedInUserId = sessionStorage.getItem("NUserID");

    if (editingFeedback.description.split(" ").length > 50) {
      toast.error("Feedback is too long");
      return;
    }

    if (editingFeedback.userID !== loggedInUserId) {
      toast.error("You can only edit your own feedback");
      return;
    }

    if (!editingFeedback.rating) {
      toast.error("Please select a rating.");
      return;
    }
    // if (editingFeedback.description.length < 10) {
    //   toast.error("Description must be at least 10 characters long.");
    //   return;
    // }

    const updatedFeedbackData = {
      feedbackId: editingFeedback.feedbackId,
      rating: editingFeedback.rating.toString(),
      description: editingFeedback.description,
      projectId: editingFeedback.nProjectId,
      userID: loggedInUserId,
      NUserID: loggedInUserId,
    };

    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/UpdateFeedback",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFeedbackData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update feedback");
      }

      toast.success("Feedback updated successfully!");
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.feedbackId === editingFeedback.feedbackId ? editingFeedback : f
        )
      );
      setOpenModal(false);
      setEditingFeedback(null);
    } catch (err) {
      toast.error("An error occurred while updating feedback.");
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("NUserID");

    if (userId) {
      axios
        .get(
          `https://paid2workk.solarvision-cairo.com/GetFeedbackByUserId?NUserID=${userId}`
        )
        .then((response) => {
          const data = response.data;
          if (data) {
            // Filter valid feedbacks from allFeedBack array
            const validFeedbacks = data.allFeedBack.filter(
              (feedback) => feedback.button === true
            );

            setFeedbacks(validFeedbacks);

            // Set feedback data directly from API response
            setFeedbackData([
              {
                totalFeedback: data.totalFeedback,
                averageRating: data.averageRating,
                totalFiveRate: data.totalFiveRate,
                totalFourRate: data.totalFourRate,
                totalThreeRate: data.totalThreeRate,
                totalTwoRate: data.totalTwoRate,
                totalOneRate: data.totalOneRate,
              },
            ]);
          } else {
            console.warn("No feedback data found for the user.");
          }
        })
        .catch((error) =>
          console.error("Error fetching feedback data:", error)
        );
    }
  }, []);

  const renderStars = (rating, size) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`h-${size} w-${size} ${
          index < rating ? "text-gold" : "text-gray"
        }`}
      />
    ));
  };

  // Add this helper function after other utility functions
  const formatRating = (rating) => {
    if (!rating) return "0.0";
    const numRating = parseFloat(rating);
    return Number.isInteger(numRating)
      ? `${numRating}.0`
      : numRating.toFixed(1);
  };

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.createdOn) - new Date(a.createdOn);
      case "rating":
        return b.rating - a.rating;
      case "oldest":
        return new Date(a.createdOn) - new Date(b.createdOn);
      default:
        return 0;
    }
  });

  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = sortedFeedbacks.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );
  const totalPages = Math.ceil(sortedFeedbacks.length / feedbacksPerPage);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <>
      <div className="pb-10 ">
        <div className="w-full flex justify-between mt-6 mb-6 md:mb-0">
          <div className=" md:hidden  ">
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="latest">Most Recent</MenuItem>
                <MenuItem value="oldest">Least Recent</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="w-full hidden md:flex justify-end  mb-6">
          <FormControl variant="outlined" size="small">
            <InputLabel id="sort-select-label" sx={{ fontSize: 14 }}>
              Sort By
            </InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
              sx={{
                height: 28,
                fontSize: 14,
                "& .MuiSelect-select": {
                  paddingTop: 1,
                  paddingBottom: 1,
                  fontSize: 14, // Text size inside the select
                },
              }}
            >
              <MenuItem value="latest" sx={{ fontSize: 14 }}>
                Most Recent
              </MenuItem>
              <MenuItem value="oldest" sx={{ fontSize: 14 }}>
                Least Recent
              </MenuItem>
              <MenuItem value="rating" sx={{ fontSize: 14 }}>
                Highest Rated
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Desktop view edit button */}
        <div className="grid  lg:grid-cols-2 gap-4 ">
          {currentFeedbacks.length === 0 ? (
            <div className="text-center p-8 text-black text-sm">
              No Feedbacks here
            </div>
          ) : (
            currentFeedbacks
              .filter((feedback) => feedback.button)
              .map((feedback) => (
                <Card
                  key={feedback.feedbackId}
                  className="relative flex flex-col bg-white border border-blue/10 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-0"
                >
                  <CardContent className="flex gap-5 p-6">
                    {/* Avatar and user info */}
                    <div className="flex flex-col items-center min-w-[56px]">
                      <Avatar
                        src={feedback.userImage}
                        alt={feedback.userrName || "User"}
                        sx={{ width: 56, height: 56 }}
                      />
                      {/* <span className="mt-2 text-xs text-gray-500 text-center">
                        {getRelativeTime(feedback.createdOn)}
                      </span> */}
                    </div>
                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between ">
                        <h3 className="text-lg font-semibold text-black">
                          {feedback.userrName || "No Username"}
                        </h3>
                        {feedback.button && (
                          <>
                            <IconButton
                              onClick={(e) => handleMenuClick(e, feedback)}
                              size="small"
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleCloseMenu}
                            >
                              <MenuItem onClick={handleEditClick}>
                                Edit Feedback
                              </MenuItem>
                            </Menu>
                          </>
                        )}
                      </div>
                      <div
                        className="flex items-center gap-2 text-blue-700 text-sm font-medium cursor-pointer hover:underline mb-2"
                        onClick={() =>
                          navigate(`/projects/details/${feedback.nProjectId}`)
                        }
                      >
                        <span className="truncate">{feedback.projectName}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(parseInt(feedback.rating) || 0)}
                        <span className="text-sm text-gray800">
                          {formatRating(feedback.rating)}
                        </span>
                      </div>
                      <div className="text-black/90 text-sm min-h-20 overflow-hidden">
                        {feedback.description}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>

{/* Pagination */}
        <div className="flex justify-center mt-6 mb-8">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex font-medium items-center justify-center gap-0.5 mx-1 pl-2 pr-3 py-0.5 text-sm rounded-lg ${
              currentPage === 1
                ? "bg-gray text-black/50 border-0"
                : "bg-white text-blue"
            } border border-blue duration-300 ease-in-out`}
          >
            <FaChevronLeft />
            <span>Back</span>
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => {
              // Always show first page
              if (pageNum === 1)
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-2 py-0.5 text-sm mx-1 rounded-lg ${
                      currentPage === pageNum
                        ? "bg-blue text-white no-underline"
                        : "bg-white text-blue"
                    } border border-blue`}
                  >
                    {pageNum}
                  </button>
                );

              // Always show last page
              if (pageNum === totalPages)
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-2 py-0.5 text-sm mx-1 rounded-lg ${
                      currentPage === pageNum
                        ? "bg-blue text-white no-underline"
                        : "bg-white text-blue"
                    } border border-blue`}
                  >
                    {pageNum}
                  </button>
                );

              // Show current page and one page before and after current
              if (
                pageNum === currentPage ||
                pageNum === currentPage - 1 ||
                pageNum === currentPage + 1
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-2 py-0.5 text-sm mx-1 rounded-lg ${
                      currentPage === pageNum
                        ? "bg-blue text-white no-underline"
                        : "bg-white text-blue"
                    } border border-blue`}
                  >
                    {pageNum}
                  </button>
                );
              }

              // Show ellipsis after first page if needed
              if (pageNum === 2 && currentPage > 3) {
                return (
                  <span key={pageNum} className="px-2">
                    ...
                  </span>
                );
              }

              // Show ellipsis before last page if needed
              if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                return (
                  <span key={pageNum} className="px-2">
                    ...
                  </span>
                );
              }

              return null;
            }
          )}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex font-medium items-center justify-center gap-0.5 mx-1 pl-3 pr-2 py-0.5 text-sm rounded-lg ${
              currentPage === totalPages
                ? "bg-gray text-black/50 border-0"
                : "bg-white text-blue"
            } border border-blue duration-300 ease-in-out`}
          >
            <span>Next</span>
            <FaChevronRight />
          </button>
        </div>

        {/* Mobile view edit button */}
        {/* <div className="md:hidden gap-4 grid">
          {sortedFeedbacks.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No Feedbacks here
            </div>
          ) : (
            sortedFeedbacks
              .filter((feedback) => feedback.button)
              .map((feedback) => (
                <div
                  key={feedback.feedbackId}
                  className="relative flex flex-col p-6 rounded-xl border border-blue/10 hover:shadow-md transition-all duration-500 ease-in-out"
                >
                  <div className="flex justify-between mb-4 items-start gap-4">
                    <div className="flex gap-4 justify-between">
                      <Tooltip title={feedback.userrName} arrow>
                        <Avatar
                          src={feedback.userImage}
                          alt={feedback.userrName || "User"}
                          sx={{ width: 48, height: 48 }}
                        />
                      </Tooltip>
                      <div>
                        <h3 className="text-base font-semibold text-black/80">
                          {feedback.userrName || "No Username"}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-black/50">
                        {getRelativeTime(feedback.createdOn)}
                      </span>
                      {feedback.button && (
                        <>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <IconButton>
                                <MoreVertIcon />
                              </IconButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleEditClick(feedback)}
                              >
                                Edit Feedback
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-medium text-muted-foreground">
                      {feedback.projectName}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating || 0, 5)}
                      </div>
                    </div>
                    <div className="text-black/75 mb-6">
                      {feedback.description}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div> */}
      </div>

      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            outline: "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 400,
            maxWidth: "90%",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Edit Feedback</h2>

          {/* ⭐ Star Rating Input */}
          <div className="mb-4">
            <div className="text-sm text-black/60 mb-1">Rating</div>
            <Rating
              name="edit-rating"
              value={parseInt(editingFeedback?.rating) || 0}
              onChange={(event, newValue) => {
                handleEditChange("rating", newValue);
              }}
              size="large"
            />
          </div>

          {/* 📝 Description Input */}
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={editingFeedback?.description || ""}
            onChange={(e) => handleEditChange("description", e.target.value)}
          />

          {/* ✅ Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline_danger" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFeedback}>Save</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Feedback;
