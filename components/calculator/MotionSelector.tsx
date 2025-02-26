'use client'

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { selectedMotionsAtom } from '@/atoms/motionAtom';
import { Motion } from '@/models/types/motion';
import { nanoid } from 'nanoid';
import { SaveLoadPanel } from '../common/SaveLoadPanel';
import { getCachedMotionData } from '@/utils/dataFetch';

export function MotionSelector() {
  const motions = getCachedMotionData();
  const [selectedMotions, setSelectedMotions] = useAtom(selectedMotionsAtom);

  const handleSave = (name: string) => {
    const totalMV = selectedMotions.reduce((sum, s) => sum + (Number(s.motion?.value) || 0), 0);
    const totalDuration = selectedMotions.reduce((sum, s) => sum + (Number(s.motion?.duration) || 0), 0);
    
    // モーションjsonやpresetの変更時に最新データが表示されるようにするためモーション名のみで保存/読み込み
    const savedMotions = selectedMotions.map(s => s.motion?.name);

    return {
      selectedMotions: savedMotions,
    }
  }

  const handleLoad = (data: any) => {
    // Map saved motion names back to Motion objects
    const loadedMotions = data.selectedMotions.map((name: string) => {
      const motion = motions.find(m => m.name === name) || null;
      return { id: nanoid(), motion };
    });

    setSelectedMotions(loadedMotions);
  }
  const addMotionSelector = () => {
    setSelectedMotions([...selectedMotions, { id: nanoid(), motion: null }]);
  };

  const removeMotionSelector = (id: string) => {
    setSelectedMotions(selectedMotions.filter(m => m.id !== id));
  };

  const updateMotionSelection = (id: string, selectedMotion: Motion | null) => {
    setSelectedMotions(selectedMotions.map(m => 
      m.id === id ? { ...m, motion: selectedMotion } : m
    ));
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">モーション選択</h2>
          
          <div className="space-y-3">
            {selectedMotions.map((selection, index) => (
              <div key={selection.id} className="flex items-center gap-3">
                <span className="w-8">{index + 1}.</span>
                <select
                  className="flex-1 p-2 border rounded"
                  value={selection.motion?.name || ''}
                  onChange={(e) => {
                    const selectedMotion = motions.find(m => m.name === e.target.value) || null;
                    updateMotionSelection(selection.id, selectedMotion);
                  }}
                >
                  <option value="">モーションを選択</option>
                  {motions.map((motion) => (
                    <option key={motion.name} value={motion.name}>
                      {motion.weaponType} - {motion.name} (MV: {motion.value})
                    </option>
                  ))}
                </select>
                
                {selectedMotions.length > 1 && (
                  <button
                    onClick={() => removeMotionSelector(selection.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addMotionSelector}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            モーション追加
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">選択中のモーション合計</h3>
            <div>
              総モーション値: {selectedMotions.reduce((sum, s) => sum + (Number(s.motion?.value) || 0), 0)}
            </div>
            <div>
              総モーション時間: {selectedMotions.reduce((sum, s) => sum + (Number(s.motion?.duration) || 0), 0)}秒
            </div>
          </div>
        </div>
      </div>
      <div className="w-80">
        <SaveLoadPanel 
          storageKey="motion-settings"
          presetFilePath='/data/motionPresets.json'
          onSave={handleSave}
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
}
