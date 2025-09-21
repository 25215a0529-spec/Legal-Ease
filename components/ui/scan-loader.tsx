"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import styles from './scan-loader.module.css'

interface ScanLoaderProps {
  className?: string
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl', 
  lg: 'text-6xl'
}

export function ScanLoader({ 
  className, 
  text = "Scan", 
  size = 'md' 
}: ScanLoaderProps) {
  return (
    <div className={cn("scan-loader-wrapper", className)}>
      <p className={cn(
        styles.scanLoader,
        "relative max-w-fit",
        sizeClasses[size]
      )}>
        <span>
          {text}
        </span>
      </p>
    </div>
  )
}
