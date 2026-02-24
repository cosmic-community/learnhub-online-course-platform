import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import LearningStreak from '@/components/LearningStreak'
import QuickTip from '@/components/QuickTip'
import './globals.css'

export const metadata: Metadata = {
  title: 'LearnHub - Online Course Platform',
  description: 'Master new skills with expert-led online courses. Learn web development, design, and more at your own pace.',
  keywords: ['online courses', 'learning platform', 'web development', 'programming', 'education'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG || ''
  
  return (
    <html lang="en">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CosmicBadge bucketSlug={bucketSlug} />
        <LearningStreak />
        <QuickTip />
      </body>
    </html>
  )
}