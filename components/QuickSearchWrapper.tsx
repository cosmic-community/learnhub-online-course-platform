'use client'

import dynamic from 'next/dynamic'

const QuickSearch = dynamic(() => import('./QuickSearch'), { ssr: false })

interface QuickSearchWrapperProps {
  courses: Array<{
    slug: string
    title: string
    metadata?: {
      tagline?: string
      difficulty?: { value?: string }
    }
  }>
  categories: Array<{
    slug: string
    title: string
    metadata?: {
      name?: string
      icon?: string
    }
  }>
}

export default function QuickSearchWrapper({ courses, categories }: QuickSearchWrapperProps) {
  return <QuickSearch courses={courses} categories={categories} />
}