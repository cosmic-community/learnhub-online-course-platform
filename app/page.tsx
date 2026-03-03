import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import HeroSection from '@/components/HeroSection'
import QuickStartQuiz from '@/components/QuickStartQuiz'
import LearningMotivation from '@/components/LearningMotivation'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total learning hours
  const totalHours = courses.reduce((acc, course) => acc + (course.metadata?.estimated_hours || 0), 0)
  
  // Get beginner courses for recommendations
  const beginnerCourses = courses.filter(c => 
    c.metadata?.difficulty?.value?.toLowerCase() === 'beginner' || 
    c.metadata?.difficulty?.key?.toLowerCase() === 'beginner'
  )

  return (
    <div>
      {/* Animated Hero Section */}
      <HeroSection 
        courseCount={courses.length}
        instructorCount={instructors.length}
        categoryCount={categories.length}
        totalHours={totalHours}
      />

      {/* Quick Start Quiz */}
      <QuickStartQuiz courses={courses} categories={categories} />

      {/* Learning Motivation */}
      <LearningMotivation />

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
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

      {/* Categories */}
      <section className="py-20">
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
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full translate-x-1/3 translate-y-1/3" />
            
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
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