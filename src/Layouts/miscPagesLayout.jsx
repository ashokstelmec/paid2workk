import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import SetupLoadable from "../components/SetupLoadable";


const PrivacyPolicy = SetupLoadable(
  lazy(() => import("../pages/misc/privacyPolicy"))
);
const TermsOfUse = SetupLoadable(
  lazy(() => import("../pages/misc/termsOfUse"))
);

const CancellationRefund = SetupLoadable(
  lazy(() => import("../pages/misc/cancellationRefund"))
)

const ShippingDelivery = SetupLoadable(
  lazy(() => import("../pages/misc/shippingDelivery"))
)

const Ticket = SetupLoadable(
  lazy(() => import("../pages/misc/ticket"))
)

const FAQPage = SetupLoadable(
  lazy(() => import("../pages/misc/faq"))
)

const MiscPagesLayout = () => {
  return (
    <div className="pt-20 ">
      <Routes>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/return-policy" element={<CancellationRefund />} />
        <Route path="/shipping-policy" element={<ShippingDelivery />} />
                <Route path="/support/tickets" element={<Ticket />} />
        <Route path="/support/faq" element={<FAQPage />} />
      </Routes>
    </div>
  );
};

export default MiscPagesLayout;
