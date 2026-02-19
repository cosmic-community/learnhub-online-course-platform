import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import LearningStreak from '@/components/LearningStreak'
import { getCourses, getCategories } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'LearnHub - Online Learning Platform',
  description: 'Discover courses in web development, design, and more. Learn from industry experts and advance your career.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string
  
  // Fetch data for search functionality
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories(),
  ])
  
  // Transform for header/search
  const searchCourses = courses.map(c => ({
    slug: c.slug,
    title: c.title,
    metadata: { tagline: c.metadata?.tagline }
  }))
  
  const searchCategories = categories.map(c => ({
    slug: c.slug,
    title: c.title,
    metadata: { name: c.metadata?.name, icon: c.metadata?.icon }
  }))
  
  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header courses={searchCourses} categories={searchCategories} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <LearningStreak />
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}