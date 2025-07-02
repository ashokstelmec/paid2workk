import { MessageSquare, Star } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function NoReviewsPrompt({
  projectComplete,
  userType,
  targetName,
  onAddReview,
}) {
  if (projectComplete !== "Completed") {
    return (
      <div className="bg-white border rounded-lg text-center p-6">
        <MessageSquare className="w-12 h-12 text-gray mx-auto mb-3" />
        <h3 className="text-lg font-medium text-primary mb-2">
          Project in Progress
        </h3>
        <p className="text-muted-foreground mb-2">
          You'll be able to leave a review once the project is complete.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg text-center p-6">
      <Star className="w-12 h-12 text-gray mx-auto mb-3" />
      <h3 className="text-lg font-medium text-primary mb-2">
        Share Your Experience
      </h3>
      <p className="text-muted-foreground mb-4">
        {userType === "client"
          ? `How was your experience working with ${targetName}? Your feedback helps other clients make informed decisions.`
          : `How was your experience working with ${targetName}? Your feedback helps other freelancers know what to expect.`}
      </p>
      <Button onClick={onAddReview} className="px-6 py-2.5">
        Leave a Review
      </Button>
    </div>
  );
}
