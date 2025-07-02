import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const SupportProvider = ({ children }) => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const value = {
    isChatModalOpen,
    setIsChatModalOpen,
    isTicketModalOpen,
    setIsTicketModalOpen,
    isContactModalOpen,
    setIsContactModalOpen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
