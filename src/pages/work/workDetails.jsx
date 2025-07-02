import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import BidModal from "./bidModal";
import { useAuth } from "../../contexts/authContext";
import axios from "axios";

// Icons
import { PiMoneyWavyFill } from "react-icons/pi";

// Slick Carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Bounce, toast } from "react-toastify";
import ProjectHeader from "./project/project-header";
import TabNavigation from "./project/tab-navigation";
import ProjectDetailsContent from "./project/project-details-content";
import ClientCard from "./project/client-card";
import ProjectProposalContent from "./project/project-proposals-content";
import ProjectMilestonesContent from "./project/project-milestones-content";
import ProjectReviewsContent from "./project/project-reviews-content";
import { Button } from "../../components/ui/button";

const WorkDetails = () => {
  const [project, setProject] = useState({});
  const [bidAmount, setBidAmount] = useState("1000");
  const [deliveryTime, setDeliveryTime] = useState("5");
  const [proposal, setProposal] = useState("");
  const [proposals, setProposals] = useState([]);
  const [currencyId, setCurrencyId] = useState("");
  const [applied, setApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobListings, setJobListings] = useState([]);
  const [saved, setSaved] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [client, setClient] = useState([]);
  const { user, getCurrencySymbolId, getCurrencySymbolName } = useAuth();

  const [activeTab, setActiveTab] = useState("Details");

  const auth = localStorage.getItem("authentication") === "true" ? true : false;

  const tabs = ["Details", "Proposals"];
  if (
    auth &&
    project.status !== "Cancelled" &&
    project.status !== "Posted" &&
    project.status !== "Open"
    // (project.freelancerId === sessionStorage.getItem("NUserID") ||
    //   project.clientId === sessionStorage.getItem("NUserID"))
  ) {
    tabs.push("Milestones", "Reviews");
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log(user);
  }, []);

  const navigate = useNavigate();

  const pathSegments = window.location.pathname.split("/");
  const projectId = pathSegments[pathSegments.indexOf("details") + 1];

  const transform = (node, children) => {
    const classMap = {
      h1: "text-base text-black font-semibold my-1",
      h2: "text-base text-black font-medium my-1",
      p: "text-black text-sm my-0 w-full",
      span: "text-black my-0 w-full",
      ul: "list-disc text-black pl-6 space-y-1 text-sm m-0 mt-1",
      ol: "list-decimal text-black pl-6 space-y-1 text-sm m-0 mt-1", // ✅ added ordered list styling
      li: "marker:text-black text-black text-sm my-0",
      a: "text-blue hover:text-blue/80 underline",
    };

    const tag = node.tagName?.toLowerCase();

    if (classMap[tag]) {
      return React.createElement(
        tag,
        {
          ...node.attributes,
          className: classMap[tag],
        },
        children
      );
    }

    return undefined; // Let Interweave handle tags not in classMap
  };

  const fetchJobListings = async (cId, currentProjectId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://paid2workk.solarvision-cairo.com/api/Projects_/GetClientProject?userid=${cId}`
      );

      // Filter out the current project by comparing the `nproject` IDs
      const filteredListings = response.data.filter(
        (job) => job.nProjectId !== currentProjectId
      );

      setJobListings(filteredListings); // Update the state with filtered data
    } catch (err) {
      console.error("Error fetching job listings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      console.error("Project ID is missing.");
      return;
    }

    setIsLoading(true);

    // Fetch project details

    let url = `https://paid2workk.solarvision-cairo.com/api/Projects_/GetProject?projectId=${projectId}`;

    if (auth) url += `&userid=${sessionStorage.getItem("NUserID")}`;
    let clientId = "";
    fetch(url)
      .then((response) => response.json())
      .then(([data]) => {
        setProject(data);

        if (data.bid_id !== null) {
          setApplied(true);
        }
        sessionStorage.setItem(
          "skillSearch",
          data.skill.split(",").slice(0, 1)[0]
        );
        clientId = data.clientId;
        sessionStorage.setItem("post", data.clientId);
        sessionStorage.setItem("projectId", data.nProjectId);
        sessionStorage.setItem("clientName", data.clientName);
      })
      .then(() => {
        fetch(
          `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?NUserId=${clientId}`
        )
          .then((response) => response.json())
          .then((data) => setClient(data[0]))
          .catch((error) =>
            console.error("Error fetching currency data:", error)
          );
      })
      .then(() => {
        fetchJobListings(clientId, projectId);
      })
      .catch((error) => console.error("Error fetching project details:", error))
      .finally(() => {
        setIsLoading(false);
      });

    // Fetch proposals for the project
    fetch(
      `https://paid2workk.solarvision-cairo.com/GetBid?projectId=${projectId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setProposals(data); // Assuming you have a state variable named `proposals`
        // console.log("Proposals fetched:", data);
      })
      .catch((error) => console.error("Error fetching proposals:", error));
  }, [saved, projectId]);

  useEffect(() => {
    // Second useEffect: Fetch job listings and similar jobs
    const cId = project.clientId;

    fetchJobListings(cId, projectId);
  }, [projectId]); // Re-run only when skillSelect changes

  const handleBidSubmission = (e) => {
    e.preventDefault();
    if (!bidAmount || !deliveryTime || !proposal || proposal.length < 30) {
      setAlertMsg(
        <Alert
          variant="filled"
          className="z-50 motion-translate-x-in-[10%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-duration-[300ms]/translate motion-duration-[300ms]/opacity motion-ease-spring-bounciest "
          severity="error"
        >
          Fill all the necessary details to place your bid.
        </Alert>
      );
      setTimeout(() => {
        setAlertMsg(null);
      }, 5000);
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
            <Alert
              variant="filled"
              className="z-50 motion-translate-x-in-[10%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-duration-[300ms]/translate motion-duration-[300ms]/opacity motion-ease-spring-bounciest "
              severity="success"
            >
              Bid Submitted Successfully.
            </Alert>
          );
          setTimeout(() => {
            setAlertMsg(null);
            window.location.reload();
          }, 1500);
        } else {
          setAlertMsg(
            <Alert
              variant="filled"
              className=" motion-translate-x-in-[10%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-duration-[300ms]/translate motion-duration-[300ms]/opacity motion-ease-spring-bounciest "
              severity="error"
            >
              An error occurred, please Try Again Later.
            </Alert>
          );
          setTimeout(() => {
            setAlertMsg(null);
          }, 5000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlertMsg(
          <Alert
            variant="filled"
            className=" motion-translate-x-in-[10%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-duration-[300ms]/translate motion-duration-[300ms]/opacity motion-ease-spring-bounciest "
            severity="error"
          >
            An error occurred. Please check the console for details.
          </Alert>
        );
        setTimeout(() => {
          setAlertMsg(null);
        }, 5000);
      });
  };

  const handleOpenModal = () => {
    if (!user) {
      navigate("/login");
    } else if (user && user.roleId === "0") {
      setAlertMsg(
        <Alert
          variant="filled"
          className=" motion-translate-x-in-[10%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-duration-[300ms]/translate motion-duration-[300ms]/opacity motion-ease-spring-bounciest "
          severity="error"
        >
          Client accounts cannot apply for projects.
        </Alert>
      );

      setTimeout(() => {
        setAlertMsg(null);
      }, 5000);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveJob = () => {
    if (!user) {
      navigate("/login");
    } else {
      const formData = new FormData();
      formData.append("FreelancerId", sessionStorage.getItem("NUserID"));
      formData.append("NProjectId", projectId);

      fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/SaveProject",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => {
          if (user && response.ok) {
            setSaved(!saved);
            // navigate("/navbar");
          } else {
            toast.error("Failed to save Job,", {
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
          }
        })
        .catch((error) => {
          console.error("Error saving job:", error);
          toast.error("An error occured while saving the job.", {
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
        });
    }
  };

  return (
    <>
      {project.status !== "Posted" &&
      (sessionStorage.getItem("roleId") === "1"
        ? project.freelancerId !== sessionStorage.getItem("NUserID")
        : project.clientId !== sessionStorage.getItem("NUserID")) ? (
        <div className="container mx-auto pt-28  p-4 h-dvh flex flex-col items-center justify-center">
          <div className="bg-white border shadow rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Project Already Allotted
            </h2>
            <p className="text-md text-muted-foreground">
              This project has been assigned to another freelancer. Please check
              other available projects.
            </p>
            <Button className="mt-6" onClick={() => navigate("/projects")}>
              Browse Other Projects
            </Button>
          </div>
        </div>
      ) : (
        <div className="container max-w-7xl mx-auto pt-28  p-4 min-h-screen">
          <div className=" mb-4">
            <ProjectHeader
              title={project.title}
              status={project.status}
              bids={proposals.length}
              isLoading={isLoading}
              applied={applied}
              handleOpenModal={handleOpenModal}
              user={user}
              handleSaveJob={handleSaveJob}
              project={project}
            />

            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-8 gap-6">
              <div className="md:col-span-2 xl:col-span-6">
                {activeTab === "Details" && (
                  <ProjectDetailsContent
                    project={project}
                    formation={transform}
                  />
                )}
                {activeTab === "Proposals" && (
                  <ProjectProposalContent
                    proposals={proposals}
                    clientId={project.clientId}
                    status={project.status}
                  />
                )}
                {activeTab === "Milestones" && (
                  <ProjectMilestonesContent project={project} />
                )}
                {activeTab === "Reviews" && (
                  <ProjectReviewsContent project={project} />
                )}
              </div>

              {/* Jobs from Client */}
              <div className="flex flex-col gap-6 md:col-span-1 xl:col-span-2">
                {client && <ClientCard client={client} />}
                {jobListings.length > 0 && (
                  <div className=" bg-white rounded-lg border p-4  h-fit">
                    <h3 className="text-base font-semibold text-black">
                      Other Listings from this Client
                    </h3>
                    <div className="mt-2">
                      {jobListings.slice(0, 5).map((job, idx) => (
                        <div key={idx} className="mt-3">
                          <a
                            href={`/projects/details/${job.nProjectId}`}
                            className=""
                          >
                            <h4 className="text-sm text-black line-clamp-1 hover:text-blue duration-300 ease-in-out">
                              {job.title}
                            </h4>
                          </a>{" "}
                          <div className="flex items-center gap-2 text-sm text-gray-950 mt-0.5">
                            <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <PiMoneyWavyFill className="text-xs" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs">
                                {getCurrencySymbolId(job.currency)} {job.budget}{" "}
                                – {job.maxBudget}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal */}

            <BidModal
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

            <div className="fixed z-50 right-4 top-28" style={{ zIndex: 2001 }}>
              <>{alertMsg}</>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkDetails;
