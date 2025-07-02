import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import Logo from "../../assets/Logo/p2w.png";
import Background from "../../assets/backWall.jpg";
import { Bounce, toast } from "react-toastify";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // Fetch email from session storage on component mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.error("No email address found.");
    }
  }, []);

  const handleResendEmail = async () => {
    if (!email) {
      console.error("No email address to resend.");
      return;
    }

    const data = { email: email };

    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/Resentmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );


      if (response.ok) {
        toast.success("Verification email has been sent again.", {
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
      } else {
        toast.error("Failed to resend verification email. Please try again.", {
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
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while resending the email. Please try again.", {
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50  px-4 sm:px-6 lg:px-8">
      <div className="absolute -z-10 inset-0">
        <img
          src={Background}
          alt="Background"
          className="sm:block hidden h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 sm:bg-white bg-white/0 sm:shadow-md sm:rounded-xl sm:px-10 p-6 sm:border sm:border-blue/10">
        <div className="flex w-full justify-center items-center">
          <img src={Logo} alt="Paid2Workk Logo" width={250} height={50} />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <h3 className="text-xl font-semibold text-black/80">
            Verify your Email to Proceed
          </h3>
          <div className="flex flex-col gap-1 justify-center items-center">
            {" "}
            <p className="text-black/60 mt-4">
              We just sent an email to the address:{" "}
              <strong className="text-black/60">{email}</strong>
            </p>
            <span className="text-black/60 mt-2">
              Please check your email and select the link provided to verify
              your address.
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <p className="block mt-4 text-black/50">Didn't receive email?</p>{" "}
          <button
            className=" my-3 bg-blue hover:brightness-125 text-white py-2 px-4 rounded-md focus:outline-none w-1/3 duration-300 ease-in-out font-medium"
            onClick={handleResendEmail}
          >
            Resend Email
          </button>
          <span
            onClick={() => {
              navigate("/login");
              sessionStorage.removeItem("email");
            }}
            className="mt-2 text-[#0b64fc] hover:underline cursor-pointer"
          >
            Click here to go to Login Page
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
