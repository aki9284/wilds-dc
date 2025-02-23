'use client'
import { useState } from 'react'

interface Skill {
  id: number
  name: string
  multiplier: number
}

export function SkillSelector() {
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null)
  
  const skills: Skill[] = [
    { id: 1, name: "Basic Attack", multiplier: 1.0 },
    { id: 2, name: "Power Strike", multiplier: 1.5 },
    { id: 3, name: "Ultimate", multiplier: 2.0 }
  ]

  return (
    <div className="space-y-4">
      {skills.map(skill => (
        <div key={skill.id} className="flex items-center gap-4">
          <input
            type="radio"
            name="skill"
            checked={selectedSkill === skill.id}
            onChange={() => setSelectedSkill(skill.id)}
          />
          <span>{skill.name} (x{skill.multiplier})</span>
        </div>
      ))}
    </div>
  )
}
