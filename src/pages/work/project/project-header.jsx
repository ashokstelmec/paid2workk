import { Tooltip } from "@mui/material";
import { Bookmark } from "lucide-react";

export default function ProjectHeader({
  title,
  status,
  isLoading,
  applied,
  handleOpenModal,
  user,
  handleSaveJob,
  project,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="w-full flex md:flex-row flex-col gap-2">
        <div className="flex justify-between md:justify-normal items-center max-w-3xl gap-4 w-full">
          <h2 className="text-base font-medium truncate">{title}</h2>
          {status && (
            <span
              className={`px-3 py-1 ${
                status === "Posted" || status === "Open"
                  ? "bg-blue/5 text-blue"
                  : status === "Ongoing"
                  ? "bg-purple/5 text-purple"
                  : status === "Cancelled"
                  ? "bg-red/5 text-red"
                  : status === "Completed"
                  ? "bg-green/5 text-green"
                  : ""
              } rounded-full text-sm font-medium`}
            >
              {status === "Posted" ? "Open" : status}
            </span>
          )}
        </div>
        {!isLoading &&
          sessionStorage.getItem("roleId") === "1" &&
          (project.status === "Posted" || project.status === "Open") && (
            <div className="flex gap-2 items-center whitespace-nowrap">
              <button
                className={`${
                  applied
                    ? "bg-blue/50 cursor-not-allowed"
                    : "bg-blue hover:brightness-125"
                } rounded-lg py-1 px-3 text-sm md:px-4 text-white duration-300 ease-in-out whitespace-nowrap`}
                onClick={!applied ? handleOpenModal : undefined}
                disabled={applied}
              >
                {applied ? "Bid Placed" : "Place Bid"}
              </button>

              {user && sessionStorage.getItem("roleId") === "1" && (
                <Tooltip title={project.like ? "Unsave" : "Save"}>
                  <button className="text-blue" onClick={handleSaveJob}>
                    {project.like ? (
                      <Bookmark className="fill-blue w-6 h-6 duration-300 ease-in-out transition-all" />
                    ) : (
                      <Bookmark className="w-6 h-6" />
                    )}
                  </button>
                </Tooltip>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
