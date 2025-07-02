import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Twitter,
  Linkedin,
  Share2,
  Clock,
  Calendar,
  Eye,
} from "lucide-react";
import Footer from "@/components/footer";

const getBlogPost = (id) => {
  const posts = {
    1: {
      id: "1",
      title: "5 Essential Skills Every Freelancer Should Master in 2025",
      excerpt:
        "Discover the key skills that will set you apart in the competitive freelancing market and help you build a successful career.",
      date: "December 15, 2024",
      readTime: "5 min read",
      category: "Career Development",
      image: "/felan_1.png",
      views: "2.4k",
      author: {
        name: "Alex Johnson",
        role: "Senior Freelance Consultant",
        avatar: "/felan_3.png",
        bio: "Freelance consultant with 8+ years of experience helping independent professionals build successful careers.",
        social: {
          twitter: "@alexjohnson",
          linkedin: "alex-johnson",
        },
      },
      content: {
        intro: `The freelancing landscape is constantly evolving, and staying competitive requires continuous skill development. As we move through 2025, certain skills have become absolutely essential for freelancers who want to thrive in this dynamic market. It's no longer enough to simply be good at your core service — clients expect freelancers to be adaptive, tech-savvy, and highly communicative. Whether you're just starting out or looking to level up, mastering these in-demand skills will help you land better projects, retain clients, and future-proof your freelance career. Staying ahead means learning smarter, not just working harder.`,
        sections: [
          {
            heading: "1. Digital Communication and Collaboration",
            paragraphs: [
              "In today's remote-first world, your ability to communicate effectively through digital channels can make or break client relationships. This goes beyond writing clear emails — it involves actively listening, adapting your tone for different platforms, and maintaining consistent responsiveness. Clients value freelancers who can clearly express project goals, ask thoughtful questions, and prevent misunderstandings before they happen. From kick-off calls to status updates, every touchpoint is an opportunity to build trust and credibility. Mastering digital communication ensures smoother collaboration and better long-term outcomes.",
            ],
            listItems: [
              "Mastering video conferencing platforms like Zoom, Google Meet, and Microsoft Teams",
              "Using project management tools such as Asana, Trello, or Monday.com",
              "Understanding different communication styles and adapting accordingly",
              "Setting clear expectations and boundaries from the start",
            ],
          },
          {
            heading: "2. AI and Automation Tools",
            paragraphs: [
              "Artificial Intelligence isn't here to replace freelancers — it's here to make us more efficient, creative, and competitive. Smart freelancers are embracing AI as a powerful ally to streamline repetitive tasks, boost productivity, and enhance the quality of their work. From automating emails and generating content drafts to analyzing data and managing workflows, AI tools are revolutionizing how freelancers operate. Rather than fearing automation, successful freelancers are learning how to integrate these technologies into their daily routines. Embracing AI can free up more time for strategy, creativity, and higher-value client work.",
            ],
            listItems: [
              "Automate repetitive tasks and workflows",
              "Generate initial drafts and ideas",
              "Analyze data and create insights",
              "Enhance their creative processes",
            ],
            extraNote:
              "Popular tools include ChatGPT for writing assistance, Midjourney for design inspiration, and Zapier for workflow automation.",
          },
          {
            heading: "3. Data Analysis and Interpretation",
            paragraphs: [
              "Regardless of your field, the ability to work with data is becoming a core freelance skill in 2024. Clients are no longer satisfied with just creative output — they expect insights backed by measurable results. Whether you're a writer tracking engagement metrics or a developer analyzing user behavior, data literacy helps you make smarter decisions. Freelancers who can collect, interpret, and present data clearly stand out as strategic partners. Being able to turn raw numbers into actionable recommendations adds immense value and builds long-term client trust.",
            ],
            listItems: [
              "Collect and analyze relevant metrics",
              "Create meaningful reports and visualizations",
              "Make data-driven recommendations",
              "Track and measure project success",
            ],
          },
          {
            heading: "4. Cybersecurity Awareness",
            paragraphs: [
              "As a freelancer, you're often entrusted with confidential client data — from login credentials to financial documents. In this digital age, basic cybersecurity awareness is not just a plus, it's a necessity. Freelancers must understand how to secure their devices, use strong and unique passwords, and recognize phishing attempts. Failing to protect client data can damage your reputation and lead to lost opportunities. Staying vigilant with secure practices builds trust and demonstrates professionalism in every project you handle.",
            ],
            listItems: [
              "Using strong, unique passwords and password managers",
              "Understanding VPNs and secure file sharing",
              "Recognizing phishing attempts and social engineering",
              "Implementing proper backup and recovery procedures",
            ],
          },
          {
            heading: "5. Personal Branding and Content Marketing",
            paragraphs: [
              "Your personal brand is your most valuable asset as a freelancer — it’s how clients perceive your expertise, reliability, and professionalism. Building a strong brand goes beyond having a portfolio; it’s about creating consistent messaging across platforms, showcasing your unique voice, and positioning yourself as a thought leader. From LinkedIn posts to portfolio updates and client testimonials, every touchpoint contributes to your credibility. A compelling personal brand helps you stand out in a crowded market and attract the right opportunities.",
            ],
            listItems: [
              "Creating consistent messaging across all platforms",
              "Developing a content strategy that showcases expertise",
              "Building and nurturing professional networks",
              "Understanding SEO and social media algorithms",
            ],
          },
          {
            heading: "Getting Started",
            paragraphs: [
              "Don't try to master all these skills at once. Choose one that aligns most closely with your current work and start there. Dedicate 30 minutes a day to learning, and you'll be surprised how quickly you progress.",
              "Remember, the goal isn't to become an expert in everything, but to develop enough competency to add value for your clients and stay competitive in the market.",
              "In today's remote-first world, your ability to communicate effectively through digital channels can make or break client relationships. This goes beyond writing clear emails — it involves actively listening, adapting your tone for different platforms, and maintaining consistent responsiveness. Clients value freelancers who can clearly express project goals, ask thoughtful questions, and prevent misunderstandings before they happen. From kick-off calls to status updates, every touchpoint is an opportunity to build trust and credibility. Mastering digital communication ensures smoother collaboration and better long-term outcomes.",
            ],
          },
        ],
      },
    },
  };

  return posts[id] || posts["1"];
};

