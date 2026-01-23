import ReactMarkdown from 'react-markdown'

interface MarkdownContentProps {
  content: string
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>,
        p: ({ children }) => <p className="mb-4 text-navy-200">{children}</p>,
        ul: ({ children }) => <ul className="mb-4 pl-6 space-y-2">{children}</ul>,
        ol: ({ children }) => <ol className="mb-4 pl-6 space-y-2">{children}</ol>,
        li: ({ children }) => <li className="text-navy-200 list-disc">{children}</li>,
        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
        a: ({ href, children }) => (
          <a href={href} className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="bg-navy-800 text-primary-300 px-2 py-1 rounded text-sm">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-navy-800 rounded-lg p-4 overflow-x-auto mb-4">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-navy-300 my-4">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}