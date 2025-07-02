"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "@mui/material";
import { useChat } from "../../contexts/chatContext";
import { useAuth } from "../../contexts/authContext";

export function QuotationModal({ quotation, isOpen, onClose, loading }) {
  const { sendResponse } = useChat();
  const { getCurrencySymbolId, getCurrencySymbolName } = useAuth();

  if (!quotation) return null;

  const handleAcceptQuotation = async () => {
    try {
      const userId = sessionStorage.getItem("NUserID");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/api/Quotation/UpdateQuotationStatus/${quotation.nMilestoneId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userId,
            status: "Approved",
            updatedBy: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept quotation");
      }

      await sendResponse(
        "accepted the Quotation",
        "response",
        quotation.nMilestoneId,
        "Accepted"
      );
      onClose();

      // You might want to add a success notification here
    } catch (error) {
      console.error("Error accepting quotation:", error);
      // You might want to add an error notification here
    }
  };

  const handleRejectQuotation = async () => {
    try {
      const userId = sessionStorage.getItem("NUserID");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/api/Quotation/UpdateQuotationStatus/${quotation.nMilestoneId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userId,
            status: "Reject",
            updatedBy: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept quotation");
      }
      await sendResponse(
        "rejected the Quotation",
        "response",
        quotation.nMilestoneId,
        "Rejected"
      );
      onClose();
      // You might want to add a success notification here
    } catch (error) {
      console.error("Error accepting quotation:", error);
      // You might want to add an error notification here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-h-[90dvh] w-[95vw] max-w-md sm:max-w-xl motion-scale-in-[0.9]  motion-translate-x-in-[0%] motion-translate-y-in-[100%] motion-opacity-in-[0%] motion-duration-[150ms] motion-ease-spring overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="p-4 rounded-t-lg">
            {loading ? <Skeleton width="200px" /> : quotation.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {loading ? (
            <div className="space-y-4 py-2 px-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border rounded-md p-3">
                  <Skeleton height={40} />
                  <Skeleton height={20} width="60%" />
                  <Skeleton height={20} width="40%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 py-2 px-4">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2 sm:p-3 font-medium text-xs sm:text-sm">
                        Description
                      </th>
                      <th className="text-right p-2 sm:p-3 font-medium text-xs sm:text-sm">
                        Time
                      </th>
                      <th className="text-right p-2 sm:p-3 font-medium text-xs sm:text-sm">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.milestones.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">
                          {item.milestoneTitle}
                        </td>
                        <td className="p-2 sm:p-3 text-right text-xs sm:text-sm">
                          {item.time}{" "}
                          {quotation.type === "0"
                            ? item.time === "1"
                              ? "Hour"
                              : "Hours"
                            : item.time === "1"
                            ? "Day"
                            : "Days"}
                        </td>

                        <td className="p-2 sm:p-3 text-right text-xs sm:text-sm">
                          {`${getCurrencySymbolId(quotation.currency)} ${item.amount}`}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-muted/50">
                      <td className="p-2 sm:p-3 font-medium text-xs sm:text-sm">
                        Total
                      </td>
                      <td className="p-2 sm:p-3 text-right font-medium text-xs sm:text-sm">
                        {Math.round(quotation.totalTime)}{" "}
                        {quotation.type === "0"
                          ? quotation.totalTime === "1.00"
                            ? "Hour"
                            : "Hours"
                          : quotation.totalTime === "1.00"
                          ? "Day"
                          : "Days"}
                      </td>
                      <td className="p-2 sm:p-3 text-right font-medium text-xs sm:text-sm">
                        {`${getCurrencySymbolId(quotation.currency)} ${quotation.totalAmount}`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border rounded-md p-3">
                <h3 className="font-medium mb-2 text-sm">Important Note</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Please note that we charge 0% platform fees and service
                  charges. The full amount will be paid to the freelancer.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>

        {quotation.status !== "Make Payment" &&
        quotation.status !== "Confirmed" &&
        quotation.status !== "Rejected" ? (
          quotation.createdBy === sessionStorage.getItem("NUserID") ? (
            <DialogFooter className="flex gap-2 flex-col sm:flex-row justify-end p-4 border-t">
              <span className="text-muted-foreground">
                Waiting for Response...
              </span>
            </DialogFooter>
          ) : (
            <DialogFooter className="flex gap-2 flex-col sm:flex-row justify-end p-4 border-t">
              <Button
                variant="outline"
                onClick={handleRejectQuotation}
                className="w-full sm:w-auto border-red text-red"
                disabled={loading}
              >
                Reject Quotation
              </Button>
              <Button
                className="w-full sm:w-auto mt-2 sm:mt-0"
                disabled={loading}
                onClick={handleAcceptQuotation}
              >
                {loading ? <Skeleton width={100} /> : "Accept Quotation"}
              </Button>
            </DialogFooter>
          )
        ) : (
          <div className="mt-2"></div>
        )}
      </DialogContent>
    </Dialog>
  );
}
