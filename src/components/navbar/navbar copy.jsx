import React, { useEffect, useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

// Assets
import Logo from "../../assets/Logo/p2w.png";

// Context
import { useAuth } from "../../contexts/authContext";
import { useCollapse } from "../../contexts/collapseContext";

// Icons
import { IoMenu } from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";
import { useToggleDrawer } from "../../contexts/drawerContext";
import { FaChevronLeft } from "react-icons/fa6";
import { TbMessageCircle } from "react-icons/tb";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Settings, Ticket, HelpCircle, LogOut, UserRound } from "lucide-react";
import { useChat } from "../../contexts/chatContext";

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
        <ListItem
          button
          onClick={() => handleNavigation("/blogs")}
          className="cursor-pointer"
        >
          <ListItemText primary="Blogs" />
        </ListItem>
      </List>
    </div>
  );

  const renderUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none outline-none focus:ring-0 cursor-pointer h-full ml-2 xl:ml-0 flex gap-3 lg:py-2 lg:px-4 rounded-full lg:rounded-xl hover:shadow-md hover:shadow-blue/[7%] bg-back/50 duration-300 ease-in-out">
        <Avatar className="h-10 w-10 border-2 border-blue/15">
          <AvatarImage src={user?.photoPath} alt="User" />
          <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-left hidden lg:block">
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
          className="flex items-center gap-2 text-red cursor-pointer px-3 py-2 hover:bg-red/5 transition"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderUserProfile = () => (
    <div className="flex items-center gap-2 xl:gap-3 text-black/80 bg-white/60 backdrop-blur-lg py-2 px-6 rounded-xl">
      {isDashboard && (
        <>
          <button
            className="lg:hidden bg-blue hover:bg-blue/80 rounded-lg px-3 py-1.5 ease-in-out duration-200 text-sm text-white"
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <button
            className="bg-back/50 hover:bg-back p-2 rounded-lg ease-in-out duration-200 relative"
            onClick={() => navigate("/messages")}
          >
            <TbMessageCircle className="text-2xl" />
            {unreadMessages !== 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue text-white text-xs rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>
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
        <button className="bg-back/50 hover:bg-back p-2 rounded-lg ease-in-out duration-200 relative outline-none">
          <Bell size={24} />
          {notifications &&
            notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue text-white text-xs rounded-full flex items-center justify-center">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
        </button>
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
      {isDashboard ? (
        <>
          {/* Small Screen */}
          <nav className="z-20 fixed md:hidden flex top-0 w-full h-20">
            <div className="w-full flex items-center justify-between px-6 transition-all ease-in-out duration-300">
              {/* Post button section */}
              {isPost && (
                <div className="flex items-center gap-2 xl:gap-3 text-black/80 bg-white/60 backdrop-blur-lg py-0.5 px-6 rounded-xl">
                  <button
                    onClick={() => {
                      if (sessionStorage.getItem("savedStep") !== "") {
                        setDiscardModal(true);
                      } else setDiscardModal(false);
                    }}
                    className={`${
                      isPost ? "flex" : "hidden"
                    } gap-1 text-black bg-back/30 text-sm items-center justify-center px-3 py-2 my-3 lg:mt-5 rounded-lg hover:bg-back duration-200`}
                  >
                    <FaChevronLeft className="text-xs" /> Dashboard
                  </button>
                </div>
              )}

              {/* Menu button section */}
              <div
                className={`p-4 text-black/80 bg-white/60 backdrop-blur-lg rounded-xl ${
                  isPost ? "hidden" : "flex"
                } h-full`}
              >
                <button
                  className="text-blue text-3xl flex items-center justify-center"
                  onClick={toggleDrawer}
                >
                  <IoMenu />
                </button>
              </div>

              {/* User profile section */}
              {renderUserProfile()}
            </div>
          </nav>

          {/* Medium Screen */}
          <nav className={`z-20 fixed hidden md:flex top-0 w-full h-20 `}>
            {isPost && (
              <div className="absolute left-0 lg:top-2.5 xl:top-[1.2rem] flex items-center gap-2 xl:gap-3 text-black/80 bg-white/60 backdrop-blur-lg py-3 px-6 rounded-xl">
                <button
                  onClick={() => {
                    if (sessionStorage.getItem("savedStep") !== "") {
                      setDiscardModal(true);
                    } else setDiscardModal(false);
                  }}
                  className={`${
                    isPost ? "flex" : "hidden"
                  } gap-1 text-sm items-center justify-center text-black bg-back/50 px-3 py-2  ml-10  rounded-lg hover:bg-back duration-200`}
                >
                  <FaChevronLeft className="text-xs pb-0.5" /> Dashboard
                </button>
              </div>
            )}

            <div
              className={`${
                isCollapsed ? "ml-24" : "ml-[18rem]"
              } absolute right-0 xl:top-2.5 w-fit flex items-center justify-end px-6 pr-10 transition-all ease-in-out duration-300`}
            >
              <div className="flex items-center gap-2 xl:gap-3 text-black/80 bg-white/60 backdrop-blur-lg py-3 px-6 rounded-xl">
                {/* Uncomment message button */}

                {isDashboard ? (
                  <button
                    className="hidden md:block bg-blue hover:bg-blue/80 rounded-lg px-3 py-2 ease-in-out duration-200 text-sm text-white"
                    onClick={() => navigate("/")}
                  >
                    Go to Home
                  </button>
                ) : (
                  <button
                    className="hidden md:block bg-blue hover:bg-blue/80 rounded-lg px-3 py-2 ease-in-out duration-200 text-sm  text-white"
                    onClick={() => navigate("/dashboard")}
                  >
                    Go to Dashboard
                  </button>
                )}
                <button
                  className="relative bg-back/50 hover:bg-back p-2 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]"
                  onClick={() => navigate("/messages")}
                >
                  <TbMessageCircle className="text-2xl" />
                  {unreadMessages !== 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue text-white text-xs rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                <NotificationButton />

                {renderUserMenu()}
              </div>
            </div>
          </nav>
        </>
      ) : (
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
              <div className="flex items-center gap-3 text-black/80">
                {/* Uncomment message button */}
                {isDashboard ? (
                  <button
                    className="lg:hidden bg-blue hover:bg-blue/80 rounded-lg px-3 py-2 ease-in-out duration-200 text-sm  text-white"
                    onClick={() => navigate("/")}
                  >
                    Home
                  </button>
                ) : (
                  <button
                    className="lg:hidden bg-blue hover:bg-blue/80 rounded-lg px-3 py-2 ease-in-out duration-200 text-sm  text-white"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                )}
                <button
                  className="bg-back/50 hover:bg-back p-2 rounded-lg ease-in-out duration-200 relative"
                  onClick={() => navigate("/messages")}
                >
                  <TbMessageCircle className="text-2xl" />
                  {unreadMessages !== 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue text-white text-xs rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                <NotificationButton />

                {renderUserMenu()}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  className="bg-white rounded-lg px-3 py-1 text-black/80 hover:text-blue/80 ease-in-out duration-200 font-medium text-sm"
                  onClick={handleLogin}
                >
                  LOGIN
                </button>
                <button
                  className="bg-blue hover:bg-blue/80 hover:shadow-md ease-in-out duration-200 rounded-lg px-3 py-1 text-white font-medium text-sm"
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
              <div className="h-full flex">
                <img
                  className="h-full pt-1 cursor-pointer"
                  src={Logo}
                  alt="paid2workk"
                  onClick={() => navigate("/")}
                />
                <div className="flex items-center gap-4 ml-6 xl:gap-6 xl:ml-10 text-sm  text-black">
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
                  <span
                    onClick={() => navigate("/blogs")}
                    className={`hover:text-blue duration-300 ease-in-out cursor-pointer ${
                      navAnimation
                        ? "motion-translate-x-in-[-1%] motion-translate-y-in-[56%] motion-opacity-in-[0%] motion-duration-[500ms]/opacity motion-delay-200"
                        : ""
                    }`}
                  >
                    Blogs
                  </span>
                </div>
              </div>
              {user ? (
                <div className="flex items-center gap-2 xl:gap-3 text-black/80">
                  {/* Uncomment message button */}

                  {isDashboard ? (
                    <button
                      className="hidden md:block bg-blue hover:bg-blue/80 rounded-lg px-3 py-2 ease-in-out duration-200 text-sm  text-white"
                      onClick={() => navigate("/")}
                    >
                      Go to Home
                    </button>
                  ) : (
                    <button
                      className="hidden md:block bg-blue hover:bg-blue/80 rounded-lg px-3 py-2 ease-in-out duration-200 text-sm  text-white"
                      onClick={() => navigate("/dashboard")}
                    >
                      Go to Dashboard
                    </button>
                  )}
                  <button
                    className="relative bg-back/50 hover:bg-back p-2 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]"
                    onClick={() => navigate("/messages")}
                  >
                    <TbMessageCircle className="text-2xl" />
                    {unreadMessages !== 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue text-white text-xs rounded-full flex items-center justify-center">
                        {unreadMessages}
                      </span>
                    )}
                  </button>

                  <NotificationButton />

                  {renderUserMenu()}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    className="bg-back/50 hover:bg-back font-medium py-1 px-4 rounded-lg ease-in-out duration-200 hover:shadow-md hover:shadow-blue/[7%]"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <button
                    className="bg-blue hover:bg-blue/80 hover:shadow-md ease-in-out duration-200 rounded-lg py-1 px-4 text-white font-semibold xl:font-bold"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </nav>
        </>
      )}

      {discardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Discard Project</h3>
            <p>Are you sure you want to discard this Project?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray hover:bg-grey duration-300 ease-in-out px-4 py-2 rounded-lg"
                onClick={() => setDiscardModal(false)}
              >
                Cancel
              </button>
              <button
                className="duration-300 ease-in-out bg-red hover:bg-red/5 border border-white text-white hover:text-red hover:border-red px-4 py-2 rounded-lg"
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
