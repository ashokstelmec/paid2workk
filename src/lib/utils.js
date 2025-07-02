import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDistanceToNow(date) {
  // Convert the input date (string) to a Date object
  const localDate = new Date(date);

  // Get the current local time and adjust for the timezone (5 hours 30 minutes for IST)
  const now = new Date();
  now.setHours(now.getHours() - 5);
  now.setMinutes(now.getMinutes() - 30);

  // Calculate the time difference in milliseconds
  const diffInMilliseconds = now - localDate;

  if (diffInMilliseconds < 1000) {
    return "Just now";
  }

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  // Format the date to a readable string in local time
  const options = { month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}