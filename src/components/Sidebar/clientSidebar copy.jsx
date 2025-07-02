import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { NavLink, useLocation, matchPath } from "react-router-dom";
import { Collapse, Drawer, Tooltip, useMediaQuery } from "@mui/material";
import { useCollapse } from "../../contexts/collapseContext";
import { useToggleDrawer } from "../../contexts/drawerContext";

// Assets
import Logo from "../../assets/Logo/p2w.png";

// Icons
import { IoChevronDownOutline } from "react-icons/io5";
import { RiStackFill } from "react-icons/ri";
import { LuExternalLink } from "react-icons/lu";
import { BiDollar } from "react-icons/bi";
import { TbLayoutSidebarLeftExpand, TbLogout, TbUser } from "react-icons/tb";
import { MdFeedback } from "react-icons/md";
import { Wallet } from "lucide-react";

const ClientSidebar = () => {
  const { logout } = useAuth();
  const { isCollapsed, toggleCollapse } = useCollapse();
  const { isDrawerOpen, toggleDrawer, closeDrawer } = useToggleDrawer();

  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();
  const [selectedRoute, setSelectedRoute] = useState(false);
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState(null);
  const [currency, setCurrency] = useState("INR");
  const [error, setError] = useState("");

  const isSmallScreen = useMediaQuery("(max-width: 900px)");

  // const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

  useEffect(() => {
    // Find if there's an exact match of pathname
    const matchedItem = menuItems.find((item) =>
      matchPath(item.route, location.pathname)
    );
    setSelectedRoute(matchedItem ? true : false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchAccountBalance = async () => {
      const NUserID = sessionStorage.getItem("NUserID");
      if (!NUserID) {
        setError("NUserID not found in session storage.");
        return;
      }

      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/api/Wallet/${NUserID}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch account balance. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setBalance(data.balance);
        setCurrency(data.currency);
        setData(data);
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching account balance."
        );
      }
    };

    fetchAccountBalance();
  }, []);

  const toggleExpand = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <RiStackFill className="w-5 h-5" />,
      route: "/dashboard",
    },
    {
      title: "Projects",
      icon: <LuExternalLink className="w-5 h-5" />,
      hasDropdown: true,
      route: "/dashboard/projects/explore",
      subMenu: [
        { title: "Post a Project", route: "/dashboard/projects/post-project" },
        { title: "My Projects", route: "/dashboard/projects/my-projects" },
        { title: "Proposals", route: "/dashboard/projects/proposals" },
      ],
    },
    {
      title: "Freelancers",
      icon: <TbUser className="w-5 h-5" />,
      hasDropdown: true,
      route: "/dashboard/freelacners/",
      subMenu: [
        { title: "Find Freelancers", route: "/dashboard/freelancers/explore" },
        { title: "Saved Freelancers", route: "/dashboard/freelancers/saved" },
      ],
    },
    {
      title: "Payments",
      icon: <BiDollar className="w-5 h-5" />,
      hasDropdown: true,
      route: "/dashboard/payments/my-wallet",
      subMenu: [
        { title: "My Wallet", route: "/dashboard/payments/my-wallet" },
        {
          title: "Payment Settings",
          route: "/dashboard/payments/payment-settings",
        },
      ],
    },
    {
      title: "Feedbacks",
      icon: <MdFeedback className="w-5 h-5" />,
      hasDropdown: true,
      route: "/dashboard/feedbacks/my-feedbacks",
      subMenu: [
        { title: "My Feedbacks", route: "/dashboard/feedbacks/my-feedbacks" },
        {
          title: "Freelancers Feedbacks",
          route: "/dashboard/feedbacks/freelancer-feedbacks",
        },
      ],
    },
  ];

  const isActiveRoute = (route) => {
    return matchPath(route, location.pathname) || route === location.pathname;
  };

  const isParentActive = (parentRoute, subMenu) => {
    if (isActiveRoute(parentRoute)) {
      return true;
    }
    return subMenu.some((item) => isActiveRoute(item.route));
  };

  return (
    <div
      className={`fixed hidden md:flex flex-col h-dvh bg-[#FCFDFF] border-r border-black/10 overflow-x-hidden overflow-y-auto z-40
      ${isCollapsed ? "w-20" : "w-64 2xl:w-72"}
      transition-all duration-300 ease-in-out`}
    >
      {/* Collapse Toggle */}
      <div className="p-2">
        <button
          onClick={toggleCollapse}
          className={` 
            w-full flex items-center gap-3 h-16 xl:h-20 px-3 py-2.5 rounded-lg
            text-left text-blue/70 hover:bg-blue/5 transition-colors duration-300 ease-in-out ${
              isCollapsed ? " justify-center" : "justify-between"
            }`}
        >
          {!isCollapsed && (
            <img
              src={Logo}
              alt=""
              className="w-36 transition-all duration-500 pt-1"
            />
          )}
          <TbLayoutSidebarLeftExpand
            className={`w-6 h-6 text-blue/70 transition-transform ${
              isCollapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <nav className="p-2">
          {menuItems.map((item, index) => {
            const isActive = isParentActive(item.route, item.subMenu || []);
            return (
              <div key={index}>
                <Tooltip title={item.title} placement="right" enterDelay={1000}>
                  <NavLink
                    to={!item.hasDropdown ? item.route : "#"}
                    onClick={() => {
                      if (isCollapsed && item.hasDropdown) {
                        toggleExpand(index);
                        toggleCollapse();
                      } else if (item.hasDropdown) {
                        toggleExpand(index);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left 2xl:text-lg
                    ${
                      isActive
                        ? "text-blue bg-blue/5 hover:bg-blue/10"
                        : "text-black/70 hover:bg-black/5"
                    }
                    transition-colors duration-300 ease-in-out ${
                      isCollapsed ? " justify-center" : "justify-start"
                    }`}
                  >
                    {item.icon}
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="truncate">{item.title}</span>
                        {item.hasDropdown && (
                          <IoChevronDownOutline
                            className={`w-5 h-5 transition-transform ${
                              expandedItems[index] ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </NavLink>
                </Tooltip>

                {!isCollapsed && item.subMenu && (
                  <Collapse in={expandedItems[index]}>
                    <div className="ml-12 my-1">
                      {item.subMenu.map((subItem, subIndex) => {
                        const isSubActive = isActiveRoute(subItem.route);
                        return (
                          <NavLink
                            key={subIndex}
                            to={subItem.route}
                            className={`w-full flex items-center gap-2 px-3 py-2 mb-1 text-sm
                            ${
                              isSubActive
                                ? "text-blue bg-blue/5 hover:bg-blue/10"
                                : "text-black/70 hover:bg-black/5"
                            }
                            transition-colors rounded-lg`}
                          >
                            <span>{subItem.title}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </Collapse>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="pt-3">
        {/* Account Balance */}
        <div className="p-0.5 bg-blue mx-2 rounded-lg mb-2 cursor-pointer hover:shadow-md duration-300 ease-in-out hover:shadow-blue/10">
          <NavLink
            to="/dashboard/payments/my-wallet"
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-2"
            } px-1 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors`}
          >
            <Wallet className="w-5 h-5 text-white" />

            {!isCollapsed && (
              <div className="flex items-center gap-2 text-white text-sm">
                <span>Account balance:</span>
                {error ? (
                  <span>{data.symbol}</span>
                ) : balance !== null ? (
                  <span>
                    {data.symbol} {balance.toFixed(2)}
                  </span>
                ) : (
                  <span>₹ --.--</span>
                )}
              </div>
            )}
          </NavLink>
        </div>

        {/* Logout */}
        <button
          className="w-full flex items-center gap-3 px-5 py-4 justify-center text-left text-red hover:bg-red/5 transition-colors "
          onClick={logout}
        >
          <TbLogout className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Drawer for small screens */}
      <Drawer
        className="md:hidden block"
        anchor="left"
        open={isDrawerOpen}
        onClose={closeDrawer}
        variant={isSmallScreen ? "temporary" : "permanent"}
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col h-dvh bg-white border-r border-black/10 overflow-x-hidden overflow-y-auto z-40">
          {/* Collapse Toggle */}
          <div className="p-2">
            <button
              onClick={toggleDrawer}
              className={`w-full flex items-center gap-3 h-16 xl:h-20 px-3 py-2.5 rounded-lg text-left text-blue/70 hover:bg-blue/5 transition-colors duration-300 ease-in-out ${
                isCollapsed ? " justify-center" : "justify-between"
              }`}
            >
              {!isCollapsed && (
                <img
                  src={Logo}
                  alt=""
                  className="w-36 transition-all duration-500 pt-1"
                />
              )}
              <TbLayoutSidebarLeftExpand
                className={`w-6 h-6 text-blue/70 transition-transform ${
                  isCollapsed ? "" : "rotate-180"
                }`}
              />
            </button>
          </div>

          {/* Main Menu for Drawer */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <nav className="p-2">
              {menuItems.map((item, index) => {
                const isActive = isParentActive(item.route, item.subMenu || []);
                return (
                  <div key={index}>
                    <Tooltip
                      title={item.title}
                      placement="right"
                      enterDelay={1000}
                    >
                      <NavLink
                        to={!item.hasDropdown ? item.route : "#"}
                        onClick={() => {
                          if (isCollapsed && item.hasDropdown) {
                            toggleExpand(index);
                            toggleCollapse();
                          } else if (item.hasDropdown) {
                            toggleExpand(index);
                          }
                          if (isSmallScreen && !item.hasDropdown) closeDrawer(); // Close drawer on small screens after selection
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left ${
                          isActive
                            ? "text-blue bg-blue/5 hover:bg-blue/10"
                            : "text-black/70 hover:bg-black/5"
                        } transition-colors duration-300 ease-in-out ${
                          isCollapsed ? " justify-center" : "justify-start"
                        }`}
                      >
                        {item.icon}
                        {!isCollapsed && (
                          <div className="flex-1 flex items-center justify-between">
                            <span className="truncate">{item.title}</span>
                            {item.hasDropdown && (
                              <IoChevronDownOutline
                                className={`w-5 h-5 transition-transform ${
                                  expandedItems[index] ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        )}
                      </NavLink>
                    </Tooltip>

                    {!isCollapsed && item.subMenu && (
                      <Collapse in={expandedItems[index]}>
                        <div className="ml-12 my-1">
                          {item.subMenu.map((subItem, subIndex) => {
                            const isSubActive = isActiveRoute(subItem.route);
                            return (
                              <NavLink
                                key={subIndex}
                                to={subItem.route}
                                className={`w-full flex items-center gap-2 px-3 py-2 mb-1 text-sm ${
                                  isSubActive
                                    ? "text-blue bg-blue/5 hover:bg-blue/10"
                                    : "text-black/70 hover:bg-black/5"
                                } transition-colors rounded-lg`}
                                onClick={() => {
                                  if (isSmallScreen) closeDrawer();
                                }}
                              >
                                <span>{subItem.title}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      </Collapse>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="pt-3">
            {/* Account Balance */}
            <div className="p-0.5 bg-blue mx-2 rounded-lg mb-2 cursor-pointer hover:shadow-md duration-300 ease-in-out hover:shadow-blue/10">
              <NavLink
                to="/dashboard/payments/my-wallet"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-2"
                } px-1 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors`}
              >
                <Wallet className="w-5 h-5 text-white" />
                {!isCollapsed && (
                  <div className="flex items-center gap-2 pl-1">
                    <div className="text-sm text-white truncate">
                      Account balance
                    </div>
                    {/* <div className="font-medium truncate">$1,080</div> */}
                    {error ? (
                      <h2 className="text-sm text-white">{data.symbol}</h2>
                    ) : balance !== null ? (
                      <h2 className="text-sm text-white">
                        {data.symbol} {balance.toFixed(2)}
                      </h2>
                    ) : (
                      <h2 className="text-sm text-white">{`₹ --.--`}</h2>
                    )}
                  </div>
                )}
              </NavLink>
            </div>

            {/* Logout */}
            <button
              className="w-full flex items-center gap-3 px-5 py-4 justify-center text-left text-red hover:bg-red/5 transition-colors "
              onClick={logout}
            >
              <TbLogout className="w-5 h-5" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ClientSidebar;
