'use client'
import { useState, useEffect } from 'react'
import { TabNavigation } from '@/components/navigation/TabNavigation'
import { EquipmentForm } from '@/components/calculator/EquipmentForm'
import { TargetSelector } from '@/components/calculator/TargetSelector'
import { MotionSelector } from '@/components/calculator/MotionSelector'
import { ConditionSelector } from '@/components/calculator/ConditionSelector'
import { fetchMonsterData, fetchMotionData } from '@/utils/dataFetch'
import { ComparePanel } from '@/components/calculator/ComparePanel'

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
      case 'compare':
        return <ComparePanel />
      default:
        setActiveTab('equipment')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
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
