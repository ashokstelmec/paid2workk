import { useChat } from "@/contexts/supportContext";
import {
  Home,
  FolderOpen,
  Users,
  CreditCardIcon,
  MessageSquare,
  Headset,
  Star,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNavbar = ({ activeTab, setActiveTab }) => {
  const { setIsChatModalOpen } = useChat();
  const dockItems = [
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
      link:
        sessionStorage.getItem("roleId") === "1"
          ? "/dashboard/saved/freelancers"
          : "/dashboard/freelancers/saved",
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
      link:
        sessionStorage.getItem("roleId") === "0"
          ? "/dashboard/feedbacks/freelancer-feedbacks"
          : "/dashboard/feedbacks/client-feedbacks",
    },
    {
      id: "support",
      icon: Headset,
      label: "Support",
      link: "",
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
      <div className="bg-white/90 backdrop-blur-xl border border-[#e2e8f0] rounded-2xl p-2 shadow-2xl">
        <div className="flex items-center space-x-2">
          {dockItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                to={item.id !== "support" && item.link}
                key={item.id}
                onClick={() => {
                  if (item.id === "support") {
                    setIsChatModalOpen(true);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`relative p-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-[#0b64fc] text-white shadow-lg scale-110"
                    : "hover:bg-[#f8fafc] text-[#1e293b] hover:scale-105"
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#1e293b] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.label}
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
