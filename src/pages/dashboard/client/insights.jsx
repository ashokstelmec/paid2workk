import React, { useEffect, useRef, useState } from "react";
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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCardIcon,
  DollarSign,
  Eye,
  File,
  Folders,
  Heart,
  IndianRupee,
  MessageSquare,
  Pencil,
  Plus,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

import { CardContent, Box, Skeleton, IconButton } from "@mui/material";

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
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxCross2 } from "react-icons/rx";

const Insights = () => {
  const { user, isLoggedIn, getCurrencySymbolId, getCurrencySymbolName } =
    useAuth(); // Add getCurrencySymbol from useAuth
  const [projects, setProjects] = useState([]);
  const [timeRangeData, setTimeRangeData] = useState("Monthly");
  const [timeRange, setTimeRange] = useState("Monthly");
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [proposalModal, setProposalModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState({});

  // const Icon = action.icon;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const carouselInterval = useRef(null);

  const proposalsCount = proposals.length;
  const visibleCards = 1; // Show 1 card at a time for carousel

  // Autoplay effect
  useEffect(() => {
    if (proposalsCount <= 1) return;
    carouselInterval.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % proposalsCount);
    }, 3500);
    return () => clearInterval(carouselInterval.current);
  }, [proposalsCount]);

  // Animation on index change
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transition =
        "transform 0.6s cubic-bezier(0.4,0,0.2,1)";
      carouselRef.current.style.transform = `translateX(-${
        carouselIndex * (100 / proposalsCount)
      }%)`;
    }
  }, [carouselIndex, proposalsCount]);

  const navigate = useNavigate();
  const handleCardClick = (link) => {
    if (link) navigate(link);
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

  useEffect(() => {
    const fetchProposals = async () => {
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
      }
    };

    fetchProposals();
  }, []);

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
      icon: user?.currency === "1" ? <DollarSign /> : <IndianRupee />,
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
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-4 py-8">
            {/* Cards & Graphs Section */}
            <div className="md:col-span-2 xl:col-span-5 space-y-4">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Direct use of Array.from for 4 card skeletons */}
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
                        {/* Direct use of Array.from for 3 pie data item skeletons */}
                        {Array.from({ length: 3 }).map((_, index) => (
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
                {/* Recently Posted title */}
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
                              {/* Project Details */}
                            </th>
                            <th className="px-6 py-4 text-center text-xs sm:text-sm font-semibold text-white tracking-wider">
                              <Skeleton variant="text" width={80} />{" "}
                              {/* Status */}
                            </th>
                            <th className="px-6 py-4 text-center text-xs sm:text-sm font-semibold text-white tracking-wider">
                              <Skeleton variant="text" width={80} />{" "}
                              {/* Proposals */}
                            </th>
                            <th className="px-6 py-4 text-right text-xs sm:text-sm font-semibold text-white tracking-wider">
                              <Skeleton variant="text" width={60} />{" "}
                              {/* Actions */}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray">
                          {/* Direct use of Array.from for 5 project table row skeletons */}
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
                              <td className="px-6 py-4 text-center">
                                <Skeleton
                                  variant="rectangular"
                                  width={70}
                                  height={24}
                                  style={{ borderRadius: 9999 }}
                                />{" "}
                                {/* Status Badge */}
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
                  {/* Direct use of Array.from for 3 quick action skeletons */}
                  {Array.from({ length: 3 }).map((_, index) => (
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

              {/* Recent Proposals */}
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
                {/* Recent Proposals title */}
                {proposalsCount === 0 ? (
                  <div className="text-center py-8 text-sm">
                    <div className="flex flex-col items-center gap-3">
                      <Skeleton variant="rectangular" width={48} height={48} />{" "}
                      {/* Icon placeholder */}
                      <Skeleton variant="text" width={180} height={24} />{" "}
                      {/* "No Proposals Found" */}
                      <Skeleton variant="text" width={220} height={20} />{" "}
                      {/* "Start by posting your first project" */}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl shadow-xl">
                    <div
                      className="flex transition-transform duration-700"
                      style={{
                        width: `${proposalsCount * 100}%`,
                      }}
                    >
                      {/* Direct use of Array.from for proposals skeletons, based on proposalsCount */}
                      {Array.from({ length: proposalsCount }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex-shrink-0 w-full"
                          style={{ width: `${100 / proposalsCount}%` }}
                        >
                          <div className="bg-gradient-to-b from-white to-cool/[0.01] flex flex-col cursor-pointer px-4 gap-2 hover:shadow-lg transition-all duration-300">
                            {/* Header */}
                            <div className="p-0 space-y-0 gap-0">
                              <Skeleton
                                variant="text"
                                width="80%"
                                height={24}
                              />{" "}
                              {/* Project Title */}
                              <Skeleton
                                variant="text"
                                width="60%"
                                height={16}
                              />{" "}
                              {/* Bid placed on... */}
                            </div>

                            {/* Content */}
                            <div className="p-0 flex flex-col gap-4">
                              <div className="flex items-center gap-4">
                                <Skeleton
                                  variant="circular"
                                  width={48}
                                  height={48}
                                />{" "}
                                {/* Avatar */}
                                <div className="truncate">
                                  <Skeleton
                                    variant="text"
                                    width={150}
                                    height={20}
                                  />{" "}
                                  {/* Freelancer Name */}
                                  <Skeleton
                                    variant="text"
                                    width={100}
                                    height={16}
                                  />{" "}
                                  {/* Rating/New Joinee */}
                                </div>
                              </div>
                              {/* Description */}
                              <Skeleton
                                variant="text"
                                width="100%"
                                height={20}
                              />{" "}
                              {/* Bid Description */}
                              {/* Skills */}
                              <div className="flex flex-nowrap gap-2 overflow-clip">
                                {Array.from({ length: 3 }).map(
                                  (_, skillIdx) => (
                                    <Skeleton
                                      key={skillIdx}
                                      variant="rectangular"
                                      width={60}
                                      height={24}
                                      style={{ borderRadius: 9999 }}
                                    />
                                  )
                                )}
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="p-0 flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                              <div className="flex flex-col">
                                <Skeleton
                                  variant="text"
                                  width={80}
                                  height={16}
                                />{" "}
                                {/* Bid Amount label */}
                                <Skeleton
                                  variant="text"
                                  width={120}
                                  height={20}
                                />{" "}
                                {/* Bid Amount value */}
                              </div>
                              <Skeleton
                                variant="text"
                                width={100}
                                height={20}
                              />{" "}
                              {/* Delivery */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Dots */}
                {proposalsCount > 1 && (
                  <div className="flex justify-center mt-2 gap-2">
                    {Array.from({ length: proposalsCount }).map((_, idx) => (
                      <Skeleton
                        key={idx}
                        variant="circular"
                        width={8}
                        height={8}
                        style={{
                          backgroundColor: idx === 0 ? "#2563eb" : "#d1d5db",
                        }} // Simulate active/inactive dot colors
                      />
                    ))}
                  </div>
                )}
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
                  Recently Posted
                </Typography>
                <div className="border rounded-xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto h-[27.4rem] overflow-y-auto">
                     <table className="w-full min-w-3xl ">
                      <thead className="sticky top-0 z-[12] shadow-lg">
                        <tr className="bg-gradient-to-t from-navy to-blue-800 border-b border-gray-200">
                          <th className="px-4 py-4 text-left text-sm font-medium text-muted tracking-wide whitespace-nowrap">
                            S. No.
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted tracking-wide whitespace-nowrap">
                            Project
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-muted tracking-wide whitespace-nowrap">
                            Status
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-muted tracking-wide whitespace-nowrap">
                            Proposals
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-medium text-muted tracking-wide whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {projects?.length > 0 ? (
                          projects?.map((project, index) => (
                            <tr
                              key={project.nProjectId}
                              className={`hover:bg-muted/50 transition-all duration-200 ${
                                index % 2 === 0 ? "bg-white" : "bg-muted/30"
                              }`}
                            >
                              <td className="px-6 py-4 font-medium text-sm">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <h3 className=" text-gray-900 text-sm leading-tight line-clamp-2">
                                    {project.title}
                                  </h3>
                                  <div className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1 text-green-600                                                       py-1 rounded-full">
                                      <span className="font-medium text-xs">
                                        {getCurrencySymbolId(project.currency)}{" "}
                                        {project.budget} - {project.maxBudget}
                                      </span>
                                    </div>
                                    <span className="text-gray-500">•</span>
                                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                                      
                                      <Clock className="w-3 h-3" />
                                      <span>
                                        posted{" "}
                                        {moment(project.createdAt).fromNow()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Badge
                                  className={`text-xs z-10 font-medium px-3 py-1 rounded-full border ${
                                    project.status === "Completed"
                                      ? "bg-green-50 border-green-200 text-green-700"
                                      : project.status === "Cancelled"
                                      ? "bg-red-50 border-red-200 text-red-700"
                                      : project.status === "Ongoing"
                                      ? "bg-purple-50 border-purple-200 text-purple-700"
                                      : "bg-blue-50 border-blue-200 text-blue-700"
                                  }`}
                                  variant="outlined"
                                >
                                  {project.status === "true" ||
                                  project.status === "Posted"
                                    ? "Open"
                                    : project.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  className="flex items-center justify-center gap-2 mx-auto px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                                  onClick={() => {
                                    navigate("/dashboard/projects/proposals", {
                                      state: { projectId: project.nProjectId },
                                    });
                                  }}
                                >
                                  <Users className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    {project.appliedCount}
                                  </span>
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex h-7 px-2 items-center gap-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                                    onClick={() => {
                                      window.location.href = `/projects/details/${project.nProjectId}`;
                                    }}
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View</span>
                                  </Button>
                                </div>
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
                                  Start by posting your first project
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
                      label: "Find Freelancers",
                      icon: Users,
                      description: "Browse available talent",
                      link: "/dashboard/freelancers/explore",
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
                      label: "Check Proposals",
                      icon: Pencil,
                      description: "Proposals sent by freelancers",
                      link: "/dashboard/projects/proposals",
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
                <h5 className="font-medium mb-2 pl-1">Recent Proposals</h5>

                {proposalsCount === 0 ? (
                  <div className="text-center py-8 text-sm">
                    <span>No proposals yet.</span>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl shadow-xl">
                    <div
                      ref={carouselRef}
                      className="flex transition-transform duration-700"
                      style={{
                        width: `${proposalsCount * 100}%`,
                      }}
                    >
                      {proposals.map((proposal, idx) => (
                        <div
                          key={proposal.id}
                          className="flex-shrink-0 w-full"
                          style={{ width: `${100 / proposalsCount}%` }}
                        >
                          <Card
                            className="bg-gradient-to-b from-white to-cool/[0.01] flex flex-col cursor-pointer px-4 gap-2  hover:shadow-lg transition-all duration-300"
                            onClick={() => {
                              setSelectedProposal(proposal);
                              setProposalModal(true);
                            }}
                          >
                            {/* Header */}
                            <CardHeader className="p-0 space-y-0 gap-0">
                              <h2 className="text-base font-medium text-black truncate">
                                {proposal.projectTitle}
                              </h2>
                              <span className="text-xs text-muted-foreground">
                                Bid placed on{" "}
                                {new Date(
                                  proposal.bidTimestamp
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })}
                              </span>
                            </CardHeader>

                            {/* Content */}
                            <CardContent className="p-0 flex flex-col gap-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage
                                    src={proposal.photopath}
                                    alt={proposal.username}
                                  />
                                  <AvatarFallback>
                                    {proposal.username
                                      ? proposal.username.charAt(0)
                                      : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="truncate">
                                  <div className="text-sm  font-medium text-black truncate">
                                    {proposal?.username || "Unknown Freelancer"}
                                  </div>
                                  <div className="text-xs  text-muted-foreground truncate">
                                    {proposal.rating
                                      ? `Rating: ${proposal.rating}/5`
                                      : "New Joinee"}
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-black line-clamp-1 break-words">
                                {proposal.bidDescription}
                              </p>

                              {/* Skills */}
                              <div className="flex flex-nowrap gap-2 overflow-clip">
                                {proposal.skill ? (
                                  proposal.skill
                                    .split(",")
                                    .map((skill, index) => (
                                      <Badge
                                        key={index}
                                        variant="default"
                                        className="text-xs bg-mute text-prime  px-2 py-1 rounded-full"
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dots */}
                {proposalsCount > 1 && (
                  <div className="flex justify-center mt-2 gap-2">
                    {proposals.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === carouselIndex ? "bg-blue-600" : "bg-gray-300"
                        }`}
                        onClick={() => setCarouselIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        type="button"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
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
              <CardHeader className="pt-4 pb-2">
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
              <CardContent className="flex-grow ">
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
                      <Badge
                        key={index}
                        variant="default"
                        className="text-xs bg-mute text-prime  px-2 py-1 rounded-full"
                      >
                        {skills}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="default">No Skills</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mb-4">
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

export default Insights;
