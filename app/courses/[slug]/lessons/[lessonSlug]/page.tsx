// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses, getLessonBySlug } from '@/lib/cosmic'
import ReactMarkdown from 'react-markdown'
import CodeBlock from '@/components/CodeBlock'
import LessonCompleteButton from '@/components/LessonCompleteButton'

// Generate static paths
export async function generateStaticParams() {
  const courses = await getCourses()
  const paths: { slug: string; lessonSlug: string }[] = []

  for (const course of courses) {
    const lessons = course.metadata?.lessons || []
    for (const lesson of lessons) {
      paths.push({
        slug: course.slug,
        lessonSlug: lesson.slug,
      })
    }
  }

  return paths
}

// Generate metadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; lessonSlug: string }> 
}) {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    return {
      title: 'Lesson Not Found - LearnHub',
    }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || '',
  }
}

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ slug: string; lessonSlug: string }> 
}) {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    notFound()
  }

  const courseLessons = course.metadata?.lessons || []
  const sortedLessons = [...courseLessons].sort(
    (a: { metadata?: { order?: number } }, b: { metadata?: { order?: number } }) => 
      (a.metadata?.order ?? 999) - (b.metadata?.order ?? 999)
  )
  
  const currentIndex = sortedLessons.findIndex((l: { slug: string }) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  const { metadata } = lesson

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-lg border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link 
              href={`/courses/${slug}`}
              className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Course
            </Link>
            
            <div className="hidden sm:flex items-center gap-2 text-sm text-navy-400">
              <span>Lesson {currentIndex + 1} of {sortedLessons.length}</span>
            </div>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="p-2 rounded-lg bg-navy-800 text-navy-400 hover:text-white hover:bg-navy-700 transition-colors"
                  title="Previous Lesson"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="p-2 rounded-lg bg-navy-800 text-navy-400 hover:text-white hover:bg-navy-700 transition-colors"
                  title="Next Lesson"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Content</h3>
              <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                {sortedLessons.map((l: { id: string; slug: string; metadata?: { title?: string }; title: string }, index: number) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg transition-colors
                      ${l.slug === lessonSlug 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'text-navy-400 hover:bg-navy-800 hover:text-white'
                      }
                    `}
                  >
                    <span className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${l.slug === lessonSlug 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-navy-800'
                      }
                    `}>
                      {index + 1}
                    </span>
                    <span className="text-sm line-clamp-1">
                      {l.metadata?.title || l.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                {metadata?.title || lesson.title}
              </h1>
              {metadata?.description && (
                <p className="text-lg text-navy-300">{metadata.description}</p>
              )}
              {metadata?.duration_minutes && (
                <div className="mt-4 flex items-center gap-2 text-navy-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{metadata.duration_minutes} minutes</span>
                </div>
              )}
            </div>

            {/* Video */}
            {metadata?.video_url && (
              <div className="mb-8 aspect-video bg-navy-900 rounded-2xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-navy-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Video: {metadata.video_url}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="prose max-w-none mb-8">
                <ReactMarkdown>{metadata.content}</ReactMarkdown>
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={metadata.code_example} />
              </div>
            )}

            {/* Mark Complete Button */}
            <div className="mt-12 pt-8 border-t border-navy-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <LessonCompleteButton 
                  courseSlug={slug} 
                  lessonSlug={lessonSlug} 
                />
                
                {/* Navigation */}
                <div className="flex items-center gap-4">
                  {prevLesson && (
                    <Link
                      href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                      className="btn-secondary"
                    >
                      ← Previous
                    </Link>
                  )}
                  {nextLesson && (
                    <Link
                      href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                      className="btn-primary"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}