// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
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
  const { lessonSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  
  if (!lesson) {
    return { title: 'Lesson Not Found - LearnHub' }
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

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="badge bg-navy-700 text-navy-200">
                    Lesson {currentIndex + 1} of {lessons.length}
                  </span>
                  {lesson.metadata?.duration_minutes && (
                    <span className="text-sm text-navy-400">
                      ⏱️ {lesson.metadata.duration_minutes} minutes
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  {lesson.metadata?.title || lesson.title}
                </h1>
                {lesson.metadata?.description && (
                  <p className="text-lg text-navy-300">{lesson.metadata.description}</p>
                )}
              </div>

              {/* Video placeholder */}
              {lesson.metadata?.video_url && (
                <div className="mb-8 aspect-video bg-navy-800 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">🎬</span>
                    <p className="text-navy-400">Video Player</p>
                    <a
                      href={lesson.metadata.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Open in new tab →
                    </a>
                  </div>
                </div>
              )}

              {/* Lesson Content */}
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

              {/* Completion Button */}
              <div className="mt-8 pt-8 border-t border-navy-700">
                <LessonCompletionButton 
                  lessonSlug={lessonSlug} 
                  lessonTitle={lesson.metadata?.title || lesson.title}
                />
              </div>

              {/* Navigation */}
              <div className="mt-8 pt-8 border-t border-navy-700 flex items-center justify-between">
                {prevLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                    className="btn-secondary"
                  >
                    ← Previous Lesson
                  </Link>
                ) : (
                  <div />
                )}
                {nextLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                    className="btn-primary"
                  >
                    Next Lesson →
                  </Link>
                ) : (
                  <Link href={`/courses/${slug}`} className="btn-primary">
                    Complete Course 🎉
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {lessons.map((l, index) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'bg-navy-800/50 text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-navy-500">{index + 1}</span>
                      <span className="text-sm line-clamp-2">
                        {l.metadata?.title || l.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}