import PageHeader    from '@/components/common/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link           from 'next/link'
import { RiTimeLine, RiArrowRightLine, RiUserLine } from 'react-icons/ri'

const posts = [
  { slug:'gps-verified-listings', title:'Why GPS Verification Changes Real Estate Forever', excerpt:'Fake listings cost buyers and sellers hours of wasted time. Here is how GPS + live photo validation solves it at the technical level.', category:'Trust', author:'Arjun Reddy', date:'Mar 28, 2025', readTime:'5 min' },
  { slug:'legal-vs-manual-verification', title:'Legal Verified vs Manual Verified — Which Plan Do You Need?', excerpt:'Comparing the two verification tiers — what each includes, when to choose which, and what buyers look for.', category:'Sellers', author:'Anitha Nair', date:'Mar 20, 2025', readTime:'4 min' },
  { slug:'paid-bids-filter-buyers', title:'How ₹99 Bids Filter Out Time Wasters Completely', excerpt:'The psychology behind paid intent — why a small fee changes buyer behaviour dramatically and what it means for sellers.', category:'Buying', author:'Priya Sharma', date:'Mar 12, 2025', readTime:'3 min' },
  { slug:'hyderabad-property-trends-2025', title:'Hyderabad Real Estate: Best Localities to Buy in 2025', excerpt:'An honest look at Jubilee Hills, Hitech City, Banjara Hills, and Kompally — price trends, demand, and what the data says.', category:'Market', author:'Kiran Rao', date:'Mar 5, 2025', readTime:'7 min' },
  { slug:'plot-vs-apartment-investment', title:'Plot vs Apartment: What Makes More Sense as an Investment?', excerpt:'Breaking down appreciation rates, liquidity, rental yields, and risk profiles for both asset classes in Indian cities.', category:'Investment', author:'Arjun Reddy', date:'Feb 25, 2025', readTime:'6 min' },
  { slug:'first-time-buyer-guide', title:'First-Time Property Buyer in India: Complete 2025 Guide', excerpt:'Everything from budget planning to legal checks to making your first bid — a step-by-step guide for first-time buyers.', category:'Buying', author:'Priya Sharma', date:'Feb 15, 2025', readTime:'10 min' },
]

const categories = ['All', 'Trust', 'Sellers', 'Buying', 'Market', 'Investment']

const catColors = { Trust:'bg-green-50 text-green-700', Sellers:'bg-blue-50 text-blue-700', Buying:'bg-purple-50 text-purple-700', Market:'bg-orange-50 text-orange-700', Investment:'bg-pink-50 text-pink-700' }

export const metadata = { title: 'Blog' }

export default function BlogPage() {
  return (
    <>
      <PageHeader badge="PropertyBids Blog" title="Real Estate Insights" subtitle="Tips, market trends, and guides for serious buyers and sellers." />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Featured post */}
          <AnimatedSection className="mb-14">
            <div className="grid md:grid-cols-2 gap-8 bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden hover:border-green-200 hover:shadow-xl transition-all card-hover">
              <div className="h-64 md:h-auto bg-gradient-to-br from-green-600 to-emerald-800 flex items-end p-8">
                <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-sm">{posts[0].category}</span>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><RiUserLine />{posts[0].author}</span>
                  <span>·</span>
                  <span>{posts[0].date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><RiTimeLine />{posts[0].readTime}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3 leading-snug">{posts[0].title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{posts[0].excerpt}</p>
                <Link href={`/blog/${posts[0].slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                  Read Article <RiArrowRightLine />
                </Link>
              </div>
            </div>
          </AnimatedSection>

          {/* All posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.slice(1).map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 80}>
                <Link href={`/blog/${post.slug}`} className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden card-hover h-full">
                  <div className="h-40 bg-gradient-to-br from-gray-700 to-gray-500 relative">
                    <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-lg ${catColors[post.category] || 'bg-gray-100 text-gray-600'}`}>{post.category}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><RiTimeLine />{post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-green-600 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-1 mt-4 text-xs font-bold text-green-600">
                      Read more <RiArrowRightLine />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
