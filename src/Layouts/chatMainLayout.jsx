import React from "react";
import { ChatProvider } from "../contexts/chatContext";
import { ChatLayout } from "../components/chat/chat-layout";

const ChatMainLayout = () => {

  return (
    // <ChatProvider>
      <div className="pt-24 container mx-auto max-w-7xl px-5 h-fit ">
        <ChatLayout />
      </div>
    // </ChatProvider>
  );
};

export default ChatMainLayout;
