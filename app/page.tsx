import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningTip from '@/components/LearningTip'
import TestimonialsSection from '@/components/TestimonialsSection'
import QuickStartButton from '@/components/QuickStartButton'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)

  // Calculate total learning hours
  const totalHours = courses.reduce((acc, course) => acc + (course.metadata?.estimated_hours || 0), 0)
  
  // Calculate total lessons
  const totalLessons = courses.reduce((acc, course) => acc + (course.metadata?.lessons?.length || 0), 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated floating shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-primary-400/10 rounded-full animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-600/10 rounded-full animate-float" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Daily Learning Tip - Surprise element! */}
            <LearningTip />
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-gradient"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg group">
                <span className="group-hover:scale-105 inline-block transition-transform">Browse Courses</span>
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg hover:scale-105 transition-transform">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Enhanced Stats with animations */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center group cursor-default">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {courses.length}+
              </div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {totalLessons}+
              </div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {instructors.length}+
              </div>
              <div className="text-navy-400 text-sm">Expert Instructors</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {totalHours}+
              </div>
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
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              View All Courses
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
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

      {/* Testimonials Section - New! */}
      <TestimonialsSection />

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
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
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
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
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <Link href="/courses" className="btn-primary text-lg group/btn">
                <span className="group-hover/btn:scale-105 inline-block transition-transform">Get Started Now</span>
                <span className="ml-2 inline-block group-hover/btn:translate-x-1 transition-transform">🎯</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Floating Button */}
      <QuickStartButton />
    </div>
  )
}