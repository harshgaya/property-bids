import PageHeader    from '@/components/common/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { SITE } from '@/constants'

export const metadata = { title: 'Terms of Service' }

const sections = [
  { title:'Acceptance of Terms', content:'By accessing or using MyPropertyBids.in, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.' },
  { title:'User Eligibility', content:'You must be at least 18 years of age to use this platform. By registering, you represent that you are legally competent to enter into contracts under applicable Indian law.' },
  { title:'Listing Rules', content:`All property listings must represent real properties owned or authorised for sale by the listing user. GPS coordinates must accurately reflect the actual property location (within 100 metres). A minimum of 5 live camera photos are required. Submitting false location data, edited photos, or listings for properties you do not own is grounds for immediate account termination and potential legal action.` },
  { title:'Bid Terms', content:`The ₹99 bid fee is non-refundable once placed. Bids are private — only the property owner can see who bid. Placing a bid does not constitute a legally binding purchase agreement. Final transactions are between buyers and sellers directly. ${SITE.name} is a facilitating platform and is not party to any property transaction.` },
  { title:'Listing Fees', content:'Listing fees (₹199 for Basic, ₹2,499 for Manual, ₹30,000 for Legal) are non-refundable after listing approval. If a listing is rejected due to violation of our rules, a partial refund may be issued at our discretion.' },
  { title:'Prohibited Conduct', content:'You may not submit fraudulent listings, impersonate another person, attempt to reverse-engineer or hack the platform, scrape data without permission, or use the platform for any unlawful purpose.' },
  { title:'Limitation of Liability', content:`${SITE.name} is not liable for any loss arising from property transactions conducted through the platform. We provide a discovery and verification layer — we do not guarantee title, encumbrance-free status, or legal completeness of any property unless under the Legal Verified plan.` },
  { title:'Governing Law', content:`These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana.` },
  { title:'Contact', content:`For terms-related queries, contact us at ${SITE.email}` },
]

export default function TermsPage() {
  return (
    <>
      <PageHeader badge="Legal" title="Terms of Service" subtitle="Last updated: January 1, 2025" />
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {sections.map(({ title, content }, i) => (
              <AnimatedSection key={title} delay={i * 60}>
                <h2 className="text-lg font-extrabold text-gray-900 mb-3">{i+1}. {title}</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{content}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
