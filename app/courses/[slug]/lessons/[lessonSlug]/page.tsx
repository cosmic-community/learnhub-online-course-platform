// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonComplete from '@/components/LessonComplete'
import { marked } from 'marked'
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
  const lesson = await getLessonBySlug(lessonSlug)
  
  if (!lesson) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - LearnHub`,
    description: lesson.metadata?.description || '',
  }
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

  const lessons = (course.metadata?.lessons as Lesson[]) || []
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  // Parse markdown content
  const contentHtml = lesson.metadata?.content 
    ? marked(lesson.metadata.content)
    : ''

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li>
              <Link href="/courses" className="hover:text-white transition-colors">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/courses/${slug}`} className="hover:text-white transition-colors">
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">{lesson.metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        {/* Lesson Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge bg-primary-500/20 text-primary-400">
              Lesson {currentIndex + 1} of {lessons.length}
            </span>
            {lesson.metadata?.duration_minutes && (
              <span className="text-navy-400 text-sm">
                ⏱️ {lesson.metadata.duration_minutes} min
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {lesson.metadata?.title || lesson.title}
          </h1>
          {lesson.metadata?.description && (
            <p className="text-xl text-navy-300">
              {lesson.metadata.description}
            </p>
          )}
        </header>

        {/* Video (if available) */}
        {lesson.metadata?.video_url && (
          <div className="mb-8 aspect-video bg-navy-800 rounded-xl overflow-hidden">
            <iframe
              src={lesson.metadata.video_url.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allowFullScreen
              title={lesson.metadata?.title || lesson.title}
            />
          </div>
        )}

        {/* Lesson Content */}
        <div 
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Code Example */}
        {lesson.metadata?.code_example && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
            <CodeBlock code={lesson.metadata.code_example} />
          </div>
        )}

        {/* Lesson Complete Button - NEW! */}
        <LessonComplete 
          lessonTitle={lesson.metadata?.title || lesson.title}
          courseSlug={slug}
          lessonSlug={lessonSlug}
        />

        {/* Navigation */}
        <nav className="mt-12 pt-8 border-t border-navy-800">
          <div className="flex justify-between items-center gap-4">
            {prevLesson ? (
              <Link
                href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="text-left">
                  <div className="text-sm">Previous</div>
                  <div className="font-medium text-white">{prevLesson.metadata?.title || prevLesson.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors text-right"
              >
                <div>
                  <div className="text-sm">Next</div>
                  <div className="font-medium text-white">{nextLesson.metadata?.title || nextLesson.title}</div>
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
                Back to Course
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}