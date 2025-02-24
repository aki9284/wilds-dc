'use client'

import { useState } from 'react'

const tabs = [
  { id: 'equipment', name: '装備' },
  { id: 'target', name: '攻撃対象' },
  { id: 'motion', name: 'モーション' },
  { id: 'condition', name: '計算条件' },
  { id: 'compare', name: '複数比較' },
]
export function TabNavigation({ activeTab, onTabChange }: {
  activeTab: string
  onTabChange: (tabId: string) => void
}) {
  return (
    <div className="border-b">
      <nav className="flex space-x-2 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-2 rounded-t-lg text-sm font-medium
              ${activeTab === tab.id 
                ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}
            `}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  )
}
