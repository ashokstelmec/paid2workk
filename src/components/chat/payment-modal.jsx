import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { IconButton, Skeleton } from "@mui/material";
import { ScrollArea } from "../ui/scroll-area";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/chatContext";
import { useAuth } from "../../contexts/authContext";

// Sample invoice data - replace with your actual data source
const invoiceData = {
  invoiceNumber: "INV-2023-001",
  date: "March 27, 2025",
  dueDate: "April 10, 2025",
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St, Anytown, USA",
  },
  items: [
    {
      id: 1,
      description: "Website Development",
      quantity: 1,
      unitPrice: 1200.0,
      amount: 1200.0,
    },
    {
      id: 2,
      description: "UI/UX Design",
      quantity: 1,
      unitPrice: 800.0,
      amount: 800.0,
    },
    {
      id: 3,
      description: "Content Creation",
      quantity: 5,
      unitPrice: 100.0,
      amount: 500.0,
    },
  ],
  subtotal: 2500.0,
  tax: 250.0,
  total: 2750.0,
};

const getJobType = (type) => {
  switch (type) {
    case "0":
      return "Hourly Rate";
    case "1":
      return "Fixed Price";
    default:
      return "Hourly Rate";
  }
};

export default function PaymentModal({
  quotation,
  isOpen,
  setIsOpen,
  loading,
  payMessageId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { paymentStatusMessage, activeContact, handleContactClick } = useChat();
  const { getCurrencySymbolId } = useAuth();

  const navigate = useNavigate();

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus(null);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Wallet/confirm-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: sessionStorage.getItem("NUserID"),
            nProjectId: quotation.nProjectId,
            nMilestoneId: quotation.nMilestoneId,
            messageId: payMessageId,
          }),
        }
      );

      if (response.status === 400) {
        toast.error("Payment failed due to Insufficient balance.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setTimeout(() => {
          navigate("/dashboard/payments/my-wallet");
        }, 3000);
        return;
      }
      paymentStatusMessage("Payment Successful !", "paymentStatus", null);
      setPaymentStatus("success");
      setIsOpen(false);
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
    } finally {
      setIsLoading(false);
      await handleContactClick(activeContact);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 py-4 rounded-t-lg border-b z-30 flex flex-row justify-between items-center">
          <div className="flex flex-col gap-1 items-start">
            <DialogTitle>Quotation Details</DialogTitle>
            <DialogDescription className="text-start">
              Review quotation details before proceeding to payment.
            </DialogDescription>
          </div>
          <IconButton onClick={() => setIsOpen(false)} disabled={isLoading}>
            <X className="w-5 h-5 text-red hover:text-red/90" />
          </IconButton>
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
                          {`${getCurrencySymbolId(quotation.currency)} ${
                            item.amount
                          }`}
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
                        {`${getCurrencySymbolId(quotation.currency)} ${
                          quotation.totalAmount
                        }`}
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
        <DialogFooter className="flex justify-end py-4 px-6 sticky bottom-0 bg-white border-t">
          {paymentStatus === "success" ? (
            <div className="flex items-center gap-2 text-green">
              <Check className="h-5 w-5" />
              <span>Payment successful!</span>
            </div>
          ) : (
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Pay"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
