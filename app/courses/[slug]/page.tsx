// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import CourseViewTracker from '@/components/CourseViewTracker'

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []

  const totalDuration = lessons.reduce((acc: number, lesson: { metadata?: { duration_minutes?: number } }) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const difficultyValue = metadata?.difficulty?.value || metadata?.difficulty || 'Beginner'

  return (
    <div className="min-h-screen">
      {/* Track course view for progress */}
      <CourseViewTracker courseSlug={slug} />
      
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Course Info */}
            <div>
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category: { id: string; slug: string; metadata?: { name?: string; icon?: string } }) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="badge badge-free"
                  >
                    {category.metadata?.icon} {category.metadata?.name}
                  </Link>
                ))}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>
              
              <p className="text-xl text-navy-300 mb-6">
                {metadata?.tagline}
              </p>

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <span className={`badge ${
                  difficultyValue === 'Beginner' ? 'badge-beginner' :
                  difficultyValue === 'Intermediate' ? 'badge-intermediate' : 'badge-advanced'
                }`}>
                  {difficultyValue}
                </span>
                
                <div className="flex items-center gap-2 text-navy-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{metadata?.estimated_hours || Math.ceil(totalDuration / 60)} hours</span>
                </div>

                <div className="flex items-center gap-2 text-navy-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>{lessons.length} lessons</span>
                </div>

                {metadata?.is_free ? (
                  <span className="badge badge-free">Free</span>
                ) : metadata?.price ? (
                  <span className="text-2xl font-bold text-white">${metadata.price}</span>
                ) : null}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-navy-400">Taught by:</span>
                  <div className="flex items-center gap-3">
                    {instructors.map((instructor: { id: string; slug: string; metadata?: { name?: string; photo?: { imgix_url?: string } } }) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-2 hover:text-primary-400 transition-colors"
                      >
                        {instructor.metadata?.photo?.imgix_url && (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || ''}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span className="text-white font-medium">{instructor.metadata?.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              {lessons.length > 0 && (
                <Link
                  href={`/courses/${slug}/lessons/${lessons[0].slug}`}
                  className="btn-primary text-lg"
                >
                  Start Learning
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Course Thumbnail */}
            <div className="relative">
              {metadata?.thumbnail?.imgix_url ? (
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full aspect-video bg-navy-800 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              {metadata?.description && (
                <div className="card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                  <div className="prose max-w-none">
                    {metadata.description.split('\n').map((paragraph: string, index: number) => {
                      if (paragraph.startsWith('# ')) {
                        return <h1 key={index}>{paragraph.replace('# ', '')}</h1>
                      }
                      if (paragraph.startsWith('## ')) {
                        return <h2 key={index}>{paragraph.replace('## ', '')}</h2>
                      }
                      if (paragraph.startsWith('- ')) {
                        return <li key={index}>{paragraph.replace('- ', '')}</li>
                      }
                      if (paragraph.trim()) {
                        return <p key={index}>{paragraph}</p>
                      }
                      return null
                    })}
                  </div>
                </div>
              )}

              {/* Lessons */}
              {lessons.length > 0 && (
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Course Content
                    <span className="text-navy-400 font-normal text-lg ml-2">
                      ({lessons.length} lessons • {totalDuration} min total)
                    </span>
                  </h2>
                  
                  <div className="space-y-3">
                    {lessons.map((lesson: { id: string; slug: string; metadata?: { title?: string; description?: string; duration_minutes?: number; order?: number } }, index: number) => (
                      <Link
                        key={lesson.id}
                        href={`/courses/${slug}/lessons/${lesson.slug}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-all group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                            {lesson.metadata?.title}
                          </h3>
                          {lesson.metadata?.description && (
                            <p className="text-navy-400 text-sm truncate">
                              {lesson.metadata.description}
                            </p>
                          )}
                        </div>
                        {lesson.metadata?.duration_minutes && (
                          <div className="flex-shrink-0 text-navy-400 text-sm">
                            {lesson.metadata.duration_minutes} min
                          </div>
                        )}
                        <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Instructors Card */}
              {instructors.length > 0 && (
                <div className="card p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Your Instructors</h3>
                  <div className="space-y-4">
                    {instructors.map((instructor: { id: string; slug: string; metadata?: { name?: string; bio?: string; credentials?: string; photo?: { imgix_url?: string } } }) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-start gap-3 group"
                      >
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || ''}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center">
                            <span className="text-lg">👨‍🏫</span>
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name}
                          </h4>
                          {instructor.metadata?.credentials && (
                            <p className="text-navy-400 text-sm line-clamp-2">
                              {instructor.metadata.credentials}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Stats */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Course Includes</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-navy-300">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{lessons.length} video lessons</span>
                  </li>
                  <li className="flex items-center gap-3 text-navy-300">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{metadata?.estimated_hours || Math.ceil(totalDuration / 60)} hours of content</span>
                  </li>
                  <li className="flex items-center gap-3 text-navy-300">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Practical code examples</span>
                  </li>
                  <li className="flex items-center gap-3 text-navy-300">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}