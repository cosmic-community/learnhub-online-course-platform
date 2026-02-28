'use client'

import dynamic from 'next/dynamic'

const QuickSearch = dynamic(() => import('./QuickSearch'), { ssr: false })

interface QuickSearchWrapperProps {
  courses: { title: string; slug: string; metadata?: { tagline?: string } }[]
  categories: { title: string; slug: string; metadata?: { name?: string; icon?: string } }[]
  instructors: { title: string; slug: string; metadata?: { name?: string; credentials?: string } }[]
}

export default function QuickSearchWrapper(props: QuickSearchWrapperProps) {
  return <QuickSearch {...props} />
}