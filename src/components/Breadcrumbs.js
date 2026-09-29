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
        className="flex items-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
      >
        <li>
          <Link 
            href="/" 
            className="flex items-center hover:text-neon-cyan transition-colors duration-200"
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
                className="hover:text-neon-cyan transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </motion.ol>
    </nav>
  )
}