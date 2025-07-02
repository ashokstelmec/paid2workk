import React, { useState, useRef } from "react";
import { useChat } from "../../contexts/supportContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ArrowRight, Headset, X } from "lucide-react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const ChatComponent = () => {
  const location = useLocation();
  const {
    isChatModalOpen,
    setIsChatModalOpen,
    isTicketModalOpen,
    setIsTicketModalOpen,
    isContactModalOpen,
    setIsContactModalOpen,
  } = useChat();

  const closeButtonRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    query: "",
  });
  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length === 10;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    let newErrors = { ...errors };

    switch (name) {
      case "phone":
        if (!validatePhone(value)) {
          newErrors.phone = "Phone number must have exactly 10 digits";
        } else {
          delete newErrors.phone;
        }
        break;
      case "email":
        if (!validateEmail(value)) {
          newErrors.email = "Please enter a valid email";
        } else {
          delete newErrors.email;
        }
        break;
      case "name":
      case "query":
        if (!value.trim()) {
          newErrors[name] = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } is required`;
        } else {
          delete newErrors[name];
        }
        break;
    }

    setErrors(newErrors);
  };

  const handlePhoneInput = (e) => {
    const { value } = e.target;
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      phone: digitsOnly,
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!validatePhone(formData.phone))
      newErrors.phone = "Phone number must have 10 digits";
    if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.query.trim()) newErrors.query = "Query is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nUserID = sessionStorage.getItem("NUserID") || " null";

    const requestData = {
      name: formData.name,
      phoneNumber: formData.phone,
      email: formData.email,
      description: formData.query,
      nUserID: nUserID,
    };

    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/InsertHelpTicket",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Ticket submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({ name: "", phone: "", email: "", query: "" });
        setIsTicketModalOpen(false);
      } else {
        toast.error(
          result.message || "Failed to submit the ticket. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleCreateTicketClick = () => {
    setIsChatModalOpen(false);
    setTimeout(() => {
      setIsTicketModalOpen(true);
    }, 300);
  };

  return (
    <div className={`relative `}>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatModalOpen(true)}
        className={`${
          location.pathname.includes("dashboard") ? "hidden" : ""
        } fixed bottom-4 right-4 z-30 flex items-center gap-2 bg-blue text-white p-2 rounded-full shadow-lg hover:brightness-110 transition-all duration-300`}
      >
        <Headset className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">Support</span>
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatModalOpen && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 4 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-5 right-4 z-50 w-96"
          >
            <div className="bg-white rounded-xl shadow-2xl border p-5 ">
              {/* Chat Modal Header */}
              <div className="flex items-end justify-between pb-1 border-b">
                <h2 className="text-lg font-medium text-gray-800">
                  Contact Us
                </h2>
                <button
                  onClick={() => setIsChatModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray hover:text-red hover:rotate-90 transition-transform duration-300 ease-in-out"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Create Ticket Option */}
              <div
                className="flex items-center justify-between p-3 mt-2 border rounded-lg cursor-pointer hover:bg-muted-foreground/10 transition-all transform hover:scale-[103%] duration-300"
                onClick={handleCreateTicketClick}
              >
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary" />
                  <span className="font-medium text-gray-800">
                    Create Ticket
                  </span>
                </div>
                <ArrowRight size={20} className="text-blue" />
              </div>

              {/* Chat / Callback Option */}
              <div
                className="flex flex-col p-3 mt-2 border rounded-lg cursor-pointer  hover:bg-muted-foreground/10 transition-all transform  duration-300"
                onClick={() => setIsContactModalOpen(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-primary" />
                    <span className="font-medium text-gray-800">
                      Chat or Request for Callback
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-3">
                    <Phone size={18} className="text-primary invisible" />
                    <span>Chat timings:</span> 10 AM - 10 PM
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-3">
                    <Phone size={18} className="text-primary invisible" />
                    <span>Call timings&nbsp;&nbsp;:</span> 10 AM - 7 PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 4 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-5 right-4 z-50 w-96"
          >
            <div className="bg-white rounded-xl shadow-xl border p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b pb-1">
                <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                  <Phone size={18} className="text-green" />
                  <h2>Get in Touch</h2>
                </div>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={18} className="text-red" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2.5 rounded-full">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Mr. Vedpal Singh
                    </p>
                    <p className="text-xs text-gray-600">+91 91086 28001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2.5 rounded-full">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      support@paid2workk.com
                    </p>
                    <p className="text-xs text-gray-600">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-dashed border-gray-300 p-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                  🙌 <strong>We're here when you need us!</strong>
                  <br />
                  Reach out via chat, call, or email — we're happy to help with
                  any questions or issues.
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-3 py-1 text-sm bg-blue text-white rounded-md hover:brightness-125 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {isTicketModalOpen && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 4 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-5 right-4 z-50 w-96"
          >
            <div className="bg-white rounded-xl shadow-2xl border p-5">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b py-2">
                <h2 className="text-lg font-medium flex-1 pr-2">
                  Need help with anything? Get in touch with us
                </h2>
                <button
                  onClick={() => setIsTicketModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={22} className="text-gray-500 invisible" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                        errors.name ? "border-red" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneInput}
                      placeholder="98XXXXX210"
                      maxLength="10"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                        errors.phone ? "border-red" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@paid2workk.com"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                      errors.email ? "border-red" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What do you want to discuss?
                  </label>
                  <textarea
                    name="query"
                    value={formData.query}
                    onChange={handleInputChange}
                    placeholder="Explain you issue..."
                    rows="4" // You can adjust this for initial height
                    className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary resize-none overflow-auto ${
                      errors.query ? "border-red" : ""
                    }`}
                  />
                  {errors.query && (
                    <p className="text-red text-xs mt-1">{errors.query}</p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-3 py-1 border rounded-md text-sm text-red border-red  hover:bg-red hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1 bg-blue text-white text-sm rounded-md hover:brightness-125"
                >
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatComponent;
