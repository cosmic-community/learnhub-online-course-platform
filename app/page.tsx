import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStats from '@/components/LearningStats'
import ParticleBackground from '@/components/ParticleBackground'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total learning hours from all courses
  const totalLearningHours = courses.reduce((acc, course) => {
    return acc + (course.metadata?.estimated_hours || 0)
  }, 0)
  
  // Count total lessons across all courses
  const totalLessons = courses.reduce((acc, course) => {
    const lessons = course.metadata?.lessons
    return acc + (Array.isArray(lessons) ? lessons.length : 0)
  }, 0)

  return (
    <div>
      {/* Hero Section with Particles */}
      <section className="relative overflow-hidden min-h-[600px]">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <span className="animate-pulse text-lg">🔥</span>
              <span className="text-primary-400 text-sm font-medium">New courses added weekly</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg group">
                Browse Courses
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Animated Stats */}
          <LearningStats 
            coursesCount={courses.length}
            instructorsCount={instructors.length}
            categoriesCount={categories.length}
            totalHours={totalLearningHours}
            totalLessons={totalLessons}
          />
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-navy-800">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">
                  🚀 Quick Start Your Learning Journey
                </h2>
                <p className="text-navy-300 mb-4">
                  Not sure where to begin? Try one of our beginner-friendly courses and start building skills today.
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {categories.slice(0, 4).map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 rounded-full text-sm text-white transition-colors"
                    >
                      <span>{category.metadata?.icon || '📚'}</span>
                      {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full" />
                  <div className="relative bg-navy-900 border border-navy-700 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <div className="text-3xl font-bold text-white">{courses.filter(c => c.metadata?.is_free).length}</div>
                    <div className="text-navy-400 text-sm">Free Courses</div>
                    <Link href="/courses" className="mt-4 inline-block text-primary-400 hover:text-primary-300 text-sm font-medium">
                      Start Free →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
              </div>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex">
              View All Courses
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses" className="btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <Link href="/courses" className="btn-primary text-lg">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}