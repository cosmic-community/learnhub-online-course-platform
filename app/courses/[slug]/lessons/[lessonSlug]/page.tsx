// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import LessonTracker from '@/components/LessonTracker'
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
  const course = await getCourseBySlug(slug)
  
  if (!lesson || !course) {
    return {
      title: 'Lesson Not Found - LearnHub',
    }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.title} in the ${course.title} course`,
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
  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  // Parse markdown content (basic implementation)
  const renderContent = (content: string) => {
    return content
      .split('\n\n')
      .map((block, index) => {
        if (block.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{block.slice(2)}</h1>
        }
        if (block.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{block.slice(3)}</h2>
        }
        if (block.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3">{block.slice(4)}</h3>
        }
        if (block.startsWith('- ')) {
          const items = block.split('\n').filter(line => line.startsWith('- '))
          return (
            <ul key={index} className="mb-4 pl-6 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="list-disc text-navy-200">
                  {item.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')}
                </li>
              ))}
            </ul>
          )
        }
        if (block.startsWith('```')) {
          const lines = block.split('\n')
          const language = lines[0].slice(3) || 'javascript'
          const code = lines.slice(1, -1).join('\n')
          return <CodeBlock key={index} code={code} language={language} />
        }
        return <p key={index} className="mb-4 text-navy-200 leading-relaxed">{block}</p>
      })
  }

  return (
    <div className="py-12">
      {/* Lesson Tracker (client-side) */}
      <LessonTracker courseSlug={slug} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-navy-400">
            <li>
              <Link href="/courses" className="hover:text-primary-400 transition-colors">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/courses/${slug}`} className="hover:text-primary-400 transition-colors">
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">{lesson.metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-primary-500/20 text-primary-400 text-sm font-medium px-3 py-1 rounded-full">
              Lesson {currentIndex + 1} of {lessons.length}
            </span>
            {lesson.metadata?.duration_minutes && (
              <span className="text-navy-400 text-sm">
                ⏱️ {lesson.metadata.duration_minutes} min
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {lesson.metadata?.title || lesson.title}
          </h1>
          {lesson.metadata?.description && (
            <p className="text-xl text-navy-300">{lesson.metadata.description}</p>
          )}
        </div>

        {/* Video Section */}
        {lesson.metadata?.video_url && (
          <div className="mb-12">
            <div className="aspect-video bg-navy-900 rounded-2xl overflow-hidden border border-navy-800">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-navy-400 mb-4">Video Player</p>
                  <a 
                    href={lesson.metadata.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Content */}
        <div className="prose max-w-none mb-12">
          {lesson.metadata?.content && renderContent(lesson.metadata.content)}
        </div>

        {/* Code Example */}
        {lesson.metadata?.code_example && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Code Example</h2>
            <CodeBlock code={lesson.metadata.code_example} language="javascript" />
          </div>
        )}

        {/* Complete Button */}
        <div className="mb-12">
          <LessonCompleteButton 
            lessonSlug={lessonSlug}
            courseSlug={slug}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-navy-800">
          {prevLesson ? (
            <Link 
              href={`/courses/${slug}/lessons/${prevLesson.slug}`}
              className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div>
                <div className="text-sm text-navy-500">Previous</div>
                <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          
          {nextLesson ? (
            <Link 
              href={`/courses/${slug}/lessons/${nextLesson.slug}`}
              className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors group text-right"
            >
              <div>
                <div className="text-sm text-navy-500">Next</div>
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
              Complete Course 🎉
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}