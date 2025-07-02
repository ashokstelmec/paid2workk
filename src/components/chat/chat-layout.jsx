"use client";

import { useEffect, useState } from "react";
import { useChat } from "../../contexts/chatContext";
import { ChatSidebar } from "./chat-sidebar";
import { ChatHeader } from "./chat-header";
import ChatMessages from "./chat-messages";
import { ChatInput } from "./chat-input";
import { ChatProfile } from "./chat-profile";
import { QuotationModal } from "./quotation-modal";
import { CreateQuotationModal } from "./create-quotation-modal";
import { UserRoundSearch, X } from "lucide-react";

import Lottie from "react-lottie";
import lottieAnimation from "../../assets/Lotties/circular.json";
import { useLocation } from "react-router-dom";
import PaymentModal from "./payment-modal";

export function ChatLayout() {
  const location = useLocation();
  const roomId = location.state?.roomId || "";
  const {
    activeContact,
    setActiveContact,
    loadingChat,
    contacts,
    sendMessage,
    handleContactClick,
    setInviteLoading,
    isConnecting,
    projectMilestones,
    sideProfileDetails,
  } = useChat();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showCreateQuotationModal, setShowCreateQuotationModal] =
    useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMessages, setShowMessges] = useState(false);
  const [quotationLoading, setQuotationLoading] = useState(true);
  const [payMessageId, setPayMessageId] = useState(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleViewQuotation = async (quotationId) => {
    try {
      setShowQuotationModal(true);
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/api/Quotation/GetQuotations?NMilestoneId=${quotationId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch quotation details");
      }
      const quotations = await response.json();
      const selectedQuotation = quotations[0];
      setSelectedQuotation(selectedQuotation);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
    } finally {
      setQuotationLoading(false);
    }
  };

  const handleContactSelect = () => {
    setShowSidebar(false);
  };

  const handleMakePayment = async (quotationId, messageId) => {
    try {
      setShowPaymentModal(true);
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/api/Quotation/GetQuotations?NMilestoneId=${quotationId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch quotation details");
      }
      const quotations = await response.json();
      const selectedQuotation = quotations[0];

      setSelectedQuotation(selectedQuotation);
      setPayMessageId(messageId);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
    } finally {
      setQuotationLoading(false);
    }
  };

  useEffect(() => {
    if (activeContact === null) {
      setShowMessges(false);
    } else {
      setShowMessges(true);
    }
  }, [activeContact]);

  useEffect(() => {
    const selectContact = async () => {
      if (roomId !== "" && contacts.length > 0) {
        const contact = contacts.find(
          (contact) => String(roomId) === String(contact.id)
        );
        if (!contact) {
          return;
        }

        await handleContactClick(contact);
      }
    };
    selectContact();
  }, [location.pathname]);

  useEffect(() => {
    setInviteLoading({ load: false, complete: false });
  }, []);

  return (
    <div
      className={`flex h-[calc(100dvh-7rem)] bg-background md:shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
        isConnecting && "justify-center items-center"
      }`}
    >
      {isConnecting ? (
        <>
          <Lottie options={defaultOptions} height={"15rem"} width={"15rem"} />
        </>
      ) : (
        <>
          {/* Mobile sidebar overlay */}
          {showSidebar && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}
          {showProfile && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowProfile(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
        fixed md:relative inset-y-0 left-0 z-50 w-80 bg-background transition-transform duration-200 ease-in-out
        md:translate-x-0 md:z-0 h-full
        ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
          >
            <ChatSidebar
              onSelectContact={handleContactSelect}
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
            />
          </div>

          {/* Main content */}
          {showMessages ? (
            <div className="flex flex-col flex-1 w-full md:border-b md:rounded-br-lg">
              <ChatHeader
                onRequestQuotation={() => setShowCreateQuotationModal(true)}
                onToggleSidebar={() => setShowSidebar(!showSidebar)}
                onToggleProfile={() => setShowProfile(true)}
              />
              {loadingChat ? (
                <div className="flex items-center justify-center h-full w-full border-x">
                  <Lottie
                    options={defaultOptions}
                    height={"10rem"}
                    width={"10rem"}
                  />
                </div>
              ) : (
                <div className="flex flex-1 overflow-hidden w-full">
                  <div className="flex-1 flex flex-col border-x border-b rounded-b-xl md:border-b-0 md:rounded-none">
                    <ChatMessages
                      onViewQuotation={handleViewQuotation}
                      handlePaymentButton={handleMakePayment}
                    />
                    <ChatInput />
                  </div>

                  {/* Profile */}
                  {activeContact && (
                    <div
                      className={`
              fixed lg:relative inset-y-0 right-0 z-50 w-80 bg-background transition-transform duration-200 ease-in-out rounded-br-lg
              lg:translate-x-0 lg:z-0 h-full
              ${
                showProfile
                  ? "translate-x-0"
                  : "translate-x-full lg:translate-x-0"
              }
            `}
                    >
                      <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-muted lg:hidden z-50"
                        onClick={() => setShowProfile(false)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <ChatProfile
                        contact={activeContact}
                        quotationDetails={projectMilestones}
                        sideProfileDetails={sideProfileDetails}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col flex-1 relative w-full lg:w-auto md:border rounded-r-lg justify-center items-center">
              <button
                className="flex items-center justify-center gap-1 md:hidden absolute top-6 left-6 font-medium text-blue border px-4 py-1 rounded border-blue text-sm hover:brightness-110 hover:shadow duration-300 ease-in-out"
                onClick={() => setShowSidebar(true)}
              >
                <UserRoundSearch className="w-4 h-4 " /> <span>Contacts</span>
              </button>
              <span> Select a contact to start a conversation</span>
            </div>
          )}

          {showQuotationModal && selectedQuotation && (
            <QuotationModal
              quotation={selectedQuotation}
              isOpen={showQuotationModal}
              onClose={() => setShowQuotationModal(false)}
              loading={quotationLoading}
            />
          )}

          {showCreateQuotationModal && (
            <CreateQuotationModal
              isOpen={showCreateQuotationModal}
              onClose={() => setShowCreateQuotationModal(false)}
            />
          )}

          {showPaymentModal && selectedQuotation && (
            <PaymentModal
              quotation={selectedQuotation}
              payMessageId={payMessageId}
              isOpen={showPaymentModal}
              setIsOpen={setShowPaymentModal}
              loading={quotationLoading}
            />
          )}
        </>
      )}
    </div>
  );
}
