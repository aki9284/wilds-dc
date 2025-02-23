'use client'
import { useState, useEffect } from 'react'
import { Combobox } from '@headlessui/react'
import { useAtom } from 'jotai'
import { selectedSkillsAtom, SelectedSkill } from '../../atoms/skillAtoms'

interface SkillLevel {
  level: number
  addAttack?: number
  addAffinity?: number
}

interface Skill {
  name: string
  levels: SkillLevel[]
}

export function SkillSelector() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useAtom(selectedSkillsAtom)
  const [query, setQuery] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)

  useEffect(() => {
    fetch('/data/skills.json')
      .then(res => res.json())
      .then(data => setSkills(data.skills))
  }, [])

  const filteredSkills = (index: number) => {
    if (isInputFocused && query === '') {
      return skills.filter(skill =>
        !selectedSkills.some((selected, idx) => selected.name === skill.name && idx !== index)
      )
    }
    return skills.filter(skill =>
      skill.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedSkills.some((selected, idx) => selected.name === skill.name && idx !== index)
    )
  }
  
  const addSkillSelection = () => {
    setSelectedSkills([...selectedSkills, { name: '', level: 1 }])
  }

  const updateSkillSelection = (index: number, name: string, level: number) => {
    const newSelectedSkills = [...selectedSkills]
    newSelectedSkills[index] = { name, level }
    setSelectedSkills(newSelectedSkills)
  }

  const removeSkillSelection = (index: number) => {
    setSelectedSkills(selectedSkills.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {selectedSkills.map((selected, index) => (
        <div key={index} className="flex items-center gap-4">
          <Combobox
            value={selected.name}
            onChange={(name) => updateSkillSelection(index, name || '', selected.level)}
            as="div"
            className="relative"
          >
            <Combobox.Button as="div" className="relative">
              <Combobox.Input
                className="border rounded px-2 py-1"
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                displayValue={(name: string) => name}
              />
            </Combobox.Button>

            <Combobox.Options className="absolute mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto w-full z-10">
              {filteredSkills(index).map((skill) => (
                <Combobox.Option
                  key={skill.name}
                  value={skill.name}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {skill.name}
                    </span>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>

          <select
            value={selected.level}
            onChange={(e) => updateSkillSelection(index, selected.name, Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {skills.find(s => s.name === selected.name)?.levels.map(level => (
              <option key={level.level} value={level.level}>
                Lv.{level.level}
              </option>
            ))}
          </select>

          <button
            onClick={() => removeSkillSelection(index)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            削除
          </button>
        </div>
      ))}

      <button
        onClick={addSkillSelection}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        スキル追加
      </button>
    </div>
  )
}