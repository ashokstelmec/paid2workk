import { Chip } from "@mui/material";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Check, Send, Star } from "lucide-react";
import { useEffect, useState } from "react";
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
export function ChatProfile({ contact, quotationDetails, sideProfileDetails }) {
  const [showInvite, setShowInvite] = useState(false);
  const {
    sendInvite,
    inviteLoading,
    setInviteLoading,
    handleContactClick,
    contacts,
    activeContact,
    sendMessage,
    sendMilestoneNotification,
    loadingChat,
  } = useChat();
  const { getCurrencySymbolId, getCurrencySymbolName, isLoggedIn } = useAuth();

  const [details, setDetails] = useState({
    receiverId: "",
    projectId: "",
    projectName: "",
    freelancerId: "",
  });
  const [buttonLoading, setButtonLoading] = useState({
    release: false,
    markComplete: false,
    request: false,
  });
  const [refresh, setRefresh] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const defaultOptionsButton = {
    loop: true,
    autoplay: true,
    animationData: lottieAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [projects, setProjects] = useState([]);

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

  useEffect(() => {
    fetchProjects();
  }, []);

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
            nProjectId: quotationDetails.nProjectId,
            nMilestoneId: quotationDetails.nMilestoneId,
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
        await sendMilestoneNotification(
          quotationDetails.title,
          "paymentReleased"
        );
        await sendMessage(
          `Payment Released for a Completed Milestone.`,
          "paymentReleased",
          null
        );
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
            nProjectId: quotationDetails.nProjectId,
            nMilestoneId: quotationDetails.nMilestoneId,
            nTaskId: taskId,
          }),
        }
      );
      await sendMilestoneNotification(
        "Completed a milestone. Please check and release payment.",
        "milestoneCompleted"
      );
      await sendMessage(
        "Completed a milestone. Please check and release payment.",
        "milestoneCompleted",
        null
      );
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
            nProjectId: quotationDetails.nProjectId,
            nMilestoneId: quotationDetails.nMilestoneId,
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
        await sendMilestoneNotification(
          quotationDetails.title,
          "releaseRequest"
        );
        await sendMessage(
          "Requested Payment release for a milestone Completion.",
          "requestPayment",
          null
        );
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

  const handleSubmit = async () => {
    const auth = localStorage.getItem("authentication") === "true" ? true : false;;
    if (!auth) {
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
    const contactId = `${details.projectId}_${sessionStorage.getItem(
      "NUserID"
    )}_${details.freelancerId}`;

    const inviteSuccess = await sendInvite(
      details.message,
      "jobInvite",
      null,
      details
    );

    if (inviteSuccess) {
      // Reset form only if invite was successful
      setDetails({
        receiverId: contact.forwardto,
        projectId: "",
        projectName: "",
        freelancerId: contact.forwardto,
      });
    }

    setInviteLoading({ load: true, complete: inviteSuccess });

    setTimeout(() => {
      setShowInvite(false);
      setInviteLoading({ load: false, complete: false });
    }, 1500);

    await handleContactClick(contacts.find((c) => c.id === contactId));
  };

  const inviteBox = () => {
    return (
      <>
        {showInvite && (
          <Dialog open={showInvite}>
            {!inviteLoading.load ? (
              <DialogContent className="max-h-[90dvh] w-[95vw] max-w-md sm:max-w-xl overflow-y-auto ">
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
                            freelancerId: contact.forwardto,
                            receiverId: contact.forwardto,
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
                        {projects.map((project) => (
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
                    {" "}
                    <div className="w-[9rem] h-[9-rem] overflow-hidden">
                      <div className="scale-[250%]">
                        <Lottie options={defaultOptions} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold pb-5 ">Sending Invite</h3>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 py-10 justify-center items-center">
                    {" "}
                    <Lottie
                      options={defaultOptions2}
                      height={"9rem"}
                      width={"9rem"}
                    />
                    <h3 className="text-xl font-bold pb-5 motion-scale-in-[0.85] motion-translate-x-in-[0%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-ease-spring-bouncier">
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

  return (
    <>
      {contact.button === false ? (
        <ScrollArea className="h-full border-r ">
          <div className="p-4 ">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback className="text-4xl">
                  {contact.name[0]}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-bold">{contact.name}</h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 px-2 pt-0.5">
                {sideProfileDetails?.bio}
              </p>
              {!loadingChat &&
                (sideProfileDetails?.roleId === "0" ? (
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold text-gray-800">
                        {sideProfileDetails?.totalproject}
                      </div>
                      <div className="text-gray-500">Projects</div>
                    </div>

                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold flex items-center justify-center text-gray-800">
                        <Star className="h-3 w-3 text-gold fill-gold" />
                        <span className="ml-1 text-gray-700 font-medium">
                          {sideProfileDetails?.rating || 0}
                        </span>
                      </div>
                      <div className="text-gray-500">Rating</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold text-gray-800">
                        {sideProfileDetails?.successRate}%
                      </div>
                      <div className="text-gray-500">Success</div>
                    </div>
                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold text-gray-800">
                        {sideProfileDetails?.experince}
                      </div>
                      <div className="text-gray-500">Years</div>
                    </div>
                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold text-gray-800">
                        {sideProfileDetails?.totalproject}
                      </div>
                      <div className="text-gray-500">Jobs</div>
                    </div>
                  </div>
                ))}
            </div>

            {contact.projectId === "null" &&
              sessionStorage.getItem("roleId") === "0" && (
                <>
                  {" "}
                  <Separator className="mb-3"></Separator>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => setShowInvite(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Job Invitation
                  </Button>
                </>
              )}
          </div>
        </ScrollArea>
      ) : (
        <ScrollArea className="h-full border-r ">
          <div className="p-4 ">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback className="text-4xl">
                  {contact.name[0]}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-bold">{contact.name}</h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 px-2 pt-0.5">
                {sideProfileDetails?.bio}
              </p>

              {!loadingChat &&
                (sideProfileDetails?.roleId === "0" ? (
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold text-gray-800">
                        {sideProfileDetails?.totalproject}
                      </div>
                      <div className="text-gray-500">Projects</div>
                    </div>

                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold flex items-center justify-center text-gray-800">
                        <Star className="h-3 w-3 text-gold fill-gold" />
                        <span className="ml-1 text-gray-700 font-medium">
                          {sideProfileDetails?.rating || 0}
                        </span>
                      </div>
                      <div className="text-gray-500">Rating</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold text-gray-800">
                        {sideProfileDetails?.successRate}%
                      </div>
                      <div className="text-gray-500">Success</div>
                    </div>
                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold text-gray-800">
                        {sideProfileDetails?.experince}
                      </div>
                      <div className="text-gray-500">Years</div>
                    </div>
                    <div className="bg-gray/40 rounded-lg p-2">
                      <div className="font-bold text-gray-800">
                        {sideProfileDetails?.totalproject}
                      </div>
                      <div className="text-gray-500">Jobs</div>
                    </div>
                  </div>
                ))}

              <Separator className="mb-3"></Separator>

              <div className="w-full space-y-4">
                {quotationDetails?.milestones.map((milestone, index) => (
                  <div key={index} className="border text-start rounded-md p-3">
                    <div className="flex justify-between items-center gap-1.5 mb-1">
                      <h2 className="font-medium">
                        {milestone.milestoneTitle}
                      </h2>
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
                    <p className="text-xs mb-2">{`${getCurrencySymbolId(
                      quotationDetails.currency
                    )}${milestone.amount} ${getCurrencySymbolName(
                      quotationDetails.currency
                    )}`}</p>

                    {milestone.status === "Completed" && (
                      <div className="flex flex-row items-center justify-center gap-1 w-full">
                        <Check className="text-green w-5 h-5" />
                        <h3 className="text-green font-medium text-sm">
                          Payment Released
                        </h3>
                      </div>
                    )}
                    {sessionStorage.getItem("roleId") === "0"
                      ? milestone.status !== "Completed" && (
                          <Button
                            className="w-full"
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
                            className="w-full"
                            onClick={() => {
                              setShowCompleteModal(true);
                              setTaskId(milestone.nTaskId);
                            }}
                          >
                            Mark Complete
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            size="sm"
                            onClick={() => {
                              handleRequestPayment(milestone.nTaskId);
                            }}
                          >
                            {buttonLoading.request ? (
                              <Lottie
                                options={defaultOptionsButton}
                                height={"1.7rem"}
                                width={"6rem"}
                              />
                            ) : (
                              "Request Payment"
                            )}
                          </Button>
                        ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
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
      {inviteBox()}
    </>
  );
}
