import { ResultPanel } from '@/components/sidebar/ResultPanel'
import { HistoryPanel } from '@/components/sidebar/HistoryPanel'

export default function CalculatorLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="flex">
        <main className="flex-1">
          {children}
        </main>
        <aside className="w-80">
          <ResultPanel />
          <HistoryPanel />
        </aside>
      </div>
    )
  }