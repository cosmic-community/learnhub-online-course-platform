// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import LessonProgress from '@/components/LessonProgress'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const currentLessonIndex = lessons.findIndex(l => l.slug === lessonSlug)
  const lesson = lessons[currentLessonIndex]
  
  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null
  const lessonOrder = currentLessonIndex + 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-navy-400">
          <li>
            <Link href="/courses" className="hover:text-primary-400">Courses</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/courses/${slug}`} className="hover:text-primary-400">
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
          {/* Lesson Header */}
          <div className="mb-8">
            <div className="text-sm text-primary-400 mb-2">
              Lesson {lessonOrder} of {lessons.length}
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {lesson.metadata?.title || lesson.title}
            </h1>
            {lesson.metadata?.description && (
              <p className="text-navy-300 text-lg">
                {lesson.metadata.description}
              </p>
            )}
            {lesson.metadata?.duration_minutes && (
              <div className="mt-4 flex items-center gap-2 text-navy-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lesson.metadata.duration_minutes} minutes
              </div>
            )}
          </div>

          {/* Video Player Placeholder */}
          {lesson.metadata?.video_url && (
            <div className="aspect-video bg-navy-800 rounded-2xl mb-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-navy-400">Video content</p>
              </div>
            </div>
          )}

          {/* Lesson Content */}
          {lesson.metadata?.content && (
            <div className="card p-8 mb-8">
              <MarkdownRenderer content={lesson.metadata.content} />
            </div>
          )}

          {/* Code Example */}
          {lesson.metadata?.code_example && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
              <CodeBlock code={lesson.metadata.code_example} language="javascript" />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-navy-800">
            {prevLesson ? (
              <Link
                href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                className="flex items-center gap-2 text-navy-400 hover:text-primary-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div>
                  <div className="text-xs">Previous</div>
                  <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                className="flex items-center gap-2 text-navy-400 hover:text-primary-400 transition-colors text-right"
              >
                <div>
                  <div className="text-xs">Next</div>
                  <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                </div>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="btn-primary"
              >
                Finish Course 🎉
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress Tracker */}
          <LessonProgress
            courseSlug={slug}
            lessonSlug={lessonSlug}
            totalLessons={lessons.length}
            lessonOrder={lessonOrder}
          />

          {/* Course Lessons */}
          <div className="card p-4">
            <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
            <div className="space-y-2">
              {lessons.map((l, index) => {
                const isActive = l.slug === lessonSlug
                return (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'hover:bg-navy-800 text-navy-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-700 text-navy-400'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm line-clamp-1">
                        {l.metadata?.title || l.title}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Back to Course */}
          <Link
            href={`/courses/${slug}`}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Course
          </Link>
        </div>
      </div>
    </div>
  )
}