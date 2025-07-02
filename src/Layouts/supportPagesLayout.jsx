import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import SetupLoadable from "../components/SetupLoadable";

const Ticket = SetupLoadable(lazy(() => import("../pages/misc/ticket")));

const FAQPage = SetupLoadable(lazy(() => import("../pages/misc/faq")));

const SupportPagesLayout = () => {
  return (
    <div className="pt-20 ">
      <Routes>
        <Route path="/tickets" element={<Ticket />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </div>
  );
};

export default SupportPagesLayout;
