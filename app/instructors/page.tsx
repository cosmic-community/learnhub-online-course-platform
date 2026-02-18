import Link from 'next/link'
import { getInstructors, getCourses } from '@/lib/cosmic'
import InstructorCard from '@/components/InstructorCard'
import type { Instructor, Course } from '@/types'

export const metadata = {
  title: 'Our Instructors - LearnHub',
  description: 'Learn from industry experts with real-world experience. Meet our team of professional instructors.',
}

export default async function InstructorsPage() {
  const [instructors, courses] = await Promise.all([
    getInstructors(),
    getCourses(),
  ])

  // Calculate course count for each instructor
  const instructorCourseCount = new Map<string, number>()
  courses.forEach((course: Course) => {
    course.metadata?.instructors?.forEach((instructor: Instructor) => {
      const count = instructorCourseCount.get(instructor.id) || 0
      instructorCourseCount.set(instructor.id, count + 1)
    })
  })

  // Sort instructors by course count (most active first)
  const sortedInstructors = [...instructors].sort((a, b) => {
    const countA = instructorCourseCount.get(a.id) || 0
    const countB = instructorCourseCount.get(b.id) || 0
    return countB - countA
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>👨‍🏫</span>
              <span>Industry Experts</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Meet Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                Expert Instructors
              </span>
            </h1>
            <p className="text-xl text-navy-300">
              Learn from professionals with years of industry experience at companies like 
              Google, Microsoft, Meta, and more. Our instructors bring real-world knowledge to every course.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-primary-400">{instructors.length}</div>
              <div className="text-navy-400 text-sm">Expert Instructors</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-primary-400">{courses.length}</div>
              <div className="text-navy-400 text-sm">Total Courses</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-primary-400">50+</div>
              <div className="text-navy-400 text-sm">Years Combined Experience</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-primary-400">4.9</div>
              <div className="text-navy-400 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">All Instructors</h2>
              <p className="text-navy-400 text-sm mt-1">
                Showing {instructors.length} instructor{instructors.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {instructors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedInstructors.map((instructor) => (
                <InstructorCard 
                  key={instructor.id} 
                  instructor={instructor}
                  courseCount={instructorCourseCount.get(instructor.id) || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Instructors Found</h3>
              <p className="text-navy-400 mb-6">Check back soon for our expert instructors.</p>
              <Link href="/" className="btn-primary">
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12">
            <div className="text-5xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Want to Become an Instructor?
            </h2>
            <p className="text-navy-300 mb-8">
              Share your expertise with thousands of learners around the world. 
              We&apos;re always looking for talented professionals to join our team.
            </p>
            <Link href="/contact" className="btn-primary">
              Apply to Teach
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}