// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonProgress from '@/components/LessonProgress'
import type { Metadata } from 'next'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  const course = await getCourseBySlug(slug)
  
  if (!lesson || !course) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.metadata?.title || lesson.title} in this comprehensive lesson.`,
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

  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-navy-400">
          <Link href="/courses" className="hover:text-white transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/courses/${slug}`} className="hover:text-white transition-colors">
            {course.metadata?.title || course.title}
          </Link>
          <span>/</span>
          <span className="text-white">{lesson.metadata?.title || lesson.title}</span>
        </nav>

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-navy-400">
              Lesson {currentIndex + 1} of {lessons.length}
            </span>
            {lesson.metadata?.duration_minutes && (
              <>
                <span className="w-1 h-1 bg-navy-600 rounded-full" />
                <span className="text-sm text-navy-400">
                  {lesson.metadata.duration_minutes} min
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {lesson.metadata?.title || lesson.title}
          </h1>
          {lesson.metadata?.description && (
            <p className="text-lg text-navy-300">{lesson.metadata.description}</p>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="mb-8">
          <LessonProgress 
            lessonSlug={lessonSlug} 
            courseSlug={slug}
            lessonTitle={lesson.metadata?.title || lesson.title}
          />
        </div>

        {/* Video */}
        {lesson.metadata?.video_url && (
          <div className="mb-8 aspect-video rounded-xl overflow-hidden bg-navy-900">
            <iframe
              src={lesson.metadata.video_url.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {/* Content */}
        {lesson.metadata?.content && (
          <div className="mb-8 prose max-w-none">
            {lesson.metadata.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={index}>{paragraph.slice(2)}</h1>
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={index}>{paragraph.slice(3)}</h2>
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index}>{paragraph.slice(4)}</h3>
              }
              if (paragraph.startsWith('- ')) {
                return <li key={index}>{paragraph.slice(2)}</li>
              }
              if (paragraph.trim() === '') {
                return null
              }
              return <p key={index}>{paragraph}</p>
            })}
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
              className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-navy-500">Previous</div>
                <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/courses/${slug}/lessons/${nextLesson.slug}`}
              className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group text-right"
            >
              <div>
                <div className="text-xs text-navy-500">Next</div>
                <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
              </div>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </div>
    </div>
  )
}