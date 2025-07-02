import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";

const ProcessPayment = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchPaymentRequests = async () => {
      try {
        const response = await axios.get(
          "https://paid2workk.solarvision-cairo.com/api/Payments/withdrawal-requests"
        );
        setPaymentRequests(response.data);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };
    fetchPaymentRequests();
  }, [refresh]);

  const handleProcessPayment = async (reqId) => {
    try {
      const response = await axios.post(
        `https://paid2workk.solarvision-cairo.com/api/Payments/process-payment?paymentRequestId=${reqId}`,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setRefresh(!refresh);
      }
      // Optionally, you can refresh the payment requests after processing
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <div className="pt-20 md:pt-28 xl:pt-[7.5rem] md:mx-6 h-full">
      <div className="container mx-auto px-10 md:px-5 xl:px-24 2xl:px-16">
        <h3 className="text-2xl font-medium mb-10">Payment Requests</h3>
        <div className="rounded-t-lg border shadow-md mb-10">
          <div className="overflow-hidden rounded-t-lg ">
            <table className="table-auto w-full text-left border-collapse ">
              <thead className="bg-blue/5 border-b sticky top-0 z-10 shadow font-semibold">
                <tr>
                  <th className="p-5 text-sm font-medium text-gray-700 w-1/5">
                    S. No.
                  </th>
                  <th className="p-5 text-sm font-medium text-gray-700 w-1/5">
                    METHOD
                  </th>
                  <th className="p-5 text-sm font-medium text-gray-700 w-1/5">
                    AMOUNT
                  </th>
                  <th className="p-5 text-sm font-medium text-gray-700 w-1/5">
                    AMOUNT w/CHARGES
                  </th>
                  <th className="p-5 text-sm font-medium text-gray-700 w-1/5">
                    STATUS
                  </th>
                  <th className="p-5 text-sm font-medium text-gray-700 w-1/5">
                    ACTION
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable Table Body */}

          <div className="overflow-y-auto">
            <table className="table-auto w-full text-left border-collapse">
              <tbody>
                {paymentRequests.length > 0 ? (
                  paymentRequests.map((req, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition duration-300"
                    >
                      <td className="p-4 text-base text-gray-800 w-1/5 font-medium">
                        {index + 1}
                      </td>
                      <td className="p-4 text-base text-black font-medium w-1/5">
                        {req.paymentMethod}
                      </td>
                      <td className="p-4 text-sm w-1/5 rounded-lg">
                        {req.actualAmount}
                      </td>
                      <td className="p-4 text-sm w-1/5 rounded-lg">
                        {req.amount}
                      </td>

                      <td className="p-4 text-base text-gray-800 w-1/5">
                        <span
                          className={`text-sm border  rounded-full px-2 py-1 ${
                            req.status === "Success"
                              ? "bg-green/5 text-green border-green"
                              : "bg-gold/5 text-gold border-gold"
                          } font-medium`}
                        >
                          {req.status}
                        </span>
                      </td>

                      <td className="p-4 text-base text-gray-800 w-1/5">
                        {req.status !== "Success" && (
                          <Button
                            onClick={() =>
                              handleProcessPayment(req.withdrawalId)
                            }
                          >
                           {req.status === "Pending" ? "Process" : "Retry"} 
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      No requests available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessPayment;
