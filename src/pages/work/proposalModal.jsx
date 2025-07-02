import React, { useEffect } from "react";
import { Modal, Box, Typography, Button, Grid } from "@mui/material";
import Chip from "@mui/material/Chip";
import { PiMoneyWavyFill } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const ProposalsModal = ({ open, proposals, handleProposalClose }) => {
  const navigate = useNavigate();
  const { getCurrencySymbolId } = useAuth();

  // useEffect(() => {
  //   console.log(proposals);
  // }, []);

  

  return (
    <div>
      {/* Modal */}
      <Modal open={open}>
        <Box
          className="absolute top-1/2 left-1/2 w-[90%] lg:w-[80%] xl:w-[60%]  overflow-y-auto overflow-x-hidden"
          sx={{
            maxHeight: "70%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "10px",
          }}
        >
          <div className="flex justify-between sticky top-0 border-b border-grey bg-white z-20 p-4">
            <h3 className="text-center text-2xl font-bold">All Proposals</h3>
            <button
              className="text-xl font-bold text-red flex justify-center items-center"
              onClick={handleProposalClose}
            >
              <RxCross2 />
            </button>
          </div>

          {/* Proposals Grid */}

          <div className="h-full py-4 px-6">
            {proposals?.map((bid, index) => {
              // Fallback for missing values
              const username = bid.username || "Unknown Freelancer";
              const skill = bid.skill || "No skills listed";
              const photopath =
                bid.photopath || "https://via.placeholder.com/60";
              const projectStatus =
                bid.projectStatus === "true" ? "Active" : "Inactive";
              const bidDescription =
                bid.bidDescription || "No description provided";
              const bidAmount = bid.bidAmount
                ? bid.bidAmount.toFixed(2)
                : "0.00";
              const clientId = bid.clientId || "Unknown Client";

              return (
                <>
                  {" "}
                  <div
                    className="proposal-card mt-2 mb-4 p-5 border border-blue/10  shadow rounded-xl hover:shadow-lg duration-300 motion-preset-fade-sm"
                    key={index}
                  >
                    <div className="card-body flex ">
                      <div className="flex justify-center items-center p-2 rounded-full w-1/5 object-cover ">
                        <img
                          src={photopath}
                          alt="User Image"
                          className="rounded-full md:h-20 md:w-20 xl:h-28 xl:w-28 border-2 border-blue/10 shadow-md"
                        />
                      </div>
                      <div className="proposal-info w-3/5 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-semibold text-black/80">
                            {username}
                          </span>
                          <span
                            className="btn border-0 text-black/50 font-medium cursor-pointer"
                            onClick={() => {
                              sessionStorage.setItem(
                                "selectedExpertId",
                                bid.freelancerId
                              );
                              navigate(`/user/details/`, {
                                state: { expertId: bid.freelancerId }, // Pass ID through state
                              });
                            }}
                          >
                            @{username}
                          </span>
                        </div>
                        <div className="flex items-center mb-2 pt-2">
                          <span className="bg-grey rounded-full px-4 py-1 text-black/80 font-medium">
                            Project Status: {projectStatus}
                          </span>
                        </div>
                        <p className="mb-2">
                          {bid.showFullDescription
                            ? bidDescription
                            : `${bidDescription.substring(0, 100)}...`}
                          <span className="text-blue/80 ml-1 cursor-pointer">
                            {bid.showFullDescription
                              ? "Read less"
                              : "Read more"}
                          </span>
                        </p>
                        <div className="skills flex gap-2 flex-wrap">
                          {skill?.split(",").map((skills, index) => (
                            <Chip
                              key={index}
                              label={skills.trim()}
                              variant="filled"
                            />
                          ))}
                        </div>
                        <div className="response-time mt-2 text-[#6c757d]">
                          Bid placed on:{" "}
                          {new Date(bid.bidTimestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="proposal-price text-right w-1/5 text-black/80">
                        <strong>
                          {getCurrencySymbolId(bid.currency)}
                          {bidAmount}
                        </strong>
                        <br />
                        <span className="text-sm text-black/60">
                          Client ID: {clientId}
                        </span>
                      </div>
                    </div>
                    <div className="card-footer flex justify-end">
                      <div className="flex flex-row-reverse justify-center items-center gap-2 text-blue underline">
                        <a href="#" className="btn btn-link">
                          Report Bid
                        </a>
                      </div>
                    </div>
                  </div>{" "}
                </>
              );
            })}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ProposalsModal;
