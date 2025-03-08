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
    <div className="sticky top-0 bg-white border-b z-10">
      <nav className="container mx-auto px-4">
        <div className="flex space-x-2 overflow-x-auto">
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
        </div>
      </nav>
    </div>
  )
}

// セーブロードパネルを備えたタブ群の共通レイアウト
export function SaveLoadableTabLayout({ children, saveLoadPanel }: { children: React.ReactNode, saveLoadPanel: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        {children}
      </div>
      <div className="md:w-128">
        {saveLoadPanel}
      </div>
    </div>
  );
}
