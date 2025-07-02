import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";

// Contexts
import { useAuth } from "../../../contexts/authContext";

// Images
import project from "@/assets/project.webp";
import form from "@/assets/form.webp";
import star from "@/assets/star.webp";
import money from "@/assets/money.webp";

// Icons
import { RiPieChartLine } from "react-icons/ri";
import { PiFolders } from "react-icons/pi";
import { MdOutlinePaid } from "react-icons/md";
import { Eye, Star } from "lucide-react";

import { Card, CardContent, Skeleton } from "@mui/material";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
} from "@mui/material";

import { ChevronDown, Users, Clock } from "lucide-react";
import {
  LineChart,
  AreaChart,
  Area,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Insights = () => {
  const { user, getCurrencySymbolId } = useAuth();

  const [timeRangeData, setTimeRangeData] = useState("Weekly");
  const [timeRange, setTimeRange] = useState("Weekly");
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const [projects, setProjects] = useState([]); // Changed state name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    postedProjects: 0,
    savedFreelancers: 0,
    totalSpending: 0,
    feedbacks: 0,
    appliedProjects: 0,
    totalIncome: 0,
    savedProjects: 0,
  });

  const navigate = useNavigate();
  const handleCardClick = (link) => {
    if (link) navigate(link);
  };

  useEffect(() => {
    if (user && sessionStorage.getItem("NUserID")) {
      fetch(
        `https://paid2workk.solarvision-cairo.com/GetDashboardStats?NUserID=${sessionStorage.getItem(
          "NUserID"
        )}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setStats(data);
        })
        .catch((error) => {
          console.error("Error fetching stats:", error);
        });
    } else {
    }
  }, [user]);

  // Add this constant for empty state color
  const EMPTY_STATE_COLOR = "#E0E0E0";

  // Update the useEffect for pie chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.nUserID) return;

        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/api/Projects_/GetProjectStatusCounts?intervalType=${timeRange}&freelancer=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const statusCounts = data[0];
          const totalCount =
            statusCounts.applied +
            statusCounts.ongoing +
            statusCounts.completed +
            statusCounts.cancelled;

          // Always show all segments, but use gray color when total is zero
          setPieData(
            [
              {
                name: "Applied",
                value: statusCounts.applied || 0,
                color: totalCount === 0 ? EMPTY_STATE_COLOR : "#0b64fc",
              },
              {
                name: "Ongoing",
                value: statusCounts.ongoing || 0,
                color: totalCount === 0 ? EMPTY_STATE_COLOR : "#9c27b0",
              },
              {
                name: "Completed",
                value: statusCounts.completed || 0,
                color: totalCount === 0 ? EMPTY_STATE_COLOR : "#18a86b",
              },
              {
                name: "Cancelled",
                value: statusCounts.cancelled || 0,
                color: totalCount === 0 ? EMPTY_STATE_COLOR : "#db3030",
              },
            ].map((segment) => ({
              ...segment,
              // If total is zero, set value to 1 for visual display but keep actual value for tooltip
              displayValue: totalCount === 0 ? 1 : segment.value,
              value: segment.value,
            }))
          );
        } else {
          // Default empty state with equal segments
          setPieData([
            {
              name: "Applied",
              value: 0,
              displayValue: 1,
              color: EMPTY_STATE_COLOR,
            },
            {
              name: "Ongoing",
              value: 0,
              displayValue: 1,
              color: EMPTY_STATE_COLOR,
            },
            {
              name: "Completed",
              value: 0,
              displayValue: 1,
              color: EMPTY_STATE_COLOR,
            },
            {
              name: "Cancelled",
              value: 0,
              displayValue: 1,
              color: EMPTY_STATE_COLOR,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
        // Show empty state with equal segments on error
        setPieData([
          {
            name: "Applied",
            value: 0,
            displayValue: 1,
            color: EMPTY_STATE_COLOR,
          },
          {
            name: "Ongoing",
            value: 0,
            displayValue: 1,
            color: EMPTY_STATE_COLOR,
          },
          {
            name: "Completed",
            value: 0,
            displayValue: 1,
            color: EMPTY_STATE_COLOR,
          },
          {
            name: "Cancelled",
            value: 0,
            displayValue: 1,
            color: EMPTY_STATE_COLOR,
          },
        ]);
      }
    };

    fetchData();
  }, [user, timeRange]);

  //  Fetch Line Data
  useEffect(() => {
    const fetchLineData = async () => {
      try {
        // Simulated fetch or replace with actual endpoint
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/api/Wallet/credit-debit-history/${sessionStorage.getItem(
            "NUserID"
          )}?timePeriod=${timeRangeData}`
        );
        const result = await response.json();
        setLineData(result);
      } catch (err) {
        console.error("Error fetching line chart data", err);
      }
    };

    fetchLineData();
  }, [timeRangeData]);

  useEffect(() => {
    if (!user?.nUserID) return; // Exit if user or user ID is not available

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null); // Reset any errors before starting the fetch

        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/api/Projects_/GetTop10appliedProjectDetails?userid=${sessionStorage.getItem(
            "NUserID"
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        // Sort by date (latest first) and take top 10
        const sortedProjects = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by created date (latest first)
          .slice(0, 10); // Get only the top 10 projects

        // Set applied projects directly without sorting
        setProjects(sortedProjects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]); // Re-run effect when `user` changes

  const cards = [
    {
      id: 1,
      title: "Applied Projects  ",
      amount: stats.appliedProjects,
      image: form,

      action: "Refresh",
      icon: <RiPieChartLine />,
      color: "sky",
      bgColor: "bg-blue/20",
      link: "/dashboard/projects/applied-projects",
    },
    {
      id: 2,
      title: "Saved Projects",
      amount: stats.savedProjects,
      image: project,
      action: "Show all invoices",
      icon: <PiFolders />,
      color: "purple",
      bgColor: "bg-red/20",
      link: "/dashboard/saved/projects",
    },
    {
      id: 4,
      title: "Total Income",
      amount: `${getCurrencySymbolId(user?.currency)} ${stats.totalIncome}`,
      action: "Withdraw now",
      image: money,
      icon: <MdOutlinePaid />,

      color: "green",
      bgColor: "bg-green/20",
      link: "/dashboard/payments/my-wallet",
    },
    {
      id: 3,
      title: "Feedback  ",
      amount: stats.feedbackCount,
      image: star,
      action: "Refresh",
      icon: <Star />,

      color: "gold",
      bgColor: "bg-gold/20",
      link: "/dashboard/feedbacks/client-feedbacks",
    },
  ];

  return (
    <div className="">
      {loading ? (
        <>
          {/* Top Greeting Skeleton */}
          <div className="px-6">
            <Skeleton variant="text" width={200} height={40} />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 pt-10">
            {[...Array(4)].map((_, idx) => (
              <Skeleton
                key={idx}
                variant="rectangular"
                height={160}
                className="rounded-lg"
              />
            ))}
          </div>

          {/* Charts Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            {[...Array(2)].map((_, idx) => (
              <Skeleton
                key={idx}
                variant="rectangular"
                height={300}
                className="rounded-lg"
              />
            ))}
          </div>

          {/* Table Section Skeleton */}
          <div className="p-6 pr-10 pl-2">
            <Skeleton variant="text" width={180} height={30} sx={{ mb: 2 }} />
            <TableContainer
              sx={{
                borderRadius: 2,
                paddingBottom: "1rem",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {[...Array(4)].map((_, idx) => (
                      <TableCell key={idx}>
                        <Skeleton variant="text" width={100} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(5)].map((_, rowIdx) => (
                    <TableRow key={rowIdx}>
                      {[...Array(4)].map((_, colIdx) => (
                        <TableCell key={colIdx}>
                          <Skeleton variant="text" height={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        <>
         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 pt-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`relative overflow-hidden border transition-all rounded-xl p-4 flex flex-col gap-2 cursor-pointer shadow-lg ${
                  card.color === "purple"
                    ? "border-purple/20  hover:shadow-purple/15"
                    : card.color === "sky"
                    ? "border-sky-600/20  hover:shadow-sky-600/15"
                    : card.color === "green"
                    ? "border-green/20  hover:shadow-green/15"
                    : card.color === "gold"
                    ? "border-gold/20  hover:shadow-gold/15"
                    : ""
                } transition-all duration-300 ease-in-out `}
                onClick={() => handleCardClick(card.link)}
              >
                {" "}
                <div
                  className={
                    `absolute inset-0 w-full h-full z-10 ` +
                    (card.color === "purple"
                      ? "bg-gradient-to-tl from-purple-200/75 to-white/0"
                      : card.color === "sky"
                      ? "bg-gradient-to-tl from-sky-200/75 to-white/0"
                      : card.color === "green"
                      ? "bg-gradient-to-tl from-green-200/75 to-white/0"
                      : card.color === "gold"
                      ? "bg-gradient-to-tl from-yellow-200/75 to-white/0"
                      : "")
                  }
                ></div>
                <div className="absolute -bottom-5 -right-5">
                  {/* Use a fixed set of gradient classes instead of dynamic */}

                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-24 -rotate-12 "
                  />
                </div>
                <div className="flex flex-col items-start gap-1 ">
                  <span
                    className={`text-2xl font-bold bg-clip-text text-black`}
                  >
                    {card.amount}
                  </span>{" "}
                  <span className="text-sm text-black">{card.title}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Graphs  */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Payments Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-0">
                <div className="flex justify-between items-center px-4 pt-2 pb-1">
                  <h2 className="text-sm font-medium text-gray-800">
                    Payments
                  </h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="xs"
                        className="flex items-center text-primary bg-white hover:bg-gray-100 border border-gray-300 rounded-md px-3 py-1 font-normal text-xs transition"
                      >
                        {timeRangeData}
                        <ChevronDown className="ml-2 w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {["Weekly", "Monthly", "Yearly"].map((range) => (
                        <DropdownMenuItem
                          key={range}
                          onClick={() => setTimeRangeData(range)}
                        >
                          {range}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Edge-to-edge Chart */}
                <div className="w-full pt-1">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart
                      data={lineData}
                      margin={{ top: 10, right: 20, left: 5, bottom: 0 }} // ↓ Reduced left margin
                    >
                      <defs>
                        <linearGradient
                          id="creditGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#18a86b"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="#18a86b"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="debitGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#db3030"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="100%"
                            stopColor="#db3030"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        stroke="#E5E7EB"
                      />
                      <YAxis
                        width={40} // ↓ Reduced width of Y axis labels
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        tickMargin={5} // ↓ Slight breathing room between ticks and axis
                        stroke="#E5E7EB"
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                          border: "none",
                        }}
                        formatter={(value, name) => [
                          value,
                          name === "creditTotal" ? "Credited" : "Debited",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="creditTotal"
                        stroke="#18a86b"
                        strokeWidth={2}
                        fill="url(#creditGradient)"
                        dot={{ r: 3 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="debitTotal"
                        stroke="#db3030"
                        strokeWidth={2}
                        fill="url(#debitGradient)"
                        dot={{ r: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </div>

            {/* My Projects Card (unchanged except for consistent spacing) */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-0">
                <div className="flex justify-between items-center px-4 pt-2 pb-1">
                  <h2 className="text-sm font-medium text-gray-800">
                    My Projects
                  </h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="xs"
                        className="flex items-center text-primary bg-white hover:bg-gray-100 border border-gray-300 rounded-md px-3 py-1 font-normal text-xs transition"
                      >
                        {timeRange}
                        <ChevronDown className="ml-2 w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {["Weekly", "Monthly", "Yearly"].map((range) => (
                        <DropdownMenuItem
                          key={range}
                          onClick={() => setTimeRange(range)}
                        >
                          {range}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center px-4 pt-2 pb-5">
                  <ResponsiveContainer width={230} height={210}>
                    <PieChart>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload?.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
                                <p className="font-semibold text-gray-800">
                                  {data.name}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Pie
                        data={pieData}
                        dataKey="displayValue"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            className="hover:opacity-80 transition-opacity duration-200"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="md:ml-6 mt-5 md:mt-0 grid grid-cols-2 md:grid-cols-1 gap-3 max-w-xs">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center group">
                        <div
                          className="w-4 h-4 rounded-full mr-3 shadow-sm group-hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Math.round(item.value)} projects
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>
          </div>

          <div className="py-6">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "500",
                pl: 0.5,
                mb: 1,
                fontSize: "1rem",
                color: "black",
              }}
            >
              Recently Applied
            </Typography>
            <div className="overflow-auto md:overflow-visible">
              <div className="border rounded-xl overflow-hidden shadow-sm w-full">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue/5 border-b">
                      <tr className="bg-gradient-to-t from-navy to-blue-800 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-4 text-center text-xs sm:text-sm font-semibold text-white tracking-wider">
                          Proposals
                        </th>
                        <th className="px-6 py-4 text-right text-xs sm:text-sm font-semibold text-white tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray">
                      {projects.map((project) => (
                        <tr
                          key={project.nProjectId}
                          className="group hover:bg-muted-foreground/5 bg-white hover:rounded-xl transition-all duration-300 ease-in-out"
                        >
                          {/* Project Info */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-black text-sm">
                                {project.title}
                              </span>
                              <span className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                                <span className="text-black">
                                  {getCurrencySymbolId(project.currency)}{" "}
                                  {project.budget} - {project.maxBudget}
                                </span>
                                <span className="mx-1 text-[11px] flex items-center">
                                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                  Applied {moment(project.aplliedOn).fromNow()}
                                </span>
                              </span>
                            </div>
                          </td>

                          {/* Client Info */}
                          <td className="px-6 py-4">
                            <div
                              className="flex items-center cursor-pointer"
                              onClick={() => {
                                navigate("/user/details", {
                                  state: {
                                    expertId: project.clientId,
                                    role: "client",
                                  }, // Pass ID through state
                                });
                              }}
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={project.clientPhoto}
                                  alt={project.clientName}
                                />
                                <AvatarFallback>
                                  {project.clientName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="ml-2 text-sm hidden md:block">
                                {project.clientName}
                              </span>
                            </div>
                          </td>

                          {/* Proposals */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center items-center text-black/75 text-sm gap-1 ">
                              <Users className="w-4 h-4" />
                              <span className="flex items-center gap-0.5">
                                {project.appliedCount}
                                <span className="hidden md:block pl-1">
                                  {project.appliedCount === "1"
                                    ? "Proposal"
                                    : "Proposals"}
                                </span>
                              </span>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4 ">
                            <Box className="flex items-center justify-end text-black/75 text-sm gap-1 cursor-pointer">
                              <Button
                                size="sm"
                                className="flex items-center gap-1 text-xs justify-center h-7 font-normal py-0.5 px-2"
                                onClick={() => {
                                  window.location.href = `/projects/details/${project.nProjectId}`;
                                }}
                              >
                                <Eye className="h-3 w-3" />
                                <span>View</span>
                              </Button>
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;
