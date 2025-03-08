'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export function MenuBar() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: 'About', href: '/' },
    { name: 'Calculator', href: '/calculator' },
  ]

  return (
    <nav className="bg-indigo-950 border-b">
      <div className="px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* ロゴエリアを追加 */}
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="text-xl font-bold text-white">かりぴきゅれーたー</span>
                {/* または画像ロゴの場合:
                <Image
                  src="/logo.png"
                  alt="WildsDC Logo"
                  width={120}
                  height={40}
                />
                */}
              </Link>
            </div>
            
            {/* ml-10を削除またはml-4などに変更 */}
            <div className="hidden md:flex ml-4 space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-gray-400 px-3 py-2 rounded-md"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
