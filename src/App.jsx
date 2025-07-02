import { lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import Loadable from "./components/Loadable";
import SetupLoadable from "./components/SetupLoadable";

// Auth
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import SignupSelection from "./pages/auth/signupType";
import VerifyEmail from "./pages/auth/verifyEmail";
import ForgotPassword from "./pages/auth/forgotPassword";

// Components
import Navbar from "./components/navbar/navbar";
import EmailVerified from "./pages/auth/emailVerified";
import UpdatePassword from "./pages/auth/updatePassword";
import PasswordUpdated from "./pages/auth/passwordUpdated";
import MiscPage from "./pages/misc/misc";
import SignupSelections from "./pages/auth/signupTypes";

import ChatComponent from "./components/support/chatComponent";
// import MiscPage from "./pages/misc/misc";
import Ticket from "./pages/misc/ticket";
import WithdrawalForm from "./pages/dashboard/freelancer/payments/paymentWithdrawal";
import FAQPage from "./pages/misc/faq";
import ProcessPayment from "./pages/admin/processPayment";
import NotFound from "./pages/misc/notfound";
import Blog from "./pages/misc/blogs";
import BlogPostPage from "./pages/misc/blogPostPage";

// HOC
const LandingPageHOC = Loadable(lazy(() => import("./HOC/landingPageHOC")));
const WorkPageHOC = Loadable(lazy(() => import("./HOC/workPageHOC")));
const FreelancerPageHOC = Loadable(
  lazy(() => import("./HOC/freelancerPageHOC"))
);
const AboutHOC = Loadable(lazy(() => import("./HOC/aboutHOC")));
const DetailsHOC = Loadable(lazy(() => import("./HOC/detailsHOC")));
const DashboardHOC = SetupLoadable(lazy(() => import("./HOC/dashboardHOC")));
const UserSetupHOC = SetupLoadable(lazy(() => import("./HOC/userSetupHOC")));
const ProfileHOC = Loadable(lazy(() => import("./HOC/profileHOC")));
const ChatHOC = Loadable(lazy(() => import("./HOC/chatHOC")));
const MiscHOC = Loadable(lazy(() => import("./HOC/miscPagesHOC")));
const SupportHOC = Loadable(lazy(() => import("./HOC/supportPagesHOC")));
const ProfileDetailsHOC = Loadable(
  lazy(() => import("./HOC/profileDetailsHOC"))
);

function App() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    // Save the current route in localStorage when it changes
    if (!user && !isAuthRoute) {
      localStorage.setItem("lastRoute", location.pathname);
    }

    if (location.pathname !== "/dashboard/projects/post-project") {
      sessionStorage.removeItem("projectTitle");
      sessionStorage.removeItem("masterCategory");
      sessionStorage.removeItem("savedStep");
      sessionStorage.removeItem("projectSkills");
      sessionStorage.removeItem("budgetType");
      sessionStorage.removeItem("projectCurrency");
      sessionStorage.removeItem("budgetFrom");
      sessionStorage.removeItem("budgetTo");
      sessionStorage.removeItem("experienceLevel");
      sessionStorage.removeItem("projectDescription");
      sessionStorage.removeItem("projectFileName");
    }
  }, [location]);

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/pre-signup" ||
    location.pathname === "/pre-signups" ||
    location.pathname === "/verify-email" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/update-password" ||
    location.pathname === "/password-success" ||
    location.pathname === "/email-verified" ||
    location.pathname === "/Email-verified" ||
    location.pathname === "/account-setup" ||
    location.pathname === "/account-setup/1" ||
    location.pathname === "/account-setup/2" ||
    location.pathname === "/account-setup/3" ||
    location.pathname === "/account-setup/4" ||
    location.pathname === "/account-setup/5";

  const showSupport =
    location.pathname === "/messages" ||
    location.pathname === "/dashboard/projects/post-project";

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <Routes>
        {/* HOC */}
        <Route path="/" element={<LandingPageHOC />} />
        <Route path="/projects" element={<WorkPageHOC />} />
        <Route path="/freelancers" element={<FreelancerPageHOC />} />
        <Route path="/projects/details/:id" element={<DetailsHOC />} />
        <Route path="/dashboard/*" element={<DashboardHOC />} />
        <Route path="/account-settings" element={<ProfileHOC />} />
        <Route path="/account-setup/*" element={<UserSetupHOC />} />
        <Route path="/messages" element={<ChatHOC />} />
        <Route path="/legal/*" element={<MiscHOC />} />
        <Route path="/support/*" element={<SupportHOC />} />
        <Route path="/user/details" element={<ProfileDetailsHOC />} />
        <Route path="/about-us" element={<AboutHOC />} />

        <Route path="/withdrawal" element={<WithdrawalForm />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pre-signup" element={<SignupSelection />} />
        <Route path="/pre-signups" element={<SignupSelections />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/password-success" element={<PasswordUpdated />} />

        {/* Misc */}
        <Route path="*" element={<NotFound />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:id" element={<BlogPostPage />} />


        {/* Admin */}
        <Route path="/admin" element={<ProcessPayment />} />
      </Routes>

      {!showSupport && <ChatComponent />}
    </>
  );
}

export default App;
