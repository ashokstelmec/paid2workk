import React, { useEffect, useState, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useCollapse } from "../contexts/collapseContext";
import SetupLoadable from "../components/SetupLoadable";

// Default
const Insights = SetupLoadable(
  lazy(() => import("../pages/dashboard/client/insights"))
);

// Projects
const ProjectPosting = SetupLoadable(
  lazy(() => import("../pages/dashboard/client/projects/projectPosting"))
);
const MyProjects = SetupLoadable(
  lazy(() => import("../pages/dashboard/client/projects/myProjects"))
);
const Proposals = SetupLoadable(
  lazy(() => import("../pages/dashboard/client/projects/proposals"))
);

// Freelancers
const FindFreelancers = SetupLoadable(
  lazy(() => import("../pages/dashboard/client/freelancers/findFreelancers"))
);
const SavedFreelancers = SetupLoadable(
  lazy(() => import("../pages/dashboard/savedFreelancers"))
);

// Payments
const MyWallet = SetupLoadable(
  lazy(() => import("../pages/dashboard/freelancer/payments/myWallet"))
);
const PaymentSettings = SetupLoadable(
  lazy(() => import("../pages/dashboard/freelancer/payments/paymentSettings"))
);

// Feedback
const Feedback = SetupLoadable(
  lazy(() => import("../pages/dashboard/freelancer/feedback"))
);
const ClientFeedback = SetupLoadable(
  lazy(() => import("../pages/dashboard/freelancer/clientFeedback"))
);

const ClientDashboardLayout = () => {
  const { isCollapsed } = useCollapse();
  const location = useLocation();

  const [isPostProject, setIsPostProject] = useState(false);

  useEffect(() => {
    if (location.pathname === "/dashboard/projects/post-project") {
      setIsPostProject(true);
    } else {
      setIsPostProject(false);
    }
  }, [location]);


  return (
    <div
      className={`container mx-auto max-w-7xl  transition-all duration-300 ease-in-out  w-full `}
    >
      <Routes>
        {/* Default */}
        <Route path="/" element={<Insights />} />

        {/* Projects */}
        <Route path="/projects/post-project" element={<ProjectPosting />} />
        <Route path="/projects/my-projects" element={<MyProjects />} />
        <Route path="/projects/proposals" element={<Proposals />} />

        {/* Freelancers */}
        <Route path="/freelancers/explore" element={<FindFreelancers />} />
        <Route path="/freelancers/saved" element={<SavedFreelancers />} />

        {/* Payments */}
        <Route path="/payments/my-wallet" element={<MyWallet />} />
        <Route
          path="/payments/payment-settings"
          element={<PaymentSettings />}
        />

        {/* Feedbacks */}
        <Route path="/feedbacks/my-feedbacks" element={<Feedback />} />
        <Route
          path="/feedbacks/freelancer-feedbacks"
          element={<ClientFeedback />}
        />

        {/* Misc */}
        <Route path="/*" element={<Insights />} />
      </Routes>
    </div>
  );
};

export default ClientDashboardLayout;
