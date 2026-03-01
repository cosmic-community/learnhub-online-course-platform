// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import LessonProgress from '@/components/LessonProgress'
import CourseProgressBar from '@/components/CourseProgressBar'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  const params: { slug: string; lessonSlug: string }[] = []

  for (const course of courses) {
    const lessons = (course.metadata?.lessons as Lesson[]) || []
    for (const lesson of lessons) {
      params.push({
        slug: course.slug,
        lessonSlug: lesson.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Lesson Not Found' }
  }

  const lessons = (course.metadata?.lessons as Lesson[]) || []
  const lesson = lessons.find((l) => l.slug === lessonSlug)

  if (!lesson) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description,
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = (course.metadata?.lessons as Lesson[]) || []
  const lesson = lessons.find((l) => l.slug === lessonSlug)

  if (!lesson) {
    notFound()
  }

  // Sort lessons and find navigation
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentIndex = sortedLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  const lessonIds = sortedLessons.map(l => l.id)

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li>
              <Link href="/" className="text-navy-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href={`/courses/${slug}`} className="text-navy-400 hover:text-white transition-colors">
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-navy-200">{lesson.metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        {/* Course Progress */}
        <div className="mb-8">
          <CourseProgressBar courseSlug={slug} lessonIds={lessonIds} />
        </div>

        {/* Lesson Navigation */}
        <div className="flex items-center justify-between mb-8 text-sm">
          <div className="text-navy-400">
            Lesson {currentIndex + 1} of {sortedLessons.length}
          </div>
          <div className="flex items-center gap-4">
            {prevLesson ? (
              <Link
                href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Link>
            ) : (
              <span className="text-navy-600">Previous</span>
            )}
            {nextLesson ? (
              <Link
                href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="text-navy-600">Next</span>
            )}
          </div>
        </div>

        {/* Lesson Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {lesson.metadata?.title || lesson.title}
          </h1>
          {lesson.metadata?.description && (
            <p className="text-lg text-navy-300">{lesson.metadata.description}</p>
          )}
          {lesson.metadata?.duration_minutes && (
            <div className="mt-4 flex items-center gap-2 text-navy-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{lesson.metadata.duration_minutes} minutes</span>
            </div>
          )}
        </div>

        {/* Lesson Progress Tracker */}
        <div className="mb-8">
          <LessonProgress 
            lessonId={lesson.id} 
            courseSlug={slug}
            lessonTitle={lesson.metadata?.title || lesson.title}
          />
        </div>

        {/* Video Player Placeholder */}
        {lesson.metadata?.video_url && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-navy-900 aspect-video flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-navy-300 mb-4">Video content available</p>
              <a
                href={lesson.metadata.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Watch Video
              </a>
            </div>
          </div>
        )}

        {/* Lesson Content */}
        {lesson.metadata?.content && (
          <div className="card p-8 mb-8">
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

        {/* Lesson Progress Tracker (Bottom) */}
        <div className="mb-8">
          <LessonProgress 
            lessonId={lesson.id} 
            courseSlug={slug}
            lessonTitle={lesson.metadata?.title || lesson.title}
          />
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-navy-800">
          {prevLesson ? (
            <Link
              href={`/courses/${slug}/lessons/${prevLesson.slug}`}
              className="flex items-center gap-3 text-navy-400 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="text-right">
                <div className="text-sm text-navy-500">Previous Lesson</div>
                <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link
              href={`/courses/${slug}/lessons/${nextLesson.slug}`}
              className="flex items-center gap-3 text-navy-400 hover:text-white transition-colors group text-right"
            >
              <div>
                <div className="text-sm text-navy-500">Next Lesson</div>
                <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
              </div>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Lessons Sidebar */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-6">All Lessons</h2>
          <div className="space-y-2">
            {sortedLessons.map((l, index) => (
              <Link
                key={l.id}
                href={`/courses/${slug}/lessons/${l.slug}`}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  l.slug === lessonSlug
                    ? 'bg-primary-500/20 border border-primary-500/30'
                    : 'bg-navy-800/50 hover:bg-navy-800'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                  l.slug === lessonSlug
                    ? 'bg-primary-500 text-white'
                    : 'bg-navy-700 text-navy-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${
                    l.slug === lessonSlug ? 'text-primary-400' : 'text-white'
                  }`}>
                    {l.metadata?.title || l.title}
                  </div>
                </div>
                {l.metadata?.duration_minutes && (
                  <div className="flex-shrink-0 text-sm text-navy-500">
                    {l.metadata.duration_minutes}m
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}