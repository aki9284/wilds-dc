'use client'
import { useAtom } from 'jotai'
import { currentWeaponStatsAtom } from '@/models/atoms/weaponAtom'
import { NamedWeaponData, WeaponStats } from '@/models/types/weapon'
import { WEAPON_STATS_LABELS } from '@/models/constants/weaponLabels'
import { SHARPNESS_DATA } from '@/models/constants/sharpness';
import { ELEMENT_TYPES } from '@/models/constants/damageTypes';
import { useEffect, useRef, useState } from 'react'
import { WeaponSelectModal } from './WeaponSelectModal'

const FormLabel = ({ name, required = false }: { name: keyof typeof WEAPON_STATS_LABELS, required?: boolean }) => (
  <div className="flex items-center w-32">
    <span>{WEAPON_STATS_LABELS[name].label}</span>
    <span 
      className="ml-1 text-red-500 cursor-help"
      title={WEAPON_STATS_LABELS[name].note}
    >
      *
    </span>
  </div>
)

export function WeaponForm() {
  const [stats, setStats] = useAtom(currentWeaponStatsAtom)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleWeaponSelect = (weapon: NamedWeaponData) => {
    setStats({
      attack: weapon.stats.attack,
      affinity: weapon.stats.affinity,
      elementType: weapon.stats.elementType,
      elementValue: weapon.stats.elementValue,
      sharpness: weapon.stats.sharpness
    })
    setIsModalOpen(false)
  }

  const NumberInput = ({ value, onChange, min, max, step }: {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
  }) => {
    // 内部で文字列として値を保持
    const [inputValue, setInputValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);
  
    // 入力値が変更されたときの処理（親コンポーネントは更新しない）
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };
  
    // フォーカスが外れたときに親コンポーネントを更新
    const handleBlur = () => {
      if (inputValue === '' || isNaN(Number(inputValue))) {
        // 無効な値の場合は元の値に戻す
        setInputValue(value.toString());
      } else {
        // 値の範囲を確認して調整
        const numValue = Number(inputValue);
        if (numValue < min) {
          setInputValue(min.toString());
          onChange(min);
        } else if (numValue > max) {
          setInputValue(max.toString());
          onChange(max);
        } else {
          setInputValue(numValue.toString());
          onChange(numValue);
        }
      }
    };
  
    // ボタンクリックでの値変更と自動フォーカス維持
    const handleButtonClick = (newValue: number) => {
      const adjustedValue = Math.max(min, Math.min(max, newValue));
      onChange(adjustedValue);
      setInputValue(adjustedValue.toString());
      // ボタンクリック後もフォーカスを維持
      inputRef.current?.focus();
    };
  
    // 外部からの値変更を反映
    useEffect(() => {
      if (!document.activeElement || document.activeElement !== inputRef.current) {
        setInputValue(value.toString());
      }
    }, [value]);
  
    return (
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => handleButtonClick(value - step)}
          className="px-3 py-1 border rounded-l bg-gray-100"
        >
          -
        </button>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="border-y w-12 text-center px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => handleButtonClick(value + step)}
          className="px-3 py-1 border rounded-r bg-gray-100"
        >
          +
        </button>
      </div>
    )
  }

  return (
    <>
      <form className="space-y-4">
        <div className="flex items-center gap-4">
          <FormLabel name="attack" />
          <NumberInput
            value={stats.attack}
            onChange={(value) => setStats({ ...stats, attack: value })}
            min={90}
            max={500}
            step={5}
          />
        </div>
        <div className="flex items-center gap-4">
          <FormLabel name="affinity" />
          <NumberInput
            value={stats.affinity}
            onChange={(value) => setStats({ ...stats, affinity: value })}
            min={-100}
            max={100}
            step={5}
          />
        </div>
        <div className="flex items-center gap-4">
          <FormLabel name="elementType" />
          <select
            value={stats.elementType}
            onChange={(e) => setStats({ ...stats, elementType: e.target.value as WeaponStats['elementType'] })}
            className="border rounded px-2 py-1"
          >
            {Object.entries(ELEMENT_TYPES).map(([key, element]) => (
              <option key={key} value={key}>
                {element.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <FormLabel name="elementValue" />
          <NumberInput
            value={stats.elementValue}
            onChange={(value) => setStats({ ...stats, elementValue: value })}
            min={0}
            max={990}
            step={10}
          />
        </div>
        <div className="flex items-center gap-4">
          <FormLabel name="sharpness" />
          <select
            value={stats.sharpness}
            onChange={(e) => setStats({ ...stats, sharpness: e.target.value as WeaponStats['sharpness'] })}
            className="border rounded px-2 py-1"
          >
            {Object.entries(SHARPNESS_DATA).map(([key, sharp]) => (
              <option key={key} value={key}>
                {sharp.label}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          武器名から入力
        </button>
      </form>

      <WeaponSelectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleWeaponSelect}
      />
    </>
  )
}
