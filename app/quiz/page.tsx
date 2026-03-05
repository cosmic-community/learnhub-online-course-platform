import type { Metadata } from 'next'
import LearningPathQuiz from '@/components/LearningPathQuiz'
import { getCourses, getCategories } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Find Your Learning Path - LearnHub',
  description: 'Take our quick quiz to discover the perfect course for your skill level and interests.',
}

export default async function QuizPage() {
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories(),
  ])

  return (
    <div className="py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <LearningPathQuiz courses={courses} categories={categories} />
      </div>
    </div>
  )
}