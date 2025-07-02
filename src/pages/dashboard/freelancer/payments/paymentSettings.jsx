import React, { useState } from "react";

// Assets
import Money from "../../../../assets/stackMoney.png";

// Icons
import { FaChevronRight } from "react-icons/fa6";
import { LuChevronsUpDown } from "react-icons/lu";
import { Modal, TextField } from "@mui/material";

const PaymentSettings = () => {
  const [paypalOpen, setPaypalOpen] = useState(false);
  const [upiOpen, setUpiOpen] = useState(false);
  const [bankTranserOpen, setBankTransferOpen] = useState(false);
  const [error, setError] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    bankingName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: "",
  });

  const handlePaypalModal = () => {
    setPaypalOpen(!paypalOpen);
  };
  const handleUpiModal = () => {
    setUpiOpen(!upiOpen);
  };
  const handleBankTransferModal = () => {
    setBankTransferOpen(!bankTranserOpen);
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    if (name === "confirmAccountNumber" || name === "accountNumber") {
      if (
        value !== bankDetails.accountNumber &&
        name === "confirmAccountNumber"
      ) {
        setError("Account Numbers do not match!");
      } else if (
        value !== bankDetails.confirmAccountNumber &&
        name === "accountNumber"
      ) {
        setError("Account Numbers do not match!");
      } else {
        setError("");
      }
    }
  };

  const handleBankSubmit = (event) => {
    event.preventDefault();
    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      setError("Account numbers do not match!");
    } else {
      setError("");
      // Submit the form
    }
  };

  return (
    <>
      <div className="pb-10">

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 gap-2 md:mr-6">
            <div>
              <h3 className="text-base font-medium">Withdrawal Methods</h3>
              <div className="bg-white rounded-xl p-6 border border-blue/10 mt-4">
                <div className="bg-gray/30 rounded-lg p-3 flex flex-row items-center px-4 justify-between hover:bg-gray/50 duration-300 ease-in-out hover:shadow-md cursor-pointer">
                  <div className="flex flex-row items-center gap-3">
                    <div className="rounded-full bg-white p-2.5 border border-grey/80 shadow w-12 h-12">
                      <img
                        src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/250_Paypal_logo-512.png"
                        alt=""
                        className=""
                      />
                    </div>
                    <div>
                      <h6 className="font-medium text-black text-sm">
                        Paypal <span>•</span> INR
                      </h6>
                      <span className="text-sm font-medium text-black/50">
                        sainiku****36@*****.com
                      </span>
                    </div>
                  </div>
                  <LuChevronsUpDown className="text-black/80" />
                </div>

                <div className="bg-grey/25 rounded-full my-6 h-0.5 w-full"></div>

                <div>
                  <span className="text-black text-sm">
                    Use them to withdraw your funds once your wallet balance
                    hits the threshold. Click on each method to customize or
                    view details.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-medium">Automatic Withdrawal</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-xl p-6 lg:py-8 border border-blue/10 mt-4">
                <div className="flex flex-col gap-2">
                  <h5 className="font-medium text-sm text-black">
                    Get your money sent to your account Automatically!
                  </h5>
                  <span className="text-sm text-black">
                    Deposit schedule weekly
                  </span>
                </div>
                <div className="w-48 lg:w-56 h-auto">
                  <img src={Money} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <h3 className="text-base font-medium">New Payment Method</h3>
            <div className="flex flex-col gap-4 bg-white rounded-xl p-6 border border-blue/10 mt-4">
              <div
                className="px-6 bg-white/60 border border-gray rounded-lg p-3 flex flex-row justify-between items-center gap-3 hover:bg-gray/50 duration-300 ease-in-out hover:shadow-md cursor-pointer"
                onClick={handlePaypalModal}
              >
                <div className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-white p-2.5 border border-grey/80 shadow w-12 h-12">
                    <img
                      src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/250_Paypal_logo-512.png"
                      alt=""
                      className=""
                    />
                  </div>
                  <div>
                    <h6 className="font-medium text-black text-sm">
                      Paypal
                    </h6>
                  </div>
                </div>
                <FaChevronRight className="text-sm text-black/80" />
              </div>

              <div
                className="px-6 bg-white/60 border border-gray rounded-lg p-3 flex flex-row justify-between items-center gap-3 hover:bg-gray/50 duration-300 ease-in-out hover:shadow-md cursor-pointer"
                onClick={handleUpiModal}
              >
                <div className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-white p-2.5 border border-grey/80 shadow w-12 h-12">
                    <img
                      src="https://img.icons8.com/fluent/512/bhim.png"
                      alt=""
                      className=""
                    />
                  </div>
                  <div>
                    <h6 className="font-medium text-black text-sm">UPI </h6>
                  </div>
                </div>
                <FaChevronRight className="text-sm text-black/80" />
              </div>
              <div
                className="px-6 bg-white/60 border border-gray rounded-lg p-3 flex flex-row justify-between items-center gap-3 hover:bg-gray/50 duration-300 ease-in-out hover:shadow-md cursor-pointer"
                onClick={handleBankTransferModal}
              >
                <div className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-white p-2.5 border border-grey/80 shadow w-12 h-12">
                    <img
                      src="https://pngimg.com/d/bank_PNG13.png"
                      alt=""
                      className=""
                    />
                  </div>
                  <div>
                    <h6 className="font-medium text-black text-sm">
                      Bank Transfer
                    </h6>
                  </div>
                </div>
                <FaChevronRight className="text-sm text-black/80" />
              </div>

              <div className="mt-5 px-1">
                <span className="text-black/80 text-sm ">
                  Choose any payment method to receive your earned amount direct
                  to your desired account. Leaving this empty or unchecked will
                  cause delay or no payments. For further info read our details{" "}
                  <span className="text-blue hover:underline cursor-pointer">
                    Terms and Condition
                  </span>{" "}
                  and{" "}
                  <span className="text-blue hover:underline cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* New Payment Modals */}

        {/* Paypal */}
        <Modal open={paypalOpen}>
          <div className="bg-white rounded-lg p-6 w-80 sm:w-96 outline-none absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <h3 className="text-lg font-medium mb-4">Link New Paypal</h3>
            <p>Enter email associated to your paypal account.</p>
            <div className="mt-6 flex flex-col w-full gap-4">
              <TextField label="Name"></TextField>
              <TextField label="Paypal Email"></TextField>
            </div>
            <div className="mt-4 w-full flex gap-3 justify-end">
              <button
                className="bg-white text-red  hover:bg-red/5 duration-300 ease-in-out px-4 py-2 rounded-lg"
                onClick={handlePaypalModal}
              >
                Cancel
              </button>
              <button
                className="duration-300 ease-in-out bg-blue hover:bg-blue/5 border border-white text-white hover:text-blue hover:border-blue px-4 py-2 rounded-lg"
                onClick={handlePaypalModal}
              >
                Add Method
              </button>
            </div>
          </div>
        </Modal>

        {/* UPI */}
        <Modal open={upiOpen}>
          <div className="bg-white rounded-lg p-6 w-80 sm:w-96 outline-none absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <h3 className="text-lg font-medium mb-4">Link New UPI</h3>
            <p>Enter your valid UPI ID.</p>
            <div className="mt-6 flex flex-col w-full gap-4">
              <TextField label="Name"></TextField>
              <TextField label="UPI ID"></TextField>
            </div>
            <div className="mt-4 w-full flex gap-3 justify-end">
              <button
                className="bg-white text-red  hover:bg-red/5 duration-300 ease-in-out px-4 py-2 rounded-lg"
                onClick={handleUpiModal}
              >
                Cancel
              </button>
              <button
                className="duration-300 ease-in-out bg-blue hover:bg-blue/5 border border-white text-white hover:text-blue hover:border-blue px-4 py-2 rounded-lg"
                onClick={handleUpiModal}
              >
                Add Method
              </button>
            </div>
          </div>
        </Modal>

        {/* Bank Transfer */}
        <Modal open={bankTranserOpen}>
          <div className="bg-white rounded-lg p-6 w-80 sm:w-96 outline-none absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <h3 className="text-lg font-medium mb-4">Link New Bank</h3>
            <p>Enter your Account Details.</p>
            <div className="mt-6 flex flex-col w-full gap-4">
              <form className="flex flex-col w-full gap-3">
                <TextField
                  name="bankName"
                  label="Bank Name"
                  type="text"
                  required
                  value={bankDetails.bankName}
                  onChange={handleOnChange}
                />
                <TextField
                  name="bankingName"
                  label="Banking Name"
                  type="text"
                  required
                  value={bankDetails.bankingName}
                  onChange={handleOnChange}
                />
                <TextField
                  name="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={handleOnChange}
                  required
                  type="password"
                  label="Account Number"
                />
                <TextField
                  type="text"
                  label="Confirm Account Number"
                  color={error ? "error" : "blue"}
                  name="confirmAccountNumber"
                  value={bankDetails.confirmAccountNumber}
                  onChange={handleOnChange}
                  required
                />

                <TextField
                  name="ifsc"
                  label="IFSC Code"
                  type="text"
                  required
                  value={bankDetails.ifsc}
                  onChange={handleOnChange}
                />
              </form>
            </div>
            <div className="mt-4 w-full flex gap-3 justify-end">
              <button
                className="bg-white text-red  hover:bg-red/5 duration-300 ease-in-out px-4 py-2 rounded-lg"
                onClick={handleBankTransferModal}
              >
                Cancel
              </button>
              <button
                className="duration-300 ease-in-out bg-blue hover:bg-blue/5 border border-white text-white hover:text-blue hover:border-blue px-4 py-2 rounded-lg"
                onClick={handleBankTransferModal}
                type="submit"
              >
                Add Method
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PaymentSettings;