const relatedPosts = [
  {
    id: "2",
    title: "How to Set Your Freelance Rates: A Complete Guide",
    excerpt:
      "Learn the art of pricing your services competitively while ensuring you're fairly compensated.",
    date: "December 10, 2024",
    readTime: "7 min read",
    category: "Business",
    image: "/felan_4.png",
    featured: true,
  },
  {
    id: "3",
    title: "Building Long-term Client Relationships",
    excerpt: "Strategies to turn one-time clients into long-term partners.",
    date: "December 5, 2024",
    readTime: "6 min read",
    category: "Client Relations",
    image: "/felan_5.png",
  },
  {
    id: "4",
    title: "Time Management for Freelancers",
    excerpt: "Effective techniques to manage multiple projects and deadlines.",
    date: "November 28, 2024",
    readTime: "4 min read",
    category: "Productivity",
    image: "/felan_6.png",
  },
  {
    id: "5",
    title: "How to Set Your Freelance Rates: A Complete Guide",
    excerpt:
      "Learn the art of pricing your services competitively while ensuring you're fairly compensated.",
    date: "December 10, 2024",
    readTime: "7 min read",
    category: "Business",
    image: "/felan_7.png",
    featured: true,
  },
];

export default function BlogPostPage({ params }) {
  const post = getBlogPost(params);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 mt-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-3">
            {/* Article Card */}
            <Card className="mb-8 border-0 shadow-lg py-0">
              <CardContent className="p-0 rounded-lg overflow-hidden">
                {/* Full-width Article Image */}
                <img
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-auto object-cover max-h-[400px]"
                />

                {/* Article Body */}
                <div className="px-6 md:px-12 py-5">
                  {/* Article Title */}
                  <h2 className="text-lg font-medium text-slate-900 leading-tight mb-2">
                    {post.title}
                  </h2>

                  {/* Meta Info */}
                  <div className="text-xs text-slate-500 mb-2">
                    By{" "}
                    <span className="font-medium text-black">
                      {post.author.name}
                    </span>{" "}
                    • {post.date} • {post.readTime}
                  </div>

                  {/* Article Content */}
                  <article className="space-y-4">
                    <p className="text-sm leading-relaxed text-slate-800">
                      {post.content.intro}
                    </p>

                    {post.content.sections.map((section, index) => (
                      <div key={index} className="space-y-4">
                        <h2 className="text-base font-medium text-slate-900 mb-2">
                          {section.heading}
                        </h2>
                        {section.paragraphs?.map((para, idx) => (
                          <p key={idx} className="text-black-800 text-sm mb-2">
                            {para}
                          </p>
                        ))}
                        {section.listItems && (
                          <ul className="list-disc list-inside space-y-1 text-black-700 text-sm">
                            {section.listItems.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                        {section.extraNote && (
                          <p className="italic text-slate-600 text-sm">
                            {section.extraNote}
                          </p>
                        )}
                      </div>
                    ))}
                  </article>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Link href="/blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  All Articles
                </Button>
              </Link>
              <div className="flex gap-3">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button variant="outline">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Table of Contents */}
              <Card className="border-0 shadow-lg">
                <CardContent className="px-6">
                  <h3 className="font-medium text-black-900 mb-4">
                    In This Article
                  </h3>
                  <nav className="space-y-2">
                    {post.content.sections.map((section, index) => (
                      <a
                        key={index}
                        href={`#section-${index}`}
                        className="block text-sm text-black-800 hover:text-blue-600 transition-colors py-1"
                      >
                        {section.heading}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="px-6">
                  <h3 className="font-bold text-slate-900 mb-2">
                    Stay Updated
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Get weekly freelancing tips delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <section className="mt-4">
          <h2 className="text-xl font-medium text-slate-900 mb-4">
            More Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {relatedPosts.map((post) => (
              <Card
                key={post.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden p-0"
              >
                {/* IMAGE SECTION */}
                <div className="relative w-full h-48 sm:h-56 md:h-60 lg:h-64 xl:h-72 cursor-pointer">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900">
                    {post.category}
                  </Badge>
                </div>

                {/* CONTENT SECTION */}
                <CardContent className="pt-4 px-4 pb-5">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
