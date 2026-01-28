// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonProgress from '@/components/LessonProgress'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex(l => l.slug === lessonSlug)
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Lesson Progress Button */}
      <LessonProgress 
        courseSlug={slug} 
        lessonSlug={lessonSlug} 
        lessonTitle={lesson.title}
      />
      
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-2 text-navy-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {course.title}
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <span className="text-navy-400 text-sm">
              Lesson {currentIndex + 1} of {lessons.length}
            </span>
            {lesson.metadata?.duration_minutes && (
              <>
                <span className="text-navy-600">•</span>
                <span className="text-navy-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.metadata.duration_minutes} min
                </span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-white">
            {lesson.metadata?.title || lesson.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video */}
            {lesson.metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={lesson.metadata.video_url} />
              </div>
            )}

            {/* Description */}
            {lesson.metadata?.description && (
              <div className="bg-navy-800/50 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">About this lesson</h2>
                <p className="text-navy-300">{lesson.metadata.description}</p>
              </div>
            )}

            {/* Content */}
            {lesson.metadata?.content && (
              <div className="mb-8">
                <MarkdownContent content={lesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {previousLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${previousLesson.slug}`}
                  className="flex items-center gap-3 text-navy-300 hover:text-white transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="text-sm text-navy-500">Previous</div>
                    <div className="font-medium">{previousLesson.metadata?.title || previousLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-3 text-navy-300 hover:text-white transition-colors group text-right"
                >
                  <div>
                    <div className="text-sm text-navy-500">Next</div>
                    <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="flex items-center gap-3 text-primary-400 hover:text-primary-300 transition-colors group"
                >
                  <div className="text-right">
                    <div className="text-sm text-navy-500">Finished!</div>
                    <div className="font-medium">Back to Course</div>
                  </div>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Course Content</h3>
              <div className="space-y-2">
                {lessons.map((l, index) => {
                  const isActive = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500/20 border border-primary-500/30'
                          : 'hover:bg-navy-800/50'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-700 text-navy-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium line-clamp-2 ${
                          isActive ? 'text-primary-300' : 'text-navy-300'
                        }`}>
                          {l.metadata?.title || l.title}
                        </div>
                        {l.metadata?.duration_minutes && (
                          <div className="text-xs text-navy-500 mt-1">
                            {l.metadata.duration_minutes} min
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}