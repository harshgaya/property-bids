import PageHeader    from '@/components/common/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { SITE } from '@/constants'

export const metadata = { title: 'Refund Policy' }

const sections = [
  { title:'Listing Fees — Non-Refundable', content:'Once a listing is approved and live on the platform, listing fees (₹199, ₹2,499, or ₹30,000) are non-refundable. This covers the verification work already performed by our team or lawyer.' },
  { title:'Listing Fees — Rejected Listings', content:'If your listing is rejected because it violates our guidelines (false location, fake photos, fraud), no refund is issued. If it is rejected due to a technical error on our side, a full refund is issued within 5–7 business days.' },
  { title:'Bid Fees — Non-Refundable', content:'The ₹99 bid fee is non-refundable in all cases. This fee represents your intent and filters out non-serious buyers. Even if the seller does not respond or rejects your bid, the fee is not returned.' },
  { title:'Razorpay Failures', content:'If a payment is deducted but the listing or bid is not confirmed due to a payment gateway error, we will investigate and issue a full refund within 5 business days. Contact us immediately at support@mypropertybids.in with your payment reference.' },
  { title:'How to Request a Refund', content:`Email ${SITE.supportEmail} with subject "Refund Request — [your order ID]". Include your registered mobile number and a brief description of the issue. We will respond within 24 hours.` },
]

export default function RefundPage() {
  return (
    <>
      <PageHeader badge="Legal" title="Refund Policy" subtitle="Clear, fair, and straightforward." />
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-10">
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Short version:</strong> Listing fees and bid fees are generally non-refundable because work has already been performed or intent has been expressed. Exceptions apply for payment failures and our technical errors.
              </p>
            </div>
          </AnimatedSection>
          <div className="space-y-10">
            {sections.map(({ title, content }, i) => (
              <AnimatedSection key={title} delay={i * 60}>
                <h2 className="text-lg font-extrabold text-gray-900 mb-3">{title}</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{content}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
