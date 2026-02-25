// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonCompletionButton from '@/components/LessonCompletionButton'
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
    return {
      title: 'Lesson Not Found - LearnHub',
    }
  }
  
  return {
    title: `${lesson.metadata?.title ?? lesson.title} - LearnHub`,
    description: lesson.metadata?.description ?? '',
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

  const lessons = course.metadata?.lessons ?? []
  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li>
              <Link href="/courses" className="hover:text-primary-400">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/courses/${course.slug}`} className="hover:text-primary-400">
                {course.metadata?.title ?? course.title}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">{lesson.metadata?.title ?? lesson.title}</li>
          </ol>
        </nav>

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge bg-primary-500/20 text-primary-400">
              Lesson {currentIndex + 1} of {lessons.length}
            </span>
            {lesson.metadata?.duration_minutes && (
              <span className="text-navy-400 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lesson.metadata.duration_minutes} min
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {lesson.metadata?.title ?? lesson.title}
          </h1>
          {lesson.metadata?.description && (
            <p className="text-xl text-navy-300">{lesson.metadata.description}</p>
          )}
        </div>

        {/* Video */}
        {lesson.metadata?.video_url && (
          <div className="mb-8 aspect-video bg-navy-800 rounded-xl overflow-hidden">
            <iframe
              src={lesson.metadata.video_url.replace('watch?v=', 'embed/')}
              title={lesson.metadata?.title ?? lesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Lesson Content */}
        {lesson.metadata?.content && (
          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: lesson.metadata.content.replace(/\n/g, '<br />') }} />
          </div>
        )}

        {/* Code Example */}
        {lesson.metadata?.code_example && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
            <CodeBlock code={lesson.metadata.code_example} language="javascript" />
          </div>
        )}

        {/* Completion Button */}
        <div className="mb-8 p-6 bg-navy-900/50 border border-navy-700 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold mb-1">Finished this lesson?</h3>
              <p className="text-navy-400 text-sm">Mark it complete to track your progress and build your streak!</p>
            </div>
            <LessonCompletionButton 
              lessonSlug={lessonSlug} 
              lessonTitle={lesson.metadata?.title ?? lesson.title}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-navy-800">
          {prevLesson ? (
            <Link 
              href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
              className="flex items-center gap-2 text-navy-400 hover:text-primary-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div>
                <div className="text-xs text-navy-500">Previous</div>
                <div className="font-medium">{prevLesson.metadata?.title ?? prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          
          {nextLesson ? (
            <Link 
              href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
              className="flex items-center gap-2 text-navy-400 hover:text-primary-400 transition-colors text-right"
            >
              <div>
                <div className="text-xs text-navy-500">Next</div>
                <div className="font-medium">{nextLesson.metadata?.title ?? nextLesson.title}</div>
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
              🎉 Complete Course
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}