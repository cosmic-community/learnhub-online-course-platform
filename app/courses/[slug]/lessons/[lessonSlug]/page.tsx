// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import CourseProgressTracker from '@/components/CourseProgressTracker'

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

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; lessonSlug: string }> 
}) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Lesson Not Found' }
  }

  const lesson = course.metadata?.lessons?.find(l => l.slug === lessonSlug)
  
  if (!lesson) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} | ${course.title} | LearnHub`,
    description: lesson.metadata?.description,
  }
}

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ slug: string; lessonSlug: string }> 
}) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentLesson = sortedLessons.find(l => l.slug === lessonSlug)
  
  if (!currentLesson) {
    notFound()
  }

  const currentIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  const { metadata } = currentLesson

  return (
    <div className="min-h-screen">
      {/* Progress Tracker (invisible) */}
      <CourseProgressTracker 
        courseSlug={course.slug}
        courseTitle={course.title}
        courseThumbnail={course.metadata?.thumbnail?.imgix_url}
        lessonSlug={currentLesson.slug}
        lessonTitle={metadata?.title || currentLesson.title}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-24">
              <Link 
                href={`/courses/${course.slug}`}
                className="flex items-center gap-2 text-sm text-navy-400 hover:text-white transition-colors mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Course
              </Link>
              
              <h3 className="font-semibold text-white mb-4 truncate">{course.title}</h3>
              
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {sortedLessons.map((lesson, index) => {
                  const isActive = lesson.slug === lessonSlug
                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary-500/20 text-primary-400' 
                          : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isActive ? 'bg-primary-500 text-white' : 'bg-navy-700'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm truncate">
                        {lesson.metadata?.title || lesson.title}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
              <span>/</span>
              <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors truncate max-w-[150px]">
                {course.title}
              </Link>
              <span>/</span>
              <span className="text-white truncate max-w-[200px]">{metadata?.title || currentLesson.title}</span>
            </nav>

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-navy-400 mb-2">
                <span>Lesson {currentIndex + 1} of {sortedLessons.length}</span>
                {metadata?.duration_minutes && (
                  <>
                    <span>•</span>
                    <span>{metadata.duration_minutes} min</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {metadata?.title || currentLesson.title}
              </h1>
              {metadata?.description && (
                <p className="text-lg text-navy-300">{metadata.description}</p>
              )}
            </div>

            {/* Video */}
            {metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={metadata.video_url} title={metadata?.title || currentLesson.title} />
              </div>
            )}

            {/* Content */}
            {metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownContent content={metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                <CodeBlock code={metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-navy-500">Previous</div>
                    <div className="text-sm">{prevLesson.metadata?.title || prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="text-sm">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-primary"
                >
                  Complete Course 🎉
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}