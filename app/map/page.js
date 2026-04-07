import PageHeader from '@/components/common/PageHeader'
import MapClient  from '@/components/property/MapClient'

export const metadata = { title: 'Map Search' }

export default function MapPage() {
  return (
    <>
      <PageHeader badge="Map Search" title="Find Properties on Map" subtitle="Search by exact location. Every pin is GPS-verified." />
      <MapClient />
    </>
  )
}
