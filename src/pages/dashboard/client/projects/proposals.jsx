import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { useAuth } from "../../../../contexts/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  CardActions,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useChat } from "../../../../contexts/chatContext";

// const getCurrencySymbolId = (currencyCode) => {
//   switch (currencyCode) {
//     case "1":
//       return "USD ($)";
//     case "3":
//       return "EUR (€)";
//     case "4":
//       return "GBP (£)";
//     case "2":
//       return "INR (₹)";
//     default:
//       return "INR (₹)";
//   }
// };

const Proposals = () => {
  const location = useLocation();
  const projectId = location.state?.projectId || "";
  const { user, getCurrencySymbolId } = useAuth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(projectId);
  const [sortBy, setSortBy] = useState("rating");
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [proposalModal, setProposalModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState({});
  const { awardedProject } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch projects from API
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/api/Projects_/GetMYProject?userid=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (value) {
      // Fetch proposals based on selected project ID
      const fetchProposals = async () => {
        setLoadingProposals(true);
        try {
          const response = await fetch(
            `https://paid2workk.solarvision-cairo.com/GetBid?projectId=${value}`
          );
          const data = await response.json();
          setProposals(data);
        } catch (error) {
          console.error("Error fetching proposals:", error);
          setProposals([]);
        } finally {
          setLoadingProposals(false);
        }
      };

      fetchProposals();
    } else {
      const fetchProposals = async () => {
        setLoadingProposals(true);
        try {
          const response = await fetch(
            `https://paid2workk.solarvision-cairo.com/GetBidTop10?clientId=${sessionStorage.getItem(
              "NUserID"
            )}`
          );
          const data = await response.json();
          setProposals(data);
        } catch (error) {
          console.error("Error fetching proposals:", error);
          setProposals([]);
        } finally {
          setLoadingProposals(false);
        }
      };

      fetchProposals();
    }
  }, [value]);

  const filteredProposals = proposals.sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price")
      return (
        parseInt(b.bidAmount.replace(/[^0-9.-]+/g, "")) -
        parseInt(a.bidAmount.replace(/[^0-9.-]+/g, ""))
      );
    return 0;
  });

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

  return (
    <div className="pb-10">

      <div className="mt-6">
        <div className="flex justify-between mb-6">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[250px] justify-between bg-white border-gray text-black hover:shadow hover:border-black/10 hover:bg-gray hover:brightness-105 duration-300 ease-in-out transition-all text-nowrap truncate"
              >
                <span className="max-w-[200px] truncate font-normal">
                  {value
                    ? projects.find((project) => project.nProjectId === value)
                        ?.title
                    : "Select project..."}
                </span>

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command className="max-w-[250px]">
                <CommandInput placeholder="Search project..." />
                <CommandList>
                  {loadingProjects ? (
                    <CommandEmpty>Loading projects...</CommandEmpty>
                  ) : (
                    <>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {projects.map((project) => (
                          <CommandItem
                            key={project.nProjectId}
                            value={project.nProjectId}
                            onSelect={(currentValue) => {
                              if (currentValue !== value) {
                                setValue(project.nProjectId); // Set the selected project ID
                              } else {
                                setValue(""); // Reset value if the same project is selected again
                              }
                              setOpen(false); // Close the popover after selection
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === project.nProjectId
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {project.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {loadingProposals ? (
          // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
              >
                <CardHeader
                  avatar={
                    <Skeleton variant="circular" width={40} height={40} />
                  }
                  title={<Skeleton variant="text" width="60%" />}
                  subheader={<Skeleton variant="text" width="40%" />}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                    </Avatar>
                    <Box>
                      <Skeleton variant="text" width={120} height={24} />
                      <Skeleton variant="text" width={80} height={18} />
                    </Box>
                  </Box>

                  <Skeleton
                    variant="rectangular"
                    height={60}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />

                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="rounded"
                        width={60}
                        height={24}
                      />
                    ))}
                  </Box>
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Bid Amount
                    </Typography>
                    <Skeleton variant="text" width={80} height={24} />
                  </Box>
                  <Skeleton variant="text" width={100} height={20} />
                </CardActions>
              </Card>
            ))}
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="w-full flex justify-center items-center h-20 text-sm text-black">
            No proposals found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProposals.map((proposal) => (
              <Card
                key={proposal.id}
                className="flex flex-col cursor-pointer p-4 space-y-4 hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  setSelectedProposal(proposal);
                  setProposalModal(true);
                }}
              >
                {/* Header */}
                <CardHeader className="p-0 space-y-1">
                  <CardTitle className="text-base sm:text-lg font-medium text-black truncate">
                    {proposal.projectTitle}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                    Bid placed on{" "}
                    {new Date(proposal.bidTimestamp).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </CardDescription>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-0 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                      <AvatarImage
                        src={proposal.photopath}
                        alt={proposal.username}
                      />
                      <AvatarFallback>
                        {proposal.username ? proposal.username.charAt(0) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <div className="text-sm sm:text-base font-medium text-black truncate">
                        {proposal?.username || "Unknown Freelancer"}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        {proposal.rating
                          ? `Rating: ${proposal.rating}/5`
                          : "New Joinee"}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-black line-clamp-3 break-words">
                    {proposal.bidDescription}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {proposal.skill ? (
                      proposal.skill.split(",").map((skill, index) => (
                        <Badge
                          key={index}
                          variant="default"
                          className="text-xs sm:text-sm"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="default">No Skills</Badge>
                    )}
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-0 flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm text-black">
                      Bid Amount
                    </span>
                    <span className="text-sm font-medium text-black">
                      {getCurrencySymbolId(proposal.currency)}
                      {proposal.bidAmount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-black whitespace-nowrap">
                    Delivery:{" "}
                    {proposal.finishDate?.split("d").join(" D") ||
                      "Not Specified"}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Edit Modal */}
      {proposalModal && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 md:px-0">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90dvh] overflow-auto motion-scale-in-[0.50] motion-translate-x-in-[0%] motion-translate-y-in-[150%] motion-opacity-in-[0%] motion-duration-[300ms]">
            <div className="sticky top-0 bg-white border-b border-grey flex justify-between items-center px-8 py-3 z-30">
              <h2 className="text-xl font-medium">Proposal</h2>
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
                <CardTitle className="text-lg font-medium text-black">
                  {selectedProposal.projectTitle}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
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
                  <Avatar className="h-20 w-20 mr-4">
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
                    <div className="font-medium">
                      {selectedProposal?.username || "Unknown Freelancer"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedProposal.rating
                        ? `Rating: ${selectedProposal.rating}/5`
                        : "New Joinee"}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-black mb-4 break-words">
                  {selectedProposal.bidDescription}
                </p>
                <div className="flex flex-wrap gap-2 mb-0">
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
                  <h2 className="text-sm text-black">Bid Amount</h2>
                  <div className="text-sm font-medium text-black">
                    {getCurrencySymbolId(selectedProposal.currency)}
                    {selectedProposal.bidAmount}
                  </div>
                </div>
                <div className="text-sm text-black">
                  Delivery:{" "}
                  {selectedProposal?.finishDate?.split("d").join(" D") ||
                    "Not Specified"}
                </div>
              </CardFooter>
            </div>
            <div className="sticky bottom-0 flex justify-end bg-white px-8 py-5 gap-3 border-t border-gray">
              {selectedProposal.bidStatus === "Awarded" ? (
                <button
                  className="px-6 py-1.5 text-sm text-white bg-blue rounded-md hover:brightness-125 duration-300"
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
                  className="px-6 py-1.5 text-sm text-white bg-blue rounded-md hover:brightness-125 duration-300"
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

export default Proposals;
