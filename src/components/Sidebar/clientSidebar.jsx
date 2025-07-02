import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { NavLink, useLocation, matchPath, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
      icon: <RiStackFill className="w-4 h-4" />,
      route: "/dashboard",
    },
    {
      title: "Projects",
      icon: <LuExternalLink className="w-4 h-4" />,
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
      icon: <TbUser className="w-4 h-4" />,
      hasDropdown: true,
      route: "/dashboard/freelacners/",
      subMenu: [
        { title: "Find Freelancers", route: "/dashboard/freelancers/explore" },
        { title: "Saved Freelancers", route: "/dashboard/freelancers/saved" },
      ],
    },
    {
      title: "Payments",
      icon: <BiDollar className="w-4 h-4" />,
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
      icon: <MdFeedback className="w-4 h-4" />,
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
      className={`bg-white fixed hidden md:flex flex-col h-[calc(100%-2.5rem)] px-2 border rounded-xl  overflow-x-hidden overflow-y-auto z-40 top-1/2 -translate-y-1/2
      transition-all duration-300 ease-in-out w-60`}
    >
      {/* Collapse Toggle */}
      <div
        className="px-3 pt-1.5 flex justify-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={Logo}
          alt=""
          className="w-48 transition-all duration-500 -mt-1.5 mr-1"
        />
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
                        setExpandedItems({ [index]: true }); // Reset all other toggles
                        toggleCollapse();
                      } else if (item.hasDropdown) {
                        setExpandedItems((prev) => ({
                          [index]: !prev[index], // Toggle current, close others
                        }));
                      }
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm text-left 
              ${
                isActive
                  ? "text-blue bg-blue/5 hover:bg-blue/10 "
                  : "text-black/70 hover:bg-black/5 "
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
                            className={`w-4 h-4 transition-transform ${
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
                    <div className="ml-10 my-0.5">
                      {item.subMenu.map((subItem, subIndex) => {
                        const isSubActive = isActiveRoute(subItem.route);
                        return (
                          <NavLink
                            key={subIndex}
                            to={subItem.route}
                            className={`w-full text-nowrap flex items-center gap-2 px-3 py-1.5 mb-0.5 text-sm
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
        <div className="p-0.5 bg-gradient-to-tl from-blue to-blue/75 transition-all mx-2 rounded-lg mb-4 cursor-pointer hover:shadow-md duration-300 ease-in-out hover:shadow-blue/10">
          <NavLink
            to="/dashboard/payments/my-wallet"
            className={`flex items-center gap-3 justify-start px-3 py-2 rounded-full `}
          >
            <div className="flex items-start flex-col gap-1 text-white text-sm">
              <div className="flex gap-2">
                <Wallet className="w-5 h-5 text-white" />
                <span>Account balance:</span>
              </div>
              {error ? (
                <span className="text-lg font-medium">{data.symbol}</span>
              ) : balance !== null ? (
                <span className="text-lg font-medium">
                  {data.symbol} {balance.toFixed(2)}
                </span>
              ) : (
                <span className="text-lg font-medium">₹ --.--</span>
              )}
            </div>
          </NavLink>
        </div>

        {/* Logout */}
        {/* <div className=" mx-2 rounded-lg mb-3">
          <button
            onClick={logout}
            className={`w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-red hover:bg-red hover:text-white hover:shadow-md hover:shadow-red/20 transition-all duration-300 ease-in-out gap-3`}
          >
            <TbLogout className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div> */}
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
                          if (!item.hasDropdown) {
                            toggleDrawer();
                          } else if (isCollapsed && item.hasDropdown) {
                            setExpandedItems({ [index]: true }); // Reset all other toggles
                          } else if (item.hasDropdown) {
                            setExpandedItems((prev) => ({
                              [index]: !prev[index], // Toggle current, close others
                            }));
                          }
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm text-left 
              ${
                isActive
                  ? "text-blue bg-blue/5 hover:bg-blue/10 "
                  : "text-black/70 hover:bg-black/5 "
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
                                className={`w-4 h-4 transition-transform ${
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
                        <div className="ml-10 my-0.5">
                          {item.subMenu.map((subItem, subIndex) => {
                            const isSubActive = isActiveRoute(subItem.route);
                            return (
                              <NavLink
                                onClick={toggleDrawer}
                                key={subIndex}
                                to={subItem.route}
                                className={`w-full text-nowrap flex items-center gap-2 px-3 py-1.5 mb-0.5 text-sm
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
            <div className="p-0.5 bg-gradient-to-tl from-blue to-blue/75 transition-all mx-2 rounded-lg mb-2 cursor-pointer hover:shadow-md duration-300 ease-in-out hover:shadow-blue/10">
              <NavLink
                onClick={toggleDrawer}
                to="/dashboard/payments/my-wallet"
                className={`flex items-center gap-3 justify-start px-3 py-2 rounded-full `}
              >
                <div className="flex items-start flex-col gap-1 text-white text-sm">
                  <div className="flex gap-2">
                    <Wallet className="w-5 h-5 text-white" />
                    <span>Account balance:</span>
                  </div>
                  {error ? (
                    <span className="text-lg font-medium">{data.symbol}</span>
                  ) : balance !== null ? (
                    <span className="text-lg font-medium">
                      {data.symbol} {balance.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-lg font-medium">₹ --.--</span>
                  )}
                </div>
              </NavLink>
            </div>

            {/* Logout */}
            {/* <div className=" mx-2 rounded-lg mb-3">
              <button
                onClick={logout}
                className={`w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-red hover:bg-red hover:text-white hover:shadow-md hover:shadow-red/20 transition-all duration-300 ease-in-out gap-3`}
              >
                <TbLogout className="w-5 h-5" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </div> */}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ClientSidebar;
