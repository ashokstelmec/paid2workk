import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { HelpCircle, Mail, Phone, Search } from "lucide-react";

// FAQ data organized by categories
const faqData = {
  general: [
    {
      question: "What is Paid2Workk?",
      answer:
        "Paid2Workk is a platform that connects freelancers with clients looking for services. We provide a secure environment for work arrangements, payments, and project management.",
    },
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. You can register as a freelancer or as a client depending on your needs.",
    },
    {
      question: "Is Paid2Workk available worldwide?",
      answer:
        "Yes, Paid2Workk is available globally. We support multiple currencies and payment methods to accommodate users from different countries.",
    },
    {
      question: "What are the fees for using Paid2Workk?",
      answer:
        "Paid2Workk charges nothing to use. We don't take any type of service fees or anything from out valuable users.",
    },
    {
      question: "What are the system requirements to use the platform?",
      answer:
        "Paid2Workk is web-based and works on any modern browser. For the best experience, we recommend using the latest versions of Chrome, Firefox, Safari, or Edge.",
    },
    {
      question: "Do I need any technical skills to use Paid2Workk?",
      answer:
        "No, the platform is designed to be user-friendly and does not require any technical expertise. Our intuitive interface guides you through every step, whether posting a job or applying for projects.",
    },
    {
      question: "Is my data safe on Paid2Workk?",
      answer:
        "We take data security seriously with encryption and regular security audits. Your personal information is protected following industry best practices.",
    },
    {
      question: "Can I update my personal information later?",
      answer:
        "Yes, after creating an account, you can edit your profile and update your information by navigating to the account settings section.",
    },
    {
      question: "What customer support options are available?",
      answer:
        "We offer 24/7 customer support via email, and 1000 hrs to 1900 hrs via call support. You can also reach out to us through our contact form.",
    },
  ],
  freelancers: [
    {
      question: "How do I find work on Paid2Workk?",
      answer:
        "You can browse available projects on the 'Find Work' page. Filter projects by category, budget, and more to find opportunities that match your skills and preferences.",
    },
    {
      question: "How and when do I get paid?",
      answer:
        "Payments are released once the client approves your work. Depending on the milestones created with both parties approval. With each milestone, you will get paid.",
    },
    {
      question: "How do I withdraw my earnings?",
      answer:
        "You can withdraw your earnings through various payment methods including bank transfers, PayPal, and other supported payment platforms. Withdrawals are processed within 3-5 business days.",
    },
    {
      question: "What types of projects can I find on the platform?",
      answer:
        "The platform offers a wide range of projects including web development, graphic design, content writing, digital marketing, and more. You can filter projects by category to find the best fit.",
    },
    {
      question: "Do freelancers get support if there is a dispute?",
      answer:
        "Yes, our dispute resolution team is available to help mediate any conflicts between freelancers and clients. We ensure fairness and transparency throughout the process.",
    },
    {
      question: "How do I increase my chances of being selected for a project?",
      answer:
        "A complete and up-to-date profile and positive reviews from previous projects will increase your chances. Make sure to tailor your proposals to each project.",
    },
    {
      question: "Can I work on multiple projects at the same time?",
      answer:
        "Absolutely. Paid2Workk allows you to work on several projects simultaneously as long as you manage your time effectively and maintain high-quality work for each.",
    },
    {
      question: "Will I be notified about project updates?",
      answer:
        "Yes, you will receive real-time notifications about project invitations, status updates, and messages from clients platform's notification system.",
    },
    {
      question: "Are there any membership fees for freelancers?",
      answer:
        "No, signing up as a freelancer on Paid2Workk is free. Ensuring you earn what you deserve.",
    },
  ],
  clients: [
    {
      question: "How do I post a job on Paid2Workk?",
      answer:
        "To post a job, go to the 'Post a Job' page and fill out the project details including description, budget, and required skills. Once submitted, freelancers can apply to your job posting.",
    },
    {
      question: "How do I choose the right freelancer?",
      answer:
        "Review freelancer profiles, ratings, and reviews. You can also conduct interviews or request samples before making your decision.",
    },
    {
      question: "What if I'm not satisfied with the work?",
      answer:
        "If you're not satisfied with the work, you can request revisions based on your original requirements. If issues persist, our dispute resolution team can help mediate and find a solution.",
    },
    {
      question: "How secure are payments on Paid2Workk?",
      answer:
        "Payments on Paid2Workk are secure and protected. We use escrow services for fixed-price projects, ensuring that funds are only released when you're satisfied with the work.",
    },
    {
      question: "Can I post a job for free?",
      answer:
        "Yes, posting a job on Paid2Workk is free. We don't charge anything from clients for posting jobs.",
    },
    {
      question: "How do I manage proposals from freelancers?",
      answer:
        "Our dashboard allows you to track proposals, view freelancer profiles, and manage communications. You can sort proposals by experience, ratings, and bid amounts.",
    },
    {
      question: "Can I set a budget for my project?",
      answer:
        "Yes, you can specify a budget range when posting your job, allowing freelancers to bid accordingly and ensuring you receive proposals that fit your financial plan.",
    },
    {
      question: "How do I communicate with freelancers?",
      answer:
        "Paid2Workk includes an integrated messaging system that facilitates clear and secure communication between you and freelancers, ensuring efficient collaboration throughout the project.",
    },
    {
      question: "What kind of support is available for clients?",
      answer:
        "Clients can access dedicated customer support, a help center, and personalized assistance to ensure that posting jobs and managing projects are as straightforward as possible.",
    },
    {
      question: "Can I cancel a job posting once it's live?",
      answer:
        "Yes, you can cancel or modify a job posting at any time. However, if freelancers have already applied, we recommend reviewing applications carefully before making any changes.",
    },
  ],
  support: [
    {
      question: "How do I contact customer support?",
      answer:
        "You can contact our customer support team through the 'Help' section, by submitting a ticket, or by emailing support@paid2workk.com. Our team is available 24/7 to assist you.",
    },
    {
      question: "What should I do if I encounter a technical issue?",
      answer:
        "If you encounter a technical issue, try refreshing the page or clearing your browser cache. If the problem persists, contact our support team with details about the issue, including screenshots if possible.",
    },
    {
      question: "How do I report a user or project?",
      answer:
        "You can report a user or project by clicking the 'Report' button on their profile or project page. Provide detailed information about the issue, and our team will investigate promptly.",
    },
    {
      question: "What is your response time for support tickets?",
      answer:
        "We aim to respond to all support tickets within 24 hours. For urgent issues, we prioritize responses and typically reply within a few hours.",
    },
    {
      question: "Do you offer live chat support?",
      answer:
        "Yes, we offer live chat support during peak hours. For off-peak times, you can leave a ticket, and our support team will get back to you as soon as possible.",
    },
    {
      question: "Where can I find the platform's user guides?",
      answer:
        "Our Help Center features user guides, FAQs, and tutorial videos designed to assist with common tasks and troubleshooting. Simply navigate to the Help section.",
    },
    {
      question: "How do I update my contact information for support?",
      answer:
        "You can update your contact details directly in your profile settings. This ensures that you receive all notifications and support communications in a timely manner.",
    },
    {
      question: "Is there a community forum for troubleshooting?",
      answer:
        "Yes, we have an active community forum where users share tips and solutions. This can be a great resource for resolving common issues and learning best practices.",
    },
    {
      question: "Can I schedule a call with a support specialist?",
      answer:
        "For complex issues, you can request a scheduled call with one of our support specialists. Simply mention your preference in your support ticket, and we will coordinate a convenient time.",
    },
    {
      question: "What if I don’t receive a timely response?",
      answer:
        "If you do not receive a response within the expected time frame, please check your spam folder or contact us again. We are committed to ensuring every issue is addressed promptly.",
    },
  ],
};


