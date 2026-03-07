// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import { getMetafieldValue } from '@/lib/utils'
import LessonCard from '@/components/LessonCard'
import JourneyTracker from '@/components/JourneyTracker'

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const difficulty = getMetafieldValue(metadata?.difficulty)
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []

  // Calculate total duration
  const totalMinutes = lessons.reduce((acc: number, lesson: { metadata?: { duration_minutes?: number } }) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="min-h-screen">
      {/* Track this page view */}
      <JourneyTracker slug={slug} title={course.title} type="course" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                <Link href="/" className="hover:text-primary-400 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-primary-400 transition-colors">Courses</Link>
                <span>/</span>
                <span className="text-navy-200">{course.title}</span>
              </nav>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category: { id: string; slug: string; metadata?: { icon?: string; name?: string }; title: string }) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="badge bg-navy-800 text-navy-200 hover:bg-navy-700 transition-colors"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className={`badge badge-${difficulty.toLowerCase()}`}>
                  {difficulty}
                </span>
                {metadata?.is_free ? (
                  <span className="badge badge-free">Free</span>
                ) : metadata?.price ? (
                  <span className="text-2xl font-bold text-white">${metadata.price}</span>
                ) : null}
                {totalMinutes > 0 && (
                  <span className="text-navy-400">
                    ⏱️ {hours > 0 ? `${hours}h ` : ''}{minutes}m
                  </span>
                )}
                <span className="text-navy-400">
                  📖 {lessons.length} lessons
                </span>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {instructors.map((instructor: { id: string; slug: string; metadata?: { photo?: { imgix_url?: string }; name?: string }; title: string }) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="relative w-12 h-12 rounded-full border-2 border-navy-900 overflow-hidden hover:z-10 hover:scale-110 transition-transform"
                      >
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-navy-700 flex items-center justify-center text-xl">
                            👨‍🏫
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-navy-400">Taught by</p>
                    <p className="text-white">
                      {instructors.map((i: { metadata?: { name?: string }; title: string }) => i.metadata?.name || i.title).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="relative">
              {metadata?.thumbnail?.imgix_url ? (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10">
                  <img
                    src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-navy-800 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              {metadata?.description && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                  <div className="prose prose-invert max-w-none">
                    {metadata.description.split('\n').map((paragraph: string, index: number) => {
                      if (paragraph.startsWith('# ')) {
                        return <h1 key={index}>{paragraph.slice(2)}</h1>
                      } else if (paragraph.startsWith('## ')) {
                        return <h2 key={index}>{paragraph.slice(3)}</h2>
                      } else if (paragraph.startsWith('- ')) {
                        return <li key={index}>{paragraph.slice(2)}</li>
                      } else if (paragraph.trim()) {
                        return <p key={index}>{paragraph}</p>
                      }
                      return null
                    })}
                  </div>
                </div>
              )}

              {/* Lessons */}
              {lessons.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Course Content ({lessons.length} lessons)
                  </h2>
                  <div className="space-y-4">
                    {lessons
                      .sort((a: { metadata?: { order?: number } }, b: { metadata?: { order?: number } }) => 
                        (a.metadata?.order ?? 999) - (b.metadata?.order ?? 999)
                      )
                      .map((lesson: { id: string; slug: string; title: string; metadata?: { title?: string; description?: string; duration_minutes?: number; order?: number } }, index: number) => (
                        <LessonCard
                          key={lesson.id}
                          lesson={lesson}
                          courseSlug={slug}
                          index={index + 1}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Course Details</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-navy-300">
                      <span className="text-xl">📊</span>
                      <span>Difficulty: {difficulty}</span>
                    </li>
                    <li className="flex items-center gap-3 text-navy-300">
                      <span className="text-xl">📖</span>
                      <span>{lessons.length} Lessons</span>
                    </li>
                    {totalMinutes > 0 && (
                      <li className="flex items-center gap-3 text-navy-300">
                        <span className="text-xl">⏱️</span>
                        <span>{hours > 0 ? `${hours}h ` : ''}{minutes}m Total</span>
                      </li>
                    )}
                    {metadata?.estimated_hours && (
                      <li className="flex items-center gap-3 text-navy-300">
                        <span className="text-xl">📅</span>
                        <span>~{metadata.estimated_hours} hours to complete</span>
                      </li>
                    )}
                  </ul>

                  {lessons.length > 0 && (
                    <Link
                      href={`/courses/${slug}/lessons/${lessons[0].slug}`}
                      className="btn-primary w-full mt-6 text-center"
                    >
                      Start Learning
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}