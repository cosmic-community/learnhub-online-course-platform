// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import LessonProgressToggle from '@/components/LessonProgressToggle'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

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

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Lesson Not Found - LearnHub' }
  }
  
  const lesson = course.metadata?.lessons?.find((l: Lesson) => l.slug === lessonSlug)
  
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

  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  
  if (currentIndex === -1) {
    notFound()
  }

  const lesson = lessons[currentIndex]
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

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
              <Link 
                href={`/courses/${course.slug}`} 
                className="text-navy-400 hover:text-white transition-colors truncate max-w-[150px] inline-block align-bottom"
              >
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-white truncate max-w-[150px]">
              {lesson.metadata?.title || lesson.title}
            </li>
          </ol>
        </nav>

        {/* Lesson Progress */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-navy-400">
            Lesson {currentIndex + 1} of {lessons.length}
          </div>
          <LessonProgressToggle courseSlug={course.slug} lessonSlug={lessonSlug} />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
            />
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
            <div className="mt-4 text-sm text-navy-400">
              ⏱️ {lesson.metadata.duration_minutes} minutes
            </div>
          )}
        </div>

        {/* Video */}
        {lesson.metadata?.video_url && (
          <div className="mb-8 card overflow-hidden">
            <div className="aspect-video bg-navy-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-navy-400">Video placeholder</p>
                <a 
                  href={lesson.metadata.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  Watch on external platform →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Content */}
        {lesson.metadata?.content && (
          <div className="card p-8 mb-8">
            <div className="prose max-w-none">
              <MarkdownContent content={lesson.metadata.content} />
            </div>
          </div>
        )}

        {/* Code Example */}
        {lesson.metadata?.code_example && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
            <CodeBlock 
              code={lesson.metadata.code_example} 
              language="javascript"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-navy-800">
          {prevLesson ? (
            <Link
              href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
              className="btn-secondary"
            >
              ← Previous Lesson
            </Link>
          ) : (
            <div />
          )}
          
          {nextLesson ? (
            <Link
              href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
              className="btn-primary"
            >
              Next Lesson →
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

        {/* Back to Course */}
        <div className="mt-8 text-center">
          <Link
            href={`/courses/${course.slug}`}
            className="text-navy-400 hover:text-white transition-colors text-sm"
          >
            ← Back to course overview
          </Link>
        </div>
      </div>
    </div>
  )
}