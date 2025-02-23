'use client'

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { selectedMotionsAtom } from '@/atoms/motionAtom';
import { Motion, MotionSelection } from '@/models/types/motion';
import { nanoid } from 'nanoid';

export function MotionSelector() {
  const [motions, setMotions] = useState<Motion[]>([]);
  const [selectedMotions, setSelectedMotions] = useAtom(selectedMotionsAtom);

  useEffect(() => {
    const loadMotions = async () => {
      const response = await fetch('/data/motions.json');
      const data = await response.json();
      setMotions(data.motions);
    };
    loadMotions();
  }, []);

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
  );
}
