import { useAuth } from "@/contexts/authContext";
import {
  Home,
  FolderOpen,
  Users,
  CreditCardIcon,
  MessageSquare,
  Star,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const TopNavbar = ({ activeTab, setActiveTab, heading }) => {
  const { user } = useAuth();

  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", link: "/dashboard" },
    {
      id: "projects",
      icon: FolderOpen,
      label: "Projects",
      link: "/dashboard/projects/my-projects",
    },
    {
      id: "freelancers",
      icon: Users,
      label: "Freelancers",
      link: sessionStorage.getItem("roleId") === "1" ? "/dashboard/saved/freelancers" : "/dashboard/freelancers/saved" ,
    },
    {
      id: "payments",
      icon: CreditCardIcon,
      label: "Payments",
      link: "/dashboard/payments/my-wallet",
    },
    {
      id: "feedbacks",
      icon: Star,
      label: "Feedbacks",
      link: sessionStorage.getItem("roleId") === "0" ? "/dashboard/feedbacks/freelancer-feedbacks" : "/dashboard/feedbacks/client-feedbacks",
    },
  ];

  return (
    <div className="flex items-center justify-between pt-[6.5rem]">
      <div
        className={`
             w-full flex flex-col items-start justify-between  transition-all ease-in-out duration-300`}
      >
        {location.pathname !== "/dashboard" ? (
          <>
            <h2 className="text-xl font-medium">{heading.title}</h2>
            <span className="text-sm text-muted-foreground">{heading.subtitle}</span>{" "}
          </>
        ) : (
          <>
            <h2 className="text-xl font-medium">
              Hello, {user?.username?.split(" ")[0]}!
            </h2>
            <span className="text-muted-foreground text-sm">
              Welcome back to your Dashboard{" "}
            </span>
          </>
        )}
      </div>{" "}
      <nav className="hidden lg:flex items-center space-x-1 bg-white/50 backdrop-blur-sm rounded-full p-1 border border-[#e2e8f0]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              to={item.link}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-blue text-white shadow-lg"
                  : "text-prime hover:bg-mute hover:text-blue"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-normal">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default TopNavbar;
