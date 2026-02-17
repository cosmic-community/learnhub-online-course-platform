import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningPathQuiz from '@/components/LearningPathQuiz'
import StatsCounter from '@/components/StatsCounter'
import FloatingElements from '@/components/FloatingElements'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total lessons and hours
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)
  
  const totalHours = courses.reduce((acc, course) => {
    return acc + (course.metadata?.estimated_hours || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        <FloatingElements />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* New badge */}
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-primary-400 text-sm font-medium">New courses added weekly</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, cloud computing, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            
            {/* CTA Buttons with Quiz */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <LearningPathQuiz />
              <Link href="/courses" className="btn-secondary text-lg">
                Browse All Courses
              </Link>
            </div>
          </div>
          
          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📚</span>
              </div>
              <StatsCounter end={courses.length} suffix="+" />
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📖</span>
              </div>
              <StatsCounter end={totalLessons} suffix="+" />
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <StatsCounter end={instructors.length} suffix="+" />
              <div className="text-navy-400 text-sm">Expert Instructors</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">⏱️</span>
              </div>
              <StatsCounter end={totalHours} suffix="h" />
              <div className="text-navy-400 text-sm">Of Content</div>
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
                <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Popular</span>
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

      {/* Why Learn With Us - New Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Why Learn With LearnHub?</h2>
            <p className="text-navy-400">Everything you need to accelerate your career</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center group hover:border-primary-500/30">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Expert Instructors</h3>
              <p className="text-navy-400">Learn from industry professionals with years of real-world experience at top companies.</p>
            </div>
            
            <div className="card p-8 text-center group hover:border-primary-500/30">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔨</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Hands-on Projects</h3>
              <p className="text-navy-400">Build real projects as you learn. Apply your skills immediately with practical exercises.</p>
            </div>
            
            <div className="card p-8 text-center group hover:border-primary-500/30">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Career Growth</h3>
              <p className="text-navy-400">Gain in-demand skills that employers are looking for. Advance your career with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-navy-900/30">
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.slice(0, 3).map((instructor) => (
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
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent" />
            
            <div className="relative">
              <span className="text-5xl mb-6 block">🚀</span>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
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