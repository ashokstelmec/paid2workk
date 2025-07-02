import React from "react";

// Image
import P2W from "../assets/Logo/p2w_white.png";

// Icons
import {
  Heart,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  Phone,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useChat } from "../contexts/supportContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { setIsChatModalOpen } = useChat();

  return (
    <footer className="w-full  bg-[#0a0e1f] text-white">
      {/* Stats Section */}
      <div className="w-full  bg-black py-2.5">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg">162</h2>
            <p className="text-sm ">Live Projects</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg">560</h2>
            <p className="text-sm ">Clients</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg">10721</h2>
            <p className="text-sm ">Freelancers</p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Contact */}
          <div className="lg:col-span-1 h-full flex flex-col justify-center items-start">
            <div
              onClick={() => navigate("/")}
              className="inline-block cursor-pointer"
            >
              <img src={P2W} alt="Footer-logo" className="w-48" />
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-1">
            <h3 className="font-medium mb-2">Explore Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/projects"
                  state={{ cat: "4" }}
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Photography
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  state={{ cat: "3" }}
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Technology & Programming
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  state={{ cat: "2" }}
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Design
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  state={{ cat: "6" }}
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Videography
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <h3 className="font-medium mb-2">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/projects"
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Find Work
                </Link>
              </li>
              <li>
                <Link
                  to="/freelancers"
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Hire Freelancers
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
          {/* About */}
          <div className="lg:col-span-1">
            <h3 className="font-medium mb-2">Help & Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about-us"
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  About us
                </Link>
              </li>

              <li>
                <Link
                  to="/support/faq"
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  FAQ's
                </Link>
              </li>
              <li>
                <span
                  onClick={() => setIsChatModalOpen(true)}
                  className="hover:text-white/80 hover:underline transition-colors cursor-pointer"
                >
                  Contact us
                </span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-1">
            <h3 className="font-medium mb-2">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/legal/privacy-policy"
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/legal/terms-of-use"
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  to="/legal/return-policy"
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Cancellation and Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/legal/shipping-policy"
                  className="hover:text-white/80 hover:underline transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="py-2.5 bg-black">
          <div className="flex max-w-7xl mx-auto flex-col md:flex-row justify-between items-center px-10 md:px-5">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Link
                to="/"
                className="text-white hover:text-white/80 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                to="/"
                className="text-white hover:text-white/80 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.53 3H21.25L13.62 10.87L22.54 21H16.16L10.77 14.61L4.66 21H0.92L8.99 12.56L0.46 3H7.02L11.88 8.82L17.53 3ZM16.36 19.13H18.18L6.75 4.76H4.81L16.36 19.13Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
              <Link
                to="/"
                className="text-white hover:text-white/80 transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </Link>
              <Link
                to="/"
                className="text-white hover:text-white/80 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                to="/"
                className="text-white hover:text-white/80 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
            <div className="flex items-center text-sm italic mb-2 md:mb-0">
              <span>~ Made with </span>
              <Heart className="h-4 w-4 mx-1 text-red fill-red" />
              <span> in India ~</span>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <span className="text-sm">
                © Copyright {currentYear}{" "}
                <span className="font-semibold">Paid2workk.com</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
