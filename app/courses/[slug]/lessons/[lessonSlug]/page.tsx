// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonComplete from '@/components/LessonComplete'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    notFound()
  }

  const lessons = (course.metadata?.lessons as Lesson[]) || []
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  
  if (currentIndex === -1) {
    notFound()
  }

  const lesson = lessons[currentIndex]
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  // Render markdown content
  const renderContent = (content: string | undefined) => {
    if (!content) return null
    
    // Simple markdown rendering - in production you'd use a proper markdown library
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeContent = ''
    let codeLanguage = ''
    
    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <CodeBlock key={index} code={codeContent.trim()} language={codeLanguage} />
          )
          codeContent = ''
          codeLanguage = ''
          inCodeBlock = false
        } else {
          inCodeBlock = true
          codeLanguage = line.slice(3).trim() || 'text'
        }
        return
      }
      
      if (inCodeBlock) {
        codeContent += line + '\n'
        return
      }
      
      if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3">{line.slice(4)}</h3>)
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-navy-200 ml-6 list-disc mb-2">
            {renderInlineCode(line.slice(2))}
          </li>
        )
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-4" />)
      } else {
        elements.push(
          <p key={index} className="text-navy-200 mb-4 leading-relaxed">
            {renderInlineCode(line)}
          </p>
        )
      }
    })
    
    return elements
  }

  // Render inline code and bold text
  const renderInlineCode = (text: string): React.ReactNode => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="bg-navy-800 text-primary-300 px-2 py-1 rounded text-sm">
            {part.slice(1, -1)}
          </code>
        )
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
          Courses
        </Link>
        <span className="text-navy-600">/</span>
        <Link 
          href={`/courses/${course.slug}`} 
          className="text-navy-400 hover:text-primary-400 transition-colors truncate max-w-[200px]"
        >
          {course.metadata?.title || course.title}
        </Link>
        <span className="text-navy-600">/</span>
        <span className="text-navy-200 truncate">{lesson.metadata?.title || lesson.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                Lesson {currentIndex + 1}
              </span>
              {lesson.metadata?.duration_minutes && (
                <span className="flex items-center gap-1 text-navy-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.metadata.duration_minutes} min
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
          </div>

          {/* Lesson Content */}
          <div className="prose max-w-none">
            {renderContent(lesson.metadata?.content)}
          </div>

          {/* Code Example */}
          {lesson.metadata?.code_example && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">💻 Code Example</h3>
              <CodeBlock code={lesson.metadata.code_example} language="javascript" />
            </div>
          )}

          {/* Lesson Complete Component */}
          <LessonComplete
            lessonTitle={lesson.metadata?.title || lesson.title}
            courseSlug={slug}
            nextLessonSlug={nextLesson?.slug}
            lessonNumber={currentIndex + 1}
            totalLessons={lessons.length}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-navy-800">
            {previousLesson ? (
              <Link 
                href={`/courses/${slug}/lessons/${previousLesson.slug}`}
                className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-navy-500">Previous</div>
                  <div className="font-medium">{previousLesson.metadata?.title || previousLesson.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            
            {nextLesson ? (
              <Link 
                href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors"
              >
                <div className="text-right">
                  <div className="text-xs text-navy-500">Next</div>
                  <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                </div>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link 
                href={`/courses/${slug}`}
                className="btn-secondary"
              >
                Back to Course
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar - Lesson List */}
        <div className="lg:w-80">
          <div className="sticky top-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Course Content</h3>
              <div className="space-y-2">
                {lessons.map((l, index) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500 text-white'
                        : 'bg-navy-700 text-navy-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm truncate">{l.metadata?.title || l.title}</span>
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