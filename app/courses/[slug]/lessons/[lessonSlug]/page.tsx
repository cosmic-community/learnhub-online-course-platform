// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonTracker from '@/components/LessonTracker'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
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
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - LearnHub`,
    description: lesson.metadata?.description || 'Learn with LearnHub',
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

  const { metadata } = lesson
  const lessons = (course.metadata?.lessons || []) as Lesson[]
  const currentIndex = lessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="py-8">
      {/* Track this lesson view */}
      <LessonTracker lessonSlug={lessonSlug} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-primary-400">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href={`/courses/${slug}`} className="text-navy-400 hover:text-primary-400">
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-white">{metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson Content */}
          <div className="lg:col-span-3">
            <article className="card p-8">
              {/* Lesson Header */}
              <header className="mb-8 pb-8 border-b border-navy-800">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge bg-primary-500/20 text-primary-400">
                    Lesson {currentIndex + 1}
                  </span>
                  {metadata?.duration_minutes && (
                    <span className="text-navy-400 text-sm">
                      ⏱ {metadata.duration_minutes} min
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  {metadata?.title || lesson.title}
                </h1>
                {metadata?.description && (
                  <p className="text-xl text-navy-300">{metadata.description}</p>
                )}
              </header>

              {/* Video */}
              {metadata?.video_url && (
                <div className="mb-8">
                  <div className="aspect-video bg-navy-800 rounded-xl overflow-hidden">
                    <iframe
                      src={metadata.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              {metadata?.content && (
                <div className="prose max-w-none mb-8">
                  <ReactMarkdown>{metadata.content}</ReactMarkdown>
                </div>
              )}

              {/* Code Example */}
              {metadata?.code_example && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                  <CodeBlock code={metadata.code_example} language="javascript" />
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-navy-800">
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
                    Complete Course ✓
                  </Link>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">
                Course Lessons
              </h3>
              <nav>
                <ul className="space-y-2">
                  {lessons.map((l, index) => {
                    const isActive = l.slug === lessonSlug
                    const lessonTitle = l.metadata?.title || l.title
                    return (
                      <li key={l.id}>
                        <Link
                          href={`/courses/${slug}/lessons/${l.slug}`}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary-500/20 text-primary-400'
                              : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                          }`}
                        >
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-navy-800 text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm line-clamp-2">{lessonTitle}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}