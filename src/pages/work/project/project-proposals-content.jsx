import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Tag,
  Pencil,
  MessageCircle,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { Alert, IconButton } from "@mui/material";
import BidModal from "../bidModal";
import { useChat } from "../../../contexts/chatContext";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const ProjectProposalContent = ({ proposals, clientId, status }) => {
  const { getCurrencySymbolId, getCurrencySymbolName } = useAuth();
  const userId = sessionStorage.getItem("NUserID");
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [currencyId, setCurrencyId] = useState("");
  const [bidId, setBidId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [proposalModal, setProposalModal] = useState(false);
  const { awardedProject } = useChat();

  const [selectedProposal, setSelectedProposal] = useState({});

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleAccept = async () => {
    const data = {
      projectId: selectedProposal.projectId,
      clientName: selectedProposal.clientname,
      forwardto: selectedProposal.freelancerId,
      projectName: selectedProposal.projectTitle,
      content: `Project Awarded.`,
    };

    const formData = new FormData();
    formData.append("bid_id", selectedProposal.bid_id);
    formData.append("bidStatus", "Awarded");
    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/RegisterBids",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );
      if (response.ok) {
        const userId = sessionStorage.getItem("NUserID");
        awardedProject(data);
        toast.success("Proposal Accepted! Redirecting...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setProposalModal(false);
        setSelectedProposal({});
        setTimeout(() => {
          const contactId =
            selectedProposal.senderId === userId
              ? selectedProposal.senderId
              : selectedProposal.receiverId;
          const Receiver =
            selectedProposal.senderId === userId
              ? selectedProposal.receiverId
              : selectedProposal.senderId;

          const roomId = `${selectedProposal.nProjectId}_${contactId}_${Receiver}`;
          navigate("/messages", {
            state: {
              roomId: roomId,
            },
          });
        }, 2500);
      } else {
        toast.error("Error Accepting Proposal!!!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error accepting proposal:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBidAmount("");
    setProposal("");
    setCurrencyId("");
    setDeliveryTime("");
    setBidId("");
  };

  const handleBidSubmission = (event) => {
    event.preventDefault();
    if (!bidAmount || !deliveryTime || !proposal || proposal.length < 30) {
      setAlertMsg(
        <Alert variant="filled" severity="error">
          Fill all the necessary details to place your bid.
        </Alert>
      );
      setTimeout(() => setAlertMsg(null), 3000);
      return;
    }

    if (proposal.length > 1000) {
      setAlertMsg(
        <Alert variant="filled" severity="error">
          Proposal is too long.
        </Alert>
      );
      setTimeout(() => setAlertMsg(null), 3000);
      return;
    }

    const projectId = sessionStorage.getItem("projectId");
    const post = sessionStorage.getItem("post");

    const formData = new FormData();
    formData.append("FinishDate", `${deliveryTime}days`);
    formData.append("ClientId", post);
    formData.append("BidStatus", "Active");
    formData.append("ProjectId", projectId);
    formData.append("BidAmount", bidAmount);
    formData.append("FreelancerId", sessionStorage.getItem("NUserID"));
    formData.append("BidDescription", proposal);
    formData.append("Currency", currencyId);
    formData.append("bid_id", bidId);

    fetch("https://paid2workk.solarvision-cairo.com/RegisterBids", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.trim() === "sucess") {
          setAlertMsg(
            <Alert variant="filled" severity="success">
              Bid Updated Successfully.
            </Alert>
          );
          setIsModalOpen(false);
          setTimeout(() => {
            setAlertMsg(null);
            window.location.reload(); // Or update state if you want to avoid full reload
          }, 1500);
        } else {
          setAlertMsg(
            <Alert variant="filled" severity="error">
              An error occurred, please try again later.
            </Alert>
          );
          setTimeout(() => setAlertMsg(null), 3000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlertMsg(
          <Alert variant="filled" severity="error">
            An error occurred. Please check the console for details.
          </Alert>
        );
        setTimeout(() => setAlertMsg(null), 3000);
      });
  };

  const handlemodalOpen = (currencyId, amount, desc, bidId, deliveryTime) => {
    setCurrencyId(currencyId);
    setBidAmount(amount);
    setProposal(desc);
    setBidId(bidId); // Important for update
    setDeliveryTime(deliveryTime);
    setIsModalOpen(true);
  };

  return (
    <div>
      {proposals.length > 0 ? (
        <div className="h-full">
          {proposals?.map((bid, index) => {
            // Fallback for missing values
            const username = bid.username || "Unknown Freelancer";
            const skills = bid.skill || "";
            const photopath = bid.photopath || "https://via.placeholder.com/60";
            const bidDescription =
              bid.bidDescription || "No description provided";
            const amount = bid.bidAmount ? bid.bidAmount.toFixed(2) : "0.00";
            const bidDate =
              new Date(bid.bidTimestamp).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) || "Unknown Date";
            const currency = bid.currency || "2";
            const role = bid.designation || "Freelancer";
            const isExpanded = expandedIndex === index;
            const freelancerId = bid.freelancerId;
            const bidId = bid.bid_id;
            const proposalObject = bid;

            return (
              <div key={index} className="w-full mx-auto mb-4">
                <div className="bg-white border rounded-lg overflow-hidden transition-all duration-300">
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => {
                          navigate("/user/details", {
                            state: { expertId: freelancerId },
                          });
                        }}
                      >
                        <div className="border rounded-full bg-blue/50 shadow shadow-blue/50 flex items-center justify-center overflow-hidden w-12 h-12">
                          <Avatar>
                            <AvatarImage src={photopath} alt={username} />
                            <AvatarFallback>
                              {username?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div>
                          <div className="flex flex-col items-start">
                            <h3 className="font-medium text-base">{username}</h3>
                            <p className="text-sm">{role}</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {getCurrencySymbolId(currency)}
                          {amount} {getCurrencySymbolName(currency)}
                        </p>
                        <p className="text-muted-foreground text-xs">Bid</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <p
                        className={`text-sm text-black transition-all break-words ${
                          isExpanded ? "" : "line-clamp-2 delay-300 "
                        }`}
                      >
                        {bidDescription}
                      </p>

                      <div
                        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                          isExpanded ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row justify-between space-y-4 pt-2">
                          <div className="max-w-[80%]">
                            <div className="flex items-center gap-1 mb-2">
                              <h4 className="text-sm font-medium text-black">
                                Skills
                              </h4>
                            </div>

                            {skills.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {skills?.split(",").map((skill) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="font-normal"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No skills listed
                              </p>
                            )}
                          </div>
                          <div className="flex sm:justify-end mt-6 lg:mt-0">
                            {userId === clientId && (
                              <div className="flex gap-1.5 w-full sm:w-auto">
                                <Button
                                  size="sm"
                                  className="px-4 flex gap-1.5 w-full sm:w-auto"
                                  onClick={() => {
                                    setSelectedProposal(proposalObject);
                                    setProposalModal(true);
                                  }}
                                >
                                  <span>View</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-4 py-2 bg-gray/30 text-xs">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1.5" />
                      Bid placed on: {bidDate}
                    </div>

                    <div className="flex items-center gap-2">
                      {userId === freelancerId && status === "Posted" && (
                        <>
                          <Button
                            size="xs"
                            className="px-3 flex gap-1"
                            onClick={() =>
                              handlemodalOpen(
                                currency,
                                amount,
                                bidDescription,
                                bidId,
                                bid.finishDate.split("d")[0]
                              )
                            }
                          >
                            <Pencil className="w-3 h-3" /> <span>Edit</span>
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(index)}
                        className={`h-8 w-8 p-0 rounded-full transition-transform`}
                        aria-label={
                          isExpanded ? "Collapse details" : "Expand details"
                        }
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <BidModal
                  bidId={bidId}
                  open={isModalOpen}
                  handleClose={handleCloseModal}
                  bidAmount={bidAmount}
                  setBidAmount={setBidAmount}
                  currencyId={currencyId}
                  setCurrencyId={setCurrencyId}
                  deliveryTime={deliveryTime}
                  setDeliveryTime={setDeliveryTime}
                  proposal={proposal}
                  setProposal={setProposal}
                  handleBidSubmission={handleBidSubmission}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex w-full justify-center items-start mt-5">
          <h3 className="text-sm">
            No Proposal for this project yet.
          </h3>
        </div>
      )}
      {proposalModal && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 md:px-0">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90dvh] overflow-auto motion-scale-in-[0.50] motion-translate-x-in-[0%] motion-translate-y-in-[150%] motion-opacity-in-[0%] motion-duration-[300ms]">
            <div className="sticky top-0 bg-white border-b border-grey flex justify-between items-center px-8 py-3 z-30">
              <h2 className="text-2xl font-bold">Proposal</h2>
              <IconButton
                onClick={() => {
                  setProposalModal(false);
                  setSelectedProposal({});
                }}
              >
                <RxCross2 className="text-red" />
              </IconButton>
            </div>
            <div className="px-2">
              <CardHeader>
                <CardTitle>{selectedProposal.projectTitle}</CardTitle>
                <CardDescription>
                  Bid placed on{" "}
                  {new Date(selectedProposal.bidTimestamp).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div
                  className="flex items-center mb-4 cursor-pointer"
                  onClick={() => {
                    navigate("/user/details", {
                      state: {
                        expertId: selectedProposal.freelancerId,
                      }, // Pass ID through state
                    });
                  }}
                >
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage
                      src={selectedProposal.photopath}
                      alt={selectedProposal.username}
                    />
                    <AvatarFallback>
                      {selectedProposal.username === null
                        ? "?"
                        : selectedProposal.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {selectedProposal?.username || "Unknown Freelancer"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedProposal.rating
                        ? `Rating: ${selectedProposal.rating}/5`
                        : "New Joinee"}
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-4 break-words">
                  {selectedProposal.bidDescription}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProposal.skill !== null ? (
                    selectedProposal.skill.split(",").map((skills, index) => (
                      <Badge key={index} variant="default">
                        {skills}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="default">No Skills</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex flex-col">
                  <h2 className="text-sm text-muted-foreground">Bid Amount</h2>
                  <div className="text-lg font-semibold">
                    {getCurrencySymbolId(selectedProposal.currency)}
                    {selectedProposal.bidAmount}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Delivery:{" "}
                  {selectedProposal?.finishDate?.split("d").join(" D") ||
                    "Not Specified"}
                </div>
              </CardFooter>
            </div>
            <div className="sticky bottom-0 flex justify-end bg-white px-8 py-5 gap-3 border-t border-gray">
              {selectedProposal.bidStatus === "Awarded" ? (
                <button
                  className="px-6 py-2 text-sm font-medium text-white bg-blue rounded-md hover:brightness-125 duration-300"
                  onClick={() => {
                    navigate("/messages", {
                      state: {
                        roomId: `${
                          selectedProposal.projectId
                        }_${sessionStorage.getItem("NUserID")}_${
                          selectedProposal.freelancerId
                        }`,
                      },
                    });
                  }}
                >
                  Send Message
                </button>
              ) : (
                <button
                  className="px-6 py-2 text-sm font-medium text-white bg-blue rounded-md hover:brightness-125 duration-300"
                  onClick={handleAccept}
                >
                  Accept
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectProposalContent;
