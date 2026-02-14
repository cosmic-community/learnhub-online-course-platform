import Link from 'next/link'
import { getCourses, getCategories, getInstructors, getLessons } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStats from '@/components/LearningStats'
import QuickCourseFinder from '@/components/QuickCourseFinder'
import FloatingCTA from '@/components/FloatingCTA'

export default async function HomePage() {
  const [courses, categories, instructors, lessons] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
    getLessons(),
  ])

  const featuredCourses = courses.slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/30 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-amber-400/20 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-6 animate-fadeIn">
              <span className="animate-pulse">🎓</span>
              <span>Start your learning journey today</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Join thousands of learners transforming their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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
            
            {/* Quick Course Finder */}
            <div className="flex justify-center">
              <QuickCourseFinder courses={courses} categories={categories} />
            </div>
          </div>
          
          {/* Animated Stats */}
          <div className="mt-16">
            <LearningStats 
              coursesCount={courses.length}
              instructorsCount={instructors.length}
              categoriesCount={categories.length}
              lessonsCount={lessons.length}
            />
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
                <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Most Popular</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              View All Courses
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="animate-fadeIn"
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Choose Your Path</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Learn With Us - New Section */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">✨</span>
              <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Why Choose Us</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Learn With Confidence</h2>
            <p className="text-navy-400">Everything you need to succeed in your learning journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎥',
                title: 'HD Video Content',
                description: 'Crystal-clear video lessons with professional production quality you can watch anytime, anywhere.'
              },
              {
                icon: '💻',
                title: 'Hands-on Projects',
                description: 'Build real-world projects that you can add to your portfolio and showcase to employers.'
              },
              {
                icon: '🏆',
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of real-world experience in their fields.'
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-6 rounded-2xl bg-navy-800/30 border border-navy-700 hover:border-primary-500/30 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-navy-400">{feature.description}</p>
              </div>
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
              <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Expert Teachers</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.slice(0, 3).map((instructor, index) => (
              <div
                key={instructor.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative card p-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
                Your future self will thank you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses" className="btn-primary text-lg group">
                  Get Started Now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/contact" className="btn-secondary text-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <FloatingCTA />
    </div>
  )
}