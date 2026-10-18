import { useState, useEffect } from 'react'
import { apiRequest } from '../services/api/client'

export function useBackendHealth(pollIntervalMs = 15000) {
  const [health, setHealth] = useState({
    status: 'checking',
    falkordb: null,
    llm: null,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    async function checkHealth() {
      try {
        const data = await apiRequest('/api/health')
        if (isMounted) {
          setHealth({
            status: data?.status || 'ok',
            falkordb: data?.falkordb,
            llm: data?.llm,
            error: null,
          })
        }
      } catch (err) {
        if (isMounted) {
          setHealth({
            status: 'offline',
            falkordb: null,
            llm: null,
            error: err.message,
          })
        }
      }
    }

    checkHealth()
    const timer = setInterval(checkHealth, pollIntervalMs)

    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [pollIntervalMs])

  return health
}
