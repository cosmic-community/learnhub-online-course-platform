import Link from 'next/link'
import { getCourses, getCategories, getInstructors, getLessons } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'
import CourseSpotlight from '@/components/CourseSpotlight'
import QuickStats from '@/components/QuickStats'
import ScrollReveal from '@/components/ScrollReveal'
import DailyTip from '@/components/DailyTip'

export default async function HomePage() {
  const [courses, categories, instructors, lessons] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
    getLessons(),
  ])

  const featuredCourses = courses.slice(0, 3)
  const spotlightCourses = courses.slice(0, 5)

  return (
    <div>
      {/* Hero Section with animated gradient */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl animate-pulse-slower" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400/30 rounded-full animate-float" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-primary-500/20 rounded-full animate-float-delayed" />
          <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-primary-400/25 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-primary-500/15 rounded-full animate-float-delayed" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Learning Streak Badge */}
            <div className="flex justify-center mb-6">
              <LearningStreak />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-gradient-x"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-6">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            
            {/* Daily Tip */}
            <div className="max-w-xl mx-auto mb-8">
              <DailyTip />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg group">
                Browse Courses
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <ScrollReveal>
        <section className="py-12 -mt-8 relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuickStats 
              courseCount={courses.length}
              lessonCount={lessons.length}
              instructorCount={instructors.length}
              categoryCount={categories.length}
            />
          </div>
        </section>
      </ScrollReveal>

      {/* Course Spotlight Section */}
      <ScrollReveal delay={100}>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CourseSpotlight courses={spotlightCourses} />
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Courses */}
      <ScrollReveal delay={200}>
        <section className="py-20 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
                <p className="text-navy-400">Start learning with our most popular courses</p>
              </div>
              <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
                View All Courses
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <ScrollReveal key={course.id} delay={index * 100} direction="up">
                  <CourseCard course={course} />
                </ScrollReveal>
              ))}
            </div>
            
            <div className="mt-8 text-center sm:hidden">
              <Link href="/courses" className="btn-secondary">
                View All Courses
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Categories */}
      <ScrollReveal delay={100}>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
              <p className="text-navy-400">Find the perfect course for your learning goals</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <ScrollReveal key={category.id} delay={index * 75} direction="up">
                  <CategoryCard category={category} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Instructors */}
      <ScrollReveal delay={100}>
        <section className="py-20 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
              <p className="text-navy-400">Learn from industry experts with real-world experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor, index) => (
                <ScrollReveal key={instructor.id} delay={index * 100} direction="up">
                  <InstructorCard instructor={instructor} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal delay={100}>
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card p-12 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-primary-500/10 to-primary-500/5 animate-gradient-x" />
              
              <div className="relative">
                <span className="text-5xl mb-4 block">🚀</span>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to start learning?
                </h2>
                <p className="text-navy-300 mb-8 text-lg">
                  Join thousands of students and start your journey to mastering new skills today.
                </p>
                <Link href="/courses" className="btn-primary text-lg group">
                  Get Started Now
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}