// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonCompleteBadge from '@/components/LessonCompleteBadge'
import CourseProgress from '@/components/CourseProgress'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Lesson Not Found - LearnHub' }
  }
  
  const lessons = course.metadata?.lessons || []
  const lesson = lessons.find((l: Lesson) => l.slug === lessonSlug)
  
  if (!lesson) {
    return { title: 'Lesson Not Found - LearnHub' }
  }
  
  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || '',
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    notFound()
  }
  
  const lessons = (course.metadata?.lessons || []) as Lesson[]
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  const lesson = lessons[currentIndex]
  
  if (!lesson) {
    notFound()
  }
  
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  
  const lessonSlugs = lessons.map(l => l.slug)
  
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-navy-400">
            <li>
              <Link href="/courses" className="hover:text-primary-400 transition-colors">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/courses/${slug}`} className="hover:text-primary-400 transition-colors">
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">{lesson.metadata?.title || lesson.title}</li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="badge bg-navy-700 text-navy-200">
                    Lesson {currentIndex + 1} of {lessons.length}
                  </span>
                  {lesson.metadata?.duration_minutes && (
                    <span className="text-navy-400 text-sm">
                      ⏱️ {lesson.metadata.duration_minutes} min
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  {lesson.metadata?.title || lesson.title}
                </h1>
                {lesson.metadata?.description && (
                  <p className="text-navy-300 text-lg">
                    {lesson.metadata.description}
                  </p>
                )}
              </div>
              
              {/* Video Player Placeholder */}
              {lesson.metadata?.video_url && (
                <div className="aspect-video bg-navy-800 rounded-xl mb-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🎬</div>
                    <p className="text-navy-300">Video: {lesson.metadata.video_url}</p>
                  </div>
                </div>
              )}
              
              {/* Lesson Content */}
              {lesson.metadata?.content && (
                <div className="mb-8">
                  <MarkdownContent content={lesson.metadata.content} />
                </div>
              )}
              
              {/* Code Example */}
              {lesson.metadata?.code_example && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                  <CodeBlock code={lesson.metadata.code_example} />
                </div>
              )}
              
              {/* Mark as Complete Button */}
              <div className="border-t border-navy-800 pt-6 mb-8">
                <LessonCompleteBadge lessonSlug={lessonSlug} courseSlug={slug} />
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-navy-800">
                {prevLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Link>
                ) : (
                  <div />
                )}
                
                {nextLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                    className="btn-primary flex items-center gap-2"
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${slug}`}
                    className="btn-primary flex items-center gap-2"
                  >
                    Complete Course
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Course Progress */}
              <CourseProgress 
                courseSlug={slug} 
                totalLessons={lessons.length}
                lessonSlugs={lessonSlugs}
              />
              
              {/* Lesson List */}
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
                <nav className="space-y-2">
                  {lessons.map((l, index) => (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`block p-3 rounded-lg transition-colors ${
                        l.slug === lessonSlug
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${
                          l.slug === lessonSlug ? 'text-primary-400' : 'text-navy-500'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-sm line-clamp-2">
                          {l.metadata?.title || l.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}