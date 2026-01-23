'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
}

export default function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-navy-700 text-navy-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-navy-600"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          padding: '1.5rem',
          background: '#1e293b',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}