import { RefreshCw, Clock, AlertCircle, Shield, Users } from "lucide-react";
import { useChat } from "../../contexts/supportContext";

export default function CancellationRefund() {
  const { setIsChatModalOpen } = useChat();

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-dvh">
      <div className="mb-6 ">
        <h2 className="text-xl font-medium text-black mb-1">
          Cancellation & Refund Policy
        </h2>
        <p className="text-gray-600">
          Protecting both freelancers and clients on paid2workk
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Project Cancellation Policy */}
        <div className="bg-blue/10 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-blue/90 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Project Cancellation
            </h2>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-blue/80 pl-4">
              <h3 className="font-medium text-black mb-2">
                Before Work Starts
              </h3>
              <p className="text-gray-700 text-sm">
                Projects can be cancelled within 24 hours of acceptance with
                full refund. No cancellation fees for either party.
              </p>
            </div>

            <div className="border-l-4 border-gold/90 pl-4">
              <h3 className="font-medium text-black mb-2">Work in Progress</h3>
              <p className="text-gray-700 text-sm">
                Mutual agreement required. Payment for completed milestones will
                be released to freelancer.
              </p>
            </div>

            <div className="border-l-4 border-red/90 pl-4">
              <h3 className="font-medium text-black mb-2">Near Completion</h3>
              <p className="text-gray-700 text-sm">
                Cancellation discouraged. Dispute resolution available if
                quality issues arise or any miscellaneous.
              </p>
            </div>

            <div className="bg-white rounded-md p-3 border border-blue-200">
              <p className="text-sm text-gray-600">
                <strong>How to Cancel:</strong> Use project dashboard or contact
                paid2workk support
              </p>
            </div>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="bg-blue/10 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <RefreshCw className="h-6 w-6 text-green/90 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Refund Policy
            </h2>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-green/90 pl-4">
              <h3 className="font-medium text-gray-900 mb-2">Full Refund</h3>
              <p className="text-gray-700 text-sm">
                Available if freelancer fails to deliver or work doesn't meet
                agreed specifications. Quality guarantee included.
              </p>
            </div>

            <div className="border-l-4 border-ranger/90 pl-4">
              <h3 className="font-medium text-gray-900 mb-2">Partial Refund</h3>
              <p className="text-gray-700 text-sm">
                For partially completed work or when milestones are met but
                project is cancelled early.
              </p>
            </div>

            <div className="border-l-4 border-purple/90 pl-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Milestone Protection
              </h3>
              <p className="text-gray-700 text-sm">
                Funds held in escrow until milestone approval. Automatic release
                after 7 days if no disputes.
              </p>
            </div>

            <div className="bg-white rounded-md p-3 border border-green-200">
              <p className="text-sm text-gray-600">
                <strong>Processing Time:</strong> 3-5 business days after
                dispute resolution
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Protection */}
      <div className="mt-8 bg-gray/30 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-gray-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Payment Protection
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-md border">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-medium text-gray-900">Escrow System</h3>
            <p className="text-sm text-gray-600">Secure milestone payments</p>
          </div>

          <div className="text-center p-4 bg-white rounded-md border">
            <div className="text-2xl mb-2">⚖️</div>
            <h3 className="font-medium text-gray-900">Dispute Resolution</h3>
            <p className="text-sm text-gray-600">Fair mediation process</p>
          </div>

          <div className="text-center p-4 bg-white rounded-md border">
            <div className="text-2xl mb-2">💯</div>
            <h3 className="font-medium text-gray-900">Quality Guarantee</h3>
            <p className="text-sm text-gray-600">Work meets specifications</p>
          </div>
        </div>
      </div>

      {/* Dispute Resolution Process */}
      <div className="mt-8 bg-purple/10 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-purple/60 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Dispute Resolution Process
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-purple/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple/90 font-bold">1</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Report Issue</h3>
            <p className="text-sm text-gray-600">
              Submit dispute through project dashboard
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple/90 font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Investigation</h3>
            <p className="text-sm text-gray-600">
              paid2workk team reviews evidence
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple/90 font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Mediation</h3>
            <p className="text-sm text-gray-600">
              Attempt resolution between parties
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple/90 font-bold">4</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Resolution</h3>
            <p className="text-sm text-gray-600">
              Final decision and payment release
            </p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mt-8 bg-red/20 border border-red/20 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red/90 mb-2">Important Notice</h4>
            <p className="text-sm text-red/80">
              Refunds are not available for work that has been completed and
              formally approved by the client through the platform.
              <br />
              <br />
              For custom development, design, or milestone-based projects,
              specific refund terms may apply based on the signed agreement or
              scope documentation. Clients and freelancers are advised to
              maintain clear communication and documentation throughout the
              engagement to avoid misunderstandings.
              <br />
              <br />
              Refund eligibility may be affected by:
            </p>
            <ul className="list-disc pl-5 mt-3 text-sm text-red/80 space-y-1">
              <li>Changes to project scope after approval</li>
              <li>Communication delays or lack of client response</li>
              <li>Partial delivery accepted or used by the client</li>
              <li>Failure to raise a dispute within 7 days of delivery</li>
            </ul>
            <p className="text-sm text-red/80 mt-4">
              All disputes are handled by the Paid2Workk support and dispute
              resolution team, whose decision shall be final after careful
              review of the communication and deliverables.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Need Help with a Dispute?
        </h3>
        <p className="text-gray-600 mb-4">
          Our support team is here to ensure fair resolution
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="bg-blue text-white px-4 py-1.5 rounded-md hover:bg-blue/90 transition-colors"
            onClick={() => setIsChatModalOpen(true)}
          >
            Contact Support
          </button>
          {/* <button className="border border-black/30 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray/50 transition-colors">
            Start Dispute Process
          </button> */}
        </div>
      </div>
    </div>
  );
}
