// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug, getCourses, getLessons } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])
  
  if (!course || !lesson) {
    return { title: 'Lesson Not Found - LearnHub' }
  }
  
  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || '',
  }
}

export async function generateStaticParams() {
  const [courses, lessons] = await Promise.all([
    getCourses(),
    getLessons(),
  ])
  
  const params: { slug: string; lessonSlug: string }[] = []
  
  for (const course of courses) {
    const courseLessons = (course.metadata?.lessons || []) as Lesson[]
    for (const lesson of courseLessons) {
      params.push({
        slug: course.slug,
        lessonSlug: lesson.slug,
      })
    }
  }
  
  // Also add any lessons that might not be in courses yet
  for (const lesson of lessons) {
    const existingCourse = courses.find(c => 
      ((c.metadata?.lessons || []) as Lesson[]).some(l => l.slug === lesson.slug)
    )
    if (!existingCourse && courses.length > 0) {
      // Add to first course as fallback
      params.push({
        slug: courses[0].slug,
        lessonSlug: lesson.slug,
      })
    }
  }
  
  return params
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

  const courseLessons = ((course.metadata?.lessons || []) as Lesson[]).sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentIndex = courseLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null

  const { metadata } = lesson

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl font-bold text-white mt-8 mb-4">{line.slice(3)}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xl font-semibold text-white mt-6 mb-3">{line.slice(4)}</h3>
      }
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/)
        if (match) {
          return (
            <li key={idx} className="mb-2 list-disc ml-6">
              <strong className="text-white">{match[1]}</strong>
              {match[2] && `: ${match[2]}`}
            </li>
          )
        }
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="mb-2 list-disc ml-6">{line.slice(2)}</li>
      }
      if (line.startsWith('```')) {
        return null // Handled separately
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-4" />
      }
      // Handle inline formatting
      let formattedLine = line
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-navy-800 text-primary-300 px-2 py-1 rounded text-sm">$1</code>')
      
      return <p key={idx} className="mb-4" dangerouslySetInnerHTML={{ __html: formattedLine }} />
    })
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8">
              <div className="card p-4 mb-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Course
                </Link>
                <h3 className="font-semibold text-white mb-2 line-clamp-2">
                  {course.metadata?.title || course.title}
                </h3>
                <div className="text-sm text-navy-400">
                  {courseLessons.length} lessons
                </div>
              </div>

              <div className="card overflow-hidden">
                <div className="p-4 border-b border-navy-700">
                  <h4 className="font-medium text-white">Lessons</h4>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {courseLessons.map((l, index) => {
                    const isActive = l.slug === lessonSlug
                    return (
                      <Link
                        key={l.id}
                        href={`/courses/${course.slug}/lessons/${l.slug}`}
                        className={`flex items-center gap-3 p-4 border-b border-navy-800 last:border-0 transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-500/10 text-primary-400'
                            : 'hover:bg-navy-800/50 text-navy-300 hover:text-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium shrink-0 ${
                          isActive
                            ? 'bg-primary-500 text-white'
                            : 'bg-navy-700 text-navy-300'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm line-clamp-2">
                          {l.metadata?.title || l.title}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="badge bg-primary-500/20 text-primary-400">
                  Lesson {currentIndex + 1} of {courseLessons.length}
                </span>
                {metadata?.duration_minutes && (
                  <span className="text-navy-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.duration_minutes} minutes
                  </span>
                )}
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold text-white">
                  {metadata?.title || lesson.title}
                </h1>
                <LessonCompleteButton 
                  lessonSlug={lessonSlug}
                  courseSlug={slug}
                  totalLessons={courseLessons.length}
                />
              </div>
              
              {metadata?.description && (
                <p className="text-navy-300 mt-4">{metadata.description}</p>
              )}
            </div>

            {/* Video */}
            {metadata?.video_url && (
              <div className="card mb-8 overflow-hidden">
                <div className="aspect-video bg-navy-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🎬</div>
                    <p className="text-navy-400 mb-4">Video Content</p>
                    <a
                      href={metadata.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-8 mb-8">
                <div className="prose max-w-none">
                  {renderMarkdown(metadata.content)}
                </div>
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Code Example</h2>
                <CodeBlock code={metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Lesson
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary group"
                >
                  Next Lesson
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-primary group"
                >
                  Complete Course
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}