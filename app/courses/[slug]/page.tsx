// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import LessonCard from '@/components/LessonCard'
import CourseProgressCard from '@/components/CourseProgressCard'
import MarkdownContent from '@/components/MarkdownContent'
import type { Metadata } from 'next'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found - LearnHub' }
  }
  
  return {
    title: `${course.metadata?.seo_title || course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
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
  
  // Get difficulty value safely
  const difficultyValue = typeof metadata?.difficulty === 'object' 
    ? metadata.difficulty.value 
    : metadata?.difficulty || 'beginner'

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
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
            <li className="text-white truncate max-w-[200px]">
              {metadata?.title || course.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className={`badge badge-${difficultyValue.toLowerCase()}`}>
                  {difficultyValue}
                </span>
                
                {metadata?.is_free ? (
                  <span className="badge badge-free">Free</span>
                ) : metadata?.price ? (
                  <span className="text-white font-semibold">${metadata.price}</span>
                ) : null}
                
                {metadata?.estimated_hours && (
                  <span className="text-navy-400">
                    ⏱️ {metadata.estimated_hours} hours
                  </span>
                )}
                
                <span className="text-navy-400">
                  📚 {lessons.length} lessons
                </span>
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">About this course</h2>
                <div className="prose">
                  <MarkdownContent content={metadata.description} />
                </div>
              </div>
            )}

            {/* Lessons */}
            {lessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Course Content ({lessons.length} lessons)
                </h2>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      courseSlug={course.slug}
                      index={index + 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Progress Card */}
              <CourseProgressCard course={course} />
              
              {/* Course Card */}
              <div className="card p-6">
                {metadata?.is_free ? (
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-green-400">Free</span>
                  </div>
                ) : metadata?.price ? (
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-white">${metadata.price}</span>
                  </div>
                ) : null}

                {lessons.length > 0 && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${lessons[0]?.slug}`}
                    className="btn-primary w-full mb-4"
                  >
                    Start Learning
                  </Link>
                )}

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-navy-400">
                    <span>Lessons</span>
                    <span className="text-white">{lessons.length}</span>
                  </div>
                  {metadata?.estimated_hours && (
                    <div className="flex justify-between text-navy-400">
                      <span>Duration</span>
                      <span className="text-white">{metadata.estimated_hours} hours</span>
                    </div>
                  )}
                  <div className="flex justify-between text-navy-400">
                    <span>Skill Level</span>
                    <span className="text-white capitalize">{difficultyValue}</span>
                  </div>
                </div>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Instructors</h3>
                  <div className="space-y-4">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-sm text-navy-400 truncate max-w-[180px]">
                              {instructor.metadata.credentials}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}