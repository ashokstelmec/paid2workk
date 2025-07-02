import { useChat } from "../../contexts/chatContext";
import { Button } from "../ui/button";
import { ArrowLeft, Info, EllipsisVertical } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function ChatHeader({
  onRequestQuotation,
  onToggleSidebar,
  onToggleProfile,
}) {
  const { activeContact, requestQuotation } = useChat();
  const navigate = useNavigate();

  const [lastRequestTime, setLastRequestTime] = useState(null);
  const userId = sessionStorage.getItem("NUserID");
  let contactId = "";
  const handleRequestQuotation = () => {
    const now = new Date();
    if (lastRequestTime && now - lastRequestTime < 5 * 60 * 1000) {
      toast.info("Please wait for a while before requesting again.", {
        autoClose: 3000,
        pauseOnHover: false,
      });
      return;
    }
    requestQuotation();
    setLastRequestTime(now);
  };

  useEffect(() => {
    contactId =
      activeContact?.senderId === userId
        ? activeContact.receiverId
        : activeContact.senderId;
  }, [activeContact.receiverId, activeContact.senderId, userId]);

  return (
    <div className="border h-16 p-4 flex justify-between items-center rounded-t-xl md:rounded-tr-lg md:rounded-tl-none relative z-10 bg-white w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <div className="flex items-center gap-2 ">
            <h2
              className="text-sm md:text-base font-semibold hover:underline hover:text-blue duration-300 transition-all ease-in-out cursor-pointer"
              onClick={() => {
                navigate("/user/details", {
                  state: { expertId: activeContact?.forwardto, role: activeContact?.freelancerId !== activeContact?.forwardto && "client" },
                });
              }}
            >
              {activeContact?.name}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:text-blue duration-300 transition-colors ease-in-out"
              onClick={onToggleProfile}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>

          <p
            className="text-xs text-muted-foreground truncate max-w-60 hover:underline hover:text-blue duration-300 transition-all ease-in-out cursor-pointer"
            onClick={() => {
              navigate(`/projects/details/${activeContact?.projectId}`);
            }}
          >
            {activeContact?.projectName !== "" && activeContact.projectName}
          </p>
        </div>
      </div>
      {!activeContact.button && activeContact.projectName !== "" && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRequestQuotation}
            size="sm"
            className="hidden lg:block"
          >
            Request Quotation
          </Button>
          <Button
            onClick={onRequestQuotation}
            size="sm"
            className="hidden lg:block"
          >
            Create Quotation
          </Button>

          {/* Mobile action buttons */}
          <div className="hidden sm:flex lg:hidden gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={handleRequestQuotation}
            >
              <span className="">Request Quotation</span>
            </Button>
            <Button size="xs" onClick={onRequestQuotation}>
              <span className="">Create Quotation</span>
            </Button>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="xs"
                className="flex items-center gap-1 border-none text-muted-foreground bg-white sm:hidden"
              >
                <EllipsisVertical className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2 space-y-2  motion-scale-in-[0.5] motion-translate-x-in-[15%] motion-translate-y-in-[-104%] motion-opacity-in-[0%] motion-duration-[250ms]">
              <Button
                variant="outline"
                size="xs"
                className="w-full"
                onClick={handleRequestQuotation}
              >
                Request Quotation
              </Button>
              <Button size="xs" className="w-full" onClick={onRequestQuotation}>
                Create Quotation
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
