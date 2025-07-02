import React from "react";
import { Route, Routes } from "react-router-dom";

// Context
import { useCollapse } from "../contexts/collapseContext";
import { lazy } from "react";
import SetupLoadable from "../components/SetupLoadable";

// Default
const Insights = SetupLoadable(
  lazy(() => import("../pages/dashboard/freelancer/insights"))
);

// Projects
const MyProjects = SetupLoadable(
  lazy(() => import("../pages/dashboard/freelancer/projects/myprojects"))
);
const ExploreProjects = SetupLoadable(
  lazy(() => import("../pages/dashboard/freelancer/projects/explore"))
);
const AppliedProjects = SetupLoadable(
  lazy(() => import("../pages/dashboard/freelancer/projects/appliedProjects"))
);

// Saved
const SavedProjects = SetupLoadable(
  lazy(() => import("../pages/dashboard/freelancer/saved/savedProjects"))
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

const FreelancerDashboardLayout = () => {
  const { isCollapsed } = useCollapse();

  return (
    <div
      className={`container mx-auto max-w-7xl  transition-all duration-300 ease-in-out  w-full min-h-dvh`}
    >
      <Routes>
        {/* Default */}
        <Route path="/" element={<Insights />} />

        {/* Projects */}
        <Route path="/projects/explore" element={<ExploreProjects />} />
        <Route path="/projects/my-projects" element={<MyProjects />} />
        <Route
          path="/projects/applied-projects"
          element={<AppliedProjects />}
        />

        {/* Saved */}
        <Route path="/saved/projects" element={<SavedProjects />} />
        <Route path="/saved/freelancers" element={<SavedFreelancers />} />

        {/* Payments */}
        <Route path="/payments/my-wallet" element={<MyWallet />} />
        <Route
          path="/payments/payment-settings"
          element={<PaymentSettings />}
        />

        {/* Feedbacks */}
        <Route path="/feedbacks/my-feedbacks" element={<Feedback />} />
        <Route
          path="/feedbacks/client-feedbacks"
          element={<ClientFeedback />}
        />

        {/* Misc */}
        <Route path="/*" element={<Insights />} />
      </Routes>
    </div>
  );
};

export default FreelancerDashboardLayout;
