import React, { useState, useEffect } from "react";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Assets
import Bag from "../../../../assets/Wallet/money-bag.png";
import WalletPending from "../../../../assets/Wallet/wallet.png";
import Withdraw from "../../../../assets/Wallet/withdraw.png";
import WalletWithdraw from "../../../../assets/Wallet/walletWithdraw.png";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../assets/Logo/p2w_mini.png";

import {
  ArrowDownIcon,
  ArrowRight,
  ArrowUpIcon,
  CheckCircle,
  Download,
  PlusIcon,
  Shield,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../contexts/authContext";
import { razorpayKey } from "../../../../config";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Skeleton, Tooltip } from "@mui/material";
import { Button } from "../../../../components/ui/button";

const MyWallet = () => {
  const [methodFilter, setMethodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [refresh, setRefresh] = useState(false);

  const { getCurrencySymbolId, user } = useAuth();

  const [amount, setAmount] = useState("");
  const [symbol, setSymbol] = useState("");
  const [balance, setBalance] = useState(null);
  const [data, setData] = useState([]);
  const [totalCredit, setTotalCredit] = useState(null);
  const [totalSpend, setTotalSpend] = useState(null);
  const [currency, setCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [currencyId, setCurrencyId] = useState(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  // const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

  const resetDates = () => {
    setDateRange({ startDate: "", endDate: "" });
  };

  const transactionFeeRate = 0.02;
  const gstRate = 0.18;
  const transactionFee = amount ? parseFloat(amount) * transactionFeeRate : 0;
  // Calculate GST as 18% of transaction fee (not 36%).
  const gst = transactionFee ? transactionFee * gstRate : 0;
  const totalAmount = amount ? parseFloat(amount) + transactionFee + gst : 0;

  const validateAmount = (value) => {
    // Only allow numbers and decimal point.
    if (
      !/^\d*\.?\d*$/.test(value) ||
      /[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/.test(value)
    ) {
      return "Only numbers are allowed";
    }

    const numValue = parseFloat(value);
    if (currency === "INR" && numValue < 10) {
      return "Minimum deposit amount is 10 INR.";
    }
    if (currency !== "INR" && numValue <= 0) {
      return `Minimum deposit amount is 1 ${currency}.`;
    }
    return "";
  };

  useEffect(() => {
    fetch(
      "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveCurrency"
    )
      .then((response) => response.json())
      .then((data) => {
        setCurrencies(data);
        // Sort currencies to ensure INR is first if present
        const sortedCurrencies = [...data].sort((a, b) => {
          if (a.currency === "INR") return -1;
          if (b.currency === "INR") return 1;
          return 0;
        });

        if (sortedCurrencies.length > 0) {
          const defaultCurrency = sortedCurrencies[0];
          setCurrency(defaultCurrency.currency);
          setCurrencyId(defaultCurrency.currency_Id);
          setSymbol(defaultCurrency.symbol);
        }
      })
      .catch((error) => console.error("API Error:", error));
  }, []);

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    const selected = currencies.find((c) => c.currency === selectedCurrency);
    if (selected) {
      setCurrency(selected.currency);
      setCurrencyId(selected.currency_Id);
      setSymbol(selected.symbol);
    }
  };

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const NUserID = sessionStorage.getItem("NUserID");
        if (!NUserID) {
          console.error("NUserID not found in sessionStorage");
          return;
        }

        const apiUrl = `https://paid2workk.solarvision-cairo.com/api/Wallet/${NUserID}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }

        const data = await response.json();
        // console.log("Wallet API Response:", data);

        setWalletData(data);
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [refresh]);

  useEffect(() => {
    const fetchAccountBalance = async () => {
      try {
        const NUserID = sessionStorage.getItem("NUserID");
        if (!NUserID) {
          console.error("NUserID not found in sessionStorage");
          return;
        }

        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/api/Wallet/${NUserID}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }

        const responseData = await response.json();
        // console.log("Wallet Data:", responseData); // Debug log

        // Update all states with the fetched data
        setBalance(responseData.balance || 0);
        setTotalCredit(responseData.totalCredit || 0);
        setTotalSpend(responseData.totalSpend || 0);
        setData({
          ...responseData,
          symbol: responseData.symbol || getCurrencySymbolId[currency] || "$",
        });
        setTransactions(responseData.transactions || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setError("Failed to load wallet data");
        setLoading(false);
      }
    };

    fetchAccountBalance();
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    const confirmPayPalPayment = async () => {
      const token = searchParams.get("token");
      const payerID = searchParams.get("PayerID");

      // Return early if no token/payerID or if already processing
      if (!token || !payerID || isProcessingPayment) {
        return;
      }

      setIsProcessingPayment(true);

      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/api/Payments/paypal-confirm?token=${encodeURIComponent(
            token
          )}&PayerID=${encodeURIComponent(payerID)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        let result = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        }

        if (!response.ok) {
          if (result.error && result.error.includes("ORDER_ALREADY_CAPTURED")) {
            // toast.info("This payment has already been processed.");
          } else {
            toast.error(result.error || "Failed to confirm PayPal payment.");
          }
          return;
        }

        toast.success(result.Message || "Payment confirmed successfully.");
      } catch (error) {
        console.error("Error confirming PayPal payment:", error);
        toast.error("An error occurred while confirming payment.");
      } finally {
        setTimeout(() => navigate("../payments/my-wallet"), 2000);
        setTimeout(() => setRefresh((prev) => !prev), 10000);
      }
    };

    confirmPayPalPayment();
  }, [searchParams, isProcessingPayment]); // Add isProcessingPayment to dependencies

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(validateAmount(value));
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      const sessionData = {
        username: sessionStorage.getItem("username"),
        email: sessionStorage.getItem("email"),
        contact: user?.contact,
        NUserID: sessionStorage.getItem("NUserID"),
      };

      if (!totalAmount || !currency || !currencyId) {
        console.error("❌ Missing amount, currency, or currencyId.");
        return null;
      }

      const actualAmount = parseFloat(parseFloat(amount).toFixed(2));
      const roundedTotalAmount = Math.round(totalAmount * 100) / 100;

      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Payments/insert",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: roundedTotalAmount,
            actualAmount: actualAmount,
            currency: currency,
            CurrenCurrency_Id: currencyId,
            userId: sessionData.NUserID,
            projectId: sessionData.NUserID,
            paymentBy: "Auto",
            status: "Pending",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || (!data.paymentId && !data.PaymentId)) {
        console.error("❌ Payment creation failed:", data);
        toast.error("Order creation failed. Please try again.");
        return null;
      }

      return data;
    } catch (error) {
      console.error("❌ Error creating order:", error);
      toast.error("Something went wrong while creating the order.");
      return null;
    }
  };

  const displayRazorpay = async () => {
    setButtonLoading(true);
    if (error) {
      toast.error("Please fix the errors before proceeding.");
      return;
    }

    const sessionData = {
      username: sessionStorage.getItem("username"),
      email: sessionStorage.getItem("email"),
      contact: user?.contact,
      NUserID: sessionStorage.getItem("NUserID"),
    };

    const orderData = await createOrder();
    if (!orderData) {
      setButtonLoading(false);
      return;
    }

    const paymentId = orderData.paymentId || orderData.PaymentId;
    const orderId = orderData.orderId || orderData.OrderId;
    const paymentMethod = orderData.paymentMethod || orderData.PaymentMethod;
    const approvalUrl = orderData.approvalUrl || orderData.ApprovalUrl;

    if (!paymentId) {
      toast.error("Payment ID missing.");

      setButtonLoading(false);
      return;
    }

    if (paymentMethod === "PayPal" && currencyId !== "2") {
      if (!approvalUrl) {
        setButtonLoading(false);
        toast.error("Missing PayPal approval URL.");
        return;
      }
      window.location.href = approvalUrl;

      setButtonLoading(false);
      return;
    }

    const razorpaySdkLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!razorpaySdkLoaded) {
      toast.error("Razorpay SDK failed to load.");

      setButtonLoading(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: (totalAmount * 100).toFixed(0),
      currency: currency,
      name: "Paid2workk",
      description: "Payment Transaction",
      image:
        "https://paid2workk.solarvision-cairo.com/static/media/p2w.9bab6ed3605cef6f7a3b.png",
      order_id: orderId, // Use backend's orderId
      notes: {
        user_id: sessionData.NUserID,
        product: "Paid2workk",
        currenCurrency_Id: currencyId,
      },
      handler: async function (response) {
        // Use backend's orderId and Razorpay's payment_id
        const updateData = {
          paymentId,
          orderId, // This is the backend orderId, not response.razorpay_order_id
          userId: sessionData.NUserID,
          amount: totalAmount,
          currency,
          status: "Success",
          paymentBy: "Razorpay",
          razorpayPaymentId: response.razorpay_payment_id, // This comes from Razorpay
        };

        const updateResponse = await fetch(
          "https://paid2workk.solarvision-cairo.com/api/Payments/update",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json().catch(() => null);
          toast.error(errorData?.error || "Failed to update payment.");

          setButtonLoading(false);
          return;
        }

        toast.success("Payment successful!");
        setShowAmountModal(false);
        setTimeout(() => window.location.reload(), 3000);
      },
      prefill: {
        name: sessionData.username || "Customer",
        email: sessionData.email,
        contact: sessionData.contact || "8770875424",
      },
      theme: { color: "#0b64fc" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function (response) {
      // Use backend's orderId and Razorpay's payment_id if available
      const failureData = {
        paymentId,
        orderId, // This is the backend orderId
        userId: sessionData.NUserID,
        amount: totalAmount,
        currency,
        status: "Failed",
        paymentBy: "Razorpay",
        razorpayPaymentId: response.razorpay_payment_id, // May be undefined if payment failed before creation
        failureReason:
          response.error.description || "Payment was not completed",
      };

      const failureResponse = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Payments/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(failureData),
        }
      );

      if (!failureResponse.ok) {
        toast.error("Failed to update failed payment.");

        setButtonLoading(false);
      }

      toast.error("Payment failed.");
    });

    setButtonLoading(false);
    rzp.open();
  };

  // Add this new function for downloading.
  const handleDownload = async () => {
    try {
      const NUserID = sessionStorage.getItem("NUserID");
      if (!dateRange.startDate || !dateRange.endDate) {
        alert("Please select both start and end dates");
        return;
      }

      const params = new URLSearchParams({
        startdate: `${dateRange.startDate}T00:00:01.001`,
        enddate: `${dateRange.endDate}T23:59:39.001`,
        type: "0",
        statusValue: "0",
        PayStatusValue: "0",
      });

      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/api/Wallet/download-history/${NUserID}?${params}`
      );

      if (!response.ok) {
        throw new Error("Failed to download history");
      }

      const data = await response.json();

      // Extract transactions array
      if (!data.transactions || !Array.isArray(data.transactions)) {
        throw new Error("Invalid response format");
      }

      const transactions = data.transactions;

      const formatDate = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString?.split("-");
        return `${day}/${month}/${year}`; // Converts YYYY-MM-DD → DD/MM/YYYY
      };

      // Check if transactions are available
      if (transactions.length === 0) {
        alert("No transactions found for the selected date range");
        return;
      }

      // Create PDF with the downloaded data.
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Transaction History", 14, 15);
      doc.setFontSize(10);
      doc.text(
        `From: ${formatDate(dateRange.startDate)} To: ${formatDate(
          dateRange.endDate
        )}`,
        14,
        25
      );

      autoTable(doc, {
        startY: 35,
        head: [
          ["Method", "Status", "Amount", "Date", "Process Date", "Remarks"],
        ],
        body: transactions.map((item) => [
          item.paymentBy,
          item.payStatus,
          `${item.currency} ${item.amount}`,
          new Date(item.transactionDate).toLocaleDateString(),
          item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-",
          item.remarks || "---",
        ]),
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [11, 100, 252] },
      });

      doc.save("transaction-history.pdf");
      setShowDownloadModal(false);
    } catch (error) {
      console.error("Error downloading history:", error);
      alert("Failed to download transaction history");
    }
  };

  const today = new Date().toISOString()?.split("T")[0];

  const validateAndSetStartDate = (newStartDate) => {
    const today = new Date().toISOString()?.split("T")[0];

    if (!newStartDate) {
      alert("From Date cannot be empty!");
      return;
    }

    if (newStartDate > today) {
      alert("From Date cannot be in the future!");
      return;
    }

    setDateRange((prev) => ({
      ...prev,
      startDate: newStartDate,
      endDate:
        prev.endDate && prev.endDate < newStartDate
          ? newStartDate
          : prev.endDate,
    }));
  };

  const validateAndSetEndDate = (newEndDate) => {
    const today = new Date().toISOString()?.split("T")[0];

    if (!newEndDate) {
      alert("To Date cannot be empty!");
      return;
    }

    if (newEndDate < dateRange.startDate) {
      alert("To Date cannot be earlier than From Date!");
      return;
    }

    if (newEndDate > today) {
      alert("To Date cannot be in the future!");
      return;
    }

    setDateRange((prev) => ({
      ...prev,
      endDate: newEndDate,
    }));
  };

  const handleDownloadClick = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select both From Date and To Date before downloading!");
      return;
    }
    handleDownload();

    resetDates();
  };

  const getFilteredTransactions = () => {
    return transactions.filter((transaction) => {
      const methodMatch =
        methodFilter === "All" || transaction.paymentBy === methodFilter;
      const statusMatch =
        statusFilter === "All status" || transaction.payStatus === statusFilter;
      return methodMatch && statusMatch;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const roleId = user?.roleId;

  // Pagination logic
  const handlePageChange = (pageNumber) => {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Paginate filtered transactions
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className=" pb-10">
        <div className="mt-6">
          <div className="flex flex-col items-center">
            <div className="w-full flex flex-col-reverse  rounded-lg ">
              {/* Wallet Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 ">
                {/* Withdrawable Balance */}
                <div className="text-mute overflow-hidden border bg-gradient-to-br h-fit from-blue to-cool hover:brightness-110 duration-300 hover:shadow-xl hover:shadow-navy/5 rounded-xl p-5 flex flex-row gap-2 cursor-pointer shadow-lg transition-all ease-in-out">
                  <div className="flex flex-col-reverse justify-between w-full">
                    <p className="text-sm text-white">Account Balance</p>
                    {balance !== null ? (
                      <h2 className="text-2xl font-semibold text-white truncate">
                        {data?.symbol || getCurrencySymbolId[currency] || "₹"}{" "}
                        {(balance || 0).toFixed(2)}
                      </h2>
                    ) : (
                      <h2 className="text-lg sm:text-xl font-medium text-gray-500 mt-2">
                        <Skeleton width={100} height={30} variant="text" />
                      </h2>
                    )}
                  </div>

                  <img
                    src={Bag}
                    alt="Currency"
                    className="w-8 h-8 lg:w-12 lg:h-12 invert-100 brightness-0 opacity-[0.8] "
                  />

                  {/* <FaMoneyBag className="text-3xl sm:text-4xl text-gray-600 mt-3" /> */}
                </div>

                {/* Withdraw Requested */}
                <div className="text-mute overflow-hidden border bg-gradient-to-br h-fit from-blue to-cool hover:brightness-110 duration-300 hover:shadow-xl hover:shadow-navy/5 rounded-xl p-5 flex flex-row gap-2 cursor-pointer shadow-lg transition-all ease-in-out">
                  <div className="flex flex-col-reverse  justify-between w-full">
                    <p className="text-sm text-white">
                      {/* WITHDRAWAL REQUESTED */}
                      Total Credited
                    </p>

                    {/* <h2 className="text-2xl sm:text-2xl font-medium text-black/70 mt-2">
                      $1,000
                    </h2> */}
                    {totalCredit !== null ? (
                      <h2 className="text-2xl font-semibold text-white truncate ">
                        {data?.symbol || getCurrencySymbolId[currency] || "$"}{" "}
                        {(totalCredit || 0).toFixed(2)}
                      </h2>
                    ) : (
                      <h2 className="text-lg sm:text-xl font-medium text-gray-500 mt-2">
                        <Skeleton width={100} height={30} variant="text" />{" "}
                      </h2>
                    )}
                  </div>
                  <img
                    src={WalletPending}
                    alt="Currency"
                    className="w-8 h-8 lg:w-12 lg:h-12 invert-100 brightness-0 opacity-[0.8] "
                  />

                  {/* <FaHourglassHalf className="text-3xl sm:text-4xl text-gray-600 mt-3" /> */}
                </div>

                {/* Withdrawn */}
                <div className="text-mute overflow-hidden border bg-gradient-to-br h-fit from-blue to-cool hover:brightness-110 duration-300 hover:shadow-xl hover:shadow-navy/5 rounded-xl p-5 flex flex-row gap-2 cursor-pointer shadow-lg transition-all ease-in-out">
                  <div className="flex flex-col-reverse  justify-between w-full">
                    <p className="text-sm text-white">
                      {roleId === "0" ? "Total Spent" : "Total Withdrawn"}
                    </p>
                    {totalSpend !== null ? (
                      <h2 className="text-2xl font-semibold text-white truncate">
                        {data?.symbol || getCurrencySymbolId[currency] || "$"}{" "}
                        {(totalSpend || 0).toFixed(2)}
                      </h2>
                    ) : (
                      <h2 className="text-lg sm:text-xl font-medium text-gray-500 mt-2">
                        <Skeleton width={100} height={30} variant="text" />{" "}
                      </h2>
                    )}
                  </div>
                  <img
                    src={Withdraw}
                    alt="Currency"
                    className="w-8 h-8 lg:w-12 lg:h-12 invert-100 brightness-0 opacity-[0.8] "
                  />

                  {/* <FaReceipt className="text-3xl sm:text-4xl text-gray-600 mt-3" /> */}
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full mt-7">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-medium text-black">
                  Recent Transactions
                </h3>
                {/* Wallet Header */}
                <div className="flex justify-end items-center gap-2">
                  <button
                    onClick={() => {
                      if (roleId !== "0") {
                        navigate("/withdrawal");
                      } else {
                        setShowAmountModal(true);
                      }
                    }}
                    className={` ${
                      roleId === "0" && "pr-3.5"
                    } flex items-center gap-1 px-2 py-1.5 text-sm text-white bg-blue rounded-lg hover:brightness-110 transition duration-200`}
                  >
                    {roleId === "0" ? (
                      <>
                        <PlusIcon className="w-4 h-4" />
                        Deposit
                      </>
                    ) : (
                      <span>Withdraw</span>
                    )}
                  </button>

                  <Tooltip
                    title="Download Transactions history"
                    placement="top"
                    arrow
                  >
                    <button
                      onClick={() => setShowDownloadModal(true)}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-white bg-blue rounded-lg hover:brightness-110 transition duration-200"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="w-full bg-white border rounded-lg px-4 py-4 mt-4">
                {/* Filters and Sorting */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                  <div className="flex gap-4">
                    <select
                      value={methodFilter}
                      onChange={(e) => setMethodFilter(e.target.value)}
                      className="border border-grey text-sm rounded-lg px-2 py-1.5 cursor-pointere bg-white"
                    >
                      <option>All</option>
                      <option>Razorpay</option>
                      <option>PayPal</option>
                      <option>netbanking</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-grey text-sm rounded-lg px-2 py-1.5 cursor-pointer bg-white hover:bg-white/30"
                    >
                      <option value="All status">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Success">Success</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Table Container */}
                <div className="relative border rounded-xl shadow-sm overflow-hidden">
                  {/* Sticky Table Header */}
                  <div className="overflow-hidden">
                    <table className="w-full table-auto text-left border-collapse">
                      <thead className="bg-gradient-to-t from-navy to-blue-800 sticky top-0 z-10 shadow text-white text-sm">
                        <tr>
                          <th className="p-4 font-semibold w-[7%]">S. No.</th>
                          <th className="p-4 font-semibold w-[19%]">
                            Payout Method
                          </th>
                          <th className="p-4 font-semibold w-[19%]">Status</th>
                          <th className="p-4 font-semibold w-[19%]">Amount</th>
                          <th className="p-4 font-semibold w-[19%]">Date</th>
                          <th className="p-4 font-semibold w-[20%]">
                            Credit / Debit
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="max-h-[450px] overflow-y-auto">
                    <table className="w-full table-auto text-left border-collapse">
                      <tbody>
                        {paginatedTransactions.length > 0 ? (
                          paginatedTransactions.map((txn, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-50 transition duration-300"
                            >
                              {/* S. No. */}
                              <td className="p-4 text-sm text-gray-700 font-medium w-[7%]">
                                {index + 1}
                              </td>

                              {/* Payout Method */}
                              <td className="p-4 text-sm text-gray-800 w-[19%]">
                                {isNaN(txn.paymentBy)
                                  ? txn.paymentBy
                                  : "Online"}
                              </td>

                              {/* Status Badge */}
                              <td className="p-4 text-sm w-[19%]">
                                <span
                                  className={`border text-xs font-medium px-2.5 py-1 rounded-full inline-block ${
                                    txn.payStatus === "Success"
                                      ? "bg-green-50 text-green-700 border-green-300"
                                      : txn.payStatus === "Failed"
                                      ? "bg-red-50 text-red-700 border-red-300"
                                      : "bg-yellow-50 text-yellow-800 border-yellow-300"
                                  }`}
                                >
                                  {txn.payStatus}
                                </span>
                              </td>

                              {/* Amount */}
                              <td className="p-4 text-sm text-black font-semibold w-[19%]">
                                {txn.amount} {txn.currency}
                              </td>

                              {/* Date */}
                              <td className="p-4 text-sm text-gray-700 w-[19%]">
                                {txn.updatedAt
                                  ? new Date(txn.updatedAt).toLocaleString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      }
                                    )
                                  : "-"}
                              </td>

                              {/* Credit / Debit */}
                              <td className="p-4 text-sm text-gray-800 w-[20%]">
                                <div className="flex items-center gap-3">
                                  {txn.status === "Credit" ? (
                                    <div className="flex items-center gap-3 text-blue-600">
                                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
                                        <ArrowDownIcon className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <div className="font-semibold">
                                          Credit
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {txn.paymentFor}
                                        </div>
                                      </div>
                                    </div>
                                  ) : txn.status === "Debit" ? (
                                    <div className="flex items-center gap-3 text-orange-600">
                                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-100">
                                        <ArrowUpIcon className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <div className="font-semibold">
                                          Debit
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {txn.paymentFor}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      {txn.status || "---"}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="p-6 text-center text-gray-500 text-sm"
                            >
                              No transactions available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Controls */}
                {filteredTransactions.length > itemsPerPage && (
                  <div className="flex justify-center mt-6">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex font-medium items-center justify-center gap-0.5 mx-1 pl-2 pr-3 py-0.5 text-sm rounded-lg ${
                        currentPage === 1
                          ? "bg-gray text-black/50 border-0"
                          : "bg-white text-blue"
                      } border border-blue duration-300 ease-in-out`}
                    >
                      <FaChevronLeft />
                      <span>Back</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      {
                        length: Math.ceil(
                          filteredTransactions.length / itemsPerPage
                        ),
                      },
                      (_, i) => i + 1
                    ).map((pageNum) => {
                      // Always show first page
                      if (pageNum === 1)
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-2 py-0.5 text-sm mx-1 rounded-lg ${
                              currentPage === pageNum
                                ? "bg-blue text-white no-underline"
                                : "bg-white text-blue"
                            } border border-blue`}
                          >
                            {pageNum}
                          </button>
                        );

                      // Always show last page
                      if (
                        pageNum ===
                        Math.ceil(filteredTransactions.length / itemsPerPage)
                      )
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-2 py-0.5 text-sm mx-1 rounded-lg ${
                              currentPage === pageNum
                                ? "bg-blue text-white no-underline"
                                : "bg-white text-blue"
                            } border border-blue`}
                          >
                            {pageNum}
                          </button>
                        );

                      // Show current page and one page before and after current
                      if (
                        pageNum === currentPage ||
                        pageNum === currentPage - 1 ||
                        pageNum === currentPage + 1
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-2 py-0.5 text-sm mx-1 rounded-lg ${
                              currentPage === pageNum
                                ? "bg-blue text-white no-underline"
                                : "bg-white text-blue"
                            } border border-blue`}
                          >
                            {pageNum}
                          </button>
                        );
                      }

                      // Show ellipsis after first page if needed
                      if (pageNum === 2 && currentPage > 3) {
                        return (
                          <span key={pageNum} className="px-2">
                            ...
                          </span>
                        );
                      }

                      // Show ellipsis before last page if needed
                      if (
                        pageNum ===
                          Math.ceil(
                            filteredTransactions.length / itemsPerPage
                          ) -
                            1 &&
                        currentPage <
                          Math.ceil(
                            filteredTransactions.length / itemsPerPage
                          ) -
                            2
                      ) {
                        return (
                          <span key={pageNum} className="px-2">
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredTransactions.length / itemsPerPage)
                      }
                      className={`flex font-medium items-center justify-center gap-0.5 mx-1 pl-3 pr-2 py-0.5 text-sm rounded-lg ${
                        currentPage ===
                        Math.ceil(filteredTransactions.length / itemsPerPage)
                          ? "bg-gray text-black/50 border-0"
                          : "bg-white text-blue"
                      } border border-blue duration-300 ease-in-out`}
                    >
                      <span>Next</span>
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAmountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header with logo and close button */}
            <div className="relative bg-blue/5 p-6 border-b border-blue/10">
              <button
                onClick={() => setShowAmountModal(false)}
                className="absolute right-6 top-6 text-red hover:bg-red/5 rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2">
                <div className=" rounded-full p-1.5 ">
                  <img src={Logo} alt="P" className="w-14 h-14" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue">Paid2Workk</h2>
                  <p className="text-blue/75 text-sm">Complete your payment</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Currency and Amount Input */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Currency
                  </label>
                  <select
                    className="w-full border  rounded-lg p-3 bg-white cursor-pointer h-12"
                    value={currency}
                    onChange={handleCurrencyChange}
                  >
                    {currencies.map((curr) => (
                      <option
                        key={curr.currency_Id}
                        value={curr.currency}
                        className="cursor-pointer"
                      >
                        {curr.currency_Name} ({curr.currency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {symbol}
                    </span>
                    <input
                      type="text"
                      className={`w-full border rounded-lg  ${
                        symbol.length < 3 ? "pl-8" : "pl-12"
                      } outline-none h-12 ${
                        error ? "border-red" : "border-gray-200"
                      }`}
                      placeholder="0.00"
                      value={amount}
                      onChange={handleAmountChange}
                      onKeyPress={(e) => {
                        if (!/[\d.]/.test(e.key)) e.preventDefault();
                        if (e.key === "." && amount.includes("."))
                          e.preventDefault();
                      }}
                    />
                  </div>
                  {error && <p className="text-red text-xs mt-1">{error}</p>}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Payment Summary</h3>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">
                      {parseFloat(amount || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      Processing Charges
                      <Tooltip
                        arrow
                        title="Charged by payment gateway."
                        placement="right"
                      >
                        {" "}
                        <IoMdInformationCircleOutline className="text-blue cursor-pointer" />
                      </Tooltip>
                    </div>
                    <span className="font-medium">
                      {transactionFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      GST on Processing Charges{" "}
                      <Tooltip
                        arrow
                        title="18% GST on Processing Charges."
                        placement="right"
                      >
                        {" "}
                        <IoMdInformationCircleOutline className="text-blue cursor-pointer" />
                      </Tooltip>
                    </div>
                    <span className="font-medium">{gst.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue/5 p-4 border-t border-blue/10">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary flex items-center gap-2 ">
                      <span>Payment due</span>
                    </span>
                    <span className="font-bold text-lg text-primary">
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                className={`w-full py-3.5 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  amount === "." || !amount || !!error || buttonLoading
                    ? "bg-gray text-muted-foreground hover:bg-gray cursor-not-allowed"
                    : "bg-blue hover:brightness-110 text-white "
                }`}
                onClick={displayRazorpay}
                disabled={amount === "." || !amount || !!error || buttonLoading}
              >
                {buttonLoading ? (
                  "Please wait..."
                ) : (
                  <>
                    Confirm and pay {symbol} {totalAmount.toFixed(2)} {currency}
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>

              {/* Terms & Security */}
              <p className="text-sm text-muted-foreground mt-4 mb-6 text-center">
                You authorize the use of your card for this deposit and future
                payments, and agree to the{" "}
                <a href="#" className="text-blue hover:underline">
                  Terms & Conditions
                </a>
                .
              </p>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Shield size={16} />
                  <span className="text-sm font-medium">Secure</span>
                </div>
                <div className="bg-blue/80 text-white text-xs font-bold px-2 py-1 rounded">
                  PCI DSS
                </div>
                <div className="bg-ranger text-white text-xs font-bold px-2 py-1 rounded">
                  MasterCard
                </div>
                <div className="text-blue font-bold text-sm">VISA</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Download Transaction History
              </h3>

              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5 transform transition-transform duration-500 hover:bg-grey hover:text-red"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 cursor-pointer hover:border-blue/50"
                  value={dateRange.startDate}
                  max={today}
                  onChange={(e) => validateAndSetStartDate(e.target.value)}
                  onFocus={(e) => e.target.showPicker()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 cursor-pointer hover:border-blue/50"
                  value={dateRange.endDate}
                  min={dateRange.startDate || ""}
                  max={today}
                  onChange={(e) => validateAndSetEndDate(e.target.value)}
                  onFocus={(e) => e.target.showPicker()}
                />
              </div>

              <button
                onClick={handleDownloadClick}
                className="w-full bg-blue text-white py-2 rounded-md hover:bg-blue/90 transition-all"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyWallet;
