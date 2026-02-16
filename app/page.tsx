import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import DailyTip from '@/components/DailyTip'
import AnimatedCounter from '@/components/AnimatedCounter'
import LearningPathSuggestion from '@/components/LearningPathSuggestion'

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

  // Calculate total learning hours
  const totalHours = courses.reduce((acc, course) => {
    return acc + (course.metadata?.estimated_hours || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              New courses added weekly
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
              <Link href="/courses" className="btn-primary text-lg">
                Browse Courses
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={courses.length} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm mt-1">Courses</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={totalLessons} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm mt-1">Lessons</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={instructors.length} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm mt-1">Expert Instructors</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={totalHours} suffix="h" />
              </div>
              <div className="text-navy-400 text-sm mt-1">Learning Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Tip & Learning Path Section */}
      <section className="py-12 bg-navy-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DailyTip />
            <LearningPathSuggestion categories={categories} />
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">📂</span>
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
      <section className="py-20 bg-navy-900/30">
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

      {/* Why Learn With Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Why Learn With LearnHub?</h2>
            <p className="text-navy-400">Everything you need to succeed in your learning journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 text-center group hover:border-primary-500/50 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Project-Based</h3>
              <p className="text-navy-400 text-sm">Learn by building real projects that you can add to your portfolio</p>
            </div>
            
            <div className="card p-6 text-center group hover:border-primary-500/50 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Learn at Your Pace</h3>
              <p className="text-navy-400 text-sm">Access courses anytime, anywhere. Learn on your own schedule</p>
            </div>
            
            <div className="card p-6 text-center group hover:border-primary-500/50 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                💻
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Hands-On Code</h3>
              <p className="text-navy-400 text-sm">Practice with interactive code examples and exercises</p>
            </div>
            
            <div className="card p-6 text-center group hover:border-primary-500/50 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🏆
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Industry Experts</h3>
              <p className="text-navy-400 text-sm">Learn from professionals with years of real-world experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <span className="text-6xl mb-4 block">🚀</span>
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