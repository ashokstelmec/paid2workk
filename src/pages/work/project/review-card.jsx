import { Share2, Star } from "lucide-react";

export default function ReviewCard({ review }) {
  const {
    reviewer = {},
    rating = 0,
    projectTitle = "",
    comment = "", // changed from reviewText
    skills = [],
    date = new Date().toISOString(),
    amount = 0,
  } = review || {};

  const formattedAmount = Number(amount).toFixed(2);
  const formattedRating = Number(rating).toFixed(1);  

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-start mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 fill-current ${
                i < rating ? "text-pink-500" : "text-gray-300"
              }`}
            />  
          ))}
          <span className="ml-2 font-medium text-gray-800">
            {formattedRating}
          </span>
        </div>
        <div className="text-xl font-bold text-gray-800">
          ${formattedAmount} USD
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-800 mb-2">{projectTitle}</h3>
      <p className="text-gray-700 mb-4">{comment}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {Array.isArray(skills) &&
          skills.map((skill) => (
            <span
              key={skill}
              className="text-blue-600 hover:underline cursor-pointer text-sm"
            >
              {skill}
            </span>
          ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={reviewer.avatar || "/placeholder.svg"}
              alt={reviewer.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium text-gray-800">{reviewer.name}</span>
          <span className="text-gray-500">@{reviewer.username}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">{date}</span>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
