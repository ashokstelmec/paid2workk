import {
  Clock,
  Package,
  Shield,
  Calendar,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { useChat } from "../../contexts/supportContext";


function ProjectDelivery() {
  const { setIsChatModalOpen } = useChat();

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-dvh">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-black mb-2">
          Project Delivery & Timeline
        </h1>
        <p className="text-gray-600">
          Clear expectations for project completion and delivery on paid2workk
        </p>
      </div>

      {/* Project Types & Timelines */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue/10 rounded-lg p-6 text-center">
          <Package className="h-8 w-8 text-blue/90 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Quick Tasks
          </h3>
          <p className="font-medium text-blue mb-2">1-3 Days</p>
          <p className="text-sm text-gray-600 mb-3">
            Logo design, content writing, simple and complex editings
          </p>
          <div className="bg-white rounded-md p-2 text-xs text-black/50">
            Same-day delivery available
          </div>
        </div>

        <div className="bg-green/10 rounded-lg p-6 text-center border-2 border-green-200">
          <div className="relative">
            <Package className="h-8 w-8 text-green/90 mx-auto mb-3" />
            <div className="absolute -top-2 -right-2 bg-green text-white text-xs px-2 py-1 rounded-full">
              Popular
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Standard Projects
          </h3>
          <p className="font-medium text-green mb-2">1-2 Weeks</p>
          <p className="text-sm text-gray-600 mb-3">
            Website development, app design, marketing campaigns
          </p>
          <div className="bg-white rounded-md p-2 text-xs text-black/50">
            Milestone-based delivery
          </div>
        </div>

        <div className="bg-purple/10 rounded-lg p-6 text-center">
          <Package className="h-8 w-8 text-purple/90 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Complex Projects
          </h3>
          <p className="font-medium text-purple mb-2">1-3 Months</p>
          <p className="text-sm text-gray-600 mb-3">
            Full-stack development, enterprise solutions, shopify development
          </p>
          <div className="bg-white rounded-md p-2 text-xs text-black/50">
            Custom timeline negotiation
          </div>
        </div>
      </div>

      {/* Delivery Process */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-medium text-gray-900">
              Delivery Process
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-md">
              <span className="font-medium text-gray-900">Project Kickoff</span>
              <span className="text-green font-medium">Day 1</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-md">
              <span className="font-medium text-gray-900">
                First Draft/Milestone
              </span>
              <span className="text-blue font-medium">25% Timeline</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-md">
              <span className="font-medium text-gray-900">Revision Round</span>
              <span className="text-ranger font-medium">50% Timeline</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-md">
              <span className="font-medium text-gray-900">Final Delivery</span>
              <span className="text-purple font-medium">100% Timeline</span>
            </div>
          </div>
        </div>

        <div className="bg-gray/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-medium text-gray-900">
              Communication Standards
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-900">Response Time</span>
                <span className="text-sm text-green">Within 24 hours</span>
              </div>
              <p className="text-sm text-gray-600">
                All messages and project updates
              </p>
            </div>

            <div className="p-3 bg-white rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-900">
                  Progress Updates
                </span>
                <span className="text-sm text-blue">Every 2-3 days</span>
              </div>
              <p className="text-sm text-gray-600">
                Regular status reports on project
              </p>
            </div>

            <div className="p-3 bg-white rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-900">
                  Milestone Reviews
                </span>
                <span className="text-sm text-purple">As scheduled</span>
              </div>
              <p className="text-sm text-gray-600">Detailed review sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Assurance Features */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-blue/10 rounded-lg">
          <Shield className="h-8 w-8 text-blue mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">Quality Check</h3>
          <p className="text-sm text-black/50">Pre-delivery review</p>
        </div>

        <div className="text-center p-4 bg-green/10 rounded-lg">
          <Clock className="h-8 w-8 text-green mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">On-Time Delivery</h3>
          <p className="text-sm text-black/50">95% success rate</p>
        </div>

        <div className="text-center p-4 bg-purple/10 rounded-lg">
          <MessageSquare className="h-8 w-8 text-purple mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">
            Unlimited Revisions
          </h3>
          <p className="text-sm text-black/50">Until satisfaction</p>
        </div>

        <div className="text-center p-4 bg-ranger/10 rounded-lg">
          <Calendar className="h-8 w-8 text-ranger mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">
            Flexible Scheduling
          </h3>
          <p className="text-sm text-black/50">Work with your timezone</p>
        </div>
      </div>

      {/* Milestone System */}
      <div className="bg-blue/10 to-purple-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Milestone-Based Delivery
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">How It Works</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Projects divided into clear milestones</li>
              <li>• Payment released per milestone completion</li>
              <li>• Client approval required for each phase</li>
              <li>• Transparent progress tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Benefits</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Reduced risk for both parties</li>
              <li>• Clear project progression</li>
              <li>• Regular feedback opportunities</li>
              <li>• Secure payment protection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delivery Guarantees */}
      <div className="bg-gray/50 rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Our Delivery Guarantees
        </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-md p-2">
            <h3 className="font-medium text-sm text-gray-900 mb-1">
              On-Time Delivery Promise
            </h3>
            <p className="text-sm text-gray-600">
              If your project is delayed due to freelancer issues, you'll
              receive a partial refund or priority support for future projects.
            </p>
          </div>

          <div className="bg-white rounded-md p-2">
            <h3 className="font-medium text-sm text-gray-900 mb-1">
              Quality Satisfaction Guarantee
            </h3>
            <p className="text-sm text-gray-600">
              Work must meet the agreed specifications. If not satisfied,
              unlimited revisions are included until requirements are met.
            </p>
          </div>

          <div className="bg-white rounded-md p-2">
            <h3 className="font-medium text-sm text-gray-900 mb-1">
              Communication Commitment
            </h3>
            <p className="text-sm text-gray-600">
              All freelancers must maintain regular communication. Lack of
              response for 48+ hours triggers automatic support intervention.
            </p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Questions about project delivery?
        </h3>
        <p className="text-gray-600 mb-2">
          Our project management team is here to ensure smooth delivery
        </p>
        <button className="bg-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors" onClick={() => setIsChatModalOpen(true)}>
          Contact Project Support
        </button>
      </div>
    </div>
  );
}

export default ProjectDelivery;