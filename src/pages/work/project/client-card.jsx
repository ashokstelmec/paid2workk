import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Check,
  User,
  Calendar,
  Users,
  Award,
  Globe,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import axios from "axios";

export default function ClientCard({ client }) {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const userId = sessionStorage.getItem("NUserID");

    if (userId) {
      axios
        .get(
          `https://paid2workk.solarvision-cairo.com/GetFeedbackByUserId?NUserID=${userId}`
        )
        .then((response) => {
          const data = response.data;
          if (response.status === 200) {
            setFeedbackData(data);
          } else {
            console.warn("No feedback data found for the user.");
          }
        })
        .catch((error) =>
          console.error("Error fetching feedback data:", error)
        );
    }
  }, []);

  return (
    <div className="bg-white rounded-lg border p-4 h-fit">
      <h2 className="text-base font-semibold text-black mb-2">About the Client</h2>

      <div className="flex items-center gap-3 mb-4">
        <div className="border rounded-full bg-blue/50 shadow shadow-blue/50 flex items-center justify-center overflow-hidden w-12 h-12">
          <Avatar>
            <AvatarImage src={client.photopath} alt={client.username} />
            <AvatarFallback>{client.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-black" />
            <span className="text-xs text-black">
              {client.city}, {client.state}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 black" />
            <span className="text-black text-xs">{client.language}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              const isHalfFilled =
                client.rating >= star - 0.5 && client.rating < star;
              return (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= client.rating
                      ? "text-gold fill-gold"
                      : isHalfFilled
                      ? "text-gold fill-none stroke-gold"
                      : "text-muted-foreground"
                  }`}
                />
              );
            })}
          </div>
          <span className="font-medium text-muted-foreground pr-2 pl-1 text-sm">
            {client.rating?.toFixed(1) || "0.0"}
          </span>
          <span className="bg-gold/5 text-gold text-xs px-2 py-0.5 rounded">
            {feedbackData?.totalFeedback || 0} review
            {feedbackData?.totalFeedback !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3 h-3" />
          <span>
            Member since{" "}
            {new Date(client.createdOn).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
