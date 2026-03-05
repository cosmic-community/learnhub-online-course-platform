import type { Metadata } from 'next'
import ProgressDashboard from '@/components/ProgressDashboard'

export const metadata: Metadata = {
  title: 'My Progress - LearnHub',
  description: 'Track your learning progress and see how far you\'ve come.',
}

export default function ProgressPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Progress</h1>
          <p className="text-xl text-navy-300">
            Track your learning journey and celebrate your achievements
          </p>
        </div>

        <ProgressDashboard />
      </div>
    </div>
  )
}