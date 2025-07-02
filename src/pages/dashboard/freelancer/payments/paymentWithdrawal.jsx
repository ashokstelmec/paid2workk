import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, HelpCircle, Shield } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../contexts/authContext";

// Assets
import Paypal from "../../../../assets/paypal.png";
import UPI from "../../../../assets/bhim.png";
import Bank from "../../../../assets/bank.png";

import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";

export default function WithdrawalForm() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const {
    currencies: apiCurrencies,
    getCurrencySymbolId,
    getCurrencySymbolName,
    user,
  } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [showRadio, setShowRadio] = useState({
    paypal: false,
    upi: false,
    razorpay: false,
  });
  const [bankDetails, setBankDetails] = useState({
    beneficiaryFullName: "",
    accountNumber: "",
    ifscCode: "",
    ibanCode: "",
    beneficiaryBankName: "",
    swiftbicCode: "",
    beneficiaryBankAddress: "",
    branchCode: "",
    city: "",
    upiId: "",
    upiError: "",
  });

  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("₹");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState("2"); // Default to INR
  const [processingFee, setProcessingFee] = useState(0.0);
  const totalAmount = Number.parseFloat(amount || "0") + processingFee;

  const validateUpiId = (value) => {
    const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return regex.test(value);
  };

  useEffect(() => {
    // Get userId from sessionStorage
    console.log(user);
    const storedUserId = sessionStorage.getItem("NUserID");
    setUserId(storedUserId);
  }, []);

  const handleUpiChange = (e) => {
    const value = e.target.value;
    setUpiId(value);

    if (!validateUpiId(value)) {
      setUpiError("Invalid UPI ID format");
    } else {
      setUpiError("");
    }
  };

  // Update currencies mapping to include currency_Id
  const currencies = apiCurrencies.map((curr) => ({
    value: curr.currency,
    label: curr.currency_Name,
    symbol: curr.symbol,
    currencyId: curr.currency_Id,
    serviceCharge: curr.serviceCharges,
    paypal: curr.paypal,
    razorpay: curr.razorPay,
    upi: curr.upi,
  }));

  useEffect(() => {
    const selectedCurrency = currencies.find(
      (curr) => curr.currencyId === selectedCurrencyId
    );
    if (selectedCurrency) {
      setShowRadio({
        paypal: selectedCurrency.paypal,
        upi: selectedCurrency.upi,
        razorpay: selectedCurrency.razorpay,
      });
      setSelectedSymbol(getCurrencySymbolId(user?.currency) || "₹");
      setCurrency(getCurrencySymbolName(user?.currency) || "INR");
      setSelectedCurrencyId(user?.currency || "2");
    }
  }, [user, selectedCurrencyId]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    // Update processing fee based on the selected currency
    const selectedCurrency = currencies.find(
      (curr) => curr.currencyId === selectedCurrencyId
    );
    if (selectedCurrency) {
      setProcessingFee((value * selectedCurrency.serviceCharge) / 100);
    }
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    // Reset other payment methods' data when switching
    switch (value) {
      case "paypal":
        setUpiId("");
        setUpiError("");
        setBankDetails({
          beneficiaryFullName: "",
          accountNumber: "",
          ifscCode: "",
          ibanCode: "",
          beneficiaryBankName: "",
          swiftbicCode: "",
          beneficiaryBankAddress: "",
          branchCode: "",
          city: "",
          upiId: "",
          upiError: "",
        });
        break;
      case "upi":
        setPaypalEmail("");
        setBankDetails({
          beneficiaryFullName: "",
          accountNumber: "",
          ifscCode: "",
          ibanCode: "",
          beneficiaryBankName: "",
          swiftbicCode: "",
          beneficiaryBankAddress: "",
          branchCode: "",
          city: "",
          upiId: "",
          upiError: "",
        });
        break;
      case "bank":
        setPaypalEmail("");
        setUpiId("");
        setUpiError("");
        break;
      default:
        break;
    }
  };

  const validateAccountNumbers = (accNum, confirmAccNum) => {
    if (accNum !== confirmAccNum) {
      setAccountNumberError("Account numbers do not match");
      return false;
    }
    setAccountNumberError("");
    return true;
  };

  const handleBankFormSubmit = () => {
    if (
      !validateAccountNumbers(bankDetails.accountNumber, confirmAccountNumber)
    ) {
      return;
    }

    // Close the modal but don't clear the form
    setShowBankModal(false);
  };

  const handleWithdrawalRequest = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }

      if (!amount || amount === "0") {
        setError("Please enter a valid amount");
        return;
      }

      if (!currency) {
        setError("Please select a currency");
        return;
      }

      // Validate based on payment method
      switch (paymentMethod) {
        case "paypal":
          if (!paypalEmail) {
            setError("Please enter PayPal email address");
            return;
          }
          if (!paypalEmail.includes("@")) {
            setError("Please enter a valid email address");
            return;
          }
          break;

        case "upi":
          if (!upiId) {
            setError("Please enter UPI ID");
            return;
          }
          if (upiError) {
            setError("Please enter a valid UPI ID");
            return;
          }
          break;

        case "bank":
          if (
            !bankDetails.beneficiaryFullName ||
            !bankDetails.accountNumber ||
            !bankDetails.beneficiaryBankName
          ) {
            setError("Please fill all required bank details");
            return;
          }
          if (accountNumberError) {
            setError("Account numbers do not match");
            return;
          }
          break;

        default:
          setError("Please select a payment method");
          return;
      }

      const basePayload = {
        userId: userId,
        requestedAmount: totalAmount,
        serviceCharges: processingFee,
        actualAmount: Number(amount),
        amount: totalAmount,
        currency_Id: selectedCurrencyId, // Send currency ID
        currency: currency, // Send currency code
        paymentMethod: paymentMethod,
      };

      const payload = {
        ...basePayload,
        // Add payment method specific details
        ...(paymentMethod === "upi" && { upiId: upiId }),
        ...(paymentMethod === "paypal" && { payPalEmail: paypalEmail }),
        ...(paymentMethod === "bank" && {
          paymentDetails: JSON.stringify({
            ...bankDetails,
            confirmAccountNumber,
          }),
          beneficiaryBankName: bankDetails.beneficiaryBankName,
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode,
          ibanCode: bankDetails.ibanCode,
          beneficiaryFullName: bankDetails.beneficiaryFullName,
          swiftbicCode: bankDetails.swiftbicCode,
          branchCode: bankDetails.branchCode,
          beneficiaryBankAddress: bankDetails.beneficiaryBankAddress,
        }),
      };

      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Payments/withdrawal-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Withdrawal request failed");
      }

      await response.json();

      // Show single success toast and navigate
      toast.success("Withdrawal request submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => {
          navigate("/dashboard/payments/my-wallet");
        },
      });

      // Reset form
      setBankDetails({
        beneficiaryFullName: "",
        accountNumber: "",
        ifscCode: "",
        beneficiaryBankName: "",
        swiftbicCode: "",
        beneficiaryBankAddress: "",
        branchCode: "",
        city: "",
        upiId: "",
        upiError: "",
      });
      setConfirmAccountNumber("");
      setPaymentMethod(null);
      setAmount("");
      setCurrency("INR");
      setSelectedSymbol("₹");
    } catch (err) {
      toast.error("Failed to submit withdrawal request. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error submitting withdrawal:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20  w-full max-w-6xl mx-auto h-[calc(100vh-7rem)] xl:h-[calc(100vh-10rem)] p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 mt-8 lg:pl-20">
        Payment Method
      </h2>
      <div className="justify-center flex flex-col lg:flex-row gap-6 ">
        {/* Left side - Payment Methods */}{" "}
        <div className="w-full lg:w-1/3 space-y-4">
          <RadioGroup
            value={paymentMethod || ""}
            onValueChange={handlePaymentMethodChange}
            className="space-y-4"
          >
            {/* PayPal Option */}
            {showRadio.paypal && (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center p-4 cursor-pointer">
                  <RadioGroupItem value="paypal" id="paypal" className="mr-4" />
                  <Label
                    htmlFor="paypal"
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <img src={Paypal} alt="P" />
                      </div>
                      <span className="font-medium">PayPal</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Label>
                </div>
                {paymentMethod === "paypal" && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <Label
                      htmlFor="paypal-email"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      PayPal Email Address
                    </Label>
                    <Input
                      id="paypal-email"
                      type="email"
                      placeholder="your-email@example.com"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}

            {/* UPI Option */}
            {showRadio.upi && (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center p-4 cursor-pointer">
                  <RadioGroupItem value="upi" id="upi" className="mr-4" />
                  <Label
                    htmlFor="upi"
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <img src={UPI} alt="U" />
                      </div>
                      <span className="font-medium">UPI</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Label>
                </div>
                {paymentMethod === "upi" && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <Label
                      htmlFor="upi-id"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      UPI ID
                    </Label>
                    <Input
                      id="upi-id"
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={handleUpiChange}
                      className={`w-full ${upiError ? "border-red" : ""}`}
                    />
                    {upiError && (
                      <p className="text-red text-sm mt-1">{upiError}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bank Transfer Option */}
            {showRadio.razorpay && (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center p-4 cursor-pointer">
                  <RadioGroupItem value="bank" id="bank" className="mr-4" />
                  <Label
                    htmlFor="bank"
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <img src={Bank} alt="B" />
                      </div>
                      <span className="font-medium">Bank Transfer</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Label>
                </div>
                {paymentMethod === "bank" && (
  <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-4">
    <Button
      variant="outline"
      className="w-full"
      onClick={() => setShowBankModal(true)}
    >
      {bankDetails.beneficiaryFullName ? "Edit Bank Details" : "Add Bank Details"}
    </Button>

    {/* Show saved bank details if available */}
    {bankDetails.beneficiaryFullName && (
      <div className="p-4 bg-white rounded-lg border border-gray-300">
        <h4 className="font-semibold mb-2 text-gray-800 text-sm">Saved Bank Details</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Account Holder:</strong> {bankDetails.beneficiaryFullName}</p>
          <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
          <p><strong>Bank Name:</strong> {bankDetails.beneficiaryBankName}</p>
          {bankDetails.ifscCode && (
            <p><strong>IFSC Code:</strong> {bankDetails.ifscCode}</p>
          )}
          {bankDetails.branchCode && (
            <p><strong>Branch Code:</strong> {bankDetails.branchCode}</p>
          )}
          {bankDetails.city && (
            <p><strong>City:</strong> {bankDetails.city}</p>
          )}
        </div>
      </div>
    )}
  </div>
)}

              </div>
            )}
          </RadioGroup>
          {error && <p className="text-red text-sm mt-2">{error}</p>}
        </div>
        {/* Add the Modal */}
        {/* Right side - Payment Details */}
        <div className="w-full lg:w-2/4 bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Select amount
            </h2>
            <div className="text-gray-600 font-medium">({currency})</div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-row gap-4 items-center ">
              {" "}
              {/* Amount Input */}
              <div className="space-y-2 w-full">
                <Label htmlFor="amount" className="text-gray-700 font-medium">
                  Amount
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">{selectedSymbol}</span>
                  </div>
                  <Input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e)}
                    className="pl-11"
                  />
                </div>
              </div>
            </div>

            {/* Total Due */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-gray-700 font-medium">Payment due</span>
              <span className="text-gray-900 font-semibold flex gap-1">
                <span>{selectedSymbol}</span>
                <span>{Number.parseFloat(amount || "0").toFixed(2)}</span>
              </span>
            </div>

            {/* Processing Fee */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-gray-700 font-medium">
                  Processing fee
                </span>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </div>
              <span className="text-gray-900 font-semibold flex gap-1">
                <span>{selectedSymbol}</span>
                <span> {processingFee.toFixed(2)}</span>
              </span>
            </div>

            {/* Payment Due */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-gray-700 font-medium">Total due</span>
              <span className="text-gray-900 font-bold flex gap-1">
                <span>{selectedSymbol}</span>
                <span> {totalAmount.toFixed(2)}</span>
              </span>
            </div>

            {/* Confirm Button */}
            <Button
              className={cn(
                "w-full py-6 text-base font-medium mt-4",
                !paymentMethod && "opacity-70 cursor-not-allowed"
              )}
              disabled={!paymentMethod || isSubmitting}
              onClick={handleWithdrawalRequest}
            >
              {isSubmitting ? "Processing..." : "Withdraw"}
            </Button>

            {/* Security Badges */}

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

      <Dialog open={showBankModal} onOpenChange={setShowBankModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-4">
            <DialogTitle className="text-xl">Enter Bank Details</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6">
            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="account-name" className="text-sm font-medium">
                Account Holder Name
              </Label>
              <Input
                id="account-name"
                type="text"
                placeholder="Enter account holder name"
                value={bankDetails.beneficiaryFullName}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    beneficiaryFullName: e.target.value,
                  })
                }
                className="mt-1.5"
              />
            </div>
            {/* Bank Name */}
            <div>
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                type="text"
                placeholder="Enter bank name"
                value={bankDetails.beneficiaryBankName}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    beneficiaryBankName: e.target.value,
                  })
                }
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="account-number" className="text-sm font-medium">
                Account Number
              </Label>
              <Input
                id="account-number"
                type="password"
                placeholder="Enter account number"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    accountNumber: e.target.value,
                  })
                }
              />
            </div>

            {/*Confirm Account Number */}
            <div className="space-y-2">
              <Label
                htmlFor="confirm-account-number"
                className="text-sm font-medium"
              >
                Confirm Account Number
              </Label>
              <Input
                id="confirm-account-number"
                type="text"
                placeholder="Confirm account number"
                value={confirmAccountNumber}
                onChange={(e) => {
                  setConfirmAccountNumber(e.target.value);
                  validateAccountNumbers(
                    bankDetails.accountNumber,
                    e.target.value
                  );
                }}
                className={cn(accountNumberError && "border-red-500")}
              />
              {accountNumberError && (
                <p className="text-sm text-red mt-1">{accountNumberError}</p>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <Label htmlFor="ifsc-code">IFSC Code</Label>
              <Input
                id="ifsc-code"
                type="text"
                placeholder="Enter IFSC code"
                value={bankDetails.ifscCode}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    ifscCode: e.target.value,
                  })
                }
              />
            </div>

            {/* IBAN Code */}
            <div>
              <Label htmlFor="iban-code">IBAN Code</Label>
              <Input
                id="iban-code"
                type="text"
                placeholder="Enter IBAN code"
                value={bankDetails.ibanCode}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    ibanCode: e.target.value,
                  })
                }
              />
            </div>

            {/* SWIFT / BIC Code */}
            <div>
              <Label htmlFor="swift-code">SWIFT / BIC Code</Label>
              <Input
                id="swift-code"
                type="text"
                placeholder="Enter SWIFT or BIC code"
                value={bankDetails.swiftbicCode}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    swiftbicCode: e.target.value,
                  })
                }
              />
            </div>

            {/* Branch Address */}
            <div>
              <Label htmlFor="branch-address">Branch Address</Label>
              <Input
                id="branch-address"
                type="text"
                placeholder="Enter branch address"
                value={bankDetails.beneficiaryBankAddress}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    beneficiaryBankAddress: e.target.value,
                  })
                }
              />
            </div>

            {/* Branch Address */}
            <div>
              <Label htmlFor="branch-address">Branch Code</Label>
              <Input
                id="branch-address"
                type="text"
                placeholder="Enter branch address"
                value={bankDetails.branchCode}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    branchCode: e.target.value,
                  })
                }
              />
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter city"
                value={bankDetails.city}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    city: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 sticky bottom-0 bg-white p-4 border-t">
            <Button
              variant="outline_danger"
              onClick={() => setShowBankModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBankFormSubmit}>Save Details</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
