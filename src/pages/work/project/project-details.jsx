import { useState } from "react"
import { Share2, MoreHorizontal, MapPin, Star, Check, User, Calendar, Users, Award, Briefcase } from "lucide-react"

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("Details")

  const tabs = ["Details", "Proposals", "Upgrades", "Payments", "Files", "Tasklists", "Share", "Reviews"]

  return (
    <div className="max-w-7xl mx-auto p-4 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Bug fixing in Python PyQt code - GUI -- 2</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Complete</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-600">Bids · Average bid</div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">11</span>
              <span className="text-gray-700">·</span>
              <span className="font-bold text-xl">$97 USD</span>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <button className="px-4 py-2 text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Project Details</h2>
              <div className="text-right">
                <span className="text-gray-700 font-medium">
                  ${"30.00"} – ${"250.00"} USD
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">Bug fixing in Python PyQt code - GUI</p>

              <h3 className="font-bold text-gray-800 mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Python</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Software Architecture</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Swift</span>
              </div>
            </div>

            <div className="text-sm text-gray-500">Project ID: 32710770</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-700 mb-4">
              Detailed description of the project would go here. This section would include all the specific
              requirements, expectations, and details about the bug fixing task in Python PyQt code.
            </p>

            <h3 className="font-bold text-gray-800 mb-3">Budget</h3>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">
                ${"30.00"} – ${"250.00"} USD
              </span>
            </div>

            <h3 className="font-bold text-gray-800 mb-3">Skills and Expertise</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Python</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Software Architecture</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Swift</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">About the Client</h2>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Bangalore</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-700">India</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-1 mb-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">5.0</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">24</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Member since Jun 10, 2013</span>
              </div>
            </div>

            <h3 className="font-medium text-gray-800 mb-2">Client Engagement</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-green-500" />
                <span>Contacted less than 10 freelancers</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-green-500" />
                <span>Invited 0 freelancers to bid</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-green-500" />
                <span>Completed 24 projects</span>
              </li>
            </ul>

            <h3 className="font-medium text-gray-800 mb-2">Client Verification</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Identity verified</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Payment verified</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Deposit made</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Email verified</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                Apply Now
              </button>
              <button className="w-full py-2.5 px-4 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                Save Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
