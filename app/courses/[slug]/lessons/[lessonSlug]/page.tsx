// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses, getLessons } from '@/lib/cosmic'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import CodeBlock from '@/components/CodeBlock'
import ProgressTracker from '@/components/ProgressTracker'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Lesson Not Found - LearnHub' }
  }

  const lesson = course.metadata?.lessons?.find(
    (l: { slug: string }) => l.slug === lessonSlug
  )

  if (!lesson) {
    return { title: 'Lesson Not Found - LearnHub' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || '',
  }
}

export async function generateStaticParams() {
  const courses = await getCourses()
  const paths: { slug: string; lessonSlug: string }[] = []

  for (const course of courses) {
    const lessons = course.metadata?.lessons || []
    for (const lesson of lessons) {
      paths.push({
        slug: course.slug,
        lessonSlug: lesson.slug,
      })
    }
  }

  return paths
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex((l: { slug: string }) => l.slug === lessonSlug)
  const lesson = lessons[currentIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="py-12">
      {/* Progress Tracker - tracks when user views this lesson */}
      <ProgressTracker type="lesson" id={lesson.id} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-24">
              <Link
                href={`/courses/${slug}`}
                className="flex items-center gap-2 text-navy-400 hover:text-white mb-4 text-sm"
              >
                <span>←</span>
                <span>Back to course</span>
              </Link>
              
              <h3 className="font-semibold text-white mb-4 text-sm">
                Course Content
              </h3>
              
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {lessons.map((l: { id: string; slug: string; metadata?: { title?: string; order?: number; duration_minutes?: number } }, index: number) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`block p-3 rounded-lg text-sm transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium opacity-60">
                        {l.metadata?.order || index + 1}
                      </span>
                      <span className="line-clamp-1">
                        {l.metadata?.title || l.slug}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-navy-400 flex-wrap">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li>/</li>
                <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
                <li>/</li>
                <li><Link href={`/courses/${slug}`} className="hover:text-white">{course.metadata?.title}</Link></li>
                <li>/</li>
                <li className="text-white">{lesson.metadata?.title}</li>
              </ol>
            </nav>

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="badge bg-navy-800 text-navy-200">
                  Lesson {lesson.metadata?.order || currentIndex + 1}
                </span>
                {lesson.metadata?.duration_minutes && (
                  <span className="text-navy-400 text-sm">
                    ⏱️ {lesson.metadata.duration_minutes} minutes
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.slug}
              </h1>
              
              {lesson.metadata?.description && (
                <p className="text-navy-300 text-lg">
                  {lesson.metadata.description}
                </p>
              )}
            </div>

            {/* Video Placeholder */}
            {lesson.metadata?.video_url && (
              <div className="mb-8 rounded-2xl overflow-hidden bg-navy-800 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎬</div>
                  <p className="text-navy-300">Video Player</p>
                  <a 
                    href={lesson.metadata.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    Watch on external site →
                  </a>
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
                <h2 className="text-xl font-bold text-white mb-4">Code Example</h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary"
                >
                  <span className="mr-2">←</span>
                  Previous Lesson
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary"
                >
                  Next Lesson
                  <span className="ml-2">→</span>
                </Link>
              ) : (
                <Link href={`/courses/${slug}`} className="btn-primary">
                  Complete Course
                  <span className="ml-2">🎉</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}