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
  
  // Calculate total learning hours
  const totalHours = courses.reduce((acc, course) => {
    return acc + (course.metadata?.estimated_hours || 0)
  }, 0)
  
  // Calculate total lessons
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">📚</div>
        <div className="absolute top-40 right-20 text-3xl animate-float opacity-20" style={{ animationDelay: '1s' }}>💡</div>
        <div className="absolute bottom-20 left-1/4 text-3xl animate-float opacity-20" style={{ animationDelay: '2s' }}>🚀</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Achievement badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-6">
              <span className="animate-pulse">🔥</span>
              <span>Join {(1247 + courses.length * 100).toLocaleString()}+ learners growing their skills</span>
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
                <span>Browse Courses</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 bg-navy-900/30 rounded-xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{courses.length}+</div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{totalLessons}+</div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{instructors.length}+</div>
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{totalHours}+</div>
              <div className="text-navy-400 text-sm">Hours of Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-primary-400 text-sm font-medium mb-2">
                <span className="w-8 h-px bg-primary-500" />
                POPULAR PICKS
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
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

      {/* Why Learn With Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-primary-400 text-sm font-medium mb-2">
              <span className="w-8 h-px bg-primary-500" />
              WHY LEARNHUB
              <span className="w-8 h-px bg-primary-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Learn Smarter, Not Harder</h2>
            <p className="text-navy-400 max-w-2xl mx-auto">
              Our platform is designed to help you achieve your learning goals with features that keep you motivated
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-navy-900/30 rounded-2xl border border-navy-800/50 hover:border-primary-500/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center text-3xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Track Your Progress</h3>
              <p className="text-navy-400">
                Build learning streaks, earn XP, and level up as you complete courses and lessons.
              </p>
            </div>
            
            <div className="p-6 bg-navy-900/30 rounded-2xl border border-navy-800/50 hover:border-primary-500/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center text-3xl mb-4">
                👨‍🏫
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Expert Instructors</h3>
              <p className="text-navy-400">
                Learn from industry professionals with real-world experience at top companies.
              </p>
            </div>
            
            <div className="p-6 bg-navy-900/30 rounded-2xl border border-navy-800/50 hover:border-primary-500/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center text-3xl mb-4">
                💻
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Hands-On Learning</h3>
              <p className="text-navy-400">
                Practice with real code examples and projects that you can add to your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-primary-400 text-sm font-medium mb-2">
              <span className="w-8 h-px bg-primary-500" />
              EXPLORE
              <span className="w-8 h-px bg-primary-500" />
            </div>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-primary-400 text-sm font-medium mb-2">
              <span className="w-8 h-px bg-primary-500" />
              YOUR TEACHERS
              <span className="w-8 h-px bg-primary-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.slice(0, 6).map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-12 bg-gradient-to-br from-primary-600/20 to-navy-900 rounded-3xl border border-primary-500/20 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 rounded-full text-primary-300 text-sm mb-6">
                <span>✨</span>
                <span>Start your journey today</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg max-w-xl mx-auto">
                Join thousands of students and start your journey to mastering new skills today. 
                Build streaks, earn XP, and level up!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses" className="btn-primary text-lg">
                  Get Started Now
                </Link>
                <Link href="/categories" className="btn-secondary text-lg">
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}