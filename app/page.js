import Hero             from '@/components/home/Hero'
import TrustBar         from '@/components/home/TrustBar'
import HowItWorks       from '@/components/home/HowItWorks'
import FeaturedListings from '@/components/home/FeaturedListings'
import ListingPlans     from '@/components/home/ListingPlans'
import Testimonials     from '@/components/home/Testimonials'
import CTABanner        from '@/components/home/CTABanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <FeaturedListings />
      <ListingPlans />
      <Testimonials />
      <CTABanner />
    </>
  )
}
