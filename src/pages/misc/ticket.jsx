import { useEffect, useState } from "react";
import { Clock, HelpCircle, Info, Mail, Phone, User } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "bg-green hover:bg-green text-white px-4 py-1 rounded-full";
    case "in progress":
      return "bg-blue hover:bg-blue text-white px-4 py-1 rounded-full";
    case "pending":
      return "bg-gold hover:bg-gold text-white px-4 py-1 rounded-full";
    case "closed":
      return "bg-muted-foreground text-white px-4 py-1 rounded-full";
    default:
      return "bg-muted-foreground text-white px-4 py-1 rounded-full";
  }
};

function TicketCard({ ticket }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg text-primary">
              Ticket #{ticket.ticketID}
            </CardTitle>
            <CardDescription>Submitted by {ticket.name}</CardDescription>
          </div>
          <Badge className={getStatusColor(ticket.status)}>
            {ticket.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
              Description
            </h3>
            <div className="p-3 bg-muted/50 rounded-md text-sm">
              <p>{ticket.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Contact
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{ticket.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{ticket.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{ticket.phoneNumber}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Timeline
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">
                    Created:{" "}
                    {new Date(ticket.createdOn).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">
                    Updated:{" "}
                    {new Date(ticket.lastUpdatedOn).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// FAQ data for sidebar
const faqs = [
  {
    question: "What is the status of my ticket?",
    answer:
      "You can view the status of your ticket in the 'Help Ticket Status' section. Tickets are categorized as Open, In Progress, Pending, or Closed.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach out to our support team via email at support@paid2workk.com or call us at +91-9108628001.",
  },
  {
    question: "What happens after I submit a ticket?",
    answer:
      "Once you submit a ticket, our support team will review it and respond as soon as possible. You can track updates in the ticket timeline.",
  },
];

const TicketStatusPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userId = sessionStorage.getItem("NUserID");
        if (!userId) throw new Error("User ID not found in session");

        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/ShowHelpTicketsByNUserID/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data = await response.json();
        // console.log("API Response:", data);

        // Don't throw an error for empty data, just set tickets to an empty array
        if (!Array.isArray(data) || data.length === 0) {
          setTickets([]);
        } else {
          setTickets(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <>
      <div className="px-10 md:px-5 container max-w-7xl mx-auto mb-8 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Help Ticket Status
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              View and manage your support requests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {tickets.length === 0 ? (
                  <>
                    <h3 className="text-base text-center py-8">
                      No Tickets Found.
                    </h3>
                  </>
                ) : (
                  tickets.map((ticket) => (
                    <TicketCard key={ticket.ticketID} ticket={ticket} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="open" className="space-y-6">
                {tickets.filter((ticket) => ticket.status === "Open").length ===
                0 ? (
                  <>
                    <h3 className="text-base text-center py-8">
                      No Tickets Found.
                    </h3>
                  </>
                ) : (
                  tickets
                    .filter((ticket) => ticket.status === "Open")
                    .map((ticket) => (
                      <TicketCard key={ticket.ticketID} ticket={ticket} />
                    ))
                )}
              </TabsContent>

              <TabsContent value="closed" className="space-y-6">
                {tickets.filter((ticket) => ticket.status === "Closed")
                  .length === 0 ? (
                  <>
                   <h3 className="text-base text-center py-8">
                      No Tickets Found.
                    </h3>
                  </>
                ) : (
                  tickets
                    .filter((ticket) => ticket.status === "Closed")
                    .map((ticket) => (
                      <TicketCard key={ticket.ticketID} ticket={ticket} />
                    ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card className="px-0 py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-1 text-lg">
                  <Info className="h-4 w-4" />
                  Support Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-black">
                      Open Tickets
                    </p>
                    <p className="text-2xl font-bold">
                      {tickets.filter((t) => t.status === "Open").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">
                      Closed Tickets
                    </p>
                    <p className="text-2xl font-bold">
                      {" "}
                      {tickets.filter((t) => t.status === "Closed").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

           <Card className="px-0 py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b pb-3 last:border-0 last:pb-0"
                    >
                      <h3 className="font-medium mb-1">{faq.question}</h3>
                      <p className="text-sm text-black">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-none hover:border-blue"
                  onClick={() => navigate("/support/faq")}
                >
                  View All FAQs
                </Button>
              </CardFooter>
            </Card>

            <Card className="px-0 py-4">
              <CardHeader>
                <CardTitle className="text-lg mb-0">Need Help?</CardTitle>
                <CardDescription className="mt-0">
                  Our support team is ready to assist you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-black" />
                  <span>support@paid2workk.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-black" />
                  <span>+91-9108628001</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketStatusPage;
