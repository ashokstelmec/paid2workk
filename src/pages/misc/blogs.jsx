import { Link } from "react-router-dom";
import Footer from "@/components/footer";

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Skills Every Freelancer Should Master in 2024",
    excerpt:
      "Discover the key skills that will set you apart in the competitive freelancing market and help you build a successful career.",
    date: "December 15, 2024",
    readTime: "5 min read",
    category: "Career Development",
    image: "/felan_11.png",
  },
  {
    id: 2,
    title: "How to Set Your Freelance Rates: A Complete Guide",
    excerpt:
      "Learn the art of pricing your services competitively while ensuring you're fairly compensated for your expertise and time.",
    date: "December 10, 2024",
    readTime: "7 min read",
    category: "Business",
    image: "/felan_12.png",
  },
  {
    id: 3,
    title: "Building Long-term Client Relationships as a Freelancer",
    excerpt:
      "Strategies to turn one-time clients into long-term partners and create a sustainable freelance business.",
    date: "December 5, 2024",
    readTime: "6 min read",
    category: "Client Relations",
    image: "/felan_13.png",
  },
  {
    id: 4,
    title: "The Freelancer's Guide to Time Management",
    excerpt:
      "Effective techniques to manage multiple projects, meet deadlines, and maintain work-life balance.",
    date: "November 28, 2024",
    readTime: "4 min read",
    category: "Productivity",
    image: "/felan_14.png",
  },
  {
    id: 5,
    title: "Creating a Professional Portfolio That Wins Clients",
    excerpt:
      "Tips and best practices for showcasing your work and attracting high-quality clients to your freelance business.",
    date: "November 20, 2024",
    readTime: "8 min read",
    category: "Marketing",
    image: "/felan_10.png",
  },
  {
    id: 6,
    title: "Handling Difficult Clients: A Freelancer's Survival Guide",
    excerpt:
      "Professional strategies for managing challenging client relationships while protecting your business interests.",
    date: "November 15, 2024",
    readTime: "6 min read",
    category: "Client Relations",
    image: "/felan_9.png",
  },
];

function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-6 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-medium mb-2">
            Freelancer Insights & Tips
          </h2>
          <p className="text-base text-blue-100 max-w-2xl mx-auto">
            Discover valuable insights, practical tips, and industry trends to
            help you succeed in your freelancing journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link
                  to={`/blogs/${post.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Read More
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Load More Articles
          </button>
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="bg-blue-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            Stay Updated with Freelancing Tips
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest insights, tips, and strategies delivered to your
            inbox. Join thousands of freelancers who trust our content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Blog;
