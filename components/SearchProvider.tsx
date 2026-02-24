'use client'

import QuickSearch from './QuickSearch'

interface SearchProviderProps {
  courses: { title: string; slug: string; metadata?: { tagline?: string } }[]
  categories: { title: string; slug: string; metadata?: { icon?: string; name?: string } }[]
  instructors: { title: string; slug: string; metadata?: { name?: string; credentials?: string } }[]
}

export default function SearchProvider({ courses, categories, instructors }: SearchProviderProps) {
  return (
    <QuickSearch 
      courses={courses}
      categories={categories}
      instructors={instructors}
    />
  )
}