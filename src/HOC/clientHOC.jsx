import React, { useEffect, useState } from "react";
import ClientSidebar from "../components/Sidebar/clientSidebar";
import ClientDashboardLayout from "../Layouts/clientDashboardLayout";
import { useLocation } from "react-router-dom";
import TopNavbar from "@/pages/dashboard/client/topNav";
import BottomNavbar from "@/pages/dashboard/client/bottomNav";
import Footer from "@/components/footer";

const ClientHOC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [heading, setHeading] = useState({
    title:"",
    subtitle:""
  });

  useEffect(() => {
    if (location.pathname.includes("/projects")) {
      setActiveTab("projects");
    } else if (location.pathname.includes("/freelancers")) {
      setActiveTab("freelancers");
    } else if (location.pathname.includes("/payments")) {
      setActiveTab("payments");
    } else if (location.pathname.includes("/feedbacks")) {
      setActiveTab("feedbacks");
    } else {
      setActiveTab("dashboard");
    }

    switch (true) {
      case location.pathname.includes("/projects/my-projects"):
      setHeading({ title: "My Projects", subtitle: "View and manage your projects" });
      break;
      case location.pathname.includes("/dashboard/freelancers/saved"):
      setHeading({ title: "Saved Freelancers", subtitle: "Your list of saved freelancers" });
      break;
      case location.pathname.includes("/payments/my-wallet"):
      setHeading({ title: "My Wallet", subtitle: "Track your payments" });
      break;
      case location.pathname.includes("/payments/payment-settings"):
      setHeading({ title: "Payments Settings", subtitle: "Manage your payments settings" });
      break;
      case location.pathname.includes("/dashboard/feedbacks/my-feedbacks"):
      setHeading({ title: "Feedbacks", subtitle: "See feedback you have given" });
      break;
      case location.pathname.includes("/dashboard/projects/proposals"):
      setHeading({ title: "Proposals", subtitle: "Review proposals from freelancers" });
      break;
      case location.pathname.includes("/dashboard/feedbacks/freelancer-feedbacks"):
      setHeading({ title: "Freelancer Feedbacks", subtitle: "Feedback provided by freelancers" });
      break;
      case location.pathname.includes("/dashboard/freelancers/explore"):
      setHeading({ title: "Find Freelancers", subtitle: "Browse and hire top freelancers" });
      break;
      case location.pathname.includes("/dashboard/payments/payment-settings"):
      setHeading({ title: "Payment Settings", subtitle: "Manage your payment methods and settings" });
      break;
      case location.pathname.includes("/support"):
      setHeading({ title: "Support", subtitle: "Get help and support" });
      break;
      default:
      setHeading({ title: "", subtitle: "" });
      break;
    }
  }, [location.pathname]);

  return (
    <>
      {location.pathname !== "/dashboard/projects/post-project" && (
        <>
          <TopNavbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            heading={heading}
          />
          <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}
      <div className=" flex w-full justify-center min-h-dvh">
        <ClientDashboardLayout />
      </div>
    </>
  );
};

export default ClientHOC;
