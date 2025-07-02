"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useChat } from "../../contexts/chatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, formatDistanceToNow } from "../../lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import Framer Motion
import { Badge } from "../ui/badge";

export function ChatSidebar({ onSelectContact, showSidebar, setShowSidebar }) {
  const {
    contacts,
    activeContact,
    handleContactClick: contextHandleContactClick,
  } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelection = async (contact) => {
    // console.log("🖱️ Selecting contact:", contact);

    if (!contact) {
      console.error("❌ No contact selected.");
      return;
    }

    try {
      setIsLoading(true);
      await contextHandleContactClick(contact);

      onSelectContact?.(contact);
    } catch (error) {
      console.error("❌ Error selecting contact:", error);
    } finally {
      setIsLoading(false);
      setShowSidebar(false);
    }
  };

  useEffect(() => {
    // console.log("🆕 Active contact updated:", activeContact);
  }, [activeContact]);

  return (
    <div className="flex flex-col h-full border-l border-y rounded-s-lg">
      <div className="p-[1.12rem] border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 flex flex-col gap-1">
          {filteredContacts.length === 0 ? (
            <div className="w-full text-center py-3">No Contacts</div>
          ) : (
            <AnimatePresence>
              {filteredContacts.map((contact) => (
                <motion.button
                  key={contact.id}
                  onClick={() => handleContactSelection(contact)}
                  className={cn(
                    "flex relative items-start gap-3 w-[18.5rem] p-3 rounded-lg text-left border border-muted/50 hover:border-blue/75 hover:shadow-md transition-all duration-300 ease-in-out",
                    activeContact?.id === contact.id
                      ? "bg-muted/75"
                      : "hover:bg-muted/50"
                  )}
                  disabled={isLoading}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage className="object-cover" src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0 relative">
                    <div className="flex justify-between items-center ">
                      <p className="font-medium truncate">{contact.name}</p>
                    </div>{" "}
                    {contact.projectName !== "" ? (
                      <div className="w-4/5">
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.projectName}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground truncate w-4/5">
                        {contact.lastMessage}
                      </p>
                    )}
                  </div>
                  <div className=" absolute top-1/2 right-3 -translate-y-1/2">
                    {contact.readTime === null &&
                    activeContact?.id !== contact.id &&
                    contact.type !== "send_new" &&
                    contact.unreadCount !== "0" ? (
                      <div className="bg-red text-white font-medium text-xs px-1.5 py-0.5 rounded-full motion-preset-confetti ">
                        {contact.unreadCount < 10 ? contact.unreadCount : "9+"}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground ">
                        {(() => {
                          const originalTimestamp = new Date(contact.timestamp);

                          // Apply offset (5h 18m in milliseconds)
                          const offsetMs = (5 * 60 + 18) * 60 * 1000;
                          const adjustedTimestamp = new Date(
                            originalTimestamp.getTime() + offsetMs
                          );

                          const now = new Date();
                          const isToday =
                            adjustedTimestamp.toDateString() ===
                            now.toDateString();

                          const yesterday = new Date();
                          yesterday.setDate(yesterday.getDate() - 1);
                          const isYesterday =
                            adjustedTimestamp.toDateString() ===
                            yesterday.toDateString();

                          const timeDifference =
                            now.getTime() - adjustedTimestamp.getTime();

                          if (timeDifference < 60 * 1000) {
                            return "Just now";
                          } else if (isToday) {
                            return adjustedTimestamp.toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            );
                          } else if (isYesterday) {
                            return "Yesterday";
                          } else {
                            return adjustedTimestamp.toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            );
                          }
                        })()}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
