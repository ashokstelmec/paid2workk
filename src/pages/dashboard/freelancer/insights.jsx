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
import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCardIcon,
  DollarSign,
  Eye,
  File,
  Users,
  Folders,
  Heart,
  MessageSquare,
  Pencil,
  Plus,
  Star,
  TrendingUp,
  Zap,
  ChartPie,
  IndianRupee,
} from "lucide-react";
import { CardContent, Skeleton, IconButton } from "@mui/material";

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
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Insights = () => {
  const { user, getCurrencySymbolId } = useAuth();

  const [timeRangeData, setTimeRangeData] = useState("Monthly");
  const [timeRange, setTimeRange] = useState("Monthly");
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

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

  // Fetch recent feedbacks
  useEffect(() => {
    if (!user?.nUserID) return;
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(
          `https://paid2workk.solarvision-cairo.com/GetFeedbackByUserId?NUserID=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const data = await res.json();
        setFeedbacks(
          data.allFeedBack.filter((f) => f.button === false).slice(0, 3) || []
        );
      } catch (err) {
        setFeedbacks([]);
      }
    };
    fetchFeedbacks();
  }, [user]);

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
      icon: <ChartPie />,
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
      icon: <Folders />,
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
      icon: user?.currency === "1" ? <DollarSign /> : <IndianRupee />,

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

  // Modal component
  const FeedbackModal = ({ open, onClose, feedback }) => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <span className="text-xl">&times;</span>
        </button>
        {feedback ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={feedback.userImage}
                  alt={feedback.userrName}
                />
                <AvatarFallback>
                  {feedback.userrName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-black">
                  {feedback.userrName}
                </div>
                <div className="text-xs text-gray-500">
                  {moment(feedback.createdOn).fromNow()}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-700">Project: </span>
              <span className="text-gray-900">{feedback.projectName}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-700">Rating: </span>
              <span className="text-yellow-500">
                {Array.from({ length: feedback.rating || 0 }).map((_, i) => (
                  <Star
                    key={i}
                    className="inline w-4 h-4 fill-yellow-400 stroke-yellow-400"
                  />
                ))}
              </span>
            </div>
            <div className="text-gray-800">{feedback.description}</div>
          </>
        ) : (
          <div>No feedback details available.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="">
      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-4 py-8">
            {/* Cards & Graphs Section */}
            <div className="md:col-span-2 xl:col-span-5 space-y-4">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="text-mute overflow-hidden border bg-gradient-to-br h-fit from-blue to-cool hover:brightness-110 duration-300 hover:shadow-xl hover:shadow-navy/5 rounded-xl p-4 flex flex-col gap-2 cursor-pointer shadow-lg transition-all hover:-translate-y-0.5 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start gap-1">
                        <Skeleton variant="text" width={80} height={40} />{" "}
                        {/* Amount */}
                        <Skeleton variant="text" width={100} height={20} />{" "}
                        {/* Title */}
                      </div>
                      <Skeleton variant="circular" width={48} height={48} />{" "}
                      {/* Icon */}
                    </div>
                  </div>
                ))}
              </div>
              {/* Graphs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Payments Chart Skeleton */}
                <div className="bg-gradient-to-b from-white to-cool/[0.05] border border-gray-200 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <div className="p-0">
                    <div className="flex justify-between items-center px-4 pt-2 pb-1">
                      <Skeleton variant="text" width={120} height={24} />{" "}
                      {/* Payments title */}
                      <Skeleton
                        variant="rectangular"
                        width={100}
                        height={32}
                        style={{ borderRadius: 4 }}
                      />{" "}
                      {/* Dropdown button */}
                    </div>
                    <div className="w-full pt-1">
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={240}
                      />{" "}
                      {/* Chart area */}
                    </div>
                  </div>
                </div>

                {/* My Projects Pie Chart Skeleton */}
                <div className="bg-gradient-to-b from-white to-cool/[0.05] border border-gray-200 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <div className="p-0">
                    <div className="flex justify-between items-center px-4 pt-2 pb-1">
                      <Skeleton variant="text" width={120} height={24} />{" "}
                      {/* My Projects title */}
                      <Skeleton
                        variant="rectangular"
                        width={100}
                        height={32}
                        style={{ borderRadius: 4 }}
                      />{" "}
                      {/* Dropdown button */}
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-center px-4 pt-2 pb-5">
                      <Skeleton variant="circular" width={190} height={190} />{" "}
                      {/* Pie chart */}
                      <div className="md:ml-6 mt-5 md:mt-0 grid grid-cols-2 md:grid-cols-1 gap-3 max-w-xs">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="flex items-center group">
                            <Skeleton
                              variant="circular"
                              width={16}
                              height={16}
                              style={{ marginRight: 12 }}
                            />{" "}
                            {/* Color dot */}
                            <div>
                              <Skeleton variant="text" width={80} height={20} />{" "}
                              {/* Project name */}
                              <Skeleton
                                variant="text"
                                width={100}
                                height={16}
                              />{" "}
                              {/* Project count */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="">
                <Skeleton
                  variant="text"
                  width={150}
                  height={24}
                  style={{
                    fontWeight: "500",
                    paddingLeft: 2,
                    marginBottom: 4,
                    fontSize: "1rem",
                    color: "black",
                  }}
                />{" "}
                {/* Recently Applied title */}
                <div className="overflow-auto md:overflow-visible">
                  <div className="border rounded-xl overflow-hidden shadow-sm w-full">
                    <div className="overflow-x-auto max-h-[27.4rem] overflow-y-auto">
                      <table className="w-full min-w-3xl">
                        <thead className="sticky top-0 z-[12] shadow-lg">
                          <tr className="bg-gradient-to-t from-navy to-blue-800 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white tracking-wider">
                              <Skeleton variant="text" width={40} />{" "}
                              {/* S No. */}
                            </th>
                            <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white tracking-wider">
                              <Skeleton variant="text" width={80} />{" "}
                              {/* Project */}
                            </th>
                            <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white tracking-wider">
                              <Skeleton variant="text" width={80} />{" "}
                              {/* Client */}
                            </th>
                            <th className="px-6 py-4 text-center text-xs sm:text-sm font-semibold text-white tracking-wider">
                              <Skeleton variant="text" width={80} />{" "}
                              {/* Proposals */}
                            </th>
                            <th className="px-6 py-4 text-right text-xs sm:text-sm font-semibold text-white tracking-wider">
                              <Skeleton variant="text" width={60} />{" "}
                              {/* Action */}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <tr
                              key={index}
                              className="group hover:bg-muted-foreground/5 bg-white hover:rounded-xl transition-all duration-300 ease-in-out"
                            >
                              <td className="px-6 py-4 font-medium text-sm">
                                <Skeleton variant="text" width={20} />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <Skeleton
                                    variant="text"
                                    width={150}
                                    height={20}
                                  />
                                  <Skeleton
                                    variant="text"
                                    width={200}
                                    height={16}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <Skeleton
                                    variant="circular"
                                    width={32}
                                    height={32}
                                  />
                                  <Skeleton
                                    variant="text"
                                    width={100}
                                    height={20}
                                    style={{ marginLeft: 8 }}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center items-center text-black/75 text-sm gap-1 ">
                                  <Skeleton
                                    variant="rectangular"
                                    width={16}
                                    height={16}
                                  />
                                  <Skeleton
                                    variant="text"
                                    width={60}
                                    height={20}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 ">
                                <div className="flex items-center justify-end text-black/75 text-sm gap-1 cursor-pointer">
                                  <Skeleton
                                    variant="rectangular"
                                    width={60}
                                    height={32}
                                    style={{ borderRadius: 4 }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2 space-y-4">
              {/* Quick Actions Section */}
              <div className="shadow-lg bg-gradient-to-br from-white to-cool/5 h-fit text-prime gap-0 pb-0 border-mute border rounded-xl">
                <div className="p-4">
                  <h2 className="text-lg text-prime font-semibold flex items-center">
                    <Skeleton
                      variant="circular"
                      width={24}
                      height={24}
                      style={{ marginRight: 8 }}
                    />
                    <Skeleton variant="text" width={120} height={24} />
                  </h2>
                </div>
                <div className="space-y-3 p-4 pt-0">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg bg-cool/10 hover:bg-cool/20 transition-colors text-left"
                    >
                      <div className="p-3 bg-white rounded-md">
                        <Skeleton
                          variant="rectangular"
                          width={16}
                          height={16}
                        />
                      </div>
                      <div>
                        <Skeleton variant="text" width={100} height={20} />
                        <Skeleton variant="text" width={150} height={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Feedbacks */}
              <div className="relative w-full pt-1">
                <Skeleton
                  variant="text"
                  width={150}
                  height={24}
                  style={{
                    fontWeight: "medium",
                    marginBottom: 8,
                    paddingLeft: 4,
                  }}
                />{" "}
                {/* Recent Feedbacks title */}
                <div className="bg-white border rounded-xl shadow-sm p-3">
                  <ul className="divide-y divide-gray-100">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 py-3 cursor-pointer hover:bg-cool/10 rounded-lg px-2 transition"
                      >
                        <Skeleton variant="circular" width={32} height={32} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Skeleton variant="text" width={100} height={20} />
                            <Skeleton variant="text" width={80} height={16} />
                          </div>
                          <Skeleton
                            variant="text"
                            width={150}
                            height={16}
                            style={{ marginBottom: 4 }}
                          />
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Skeleton
                                key={i}
                                variant="circular"
                                width={12}
                                height={12}
                              />
                            ))}
                          </div>
                          <Skeleton variant="text" width="100%" height={40} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-4 py-8">
            {/* Cards & Graphs Section */}
            <div className="md:col-span-2 xl:col-span-5 space-y-4">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="text-mute overflow-hidden border bg-gradient-to-br h-fit from-blue to-cool hover:brightness-110 duration-300 hover:shadow-xl hover:shadow-navy/5 rounded-xl p-4 flex flex-col gap-2 cursor-pointer shadow-lg transition-all hover:-translate-y-0.5 ease-in-out"
                    onClick={() => handleCardClick(card.link)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-2xl font-bold bg-clip-text text-white">
                          {card.amount}
                        </span>
                        <span className="text-xs text-white">{card.title}</span>
                      </div>
                      <div className="text-white p-4 pr-1">{card.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Graphs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Payments Chart */}
                <div className="bg-gradient-to-b from-white to-cool/[0.05] border border-gray-200 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
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

                    <div className="w-full pt-1">
                      <ResponsiveContainer width="100%" height={240}>
                        <AreaChart
                          data={lineData}
                          margin={{ top: 10, right: 20, left: 5, bottom: 0 }}
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
                            width={40}
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                            tickMargin={5}
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

                {/* My Projects Pie */}
                <div className="bg-gradient-to-b from-white to-cool/[0.05] border border-gray-200 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
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
                          <div
                            key={item.name}
                            className="flex items-center group"
                          >
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
              </div>{" "}
              <div className="">
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
                    <div className="overflow-x-auto max-h-[27.4rem] overflow-y-auto">
                      <table className="w-full min-w-3xl ">
                        <thead className="sticky top-0 z-[12] shadow-lg">
                          <tr className="bg-gradient-to-t from-navy to-blue-800 border-b border-gray-200">
                            <th className="px-4 py-4 text-left text-xs sm:text-sm font-medium whitespace-nowrap text-white tracking-wider">
                              S No.
                            </th>
                            <th className="px-6 py-4 text-left text-xs sm:text-sm font-medium whitespace-nowrap text-white tracking-wider">
                              Project
                            </th>
                            <th className="px-6 py-4 text-left text-xs sm:text-sm font-medium whitespace-nowrap text-white tracking-wider">
                              Client
                            </th>
                            <th className="px-6 py-4 text-center text-xs sm:text-sm font-medium whitespace-nowrap text-white tracking-wider">
                              Proposals
                            </th>
                            <th className="px-6 py-4 text-right text-xs sm:text-sm font-medium whitespace-nowrap text-white tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray">
                          {projects?.length > 0 ? (
                            projects?.map((project, index) => (
                              <tr
                                key={project.nProjectId}
                                className="group hover:bg-muted-foreground/5 bg-white hover:rounded-xl transition-all duration-300 ease-in-out"
                              >
                                {/* Project Info */}
                                <td className="px-6 py-4 font-medium text-sm">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="text-black text-sm leading-tight line-clamp-2">
                                      {project.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                                      <span className="text-black">
                                        {getCurrencySymbolId(project.currency)}{" "}
                                        {project.budget} - {project.maxBudget}
                                      </span>
                                      <span>•</span>
                                      <span className="mx-1 text-[11px] flex items-center">
                                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                        Applied{" "}
                                        {moment(project.aplliedOn).fromNow()}
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
                                        {project.clientName
                                          ?.charAt(0)
                                          .toUpperCase()}
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
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="text-center min-h-full py-20 h-[24rem]"
                              >
                                <div className="flex flex-col items-center gap-3">
                                  <Briefcase className="w-12 h-12 text-gray-300" />
                                  <h3 className="text-lg font-medium text-gray-500">
                                    No Projects Found
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    Start by applying on projects
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2 space-y-4">
              {/* Quick Actions Section */}
              <Card className="shadow-lg bg-gradient-to-br from-white to-cool/5 h-fit text-prime gap-0  pb-0 border-mute border">
                <CardHeader>
                  <CardTitle className="text-lg text-prime font-semibold flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      label: "Find Projects",
                      icon: Users,
                      description: "Browse available projects",
                      link: "/dashboard/projects/explore",
                    },
                    {
                      label: "Send Messages",
                      icon: MessageSquare,
                      description: `Communicate with freelancer`,
                      link: "/messages",
                    },
                    {
                      label: "Manage Projects",
                      icon: File,
                      description: "Make changes in project scope",
                      link: "/dashboard/projects/my-projects",
                    },
                    {
                      label: "Manage Payments",
                      icon: CreditCardIcon,
                      description: "Handle transactions",
                      link: "/dashboard/payments/payment-settings",
                    },
                    {
                      label: "Manage Feedbacks",
                      icon: Star,
                      description: "Manage your feedbacks",
                      link: "/dashboard/feedbacks/my-feedbacks",
                    },
                    {
                      label: "Saved Freelancers",
                      icon: Heart,
                      description: "Check saved freelancers",
                      link: "/dashboard/saved/freelancers",
                    },
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        onClick={() => navigate(action.link)}
                        key={index}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg bg-cool/10 hover:bg-cool/20 transition-colors text-left"
                      >
                        <div className="p-3 bg-white rounded-md">
                          {" "}
                          <Icon className="w-4 h-4" />
                        </div>

                        <div>
                          <span className="text-sm font-medium block">
                            {action.label}
                          </span>
                          <span className="text-xs text-prime">
                            {action.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="relative w-full pt-1">
                <h5 className="font-medium mb-2 pl-1">Recent Feedbacks</h5>
                <div className="bg-white border rounded-xl shadow-sm p-3">
                  {feedbacks.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <Star className="w-10 h-10 text-gray-300" />
                      <span className="text-gray-500 text-sm">
                        No feedbacks yet.
                      </span>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {feedbacks.map((fb, idx) => (
                        <li
                          key={fb.feedbackId || idx}
                          className="flex items-start gap-3 py-3 cursor-pointer hover:bg-cool/10 rounded-lg px-2 transition"
                          onClick={() => {
                            setSelectedFeedback(fb);
                            setFeedbackModalOpen(true);
                          }}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={fb.userImage}
                              alt={fb.userrName}
                            />
                            <AvatarFallback>
                              {fb.userrName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-black text-sm">
                                {fb.userrName}
                              </span>
                              <span className="text-xs text-gray-400">
                                {moment(fb.createdOn).fromNow()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              Project:{" "}
                              <span className="font-medium">
                                {fb.projectName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: fb.rating || 0 }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3 h-3 fill-yellow-400 stroke-yellow-400"
                                  />
                                )
                              )}
                            </div>
                            <div className="text-gray-700 text-sm line-clamp-2">
                              {fb.description}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <FeedbackModal
                  open={feedbackModalOpen}
                  onClose={() => setFeedbackModalOpen(false)}
                  feedback={selectedFeedback}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;
