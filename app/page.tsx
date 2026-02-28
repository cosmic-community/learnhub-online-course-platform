import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)

  // Calculate total lessons across all courses
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated background orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Streak encouragement banner */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-orange-500/20 border border-primary-500/30 rounded-full mb-6 animate-shimmer">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-medium text-primary-300">Build your learning streak today!</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-orange-400"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Browse Courses</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/50 transition-colors group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{courses.length}+</div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/50 transition-colors group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{totalLessons}+</div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/50 transition-colors group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{instructors.length}+</div>
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/50 transition-colors group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{categories.length}</div>
              <div className="text-navy-400 text-sm">Categories</div>
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

      {/* Learning Path Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🚀</span>
              <h2 className="text-3xl font-bold text-white">Your Learning Journey</h2>
            </div>
            <p className="text-navy-400">Track your progress and celebrate milestones</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Streak Card */}
            <div className="card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-3xl glow-orange">
                🔥
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Daily Streaks</h3>
              <p className="text-navy-400 text-sm">
                Visit daily to build your learning streak and unlock achievements!
              </p>
            </div>

            {/* Progress Card */}
            <div className="card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-3xl glow-primary">
                📈
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
              <p className="text-navy-400 text-sm">
                Monitor your learning journey with visual progress indicators.
              </p>
            </div>

            {/* Milestones Card */}
            <div className="card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-3xl">
                🏆
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Earn Milestones</h3>
              <p className="text-navy-400 text-sm">
                Reach 7, 30, and 100-day streaks to celebrate your dedication!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🏷️</span>
              <h2 className="text-3xl font-bold text-white">Browse by Category</h2>
            </div>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">👨‍🏫</span>
              <h2 className="text-3xl font-bold text-white">Meet Our Instructors</h2>
            </div>
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
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-orange-500/10" />
            
            <div className="relative">
              <div className="text-5xl mb-4 animate-float">🎯</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
                Build your streak and become a dedicated learner!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses" className="btn-primary text-lg">
                  Get Started Now
                </Link>
                <Link href="/contact" className="btn-secondary text-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}