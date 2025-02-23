'use client'
import { useEffect, useState } from 'react'

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
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    fetch('/data/content.json')
      .then(res => res.json())
      .then(json => setData(json))
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <main className="p-4">
      <h1>{data.title}</h1>
      <a href="/dc">Damage Calculator</a>
      <div>
        {data.content.map((item) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

