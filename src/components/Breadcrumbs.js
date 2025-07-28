'use client'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <motion.ol 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
      >
        <li>
          <Link 
            href="/" 
            className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2" />
            {item.href ? (
              <Link 
                href={item.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </motion.ol>
    </nav>
  )
}