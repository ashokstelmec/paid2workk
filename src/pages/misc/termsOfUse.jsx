import React from "react";

const TermsOfUse = () => {
  const handleMailTo = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="container mx-auto  py-8 pb-4 px-10 md:px-5 max-w-7xl">
      <div className="space-y-2 text-start mb-2 pl-6">
        <h1 className="text-xl font-semibold tracking-tighter">
          Terms of Use
        </h1>
      </div>

      <div className="p-6 py-0  mb-8 text-sm">
        <div className=" max-w-none">
          <p className="flex flex-col">
            Welcome to Paid2Workk. These Terms of Use ("Terms") govern your
            access to and use of our website, mobile applications, and services.
            By registering, accessing, or using the Platform, you agree to be
            bound by these Terms and our Privacy Policy. If you do not agree,
            you may not use the Platform.
          </p>

          <h2 className="text-lg font-medium mt-6 mb-2">1. Eligibilty</h2>
          <p>
            You must be at least 18 years old and legally capable of entering
            into contracts to use the Platform. By using the Platform, you
            represent and warrant that you meet these requirements.
          </p>

          <h2 className="text-lg font-medium mt-4 mb-2">
            2. Account Registration
          </h2>
          <p>
            To use many features of the Platform, you must create an account.
          </p>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              Provide accurate and complete information during registration
            </li>
            <li>Maintain the security of your account and password</li>
            <li>
              Notify us immediately of unauthorized use or security breaches
            </li>
            <li>Be responsible for all activities under your account</li>
          </ul>
          <p className="mt-4">
            We reserve the right to suspend or terminate accounts at our
            discretion.
          </p>

          <h2 className="text-lg font-medium mt-4 mb-2">3. Platform Roles</h2>
          <p>
            The Platform connects <strong>Clients</strong> (those seeking
            services) with <strong>Freelancers</strong> (those providing
            services).
          </p>

          <div className="md:pl-8 pt-2">
            <p className=" font-medium">a. Clients agree to:</p>
            <ul className="list-disc pl-10 space-y-2 pt-2">
              <li>
                Post legitimate projects and provide clear, complete job
                requirements
              </li>
              <li>
                Pay freelancers for work completed according to agreed terms
              </li>
              <li>Refrain from discrimination or abusive behavior</li>
            </ul>
            <p className=" font-medium mt-2">b. Freelancers agree to:</p>
            <ul className="list-disc pl-10 space-y-2 pt-2">
              <li>Provide accurate qualifications and experience</li>
              <li>Deliver work in a timely, professional manner</li>
              <li>Not plagiarize, misrepresent, or deliver fraudulent work</li>
            </ul>
          </div>

          <h2 className=" font-medium mt-4 mb-0">4. Payments and Fees</h2>
          <ul className="list-disc pl-10 space-y-2 pt-2">
            <li>
              Clients agree to fund projects through the Platform's payment
              system.
            </li>
            <li>Freelancers will receive payment for completed work.</li>
            <li>
              We use third-party payment processors; you agree to their terms as
              well.
            </li>
          </ul>
          <p className="mt-4">
            We are not responsible for failed payments due to incorrect
            information or third-party system failures.
          </p>

          <h2 className="text-lg font-medium mt-4 mb-2">
            5. Dispute Resolution
          </h2>
          <p>
            Disputes between users should be resolved between the parties
            whenever possible. If necessary, you may request mediation through
            the Platform. Our decision in such cases is final and binding.
          </p>

          <h2 className="text-lg font-medium mt-4 mb-2">
            6. Prohibited Activities
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-10 space-y-2 pt-2">
            <li>Violate any laws or third-party rights</li>
            <li>Post false or misleading content</li>
            <li>Engage in spamming, phishing, or unauthorized advertising</li>
            <li>Circumvent fees by conducting business off-platform</li>
            <li>Upload viruses or malicious code</li>
          </ul>
          <p className="mt-4">
            Violations may result in suspension or permanent account
            termination.
          </p>

          <h2 className="text-lg font-medium mt-4 mb-2">
            7. Intellectual Property
          </h2>
          <p>
            All content on the Platform (excluding user-submitted content) is
            owned by or licensed to Paid2Workk and protected by intellectual
            property laws. Users may not copy, reproduce, or distribute any part
            of the Platform without our written permission.
          </p>
          <h2 className="text-lg font-medium mt-4 mb-2">
            8. User-Generated Content
          </h2>
          <p>
            You retain ownership of content you post, but grant us a
            non-exclusive, royalty-free license to use, display, and distribute
            it for the purposes of operating the Platform.
          </p>
          <h2 className="text-lg font-medium mt-4 mb-2">9. Termination</h2>
          <p>
            We may terminate or suspend your account at any time, with or
            without notice, for violating these Terms or for any reason at our
            discretion. Upon termination, your right to use the Platform ceases
            immediately.
          </p>

          <h2 className="text-lg font-medium mt-4 mb-0">10. Disclaimers</h2>
          <ul className="list-disc pl-10 space-y-2 pt-2">
            <li>
              We provide the Platform "as is" and make no warranties, express or
              implied, regarding its availability or accuracy.
            </li>
            <li>
              We do not guarantee the quality or reliability of freelancers or
              clients.
            </li>
            <li>
              We are not liable for any losses, damages, or disputes arising
              from use of the Platform.
            </li>
          </ul>
          <h2 className="text-lg font-medium mt-4 mb-2">
            11. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, Paid2Workk shall not be
            liable for indirect, incidental, or consequential damages arising
            from your use of the Platform.
          </p>
          <h2 className="text-lg font-medium mt-4 mb-2">
            12. Changes to These Terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            Platform after changes means you accept the revised Terms.
          </p>
          <h2 className="text-lg font-medium mt-4 mb-2">13. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Indian Jurisdiction. Any
            disputes will be resolved exclusively in the courts of Gautam Buddha
            Nagar, Uttar Pradesh, India.
          </p>
          <h2 className="text-lg font-medium mt-4 mb-2">14. Contact Us</h2>
          <p>If you have any questions or concerns, please contact us at:</p>
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

export default TermsOfUse;
