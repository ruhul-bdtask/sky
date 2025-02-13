'use client'

import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Snowflake } from '../snowflake/Snowflake'


export function Snowfall({ snowflakeCount = 50, enabled = true }) {
  const [snowflakes, setSnowflakes] = useState([])

  // Initialize snowflakes with staggered entry
  useEffect(() => {
    if (enabled) {
      // Stagger the creation of snowflakes for a more natural effect
      const createSnowflakes = () => {
        setSnowflakes((prev) => {
          if (prev.length >= snowflakeCount) return prev
          return [...prev, prev.length]
        })
      }

      // Initially create some snowflakes
      setSnowflakes(Array.from({ length: Math.min(10, snowflakeCount) }, (_, i) => i))

      // Gradually add more snowflakes
      const interval = setInterval(() => {
        createSnowflakes()
      }, 200)

      return () => clearInterval(interval)
    } else {
      setSnowflakes([])
    }
  }, [snowflakeCount, enabled])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {snowflakes.map((i) => (
        <Snowflake
          key={i}
          size={12 + Math.random() * 10}
          style={{
            animationDelay: `${Math.random() * 8}s`,
            willChange: 'transform', // Optimize performance
          }}
        />
      ))}
    </div>
  )
}

Snowfall.propTypes = {
  snowflakeCount: PropTypes.number,
  enabled: PropTypes.bool,
}

