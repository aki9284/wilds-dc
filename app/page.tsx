'use client'

interface Content {
  id: number
  title: string
  description: string
}

interface Data {
  title: string
  content: Content[]
}

export default function Home() {
  return <div>Loading...</div>
}

