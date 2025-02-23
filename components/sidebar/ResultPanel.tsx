'use client'

export function ResultPanel() {
  return (
    <div className="p-4 border-b">
      <h2 className="text-xl font-semibold mb-4">Calculation Results</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Base Damage:</span>
          <span className="font-mono">1234</span>
        </div>
        <div className="flex justify-between">
          <span>Critical Hit:</span>
          <span className="font-mono">2468</span>
        </div>
      </div>
    </div>
  )
}
