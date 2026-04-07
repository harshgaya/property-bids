'use client'

import { useEffect, useRef, useState } from 'react'

export default function AnimatedSection({ children, className = '', animation = 'anim-fade-up', delay = 0, threshold = 0.15 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? animation : 'opacity-0'}`}
      style={{ animationDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
