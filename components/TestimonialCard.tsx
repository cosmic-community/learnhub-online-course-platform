interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  rating: number
  course: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="card p-6 h-full flex flex-col">
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-navy-700'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Content */}
      <p className="text-navy-200 mb-6 flex-1 leading-relaxed">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Course tag */}
      <div className="mb-4">
        <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
          {testimonial.course}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-navy-800">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-white">{testimonial.name}</div>
          <div className="text-sm text-navy-400">{testimonial.role}</div>
        </div>
      </div>
    </div>
  )
}