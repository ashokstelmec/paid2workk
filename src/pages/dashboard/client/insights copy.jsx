import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";

// Images
import project from "@/assets/project.webp";
import heart from "@/assets/heart.webp";
import star from "@/assets/star.webp";
import money from "@/assets/money.webp";

// Icons
import { MdOutlinePaid } from "react-icons/md";

import { PiFolders } from "react-icons/pi";
import {
  Briefcase,
  Clock,
  DollarSign,
  Eye,
  Folders,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CardContent, Box, Skeleton } from "@mui/material";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Badge,
} from "@mui/material";

import { ChevronDown, Users } from "lucide-react";

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
import { Card } from "@/components/ui/card";

const Insights = () => {
  const { user, isLoggedIn, getCurrencySymbolId, getCurrencySymbolName } =
    useAuth(); // Add getCurrencySymbol from useAuth
  const [projects, setProjects] = useState([]);
  const [timeRangeData, setTimeRangeData] = useState("Weekly");
  const [timeRange, setTimeRange] = useState("Weekly");
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleCardClick = (link) => {
    if (link) navigate(link);
  };

  const chartConfig = {
    creditTotal: {
      label: "Credited",
      color: "#10B981",
    },
    debitTotal: {
      label: "Debited",
      color: "#EF4444",
    },
  };

  const [stats, setStats] = useState({
    postedProjects: 0,
    savedFreelancers: 0,
    totalSpending: 0,
    feedbacks: 0,
    appliedProjects: 0,
    totalIncome: 0,
  });

  useEffect(() => {
    const auth =
      localStorage.getItem("authentication") === "true" ? true : false;
    if (auth && sessionStorage.getItem("NUserID")) {
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
          console.error("Error fetching stats:", error); // Log any error
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
          `https://paid2workk.solarvision-cairo.com/api/Projects_/GetProjectStatusCounts?intervalType=${timeRange}&client=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const statusCounts = data[0];
          const totalCount =
            statusCounts.posted +
            statusCounts.ongoing +
            statusCounts.completed +
            statusCounts.cancelled;

          // Always show all segments, but use gray color when total is zero
          setPieData([
            {
              name: "Open",
              value: statusCounts.posted || 0,
              color: totalCount === 0 ? EMPTY_STATE_COLOR : "#0b64fc",
              displayValue: totalCount === 0 ? 1 : statusCounts.posted || 0,
            },
            {
              name: "Ongoing",
              value: statusCounts.ongoing || 0,
              color: totalCount === 0 ? EMPTY_STATE_COLOR : "#9c27b0",
              displayValue: totalCount === 0 ? 1 : statusCounts.ongoing || 0,
            },
            {
              name: "Completed",
              value: statusCounts.completed || 0,
              color: totalCount === 0 ? EMPTY_STATE_COLOR : "#18a86b",
              displayValue: totalCount === 0 ? 1 : statusCounts.completed || 0,
            },
            {
              name: "Cancelled",
              value: statusCounts.cancelled || 0,
              color: totalCount === 0 ? EMPTY_STATE_COLOR : "#db3030",
              displayValue: totalCount === 0 ? 1 : statusCounts.cancelled || 0,
            },
          ]);
        } else {
          // Default empty state with equal segments
          setPieData([
            {
              name: "Open",
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
            name: "Open",
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
        // console.log("Line Chart Data:", result);
        setLineData(result);
      } catch (err) {
        console.error("Error fetching line chart data", err);
      }
    };

    fetchLineData();
  }, [timeRangeData]);

  useEffect(() => {
    if (!user?.nUserID) return;

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/api/Projects_/GetTop10MyProjectDetails?userid=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const data = await response.json();

        // Sort by date (latest first) and take top 10
        const sortedProjects = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by created date (latest first)
          .slice(0, 10); // Get only the top 10 projects

        setProjects(sortedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const cards = [
    {
      id: 1,
      title: "Total Projects",
      amount: stats.postedProjects,
      action: "Refresh",
      icon: <Folders />,
      color: "purple",
      gradient: "from-purple-400 via-purple-300 to-purple-300",
      bgColor: "bg-blue/20",
      link: "/dashboard/projects/my-projects",
      image: project,
    },
    {
      id: 2,
      title: "Saved Freelancers",
      amount: stats.savedFreelancers,
      action: "Show all invoices",
      icon: <Heart />,
      color: "red",
      gradient: "from-red-400 via-red-300 to-red-300",
      bgColor: "bg-red/20",
      link: "/dashboard/freelancers/saved",
      image: heart,
    },
    {
      id: 3,
      title: "Total Spending",
      amount: `${getCurrencySymbolId(user?.currency)} ${stats.totalSpending}`,
      action: "Withdraw now",
      icon: <DollarSign />,
      color: "green",
      gradient: "from-green-400 via-green-300 to-green-300",
      bgColor: "bg-green/20",
      link: "/dashboard/payments/my-wallet",
      image: money,
    },
    {
      id: 4,
      title: "Feedback",
      amount: stats.feedbackCount,
      action: "Refresh",
      icon: <Star />,
      color: "gold",
      gradient: "from-gold-400 via-gold-300 to-gold-300",
      bgColor: "bg-gold/20",
      link: "/dashboard/feedbacks/freelancer-feedbacks",
      image: star,
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6  pt-10">
            {[...Array(4)].map((_, idx) => (
              <Skeleton
                key={idx}
                variant="rectangular"
                height={100}
                className="rounded-lg"
              />
            ))}
          </div>

          {/* Charts Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 ">
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
        

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 pt-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`relative overflow-hidden border transition-all rounded-xl p-4 flex flex-col gap-2 cursor-pointer shadow-lg ${
                  card.color === "purple"
                    ? "border-purple/20  hover:shadow-purple/15"
                    : card.color === "red"
                    ? "border-red/20  hover:shadow-red/15"
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
                      : card.color === "red"
                      ? "bg-gradient-to-tl from-red-200/75 to-white/0"
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

          {/* Graphs */}
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

          <div className="py-6 ">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "500",
                pl:0.5,
                mb: 1,
                fontSize: "1rem",
                color: "black",
              }}
            >
              Recently Posted
            </Typography>
            <div className="border rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-black">
                    <tr className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-xl h-12">
                      <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-white tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-center text-xs sm:text-sm font-medium text-white tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs sm:text-sm font-medium text-white tracking-wider">
                        Proposals
                      </th>
                      <th className="px-6 py-3 text-right text-xs sm:text-sm font-medium text-white tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray ">
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <tr
                          key={project.nProjectId}
                          className="group hover:bg-muted-foreground/5 hover:rounded-xl transition-all duration-300 ease-in-out bg-white overflow-hidden"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-black text-sm transition-colors">
                                {project.title}
                              </span>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-black">
                                  {getCurrencySymbolId(project.currency)}{" "}
                                  {project.budget} - {project.maxBudget}{" "}
                                  {getCurrencySymbolName(project.currency)}
                                </span>
                                <span className="text-xs text-grey">•</span>
                                <span className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                  posted {moment(project.createdAt).fromNow()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge
                              className={`text-[10px] lg:text-sm rounded-full px-1.5  lg:px-2.5 py-0.5 border ${
                                project.status === "Completed"
                                  ? "bg-green/10 border-green text-green"
                                  : project.status === "Cancelled"
                                  ? "bg-red/10 border-red text-red"
                                  : project.status === "Ongoing"
                                  ? "bg-purple/10 border-purple text-purple"
                                  : "bg-blue/10 border-blue text-blue"
                              }`}
                              variant="outlined"
                            >
                              {project.status === "true" ||
                              project.status === "Posted"
                                ? "Open"
                                : `${project.status}`}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Box
                              className="flex h-full items-center justify-center text-black/75 text-sm gap-1 cursor-pointer"
                              onClick={() => {
                                navigate("/dashboard/projects/proposals", {
                                  state: { projectId: project.nProjectId },
                                });
                              }}
                            >
                              <Users className="w-3 h-3 md:w-4 md:h-4" />
                              <span className="flex items-center justify-center gap-0.5 no-underline hover:underline">
                                {project.appliedCount}
                                <span className="md:block hidden">
                                  {project.appliedCount === "1"
                                    ? "Proposal"
                                    : "Proposals"}
                                </span>
                              </span>
                            </Box>
                          </td>

                          <td className="px-6 py-4 ">
                            <Box className="flex items-center justify-end text-black/75 text-sm gap-1 cursor-pointer">
                              <Button
                                className="flex items-center gap-1 text-xs justify-center h-7 font-normal py-0.5 px-2"
                                size="sm"
                                onClick={() => {
                                  window.location.href = `/projects/details/${project.nProjectId}`;
                                }}
                              >
                                <Eye className="h-3 w-3" />
                                <span>View</span>
                              </Button>{" "}
                            </Box>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-6">
                          <h5>No Project</h5>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;
