'use client'

import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'

export default function Home() {
  const [content, setContent] = useState('')

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/about.md`)
      .then(response => response.text())
      .then(text => setContent(text))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="markdown-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
