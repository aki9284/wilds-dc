'use client'

import { useState } from 'react'
import { TabNavigation } from '@/components/navigation/TabNavigation'
import { WeaponForm } from '@/components/calculator/WeaponForm'
import { SkillSelector } from '@/components/calculator/SkillSelector'

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'weapon':
        return <WeaponForm />
      case 'skills':
        return <SkillSelector />
      case 'overview':
      default:
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Overview content */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Quick Overview</h2>
              {/* ... existing overview content ... */}
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              {/* ... existing actions content ... */}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <h1 className="text-2xl font-bold p-6 pb-4">Damage Calculator</h1>
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>

      <div className="flex-1 p-6">
        {renderTabContent()}
      </div>
    </div>
  )
}
