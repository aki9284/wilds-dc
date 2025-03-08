import { ResultPanel } from '@/components/sidebar/ResultPanel'
import { HistoryPanel } from '@/components/sidebar/HistoryPanel'

export default function CalculatorLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <main className="flex-1">
            {children}
          </main>
          <aside className="lg:w-80 w-full">
            <ResultPanel />
            <HistoryPanel />
          </aside>
        </div>
      </div>
    )
  }