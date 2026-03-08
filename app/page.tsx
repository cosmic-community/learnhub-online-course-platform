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
  const totalHours = courses.reduce((sum, course) => {
    return sum + (course.metadata?.estimated_hours || 0)
  }, 0)

  // Calculate total lessons
  const totalLessons = courses.reduce((sum, course) => {
    return sum + (course.metadata?.lessons?.length || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary-400/20 rounded-full animate-pulse"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Welcome badge */}
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-sm text-primary-300 font-medium">
                🎉 New courses added weekly
              </span>
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
          
          {/* Enhanced Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-4 border border-navy-700/50 group-hover:border-primary-500/30 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">{courses.length}+</div>
                <div className="text-navy-400 text-sm">Courses</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-4 border border-navy-700/50 group-hover:border-primary-500/30 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">{totalLessons}+</div>
                <div className="text-navy-400 text-sm">Lessons</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-4 border border-navy-700/50 group-hover:border-primary-500/30 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">{totalHours}+</div>
                <div className="text-navy-400 text-sm">Hours</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-4 border border-navy-700/50 group-hover:border-primary-500/30 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">{instructors.length}+</div>
                <div className="text-navy-400 text-sm">Experts</div>
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
                <span className="text-2xl">🔥</span>
                <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">Popular</span>
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

      {/* Learning Path Highlight */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 lg:p-12 bg-gradient-to-br from-navy-900/80 to-navy-900/40">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎯</span>
                  <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">Why Learn Here</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Your journey to mastery starts here
                </h2>
                <p className="text-navy-300 mb-6">
                  Our structured learning paths guide you from beginner to expert, with hands-on projects and real-world applications.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: '📚', text: 'Comprehensive curriculum designed by experts' },
                    { icon: '💻', text: 'Hands-on coding exercises and projects' },
                    { icon: '🏆', text: 'Track your progress with learning streaks' },
                    { icon: '🤝', text: 'Learn from industry professionals' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-navy-200">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent rounded-2xl blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  {[
                    { label: 'Beginner', color: 'green', emoji: '🌱' },
                    { label: 'Intermediate', color: 'yellow', emoji: '⚡' },
                    { label: 'Advanced', color: 'red', emoji: '🚀' },
                    { label: 'Expert', color: 'purple', emoji: '💎' },
                  ].map((level, i) => (
                    <div 
                      key={i}
                      className={`bg-navy-800/50 rounded-xl p-4 border border-navy-700/50 hover:border-${level.color}-500/30 transition-all hover:scale-105 cursor-pointer`}
                    >
                      <span className="text-2xl mb-2 block">{level.emoji}</span>
                      <span className="text-white font-medium">{level.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">📂</span>
              <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">Explore</span>
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">👨‍🏫</span>
              <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">Learn from the Best</span>
            </div>
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
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <span className="text-5xl mb-4 block">🚀</span>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
                Build your streak and track your progress!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses" className="btn-primary text-lg">
                  Get Started Now
                </Link>
                <Link href="/contact" className="btn-secondary text-lg">
                  Have Questions?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}