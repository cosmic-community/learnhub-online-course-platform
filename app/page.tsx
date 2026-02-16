import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'
import CourseQuiz from '@/components/CourseQuiz'

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
      {/* Hero Section with animated gradient */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl animate-float" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/30 rounded-full animate-float-particle" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary-500/20 rounded-full animate-float-particle-delay" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary-400/25 rounded-full animate-float-particle-slow" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Greeting with emoji animation */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900/50 backdrop-blur-sm border border-navy-700 rounded-full text-sm text-navy-300 mb-6 animate-fade-in-up">
              <span className="animate-wave">👋</span>
              <span>Welcome to your learning journey</span>
              <span className="text-primary-400">✨</span>
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
                <span>Browse Courses</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg group">
                <span>Explore Categories</span>
                <svg className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Enhanced Stats with animations */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center group animate-fade-in-up animation-delay-400">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="tabular-nums">{courses.length}</span>
                <span className="text-primary-500">+</span>
              </div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center group animate-fade-in-up animation-delay-500">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="tabular-nums">{totalLessons}</span>
                <span className="text-primary-500">+</span>
              </div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center group animate-fade-in-up animation-delay-600">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="tabular-nums">{instructors.length}</span>
                <span className="text-primary-500">+</span>
              </div>
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center group animate-fade-in-up animation-delay-700">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="tabular-nums">{totalHours}</span>
                <span className="text-primary-500">h</span>
              </div>
              <div className="text-navy-400 text-sm">of Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Streak Section - NEW! */}
      <section className="py-12 bg-gradient-to-r from-navy-900/50 via-primary-900/10 to-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LearningStreak />
        </div>
      </section>

      {/* Course Recommendation Quiz - NEW! */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseQuiz courses={courses} categories={categories} />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-4xl">🌟</span>
                Featured Courses
              </h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              <span>View All Courses</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
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
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <span className="text-4xl">🎯</span>
              Browse by Category
            </h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <span className="text-4xl">👨‍🏫</span>
              Meet Our Instructors
            </h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div 
                key={instructor.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with enhanced design */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5 group-hover:from-primary-500/10 group-hover:to-primary-600/10 transition-colors duration-500" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors duration-500" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl group-hover:bg-primary-600/20 transition-colors duration-500" />
            
            <div className="relative">
              <div className="text-6xl mb-4 animate-bounce-slow">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Get Started Now</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}