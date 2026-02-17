import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { metadata } = category

  return (
    <Link 
      href={`/categories/${category.slug}`} 
      className="card group block p-6 text-center hover:transform hover:-translate-y-2 transition-all duration-300"
    >
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <span className="relative text-4xl mb-4 block group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
          {metadata?.icon || '📁'}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
        {metadata?.name || category.title}
      </h3>
      
      {metadata?.description && (
        <p className="text-navy-400 text-sm line-clamp-2 group-hover:text-navy-300 transition-colors">
          {metadata.description}
        </p>
      )}
      
      <div className="mt-4 inline-flex items-center gap-1 text-sm text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <span>Explore</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}