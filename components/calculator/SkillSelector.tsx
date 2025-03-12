'use client'
import { useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useAtom } from 'jotai'
import { selectedSkillsAtom } from '@/models/atoms/skillAtoms'
import { SKILL_DATA, SkillKey } from '@/models/constants/skill'

export function SkillSelector() {
  const [selectedSkills, setSelectedSkills] = useAtom(selectedSkillsAtom)
  const [query, setQuery] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)
  const filteredSkills = (index: number) => {
    const skillEntries = Object.entries(SKILL_DATA)
    if (isInputFocused && query === '') {
        return skillEntries.filter(([key, skill]) => 
          !selectedSkills.some((selected, idx) => selected.skillKey === key && idx !== index) &&
          !skill.hidden
        )
    }
    return skillEntries.filter(([key, skill]) => 
      skill.label.toLowerCase().includes(query.toLowerCase()) &&
      !selectedSkills.some((selected, idx) => selected.skillKey === key && idx !== index) &&
      !skill.hidden
    )
  }
  
  
  const addSkillSelection = () => {
    const availableSkill = Object.entries(SKILL_DATA)
    .find(([key, skill]) => 
      !selectedSkills.some(selected => selected.skillKey === key) && 
      !skill.hidden
    );

    if (availableSkill) {
      const [skillKey] = availableSkill;
      setSelectedSkills([...selectedSkills, { skillKey: skillKey as SkillKey, level: 1 }]);
    }
  }

  const updateSkillSelection = (index: number, skillKey: SkillKey, level: number) => {
    const newSelectedSkills = [...selectedSkills]
    newSelectedSkills[index] = { skillKey, level }
    setSelectedSkills(newSelectedSkills)
  }

  const removeSkillSelection = (index: number) => {
    setSelectedSkills(selectedSkills.filter((_, i) => i !== index))
  }

  const isValidSkill = (input: string): boolean => {
    return Object.values(SKILL_DATA).some(skill => 
      skill.label.toLowerCase() === input.toLowerCase()
    )
  }

  return (
    <div className="space-y-4">
      {selectedSkills.map((selected, index) => (
        <div key={index} className="flex items-center gap-4">
          <Combobox
            value={selected.skillKey}
            onChange={(key: SkillKey) => updateSkillSelection(index, key, selected.level)}
            as="div"
            className="relative"
          >
            <ComboboxButton as="div" className="relative">
              {/* 入力によるスキル選択は複数コンボボックス間で妙な事象を引き起こすため一時無効化
              <ComboboxInput
                className="border rounded px-2 py-1"
                onChange={(event) => {
                  setQuery(event.target.value)
                  // 入力が空の場合は現在の選択値を維持
                  if (!event.target.value) {
                    event.target.value = SKILL_DATA[selected.skillKey].label
                  }
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={(event) => {
                  setIsInputFocused(false)
                  if (!isValidSkill(event.target.value)) {
                    // 無効な入力の場合、現在選択中のスキルのラベルに戻す
                    event.target.value = SKILL_DATA[selected.skillKey].label
                  }
                }}
                displayValue={(key: SkillKey) => SKILL_DATA[key].label}
              /> */}
              <Combobox.Input
                className="border rounded px-2 py-1"
                readOnly
                displayValue={(key: SkillKey) => SKILL_DATA[key].label}
              />
            </ComboboxButton>

            <ComboboxOptions className="absolute mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto w-full z-10">
              {filteredSkills(index).map(([key, skill]) => (
                <ComboboxOption
                  key={key}
                  value={key}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {skill.label}
                    </span>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>

          <select
            value={selected.level}
            onChange={(e) => updateSkillSelection(index, selected.skillKey, Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {SKILL_DATA[selected.skillKey].levels.map(level => (
              <option key={level.level} value={level.level}>
                Lv.{level.level}
              </option>
            ))}
          </select>

          <button
            onClick={() => removeSkillSelection(index)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            ×
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
