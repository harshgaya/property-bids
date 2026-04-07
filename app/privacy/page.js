import PageHeader    from '@/components/common/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { SITE } from '@/constants'

export const metadata = { title: 'Privacy Policy' }

const sections = [
  { title:'Information We Collect', content:`We collect your mobile number for OTP authentication, property listing details you voluntarily submit, GPS location data when you submit a listing (to validate the property pin), and photo metadata (GPS coordinates, timestamp) embedded in uploaded images.` },
  { title:'How We Use Your Data', content:`Your mobile number is used solely for authentication via OTP. Location data is used to validate listing authenticity — we compare your device GPS against your submitted pin. We do not sell, rent, or share your personal data with third parties for marketing purposes.` },
  { title:'Photo & GPS Data', content:`Live camera photos taken in-app are GPS-stamped to prevent fake listings. This stamp includes latitude, longitude, and a timestamp. This data is stored with your listing and shown to prospective buyers as proof of authenticity.` },
  { title:'Data Security', content:`All data is encrypted in transit (HTTPS/TLS). Passwords are not stored — we use OTP-only authentication. Database access is restricted to authenticated services. We use MongoDB Atlas with encryption at rest.` },
  { title:'Cookies', content:`We use a single secure httpOnly cookie for session management (pb_token). We do not use tracking cookies, advertising cookies, or any third-party analytics cookies that share data externally.` },
  { title:'Your Rights', content:`You can request deletion of your account and all associated data by emailing ${SITE.supportEmail}. We will process deletion requests within 7 business days.` },
  { title:'Contact', content:`For privacy-related queries, email ${SITE.supportEmail} or write to us at ${SITE.address.line1}, ${SITE.address.line2}, ${SITE.address.city}, ${SITE.address.state} — ${SITE.address.pin}.` },
]

export default function PrivacyPage() {
  return (
    <>
      <PageHeader badge="Legal" title="Privacy Policy" subtitle={`Last updated: January 1, 2025`} />
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-10">
              <p className="text-sm text-green-800 leading-relaxed">
                <strong>{SITE.name}</strong> is committed to protecting your privacy. We do not run ads. We do not sell data. This policy explains exactly what we collect and why.
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