export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Collect all questions that match the search query
    const results = [];
    Object.keys(faqData).forEach((category) => {
      faqData[category].forEach((item) => {
        if (
          item.question.toLowerCase().includes(query.toLowerCase()) ||
          item.answer.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({
            ...item,
            category,
          });
        }
      });
    });

    setFilteredQuestions(results);
  };

  return (
    <div className="px-10 md:px-5 container max-w-7xl mx-auto mb-8 p-6">
      <div className="max-w-3xl mx-auto mb-4 text-center">
        <h1 className="text-xl font-medium tracking-tight mb-1">
          Frequently Asked Questions
        </h1>
        <p className="text-black text-sm">
          Find answers to common questions about Paid2Workk
        </p>

        <div className="relative max-w-md mx-auto mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
          <Input
            placeholder="Search for questions..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {isSearching ? (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          {filteredQuestions.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredQuestions.map((item, index) => (
                <AccordionItem key={index} value={`search-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div>
                      <span>{item.question}</span>
                      <span className="ml-2 text-xs px-2 py-1 bg-muted rounded-full capitalize">
                        {item.category}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-black">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 mx-auto text-black mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-black mb-4">
                We couldn't find any questions matching your search.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearching(false);
                }}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="mb-6 w-fit justify-start overflow-auto">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="freelancers">For Freelancers</TabsTrigger>
                <TabsTrigger value="clients">For Clients</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 w-full">
                <Accordion type="single" collapsible className="w-full">
                  {faqData.general.map((item, index) => (
                    <AccordionItem key={index} value={`general-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-black">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="freelancers" className="space-y-4 w-full">
                <Accordion type="single" collapsible className="w-full">
                  {faqData.freelancers.map((item, index) => (
                    <AccordionItem key={index} value={`freelancers-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-black">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="clients" className="space-y-4 w-full">
                <Accordion type="single" collapsible className="w-full">
                  {faqData.clients.map((item, index) => (
                    <AccordionItem key={index} value={`clients-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-black">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="support" className="space-y-4 w-full">
                <Accordion type="single" collapsible className="w-full">
                  {faqData.support.map((item, index) => (
                    <AccordionItem key={index} value={`support-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-black">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-medium">Still Need Help?</CardTitle>
                <CardDescription className="text-sm text-black">
                  Our support team is ready to assist you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 mt-0 ">
                <div className="flex items-center gap-2 text-sm ">
                  <Mail className="h-4 w-4 text-black" />
                  <span>support@paid2workk.com</span>
                </div>
                <div className="flex items-center gap-2  text-sm" >
                  <Phone className="h-4 w-4 text-black" />
                  <span>+91 91086 28001</span>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Getting Started Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Payment Methods
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Account Security
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Dispute Resolution
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Service Fees
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle>Submit a Question</CardTitle>
                <CardDescription>
                  Can't find what you're looking for?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-black mb-4">
                  Submit your question and our team will add it to our FAQ
                  section.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Submit Question
                </Button>
              </CardFooter>
            </Card> */}
          </div>
        </div>
      )}
    </div>
  );
}
