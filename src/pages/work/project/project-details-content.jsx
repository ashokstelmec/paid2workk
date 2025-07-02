import { Interweave } from "interweave";
import { Briefcase, File } from "lucide-react";
import { useAuth } from "../../../contexts/authContext";
import { Badge } from "../../../components/ui/badge";

export default function ProjectDetailsContent({ project, formation }) {
  const { getCurrencySymbolId, getCurrencySymbolName } = useAuth();

  return (
    <>
      <div className="bg-white rounded-lg border  p-4  h-fit">
        <h2 className="font-semibold text-black mb-1">Description</h2>
        <div className="prose max-w-[52rem] break-words mb-5 ">
          <Interweave
            content={project.description || project.bio || ""}
            transform={formation}
          />
        </div>

        <h3 className="font-medium  text-black mb-2">Budget</h3>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-4 h-4 text-black" />
          <span className="text-black text-sm">
            {getCurrencySymbolId(project.currency)} {project.budget} -
            {project.maxBudget} {getCurrencySymbolName(project.currency)}
          </span>
        </div>

        <h3 className="font-medium text-black mb-2">Skills and Expertise</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skill?.split(",").map((skill) => (
            <Badge key={skill}> {skill.trim()}</Badge>
          ))}
        </div>

        {project.file && (
          <>
            {" "}
            <h3 className="font-medium text-black mb-2">Attachment</h3>
            <div className="flex items-center gap-2 mb-4 bg-back w-48 p-2 rounded-lg border ">
              <div className="  rounded-lg  bg-white p-2  flex gap-2 items-center">
                <File className="w-7 h-7 fill-back text-blue" />
              </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm line-clamp-1">
                    {project?.file?.split("/")[8]}
                  </span>
                  <button className="text-xs text-blue font-medium hover:text-blue/90" onClick={() => {
                    window.open(project.file, '_blank');
                  }}>
                    View
                  </button>
                </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
