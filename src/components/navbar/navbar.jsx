import React, { useEffect, useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

// Assets
import Logo from "../../assets/Logo/p2w.png";

// Context
import { useAuth } from "../../contexts/authContext";
import { useCollapse } from "../../contexts/collapseContext";

// Icons
import { RxDashboard } from "react-icons/rx";
import { IoMenu } from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";
import { useToggleDrawer } from "../../contexts/drawerContext";
import { FaChevronLeft } from "react-icons/fa6";
import { TbMessageCircle } from "react-icons/tb";
import { Bell, House, LayoutDashboard } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Settings, Ticket, HelpCircle, LogOut, UserRound } from "lucide-react";
import { useChat } from "../../contexts/chatContext";
import { Button } from "../ui/button";

const Navbar = () => {
  const {
    user,
    logout,
    getCurrencySymbolId,
    getCurrencySymbolName,
    isLoggedIn,
  } = useAuth();

  const {
    notifications,
    handleNotificationClick,
    markNotificationAsRead,
    messages,
    unreadMessages,
  } = useChat();
  const roleType =
    sessionStorage.getItem("roleId") === "0" ? "client" : "freelancer";
  const { isCollapsed } = useCollapse();
  const { toggleDrawer } = useToggleDrawer();

  const [discardModal, setDiscardModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navAnimation, setNavAnimation] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const [isPost, setIsPost] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setIsDashboard(true);
    } else {
      setIsDashboard(false);
    }

    if (location.pathname === "/dashboard/projects/post-project") {
      setIsPost(true);
    } else {
      setIsPost(false);
    }

    if (location.pathname === "/") {
      setNavAnimation(true);
    } else {
      setNavAnimation(false);
    }
  }, [location]);

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleMainDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const drawerList = () => (
    <div className="px-4 pr-7 flex flex-col items-center" role="presentation">
      <img
        className="w-48 p-2 pt-4 pb-5 cursor-pointer"
        src={Logo}
        alt="paid2workk"
        onClick={() => {
          navigate("/");
          setDrawerOpen(false);
        }}
      />
      <List>
        <ListItem
          button
          onClick={() => handleNavigation("/freelancers")}
          className="cursor-pointer"
        >
          <ListItemText primary="Hire Freelancer" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleNavigation("/projects")}
          className="cursor-pointer"
        >
          <ListItemText primary="Find Work" />
        </ListItem>
        {/* <ListItem
          button
          onClick={() => handleNavigation("/blogs")}
          className="cursor-pointer"
        >
          <ListItemText primary="Blogs" />
        </ListItem> */}
      </List>
    </div>
  );

  const renderUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`focus:outline-none outline-none focus:ring-0 cursor-pointer h-full flex flex-row-reverse items-center gap-3 lg:py-2 lg:px-4 rounded-full lg:rounded-xl hover:shadow-md hover:shadow-blue/[7%] ${"bg-back2/30"} duration-300 ease-in-out`}
      >
        <Avatar className="h-10 w-10 border-2 border-blue/15">
          <AvatarImage src={user?.photoPath} alt="User" />
          <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-right hidden lg:block">
          <p className="font-medium text-sm">{user?.username}</p>
          <p className="text-xs text-gray-500">
            {getCurrencySymbolId(user?.currency)} {user?.balance || "0.00"}{" "}
            {getCurrencySymbolName(user?.currency)}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-36 bg-white shadow-md rounded-md p-1 border"
      >
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-muted-foreground/5 transition"
          onClick={() => navigate("/dashboard")}
        >
          <RxDashboard className="h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-muted-foreground/5 transition"
          onClick={() =>
            navigate(`/user/details`, {
              state: {
                expertId: sessionStorage.getItem("NUserID"),
                role: roleType,
              }, // Pass ID through state
            })
          }
        >
          <UserRound className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-muted-foreground/5 transition"
          onClick={() => navigate("/account-settings")}
        >
          <Settings className="h-4 w-4" /> Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-muted-foreground/5 transition"
          onClick={() => navigate("/support/tickets")}
        >
          <Ticket className="h-4 w-4" /> Tickets
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-muted-foreground/5 transition"
          onClick={() => navigate("/support/faq")}
        >
          <HelpCircle className="h-4 w-4" /> FAQs
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 text-red-500 cursor-pointer px-3 py-2 hover:bg-red-50 transition"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderUserProfile = () => (
    <div className="flex items-center gap-2 xl:gap-3 text-black/80 bg-primary-foreground/80 backdrop-blur-lg py-2 px-6 rounded-xl">
      {isDashboard && (
        <>
          {!isPost &&
            (sessionStorage.getItem("roleId") === "0" ? (
              <Button
                onClick={() => navigate("/dashboard/projects/post-project")}
                className="h-9 bg-blue-600"
              >
                Post a Project
              </Button>
            ) : (
              <Button className="h-9" onClick={() => navigate("/projects")}>
                Find Projects
              </Button>
            ))}
          {/* <button
            className="lg:hidden bg-blue hover:bg-blue/80 rounded-lg px-3 py-1.5 ease-in-out duration-200 text-sm text-white"
            onClick={() => navigate("/")}
          >
            Home
          </button> */}
          <Tooltip title="Messages" arrow>
            <span>
              <button
                className="relative bg-white hover:bg-muted-foreground/10 p-2 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]"
                onClick={() => navigate("/messages")}
                type="button"
                tabIndex={0}
              >
                <TbMessageCircle className="text-2xl" />
                {unreadMessages !== 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue text-white text-xs rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>
            </span>
          </Tooltip>

          <NotificationButton />
        </>
      )}

      {renderUserMenu()}
    </div>
  );

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diff / (1000 * 60));
    const diffInHours = Math.floor(diff / (1000 * 60 * 60));
    const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffInSeconds < 60) return "just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays === 1) return "yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30)
      return `${Math.floor(diffInDays / 7)} week${
        diffInDays > 13 ? "s" : ""
      } ago`;
    if (diffInDays < 365)
      return `${Math.floor(diffInDays / 30)} month${
        diffInDays > 60 ? "s" : ""
      } ago`;

    return `${Math.floor(diffInDays / 365)} year${
      diffInDays > 730 ? "s" : ""
    } ago`;
  };

  const getNotificationContent = (notification) => {
    switch (notification.notificationType) {
      case "text":
        return `${notification.messageContent}`;
      case "paymentStatus":
        return `Payment successful for a Quotation.`;
      case "quotation":
        return `Created a New Quotation for '${notification.messageContent}'`;
      case "projectAward":
        return `Awarded you project '${notification.messageContent}'`;
      case "quotation_request":
        return `Requested a quotation for '${notification.messageContent}'`;
      case "jobInvite":
        return `Invited you for project '${notification.messageContent}'`;
      case "payment":
        return `Complete payment for project '${notification.messageContent}'`;
      case "response":
        return `${notification.senderName} ${notification.messageContent}`;
      case "milestoneCompleted":
        return `${notification.messageContent}`;
      case "feedback":
        return `${notification.messageContent}`;
      case "paymentReleased":
        return `Payment released for a milestone of '${notification.messageContent}'`;
      case "releaseRequest":
        return `Requested payment release for a milestone of '${notification.messageContent}'`;
    }
  };

  const NotificationButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Tooltip title="Notifications" arrow>
          <button
            className={`relative ${"bg-back2/30"} hover:bg-muted-foreground/10 p-2 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]`}
          >
            <Bell size={21} />
            {notifications &&
              notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
          </button>
        </Tooltip>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[90vw] sm:w-[24rem] bg-white shadow-md rounded-md p-0 border max-h-80 overflow-y-auto"
      >
        <div className="px-4 py-3 border-b sticky top-0 bg-white shadow z-20">
          <h4 className="font-semibold text-base">Notifications</h4>
        </div>

        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 ">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.nNotificationId}
              className={`flex relative items-center gap-3 px-4 py-2 hover:bg-muted-foreground/5 border hover:border-blue/20 cursor-pointer m-1 rounded-lg duration-300 ease-in-out transition-all ${
                !notification.isRead ? "bg-blue/5" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <Avatar className="h-10 w-10 rounded-full flex-shrink-0">
                <AvatarImage
                  src={notification.senderPhoto || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {notification.senderName?.[0]?.toUpperCase() || "N"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-0.5 min-w-0 ">
                <div className="flex items-center justify-between ">
                  <h3 className="font-semibold text-sm text-primary">
                    {notification.senderName}
                  </h3>
                  <div className="flex items-center gap-2 absolute right-4 top-2.5">
                    <p className="text-xs text-muted-foreground break-words truncate text-nowrap">
                      {getRelativeTime(notification.createdAt)}
                    </p>
                    {!notification.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground break-words truncate text-nowrap ">
                  {getNotificationContent(notification)}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <>
        {/* Small Screen */}
        <nav className=" z-20 fixed flex md:hidden top-0 w-full px-6 bg-white h-20 shadow-lg shadow-black/5 items-center justify-between ">
          <div className="h-full flex">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMainDrawer(true)}
            >
              <HiOutlineMenu className="text-blue text-3xl" />
            </IconButton>
          </div>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleMainDrawer(false)}
          >
            {drawerList()}
          </Drawer>

          {isLoggedIn ? (
            <div className="flex items-center gap-2 text-black/80">
              {/* Uncomment message button */}
              {!isPost &&
                (sessionStorage.getItem("roleId") === "0" ? (
                  <Button
                    onClick={() => navigate("/dashboard/projects/post-project")}
                    className="h-8 bg-blue-600"
                  >
                    Post a Project
                  </Button>
                ) : (
                  <Button className="h-8" onClick={() => navigate("/projects")}>
                    Find Projects
                  </Button>
                ))}

              {isDashboard ? (
                <Tooltip title="Home" arrow>
                  <button
                    className="relative bg-back/50 hover:bg-muted-foreground/10 p-2 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]"
                    onClick={() => navigate("/")}
                  >
                    <House className="w-5 h-5" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Dashboard" arrow>
                  <button
                    className="relative bg-back/50 hover:bg-muted-foreground/10 p-2 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]"
                    onClick={() => navigate("/dashboard")}
                  >
                    <RxDashboard className="text-xl" />
                  </button>
                </Tooltip>
              )}
              <Tooltip title="Messages" arrow>
                <button
                  className="bg-back/50 hover:bg-muted-foreground/10 p-2 rounded-lg ease-in-out duration-200 relative"
                  onClick={() => navigate("/messages")}
                >
                  <TbMessageCircle className="text-xl" />
                  {unreadMessages !== 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue text-white text-xs rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>
              </Tooltip>

              <NotificationButton />

              {renderUserMenu()}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                className="bg-white rounded-lg px-3 py-1 text-black/80 hover:text-blue/80 ease-in-out duration-200 text-sm"
                onClick={handleLogin}
              >
                LOGIN
              </button>
              <button
                className="bg-blue hover:bg-blue/80 hover:shadow-md ease-in-out duration-200 rounded-lg px-3 py-1 text-white text-sm"
                onClick={handleLogin}
              >
                SIGN UP
              </button>
            </div>
          )}
        </nav>

        {/* Medium/Large Screen */}
        <nav className="z-20 fixed hidden md:flex top-0 w-full bg-white/95 backdrop-blur-xl h-20  shadow-md border-b shadow-black/5 items-center justify-between ">
          <div className="flex items-center justify-between w-full mx-auto max-w-7xl h-20 px-10 md:px-5">
            <div className="h-full  flex">
              <img
                className="h-auto w-48 cursor-pointer"
                src={Logo}
                alt="paid2workk"
                onClick={() => navigate("/")}
              />
              <div className="flex items-center gap-2 lg:gap-4 ml-4 lg:ml-6 text-xs lg:text-sm  text-black">
                <span
                  onClick={() => navigate("/freelancers")}
                  className={`hover:text-blue duration-300 ease-in-out cursor-pointer ${
                    navAnimation
                      ? "motion-translate-x-in-[-1%] motion-translate-y-in-[56%] motion-opacity-in-[0%] motion-duration-[500ms]/opacity"
                      : ""
                  }`}
                >
                  Hire Freelancer
                </span>
                <span
                  onClick={() => navigate("/projects")}
                  className={`hover:text-blue duration-300 ease-in-out cursor-pointer ${
                    navAnimation
                      ? "motion-translate-x-in-[-1%] motion-translate-y-in-[56%] motion-opacity-in-[0%] motion-duration-[500ms]/opacity motion-delay-100"
                      : ""
                  }`}
                >
                  Find Work
                </span>
                {/* <span
                  onClick={() => navigate("/blogs")}
                  className={`hover:text-blue duration-300 ease-in-out cursor-pointer ${
                    navAnimation
                      ? "motion-translate-x-in-[-1%] motion-translate-y-in-[56%] motion-opacity-in-[0%] motion-duration-[500ms]/opacity motion-delay-200"
                      : ""
                  }`}
                >
                  Blogs
                </span> */}
              </div>
            </div>{" "}
            <div
              className={`flex items-center ${
                !user ? "flex-row-reverse gap-2 lg:gap-5 " : "flex-row gap-2"
              } items-centertext-black/80`}
            >
              {/* Uncomment message button */}
              {!isPost &&
                (roleType === "client" || !user ? (
                  <Button
                    onClick={() => {
                      if (!user) {
                        navigate("/login");
                      } else {
                        navigate("/dashboard/projects/post-project");
                      }
                    }}
                    className="h-7 lg:h-8 bg-blue-600"
                  >
                    Post a Project
                  </Button>
                ) : (
                  <Button
                    className="h-7 lg:h-8 bg-blue-600"
                    onClick={() => navigate("/projects")}
                  >
                    Find Projects
                  </Button>
                ))}
              {user ? (
                <>
                  {" "}
                  {isDashboard ? (
                    <Tooltip title="Home" arrow>
                      <button
                        className="relative bg-back/50 hover:bg-muted-foreground/10 p-2 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]"
                        onClick={() => navigate("/")}
                      >
                        <House className="w-5 h-5" />
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Dashboard" arrow>
                      <button
                        className="relative bg-back/50 hover:bg-muted-foreground/10 p-2 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]"
                        onClick={() => navigate("/dashboard")}
                      >
                        <RxDashboard className="text-xl" />
                      </button>
                    </Tooltip>
                  )}
                  <Tooltip title="Messages" arrow>
                    <button
                      className="relative bg-back/50 hover:bg-muted-foreground/10 p-2 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]"
                      onClick={() => navigate("/messages")}
                    >
                      <TbMessageCircle className="text-xl" />
                      {unreadMessages !== 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue text-white text-xs rounded-full flex items-center justify-center">
                          {unreadMessages}
                        </span>
                      )}
                    </button>
                  </Tooltip>
                  <NotificationButton />
                  {renderUserMenu()}{" "}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button size="ghost" variant="ghost" onClick={handleLogin}>
                    Log In
                  </Button>
                  <Button
                    size="ghost"
                    variant="ghost"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </>

      {discardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Discard Project</h3>
            <p className="text-sm">
              Are you sure you want to discard this Project?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="bg-gray hover:bg-grey duration-300 ease-in-out px-3 py-1 text-sm rounded-lg"
                onClick={() => setDiscardModal(false)}
              >
                Cancel
              </button>
              <button
                className="duration-300 ease-in-out bg-red hover:bg-red/5 border text-sm border-white text-white hover:text-red hover:border-red px-3 py-1 rounded-lg"
                onClick={() => {
                  navigate("/dashboard");
                  setDiscardModal(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
