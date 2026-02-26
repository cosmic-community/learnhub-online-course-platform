import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  size?: 'default' | 'large'
}

export default function CategoryCard({ category, size = 'default' }: CategoryCardProps) {
  const { metadata } = category

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`card group block text-center card-lift glow-on-hover ${
        size === 'large' ? 'p-8' : 'p-6'
      }`}
    >
      {/* Icon with animation */}
      <div className={`mb-4 transform group-hover:scale-110 transition-transform duration-300 ${size === 'large' ? 'text-6xl' : 'text-4xl'}`}>
        {metadata?.icon || '📂'}
      </div>
      
      {/* Name */}
      <h3 className={`font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors ${
        size === 'large' ? 'text-xl' : 'text-lg'
      }`}>
        {metadata?.name || category.title}
      </h3>
      
      {/* Description */}
      {metadata?.description && (
        <p className={`text-navy-400 ${size === 'large' ? 'text-base' : 'text-sm'} line-clamp-2`}>
          {metadata.description}
        </p>
      )}
      
      {/* Explore link */}
      <div className="mt-4 inline-flex items-center gap-1 text-sm text-navy-500 group-hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100">
        <span>Explore</span>
        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}