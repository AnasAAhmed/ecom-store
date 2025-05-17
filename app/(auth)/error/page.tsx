import ErrorUi from '@/components/Error'
import Loader from '@/components/ui/Loader'
import React from 'react'

const page = () => {
  return (
    <React.Suspense fallback={<Loader />}>
      <ErrorUi />
    </React.Suspense>
  )
}

export default page
