import { useEffect, useRef, useState } from "react";
import { useChat } from "../../contexts/chatContext";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  FileIcon,
  Download,
  ChevronRight,
  Users,
  FileText,
  Star,
} from "lucide-react";
import { formatDistanceToNow } from "../../lib/utils";
import { Skeleton, Tooltip } from "@mui/material";
import { saveAs } from "file-saver";
import { CreateQuotationModal } from "./create-quotation-modal";
import { useNavigate } from "react-router-dom";

import { Card } from "../ui/card";
import { useAuth } from "../../contexts/authContext";

const getTime = (type) => {
  switch (type) {
    case "0":
      return true;
    case "1":
      return false;
    default:
      return true;
  }
};

const getJobType = (type) => {
  switch (type) {
    case "0":
      return "Hourly Rate";
    case "1":
      return "Fixed Price";
    default:
      return "Hourly Rate";
  }
};

const ChatMessages = ({ onViewQuotation, handlePaymentButton }) => {
  const { getCurrencySymbolId } = useAuth();
  const { messages, activeContact, refetchMilestone } = useChat();
  const scrollRef = useRef(null);
  const [showCreateQuotationModal, setShowCreateQuotationModal] =
    useState(false);
  const [milestoneDetails, setMilestoneDetails] = useState({}); // State to store milestone details
  const navigate = useNavigate();

  const getFileName = (file) => {
    try {
      const fileurl = file[0];
      const name = fileurl.split("/").pop().split("_").pop();
      return name;
    } catch (error) {
      console.error("Error naming file:", error);
      return "Attachment";
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [messages]);

  useEffect(() => {
    const fetchMilestoneDetails = async () => {
      // Reset milestone details when refetchMilestone changes
      if (refetchMilestone) {
        setMilestoneDetails({});
      }

      const uniqueMilestoneIds = [
        ...new Set(
          messages
            .filter(
              (msg) =>
                (msg?.type === "quotation" || msg?.type === "response") &&
                msg?.milestoneId
            )
            .map((msg) => msg.milestoneId)
        ),
      ];

      const newMilestoneDetails = { ...milestoneDetails };

      for (const milestoneId of uniqueMilestoneIds) {
        // Remove the continue check to force re-fetch when refetchMilestone changes
        try {
          const response = await fetch(
            `https://paid2workk.solarvision-cairo.com/api/Quotation/GetQuotations?NMilestoneId=${milestoneId}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch milestone ${milestoneId}`);
          }

          const data = await response.json();

          if (data.length > 0) {
            newMilestoneDetails[milestoneId] = data[0];
          }
        } catch (error) {
          console.error(`Error fetching milestone ${milestoneId}:`, error);
        }
      }

      setMilestoneDetails((prev) => ({ ...prev, ...newMilestoneDetails }));
    };

    if (
      messages.some(
        (msg) => msg?.type === "quotation" || msg?.type === "response"
      )
    ) {
      fetchMilestoneDetails();
    }
  }, [messages, refetchMilestone]); // Keep both dependencies

  const renderMessageContent = (message) => {
    switch (message?.type) {
      case "text":
        return <p className="text-sm">{message.content}</p>;

      case "paymentStatus":
        return <p className="text-sm font-medium">{message.content}</p>;

      case "feedback":
        const userW = message.sender === sessionStorage.getItem("NUserID");
        return (
          <div
            className={`${
              userW ? "rounded-l-lg " : "rounded-r-lg"
            } border border-muted-foreground/20 bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden`}
          >
            {/* Header Section */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gold/5 hidden sm:flex items-center justify-center">
                    <Star className="h-4 w-4 text-gold" />
                  </div>

                  <h3 className="font-medium text-sm md:text-base">Feedback</h3>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-4 pt-4 pb-2 flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < message.rating ? "text-gold fill-gold" : "text-gray"
                  }`}
                />
              ))}<span className="pl-2 font-medium text-muted-foreground text-sm">{(message.rating).toFixed(1)}</span>
            </div>
            <div className="p-2 border rounded-md m-2">
              <p className="text-sm">{message.description}</p>
            </div>
          </div>
        );

      case "quotation":
        const details = milestoneDetails[message.milestoneId];
        const isUser = message.sender === sessionStorage.getItem("NUserID");
        return (
          <div
            className={`${
              isUser ? "rounded-l-lg " : "rounded-r-lg"
            } border border-muted-foreground/20 bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden`}
          >
            {/* Header Section */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue/5 hidden sm:flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue" />
                  </div>
                  {!details ? (
                    <Skeleton variant="text" width={100} height={20} />
                  ) : (
                    <h3 className="font-medium text-sm md:text-base">
                      Quotation
                    </h3>
                  )}
                </div>

                {!details ? (
                  <Skeleton variant="rectangular" width={80} height={24} />
                ) : (
                  <span
                    className={`px-1 py-0 md:px-2 md:py-0.5 rounded-full text-xs font-medium bg-gradient-to-r border
                    ${
                      details?.status === "Approved" ||
                      details?.status === "Make Payment"
                        ? " border-green text-green"
                        : details?.status === "Pending"
                        ? " border-gold text-gold"
                        : details?.status === "Rejected"
                        ? "border-red text-red"
                        : "border-blue text-blue"
                    }`}
                  >
                    {details?.status === "Make Payment"
                      ? message.freelancerId ===
                        sessionStorage.getItem("NUserID")
                        ? "Approved"
                        : details?.status
                      : details?.status || "Pending"}
                  </span>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              {/* Job Type */}
              <div className="text-sm text-muted-foreground mb-2">
                {!details ? (
                  <Skeleton variant="text" width={100} height={18} />
                ) : (
                  `${details?.title} • ${getJobType(details?.paidBy)}`
                )}
              </div>

              {/* Quotation Details */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {["Milestone", "Time", "Amount"].map((label, index) => (
                  <div
                    key={index}
                    className="bg-slate-50/80 backdrop-blur-sm p-2 rounded-lg text-center"
                  >
                    <div className="text-xs text-slate-500 mb-1">{label}</div>
                    {!details ? (
                      <Skeleton variant="text" width={40} height={20} />
                    ) : (
                      <div className="font-semibold text-xs md:text-base">
                        {label === "Milestone"
                          ? details?.milestones.length
                          : label === "Time"
                          ? `${Math.round(details?.totalTime)} ${
                              getTime(details?.paidBy)
                                ? `Hour${
                                    details?.totalTime === "1.00" ? "" : "s"
                                  }`
                                : `Day${
                                    details?.totalTime === "1.00" ? "" : "s"
                                  }`
                            }`
                          : `${getCurrencySymbolId(details?.currency)} ${
                              details?.totalAmount
                            }`}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* View Button */}
              {!details ? (
                <Skeleton variant="rectangular" width="100%" height={36} />
              ) : (
                <Button
                  size="xs"
                  className={`w-full text-blue bg-transparent hover:bg-transparent duration-300 ease-in-out ${
                    isUser ? "text-right" : "text-left"
                  }`}
                  onClick={() => onViewQuotation(details?.nMilestoneId)}
                >
                  View Details{" "}
                  <ChevronRight className="w-4 h-4 pl-0.5 pb-0.5" />
                </Button>
              )}
            </div>
          </div>
        );

      case "response":
        const ndetails = milestoneDetails[message.milestoneId];
        const nisUser = message.sender === sessionStorage.getItem("NUserID");
        return (
          <div className="relative mb-6 w-full">
            <div
              className={`rounded-lg border border-muted-foreground/20 bg-muted/50 backdrop-blur-sm shadow-sm overflow-hidden opacity-60 select-none cursor-default w-fit`}
            >
              {/* Header Section */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue/5 hidden sm:flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue" />
                    </div>
                    {!ndetails ? (
                      <Skeleton variant="text" width={100} height={20} />
                    ) : (
                      <h3 className="font-medium text-sm md:text-base">
                        Quotation
                      </h3>
                    )}
                  </div>

                  {!ndetails ? (
                    <Skeleton variant="rectangular" width={80} height={24} />
                  ) : (
                    <span
                      className={`px-1 py-0 md:px-2 md:py-0.5 rounded-full text-xs font-medium bg-gradient-to-r border
                    ${
                      ndetails?.status === "Approved" ||
                      ndetails?.status === "Make Payment"
                        ? " border-green text-green"
                        : ndetails?.status === "Pending"
                        ? " border-gold text-gold"
                        : ndetails?.status === "Rejected"
                        ? "border-red text-red"
                        : "border-blue text-blue"
                    }`}
                    >
                      {ndetails?.status === "Make Payment"
                        ? message.freelancerId ===
                          sessionStorage.getItem("NUserID")
                          ? "Approved"
                          : ndetails?.status
                        : ndetails?.status || "Pending"}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Job Type */}
                <div className="text-sm text-muted-foreground mb-2">
                  {!ndetails ? (
                    <Skeleton variant="text" width={100} height={18} />
                  ) : (
                    `${ndetails?.title} • ${getJobType(ndetails?.paidBy)}`
                  )}
                </div>

                {/* Quotation Details */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["Milestone", "Time", "Amount"].map((label, index) => (
                    <div
                      key={index}
                      className="bg-slate-50/80 backdrop-blur-sm p-2 rounded-lg text-center"
                    >
                      <div className="text-xs text-slate-500 mb-1">{label}</div>
                      {!ndetails ? (
                        <Skeleton variant="text" width={40} height={20} />
                      ) : (
                        <div className="font-semibold text-xs md:text-base">
                          {label === "Milestone"
                            ? ndetails?.milestones.length
                            : label === "Time"
                            ? `${Math.round(ndetails?.totalTime)} ${
                                getTime(ndetails?.paidBy)
                                  ? `Hour${
                                      ndetails?.totalTime === "1.00" ? "" : "s"
                                    }`
                                  : `Day${
                                      ndetails?.totalTime === "1.00" ? "" : "s"
                                    }`
                              }`
                            : `${getCurrencySymbolId(ndetails?.currency)} ${
                                ndetails?.totalAmount
                              }`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className={`flex ${
                nisUser ? " justify-end right-0" : ""
              } absolute -bottom-4 w-full overflow-visible text-nowrap`}
            >
              <h3
                className={`${
                  nisUser
                    ? "bg-blue text-white text-right right-0 "
                    : "bg-white border"
                } rounded-lg p-2 sm:p-3 font-medium  shadow-md text-sm`}
              >{`${
                nisUser
                  ? "You have"
                  : `${(activeContact?.name).split(" ")[0]} has`
              }  ${message.content}.`}</h3>
            </div>
          </div>
        );

      case "payment":
        const pdetails = milestoneDetails[message.milestoneId];
        const isFreelancer =
          message?.freelancerId === sessionStorage.getItem("NUserID");
        return (
          <div className=" p-0.5 rounded-md flex flex-col gap-2">
            <p
              className={`text-xs sm:text-sm ${!isFreelancer && "font-medium"}`}
            >
              {isFreelancer
                ? "Waiting for client to proceed with payment..."
                : message.content}
            </p>
            {!isFreelancer && (
              <>
                <Button
                  size="xs"
                  variant={`${
                    message.receiver === sessionStorage.getItem("NUserID")
                      ? "default"
                      : "outline"
                  }`}
                  className={`${
                    message.receiver !== sessionStorage.getItem("NUserID") &&
                    "bg-white"
                  }`}
                  onClick={() => {
                    handlePaymentButton(pdetails?.nMilestoneId, message?.id);
                  }}
                >
                  Make Payment
                </Button>
              </>
            )}
          </div>
        );

      case "quotation_request":
        return (
          <div className=" p-0.5 rounded-md flex flex-col gap-2">
            <p className="text-xs sm:text-sm font-medium">
              Requested Quotation for project.
            </p>
            {message?.receiver === sessionStorage.getItem("NUserID") && (
              <>
                <Button
                  size="xs"
                  onClick={() => setShowCreateQuotationModal(true)}
                >
                  Create Quotation
                </Button>
              </>
            )}
          </div>
        );

      case "file":
        return (
          <div className="max-w-48 sm:max-w-xs xl:max-w-md">
            <div className="mb-2">
              <p className="text-sm">{message.content}</p>
            </div>
            <div className="bg-muted p-2 sm:p-3 rounded-md flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap cursor-pointer">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden bg-background">
                <FileIcon className="absolute inset-0 m-auto h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-muted-foreground font-medium text-xs sm:text-sm truncate">
                  {getFileName(message?.attachment) || "Attachment"}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Tooltip title="Download">
                  <Button
                    size="sm"
                    className="flex-1 sm:flex-initial bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground/75 gap-2"
                    onClick={() => handleDownload(message?.attachment[0])}
                  >
                    <Download />{" "}
                    <span className="sm:hidden font-medium ">Download</span>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        );

      case "jobInvite":
        const user = message.sender === sessionStorage.getItem("NUserID");
        return (
          <Card
            className={`border-muted-foreground/20 shadow-sm  cursor-default hover:shadow-none max-w-[13rem] md:max-w-xs ${
              user
                ? "rounded-l-lg rounded-r-none"
                : "rounded-r-lg rounded-l-none"
            }`}
          >
            {/* Header Section */}
            <div className="px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue/5 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-primary/90 break-words">
                  {message.projectName}
                </h3>
              </div>
            </div>

            {/* Message Content */}
            <div className="px-4">
              <p className="text-sm text-muted-foreground break-words">{message.content}</p>
            </div>

            {/* Footer with View Button */}
            <div className={`px-4 w-full flex ${user ? "justify-end" : ""} `}>
              <Button
                size="sm"
                className={`gap-1 text-blue px-0 bg-white hover:bg-white`}
                onClick={() =>
                  navigate(`/projects/details/${message.projectId}`)
                }
              >
                <span>View</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        );

      case "projectAward":
        return (
          <div className="bg-secondary p-2 rounded-md">
            <div
              className={`flex flex-col mb-2 ${
                message.senderId === sessionStorage.getItem("NUserID")
                  ? "text-end"
                  : "text-start"
              }`}
            >
              <h4 className="font-medium text-xs sm:text-sm text-primary/90">
                {message.projectName}
              </h4>

              <span className="text-xs text-muted-foreground">
                {message.content}
              </span>
            </div>
            <Button
              size="xs"
              onClick={() => navigate(`/projects/details/${message.projectId}`)}
            >
              View
            </Button>
          </div>
        );

      case "send_new":
        return;

      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      const blob = await response.blob();
      saveAs(blob, fileUrl.split("/").pop().split("_").pop());
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-1.5 md:pt-4 ">
        {messages
          .filter((message) => message.type !== "send_new")
          .map((message, index) => {
            const isUser = message.sender === sessionStorage.getItem("NUserID");

            return (
              <div
                key={message.id}
                className={`relative flex pl-11 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]  ${
                    isUser ? "flex-row-reverse" : ""
                  }`}
                >
                  {!isUser && (
                    <Avatar className="h-8 w-8 flex-shrink-0 absolute bottom-1 left-0">
                      <AvatarImage
                        src={activeContact?.avatar}
                        alt={activeContact?.name}
                      />
                      <AvatarFallback>{activeContact?.name[0]}</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-md lg:max-w-xl flex justify-center gap-2 items-end group ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`rounded-lg ${
                        message.type !== "quotation" &&
                        message.type !== "jobInvite" &&
                        message.type !== "response" &&
                        message.type !== "feedback" &&
                        "p-2 sm:p-3"
                      }  w-fit ${
                        message.type === "quotation" ||
                        message.type === "jobInvite" ||
                        message.type === "feedback" ||
                        message.type === "response"
                          ? "bg-transparent"
                          : isUser
                          ? "bg-blue text-primary-foreground"
                          : "bg-muted/60 border"
                      }
                  ${
                    message.type === "quotation" ||
                    message.type === "jobInvite" ||
                    message.type === "feedback"
                      ? isUser
                        ? "border-r-4 border-blue"
                        : "border-l-4 border-muted-foreground"
                      : ""
                  }
                  
                  `}
                    >
                      {renderMessageContent(message)}
                    </div>
                    <div
                      className={`mt-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-in delay-500 ${
                        isUser ? "text-right" : ""
                      } ${message.type === "response" && "pb-16"}`}
                    >
                      {formatDistanceToNow(new Date(message.timestamp))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={scrollRef} />
      </div>

      {showCreateQuotationModal && (
        <CreateQuotationModal
          isOpen={showCreateQuotationModal}
          onClose={() => setShowCreateQuotationModal(false)}
        />
      )}
    </ScrollArea>
  );
};

export default ChatMessages;
