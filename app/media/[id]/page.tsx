import { Suspense } from 'react'
import MediaDetails from './components/media-details'

interface PageProps {
  params: {
    id: string;
  };
}

export default function MediaPage({ params }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <MediaDetails id={params.id} />
      </Suspense>
    </div>
  )
}