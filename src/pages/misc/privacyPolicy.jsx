import React from "react";

const PrivacyPolicy = () => {
  const handleMailTo = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-10 md:px-5 ">
      <div className="space-y-2 text-start mb-2 pl-6">
        <h1 className="text-xl font-semibold tracking-tighter">
          Privacy Policy
        </h1>
      </div>

      <div className="p-6 py-0 mb-4">
        <div className=" max-w-none text-sm">
          <p className="flex flex-col">
            <span>Welcome to Paid2Workk. </span>
            We are committed to protecting your privacy and ensuring that your
            personal information is handled in a safe and responsible manner.
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our platform.
            <span className="mt-2">
              Please read this Privacy Policy carefully. By using our Service,
              you agree to the collection and use of information in accordance
              with this Policy.
            </span>
          </p>

          <h2 className="text-lg font-semibold mt-4 mb-2">
            1. Information We Collect
          </h2>
          <p>
            We collect information that you provide directly to us, as well as
            information automatically collected when you use our Service.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Full Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Mailing address</li>
            <li>
              Payment information (e.g., bank account details, payment gateway
              data)
            </li>
            <li>
              Profile information (bio, skills, work experience, portfolio)
            </li>
            <li>
              Communications between you and other users (e.g., messages,
              proposals)
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-4 mb-2">
            2. How We Use Your Information
          </h2>
          <p>We may use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Provide, operate, and maintain our Service</li>
            <li>Create and manage your account</li>
            <li>Facilitate payments between clients and freelancers</li>
            <li>Enable communication between users</li>
            <li>
              Send administrative notifications (e.g., account verification,
              updates)
            </li>
            <li>Personalize user experience and improve the platform</li>
            <li>Detect and prevent fraud or other illegal activities</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-lg font-semibold mt-4 mb-2">
            3. Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies and similar technologies to enhance your experience
            on our platform. You can control or disable cookies through your
            browser settings, but doing so may affect your ability to use
            certain features of our Service.
          </p>

          <h2 className="text-lg font-semibold mt-4 mb-2">4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your
            information. However, no system can guarantee absolute security. You
            use our Service at your own risk.
          </p>

          <h2 className="text-lg font-semibold mt-4 mb-2">5. Your Data Rights</h2>
          <p>
            Depending on your location, you may have the following rights
            regarding your personal information:
          </p>

          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Access the information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict certain processing</li>
            <li>Withdraw consent where applicable</li>
          </ul>

          <p className="pt-4">
            To exercise any of these rights, please contact us at{" "}
            <span
              className="text-blue hover:underline cursor-pointer "
              onClick={() => handleMailTo("support@paid2workk.com")}
            >
              support@paid2workk.com
            </span>
          </p>

          <h2 className="text-lg font-semibold mt-4 mb-2">
            6. Retention of Information
          </h2>
          <p>
            We retain your information as long as necessary to provide our
            Service and fulfill the purposes outlined in this Policy, unless a
            longer retention period is required or permitted by law.
          </p>
          <h2 className="text-lg font-semibold mt-4 mb-2">7. Third-Party Links</h2>
          <p>
            Our Service may contain links to third-party websites or services.
            We are not responsible for the privacy practices of such third
            parties.
          </p>
          <h2 className="text-lg font-semibold mt-4 mb-2">
            8. Children's Privacy
          </h2>
          <p>
            Our Service is not intended for individuals under the age of 18. We
            do not knowingly collect personal data from children.
          </p>
          <h2 className="text-lg font-semibold mt-4 mb-2">
            9. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            effective when posted. We encourage you to review this Policy
            periodically.
          </p>

          <h2 className="text-lg font-semibold mt-4 mb-2">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong>{" "}
            <span
              className="text-blue hover:underline cursor-pointer"
              onClick={() => handleMailTo("support@paid2workk.com")}
            >
              support@paid2workk.com
            </span>
            <br />
            <strong>Address:</strong> Noida, India
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
