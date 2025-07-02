import React, { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  HelpCircle,
  MessageCircle,
  Flag,
  Check,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Chip, Skeleton } from "@mui/material";
import { useAuth } from "../../../contexts/authContext";
import { useChat } from "../../../contexts/chatContext";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import lottieAnimation from "../../../assets/Lotties/button.json";
import Lottie from "react-lottie";
import { Badge } from "../../../components/ui/badge";

const ProjectMilestonesContent = ({ project }) => {
  const { getCurrencySymbolId, getCurrencySymbolName } = useAuth();
  const { contacts, handleContactClick, sendMilestoneNotificationFromDetails, sendMilestoneMessageFromDetails } =
    useChat();
  const [milestoneDetails, setMilestoneDetails] = useState({});
  const [freelancerData, setFreelancerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState({
    release: false,
    markComplete: false,
    request: false,
  });
  const [refresh, setRefresh] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    const userId =
      sessionStorage.getItem("NUserID") === project.freelancerId
        ? project.clientId
        : project.freelancerId;
    const fetchMilestoneDetails = async () => {
      setLoading(true);
      try {
        const quoteRes = await axios.get(
          `https://paid2workk.solarvision-cairo.com/api/Quotation/GetQuotations?NMilestoneId=${project.nMilestoneId}`
        );

        const freelancerRes = await axios.get(
          `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?NUserId=${userId}`
        );
        setFreelancerData(freelancerRes.data[0]);
        setMilestoneDetails(quoteRes.data[0]);
      } catch (error) {
        console.error("Error fetching milestone details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (project.nMilestoneId) {
      fetchMilestoneDetails();
    }
  }, [project, refresh]);

  // Chat Button Function
  const handleChatClick = async () => {
    const contactId = `${project.nProjectId}_${project.clientId}_${project.freelancerId}`;

    try {
      const contact = contacts.find((c) => c.id === contactId);
      await handleContactClick(contact);
      navigate("/messages");
    } catch (error) {
      console.error(error);
    }
  };

  // Release Payment Button Function
  const handleReleasePayment = async () => {
    setButtonLoading({ release: true });

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Wallet/release-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: sessionStorage.getItem("NUserID"),
            nProjectId: project.nProjectId,
            nMilestoneId: project.nMilestoneId,
            nTaskId: taskId,
          }),
        }
      );

      if (response.ok) {
        toast.success("Payment released Successful.", {
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
        await sendMilestoneNotificationFromDetails(
          project.title,
          "paymentReleased",
          project.clientId,
          project.freelancerId,
          project.nProjectId
        );
        await sendMilestoneMessageFromDetails(
          "Payment Released for a Completed Milestone.",
          "paymentReleased",
          project.clientId,
          project.freelancerId,
          project.nProjectId,
          project.title,
          project.freelancerId,
          project.nMilestoneId
        )
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment release Failed.", {
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
    } finally {
      setButtonLoading({ release: false });
      setRefresh(!refresh);
      setShowReleaseModal(false);
    }
  };

  // mark Complete Button Function
  const handleMarkComplete = async () => {
    setButtonLoading({ markComplete: true });

    try {
      // Replace with your actual API endpoint
      await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Wallet/Complete-Milestone",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: sessionStorage.getItem("NUserID"),
            nProjectId: project.nProjectId,
            nMilestoneId: project.nMilestoneId,
            nTaskId: taskId,
          }),
        }
      );
      await sendMilestoneNotificationFromDetails(
        "Completed a milestone. Please check and release payment.",
        "milestoneCompleted",
        project.freelancerId,
        project.clientId,
        project.nProjectId
      );
      await sendMilestoneMessageFromDetails(
        "Completed a milestone. Please check and release payment.",
        "milestoneCompleted",
        project.freelancerId,
        project.clientId,
        project.nProjectId,
        project.title,
        project.freelancerId,
        project.nMilestoneId
      )
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark milestone as complete.", {
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
    } finally {
      setButtonLoading({ markComplete: false });
      setRefresh(!refresh);
      setShowCompleteModal(false);
    }
  };

  // Request Button Function
  const handleRequestPayment = async (task) => {
    setButtonLoading({ request: true });
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Wallet/Request-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: sessionStorage.getItem("NUserID"),
            nProjectId: project.nProjectId,
            nMilestoneId: project.nMilestoneId,
            nTaskId: task,
          }),
        }
      );

      if (response.ok) {
        toast.success("Request Sent!", {
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
        await sendMilestoneNotificationFromDetails(
          project.title,
          "releaseRequest",
          project.freelancerId,
          project.clientId,
          project.nProjectId
        );
        await sendMilestoneMessageFromDetails(
          "Requested Payment release for a milestone Completion.",
          "releaseRequest",
          project.freelancerId,
          project.clientId,
          project.nProjectId,
          project.title,
          project.freelancerId,
          project.nMilestoneId
        )
      }
    } catch (error) {
      console.error(error);
      toast.error("Request Failed!", {
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
    } finally {
      setButtonLoading({ request: false });
      setRefresh(!refresh);
    }
  };

  return loading ? (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16">
            <Skeleton variant="circular" width={64} height={64} />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="rectangular" width={80} height={30} />
          </div>
        </div>
        <Skeleton variant="rectangular" width="100%" height={20} />
      </div>
      <div className="mt-6">
        <Skeleton variant="rectangular" width="100%" height={150} />
      </div>
    </div>
  ) : (
    <div className=" mx-auto">
      {/* Freelancer Header */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={freelancerData.photopath}
                  alt={freelancerData.username}
                />
                <AvatarFallback className="bg-gray text-primary">
                  {freelancerData.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-medium text-gray-800">
                  {freelancerData.username}
                </h2>
              </div>
              <Button
                size="sm"
                className="mt-1 inline-flex gap-1.5 items-center text-sm bg-gray text-primary rounded-md hover:bg-grey transition-colors"
                onClick={handleChatClick}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col items-end">
            <div className="text-base font-medium text-black-800">
              {getCurrencySymbolId(milestoneDetails.currency)}{" "}
              {milestoneDetails.totalAmount}{" "}
              {getCurrencySymbolName(milestoneDetails.currency)}
            </div>
            <div className="text-xs text-gray-600 flex gap-1">
              <span>Due on </span>
              {milestoneDetails.paidBy === "1"
                ? new Date(
                    new Date(milestoneDetails.createdAt).getTime() +
                      parseFloat(milestoneDetails.totalTime) *
                        24 *
                        60 *
                        60 *
                        1000
                  ).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })
                : new Date(
                    new Date(milestoneDetails.createdAt).getTime() +
                      parseFloat(milestoneDetails.totalTime) * 60 * 60 * 1000
                  ).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-medium text-black mb-2">
          Payment Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <span className="">Balance</span>
              {/* <HelpCircle className="w-4 h-4 text-muted-foreground" /> */}
            </div>
            <div className="text-sm font-medium text-gray-800">
              {" "}
              {getCurrencySymbolId(milestoneDetails.currency)}{" "}
              {milestoneDetails.holdAmount.balance}{" "}
              {getCurrencySymbolName(milestoneDetails.currency)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <span className=" text-black-700">Holding</span>
              {/* <HelpCircle className="w-4 h-4 text-muted-foreground" /> */}
            </div>
            <div className="text-sm font-medium text-black-800">
              {getCurrencySymbolId(milestoneDetails.currency)}{" "}
              {milestoneDetails.holdAmount.hold}{" "}
              {getCurrencySymbolName(milestoneDetails.currency)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-black-700">Released</span>
              {/* <HelpCircle className="w-4 h-4 text-muted-foreground" /> */}
            </div>
            <div className="text-sm font-medium text-black-800">
              {getCurrencySymbolId(milestoneDetails.currency)}{" "}
              {milestoneDetails.holdAmount.release}{" "}
              {getCurrencySymbolName(milestoneDetails.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Payments */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <h2 className="text-base font-medium text-black">
            Milestone Payments
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-black">
                  Description
                </th>
                <th className="py-3 px-4 text-center text-sm font-medium text-black">
                  Time
                </th>
                <th className="py-3 px-4 text-center text-sm font-medium text-black">
                  Amount
                </th>
                <th className="py-3 px-3 text-center text-sm font-medium text-black">
                  Status
                </th>
                <th className="py-3 px-4 md:pr-14 text-right text-sm font-medium text-black">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {milestoneDetails.milestones?.map((milestone, index) => (
                <tr key={index} className="border-b border-gray-200 text-sm text-black">
                  <td className="py-4 px-4 text-gray-800">
                    {milestone.milestoneTitle}
                  </td>
                  <td className="py-4 px-4 text-gray-800">
                    <div className="flex justify-center">
                      {milestone.time}{" "}
                      {milestoneDetails.paidBy === "0"
                        ? milestone.time === "1.00" || milestone.time === "1"
                          ? "Hour"
                          : "Hours"
                        : milestone.time === "1.00" || milestone.time === "1"
                        ? "Day"
                        : "Days"}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center items-center gap-1 text-gray-800">
                      <span>
                        {getCurrencySymbolId(milestoneDetails.currency)}{" "}
                        {milestone.amount}{" "}
                        {getCurrencySymbolName(milestoneDetails.currency)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center items-center gap-1 text-gray-800">
                      <Chip
                        variant="outlined"
                        color={
                          milestone.status === "Pending" ? "warning" : "success"
                        }
                        sx={{ fontSize: "12px" }}
                        size="small"
                        label={milestone.status}
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-1 text-gray-800">
                      {milestone.status === "Completed" && (
                        <div className="flex flex-row items-center justify-center gap-1">
                          <Check className="text-green w-5 h-5" />
                          <h3 className="text-green font-medium text-sm">
                            Payment Released
                          </h3>
                        </div>
                      )}
                      {sessionStorage.getItem("roleId") === "0"
                        ? milestone.status !== "Completed" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setShowReleaseModal(true);
                                setTaskId(milestone.nTaskId);
                              }}
                            >
                              Release Payment
                            </Button>
                          )
                        : milestone.status !== "Completed" &&
                          (milestone.status === "Pending" ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                setShowCompleteModal(true);
                                setTaskId(milestone.nTaskId);
                              }}
                            >
                              Mark Complete
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                handleRequestPayment(milestone.nTaskId);
                              }}
                            >
                              {buttonLoading.request ? (
                                <Lottie
                                  options={defaultOptions}
                                  height={"1.7rem"}
                                  width={"6rem"}
                                />
                              ) : (
                                "Request Payment"
                              )}
                            </Button>
                          ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}

      {/* Release Payment Modal */}
      {showReleaseModal && (
        <Dialog open={showReleaseModal}>
          <DialogContent className="max-w-lg ">
            <DialogHeader className="shadow-none px-6 py-4 rounded-t-xl">
              <DialogTitle>Confirm Payment Release</DialogTitle>
            </DialogHeader>
            <div className="text-primary text-sm md:text-base px-6">
              This action is{" "}
              <span className="font-semibold text-red">irreversible</span>. Once
              you release the payment, you cannot undo this action.
            </div>
            <DialogFooter className="flex justify-end gap-1 mt-3 px-6 pb-4">
              <Button
                size="sm"
                variant="outline"
                className="text-red border-red hover:bg-red/5 duration-300 ease-in-out transition-colors"
                onClick={() => setShowReleaseModal(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleReleasePayment}>
                {buttonLoading.release ? (
                  <Lottie
                    options={defaultOptions}
                    height={"1.7rem"}
                    width={"6rem"}
                  />
                ) : (
                  "Confirm Release"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Complete Milestone Modal */}
      {showCompleteModal && (
        <Dialog open={showCompleteModal}>
          <DialogContent className="max-w-lg ">
            <DialogHeader className="shadow-none px-6 py-4 rounded-t-xl">
              <DialogTitle>Mark Milestone as Completed?</DialogTitle>
            </DialogHeader>
            <div className="text-primary text-sm md:text-base px-6">
              This action is{" "}
              <span className="font-semibold text-red">irreversible</span>. Once
              marked completed, you cannot undo this action.
            </div>
            <DialogFooter className="flex justify-end gap-1 mt-3 px-6 pb-4">
              <Button
                size="sm"
                variant="outline"
                className="text-red border-red hover:bg-red/5 duration-300 ease-in-out transition-colors"
                onClick={() => setShowCompleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="w-[6rem]"
                onClick={handleMarkComplete}
              >
                {buttonLoading.markComplete ? (
                  <Lottie
                    options={defaultOptions}
                    height={"1.7rem"}
                    width={"6rem"}
                  />
                ) : (
                  "Confirm"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectMilestonesContent;
