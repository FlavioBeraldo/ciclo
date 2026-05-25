import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BrandsStrip from '@/components/BrandsStrip'
import CommonErrorSection from '@/components/CommonErrorSection'
import ThesisSection from '@/components/ThesisSection'
import ServicesSection from '@/components/ServicesSection'
import CasesSection from '@/components/CasesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import PodcastSection from '@/components/PodcastSection'
import RecentBlogSection from '@/components/RecentBlogSection'
import LeadForm from '@/components/LeadForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <BrandsStrip />
      <CommonErrorSection />
      <ThesisSection />
      <ServicesSection />
      <CasesSection />
      <TestimonialsSection />
      <PodcastSection />
      <RecentBlogSection />
      <LeadForm />
      <Footer />
    </main>
  )
}
