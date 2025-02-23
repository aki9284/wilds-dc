'use client'

import { useState } from 'react'

const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'equipment', name: '装備・スキル等' },
  { id: 'target', name: '攻撃対象' },
  { id: 'motion', name: 'モーション' },
  { id: 'expectation', name: '期待値計算' },
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
