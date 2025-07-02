import React from "react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import {
  Globe,
  Users,
  Shield,
  Lightbulb,
  Briefcase,
  MessageSquare,
  CheckCircle,
  Layers,
} from "lucide-react";

const AboutUs = () => {
  return (
    <div className="container max-w-7xl mx-auto pb-4 px-10 md:px-5 pt-20 ">
      <div className="min-h-screen space-y-4 ">
        {/* Hero Section */}
        <section className="relative pt-8 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10"></div>
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-1">
              <h1 className="text-xl md:text-xl font-bold tracking-tight text-black">
                About <span className="text-blue">Paid2Workk</span>
              </h1>
              <p className="text-base text-black md:text-base/relaxed lg:text-base/relaxed xl:text-base/relaxed">
                Where Talent Meets Opportunity
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="pb-4 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-base md:text-base text-gray-700 leading-relaxed">
              At Paid2Workk, we're redefining the way businesses and independent
              professionals connect and collaborate. Built with flexibility,
              trust, and growth in mind, our platform empowers freelancers to
              showcase their skills and clients to find the right talent for any
              project—fast and efficiently.
            </p>
            <div className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-2 ">
              <MessageSquare className="h-5 w-5" />
              <p className="text-sm ">
                We are a customer centric company. You can reach out to us
                anytime on{" "}
                <a
                  href="mailto:support@paid2workk.com"
                  className="hover:underline text-blue"
                >
                  support@paid2workk.com
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-8 bg-blue/75 text-white rounded-lg">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block p-3 bg-white rounded-full">
                <Lightbulb className="h-8 w-8 text-blue" />
              </div>
              <h2 className="text-xl font-medium mt-0">Our Mission</h2>
              <p className=" leading-relaxed mt-4">
                To create a thriving digital workspace where freelancers and
                businesses of all sizes can succeed together. Whether you're a
                developer, designer, writer, marketer, or entrepreneur, we're
                here to support your journey with the tools and support you
                need.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-4 container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-black">
              What We Offer
            </h2>
            <div className="mt-0 h-0.5 w-20 bg-blue/60 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white via-back2/30 to-blue/5">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-blue/5 rounded-full">
                  <Briefcase className="h-8 w-8 text-blue/60" />
                </div>
                <h3 className="text-lg font-bold text-black">
                  For Freelancers
                </h3>
                <p className="text-black text-sm">
                  A global stage to promote your expertise, grow your portfolio,
                  and get paid doing what you love.
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white via-back2/30 to-blue/5">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-blue/5 rounded-full">
                  <Users className="h-8 w-8 text-blue/60" />
                </div>
                <h3 className="text-lg font-bold text-black">
                  For Clients
                </h3>
                <p className="text-black text-sm">
                  Access to a diverse pool of verified talent across
                  industries—available on demand, project-ready, and scalable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-8 bg-back/50 rounded-lg ">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-medium ">
                Why Choose Us?
              </h2>
              <div className="mt-0.5 h-0.5 w-20 bg-blue/60 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-3 bg-blue/5 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-blue/60" />
                </div>
                <h3 className="text-lg font-medium text-black mb-1">
                  Secure & Reliable
                </h3>
                <p className="text-black text-sm">
                  Protected payments, verified profiles, and a safe working
                  environment.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-3 bg-blue/5 rounded-full mb-4">
                  <Layers className="h-6 w-6 text-blue/60" />
                </div>
                <h3 className="text-lg font-medium text-black mb-1">
                  Simple & Transparent
                </h3>
                <p className="text-black text-sm">
                  Easy-to-use interface, clear communication tools, and fair
                  pricing.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-3 bg-blue/5 rounded-full mb-4">
                  <Globe className="h-6 w-6 text-blue/60" />
                </div>
                <h3 className="text-lg font-medium text-black mb-1">
                  Global Community
                </h3>
                <p className="text-black text-sm">
                  Thousands of freelancers and clients from around the world,
                  all in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-8 bg-blue/75 text-white rounded-lg ">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center space-y-2">
              <div className="inline-block p-3 bg-white rounded-full mb-2">
                <CheckCircle className="h-8 w-8 text-blue" />
              </div>
              <h2 className="text-xl font-medium">Our Vision</h2>
              <p className="text-sm leading-relaxed">
                To become the world's most trusted freelancing ecosystem—built
                on transparency, innovation, and the belief that great work
                knows no borders.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-4 container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl font-medium text-black mb-2">
              Ready to Get Started?
            </h2>
            <p className="mb-4">
              Join thousands of freelancers and businesses already using
              Paid2Workk to grow their careers and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="sm" onClick={() => (window.location.href = "/signup")}>
                Sign Up Now
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
