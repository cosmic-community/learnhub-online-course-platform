// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonProgressTracker from '@/components/LessonProgressTracker'
import ReadingTime from '@/components/ReadingTime'
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
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug)
  ])
  
  if (!course || !lesson) {
    return { title: 'Lesson Not Found' }
  }
  
  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} | LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.title} in the ${course.title} course`,
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug)
  ])
  
  if (!course || !lesson) {
    notFound()
  }
  
  const lessons = (course.metadata?.lessons || []) as Lesson[]
  const currentIndex = lessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  
  const { metadata } = lesson
  const courseThumbnail = course.metadata?.thumbnail?.imgix_url
  
  return (
    <>
      {/* Progress Tracker */}
      <LessonProgressTracker
        lessonId={lesson.id}
        lessonSlug={lesson.slug}
        lessonTitle={metadata?.title || lesson.title}
        courseSlug={course.slug}
        courseTitle={course.metadata?.title || course.title}
        courseThumbnail={courseThumbnail}
        totalLessonsInCourse={lessons.length}
      />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
                  Courses
                </Link>
              </li>
              <li className="text-navy-600">/</li>
              <li>
                <Link href={`/courses/${course.slug}`} className="text-navy-400 hover:text-primary-400 transition-colors">
                  {course.metadata?.title || course.title}
                </Link>
              </li>
              <li className="text-navy-600">/</li>
              <li className="text-navy-300">{metadata?.title || lesson.title}</li>
            </ol>
          </nav>
          
          {/* Lesson Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge bg-primary-500/20 text-primary-400">
                Lesson {currentIndex + 1} of {lessons.length}
              </span>
              <ReadingTime 
                content={metadata?.content} 
                durationMinutes={metadata?.duration_minutes} 
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {metadata?.title || lesson.title}
            </h1>
            {metadata?.description && (
              <p className="text-xl text-navy-300">
                {metadata.description}
              </p>
            )}
          </header>
          
          {/* Video Embed */}
          {metadata?.video_url && (
            <div className="mb-10 aspect-video bg-navy-900 rounded-2xl overflow-hidden">
              <iframe
                src={metadata.video_url.replace('watch?v=', 'embed/')}
                title={metadata.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
          
          {/* Lesson Content */}
          {metadata?.content && (
            <div className="prose max-w-none mb-10">
              {metadata.content.split('\n').map((line, index) => {
                // Handle headers
                if (line.startsWith('### ')) {
                  return <h3 key={index}>{line.replace('### ', '')}</h3>
                }
                if (line.startsWith('## ')) {
                  return <h2 key={index}>{line.replace('## ', '')}</h2>
                }
                if (line.startsWith('# ')) {
                  return <h1 key={index}>{line.replace('# ', '')}</h1>
                }
                // Handle list items
                if (line.startsWith('- ')) {
                  return <li key={index}>{line.replace('- ', '')}</li>
                }
                // Handle code blocks (simple detection)
                if (line.startsWith('```')) {
                  return null // Skip code fence markers
                }
                // Regular paragraphs
                if (line.trim()) {
                  return <p key={index}>{line}</p>
                }
                return null
              })}
            </div>
          )}
          
          {/* Code Example */}
          {metadata?.code_example && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💻</span>
                Code Example
              </h3>
              <CodeBlock code={metadata.code_example} language="javascript" />
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex items-center justify-between pt-8 border-t border-navy-800">
            {prevLesson ? (
              <Link
                href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                className="group flex items-center gap-3 text-navy-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div>
                  <div className="text-xs text-navy-500">Previous</div>
                  <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            
            {nextLesson ? (
              <Link
                href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                className="group flex items-center gap-3 text-navy-300 hover:text-white transition-colors text-right"
              >
                <div>
                  <div className="text-xs text-navy-500">Next</div>
                  <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                </div>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link
                href={`/courses/${course.slug}`}
                className="btn-primary"
              >
                Complete Course ✨
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}