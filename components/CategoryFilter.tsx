import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/courses"
        className="badge bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
      >
        All Courses
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="badge bg-navy-800 text-navy-200 hover:bg-navy-700 transition-colors"
        >
          {category.metadata?.icon} {category.metadata?.name || category.title}
        </Link>
      ))}
    </div>
  )
}