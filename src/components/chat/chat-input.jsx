import { useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useChat } from "../../contexts/chatContext";
import { Tooltip } from "@mui/material";

export function ChatInput() {
  const { sendMessage } = useChat();
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSendMessage = (e) => {
    if (message.trim() || attachment) {
      if (attachment) {
        sendMessage(message || "Sent an attachment", "file", file);
      } else {
        sendMessage(message, "text", null);
      }
      setMessage("");
      setAttachment(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFiles(e.target.files[0]);
      setAttachment(e.target.files[0]);
    }
  };

  // Upload files function
  async function uploadFiles(file) {
    const formData = new FormData();
    formData.append("NFiles", file);
    const senderId = sessionStorage.getItem("NUserID");
    const response = await fetch(
      `https://paid2workk.solarvision-cairo.com/UploadFile?userid=${senderId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) throw new Error("File upload failed");
    const data = await response.json();
    setFile(data.filePaths[0]);
    return;
  }

  return (
    <div className="p-2 sm:p-4 border-t ">
      {attachment && (
        <div className="mb-2 p-2 bg-muted rounded-md flex justify-between items-center ">
          <span className="text-sm truncate ">
            {attachment.name.length > 20
              ? `${attachment.name.slice(0, 20)}...`
              : attachment.name}
          </span>
          <div className="w-fit">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAttachment(null)}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Tooltip title="Attach File" placement="top">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 px-2.5"
          >
            <Paperclip className="h-5 w-5" />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </Button>
        </Tooltip>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type here..."
          className="min-h-10 flex-1 resize-none text-sm sm:text-base "
          rows={1}
        />
        <Tooltip title="Send" placement="top">
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim() && !attachment}
            className="flex-shrink-0 px-3"
          >
            <Send className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
