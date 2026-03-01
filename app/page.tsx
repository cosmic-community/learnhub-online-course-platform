import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'
import QuickLearnSection from '@/components/QuickLearnSection'
import AnimatedSection from '@/components/AnimatedSection'

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
  
  // Get total lessons count
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-particle particle-1" />
          <div className="floating-particle particle-2" />
          <div className="floating-particle particle-3" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6 animate-fade-in-up">
              <span className="animate-pulse">🚀</span>
              <span className="text-primary-400 text-sm font-medium">New courses added weekly</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up animation-delay-100">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-gradient"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8 animate-fade-in-up animation-delay-200">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
              <Link href="/courses" className="btn-primary text-lg group">
                Browse Courses
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="stat-card group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors counter-animate">{courses.length}+</div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="stat-card group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors counter-animate">{totalHours}+</div>
              <div className="text-navy-400 text-sm">Hours of Content</div>
            </div>
            <div className="stat-card group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors counter-animate">{instructors.length}+</div>
              <div className="text-navy-400 text-sm">Expert Instructors</div>
            </div>
            <div className="stat-card group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors counter-animate">{totalLessons}+</div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Streak Widget */}
      <section className="py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LearningStreak />
        </div>
      </section>

      {/* Quick Learn Section */}
      <AnimatedSection className="py-16 bg-gradient-to-b from-navy-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickLearnSection courses={courses} />
        </div>
      </AnimatedSection>

      {/* Featured Courses */}
      <AnimatedSection className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
              </div>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              View All Courses
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses" className="btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Categories */}
      <AnimatedSection className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-3xl font-bold text-white">Browse by Category</h2>
            </div>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={category.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms` }}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Instructors */}
      <AnimatedSection className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-2xl">👨‍🏫</span>
              <h2 className="text-3xl font-bold text-white">Meet Our Instructors</h2>
            </div>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div key={instructor.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="text-5xl mb-4 animate-bounce-slow">🎓</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <Link href="/courses" className="btn-primary text-lg group">
                Get Started Now
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">🚀</span>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}