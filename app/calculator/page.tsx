'use client'
import { useState, useEffect } from 'react'
import { TabNavigation } from '@/components/navigation/TabNavigation'
import { EquipmentForm } from '@/components/calculator/EquipmentForm'
import { TargetSelector } from '@/components/calculator/TargetSelector'
import { MotionSelector } from '@/components/calculator/MotionSelector'
import { ConditionSelector } from '@/components/calculator/ConditionSelector'
import { fetchMonsterData, fetchMotionData } from '@/utils/dataFetch'

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // モンスターデータの事前ロード
  useEffect(() => {
    fetchMonsterData()
        .then()
        .catch(error => console.error(error));
  }, []);

  // モーションデータの事前ロード
  useEffect(() => {
    fetchMotionData()
        .then()
        .catch(error => console.error(error));
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'equipment':
        return <EquipmentForm />
      case 'target':
        return <TargetSelector />
      case 'motion':
        return <MotionSelector />
      case 'condition':
        return <ConditionSelector />
      case 'overview':
      default:
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Quick Overview</h2>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
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
