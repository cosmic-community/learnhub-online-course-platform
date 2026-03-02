// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import { marked } from 'marked'
import CodeBlock from '@/components/CodeBlock'
import { LessonCompleteButton } from '@/components/LearningProgress'

export async function generateStaticParams() {
  const courses = await getCourses()
  const params: { slug: string; lessonSlug: string }[] = []
  
  for (const course of courses) {
    const lessons = course.metadata?.lessons || []
    for (const lesson of lessons) {
      params.push({
        slug: course.slug,
        lessonSlug: lesson.slug,
      })
    }
  }
  
  return params
}

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex((l: { slug: string }) => l.slug === lessonSlug)
  
  if (currentIndex === -1) {
    notFound()
  }

  const lesson = lessons[currentIndex]
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  const { metadata } = lesson

  // Parse content markdown
  const contentHtml = metadata?.content 
    ? marked(metadata.content) 
    : ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-navy-400 flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary-400 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
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
          <li className="text-navy-200">{metadata?.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Lesson List */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-8">
            <div className="card p-4">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>📚</span> Lessons
              </h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {lessons.map((l: { id: string; slug: string; metadata?: { title?: string; duration_minutes?: number } }, index: number) => {
                  const isActive = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'hover:bg-navy-800 text-navy-300'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isActive ? 'bg-primary-500 text-white' : 'bg-navy-700'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm truncate flex-1">
                        {l.metadata?.title || `Lesson ${index + 1}`}
                      </span>
                      {l.metadata?.duration_minutes && (
                        <span className="text-xs text-navy-500 flex-shrink-0">
                          {l.metadata.duration_minutes}m
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {/* Lesson Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-navy-400 mb-2">
              <span>Lesson {currentIndex + 1} of {lessons.length}</span>
              {metadata?.duration_minutes && (
                <>
                  <span>•</span>
                  <span>{metadata.duration_minutes} minutes</span>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {metadata?.title}
            </h1>
            {metadata?.description && (
              <p className="text-lg text-navy-300">{metadata.description}</p>
            )}
          </div>

          {/* Video Player */}
          {metadata?.video_url && (
            <div className="mb-8 card overflow-hidden">
              <div className="aspect-video bg-navy-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎬</div>
                  <p className="text-navy-300">Video Player</p>
                  <a 
                    href={metadata.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    Watch on external player →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Content */}
          {contentHtml && (
            <div className="card p-8 mb-8">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          )}

          {/* Code Example */}
          {metadata?.code_example && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💻</span> Code Example
              </h2>
              <CodeBlock code={metadata.code_example} />
            </div>
          )}

          {/* Mark Complete Button */}
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-semibold text-white">Finished this lesson?</h3>
                <p className="text-sm text-navy-400">Mark it complete to track your progress</p>
              </div>
              <LessonCompleteButton 
                courseSlug={slug} 
                lessonSlug={lessonSlug}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 pt-8 border-t border-navy-800">
            {prevLesson ? (
              <Link
                href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-navy-500">Previous</div>
                  <div className="font-medium">{prevLesson.metadata?.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            
            {nextLesson ? (
              <Link
                href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors text-right"
              >
                <div>
                  <div className="text-xs text-navy-500">Next</div>
                  <div className="font-medium">{nextLesson.metadata?.title}</div>
                </div>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="btn-primary"
              >
                Complete Course 🎉
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}