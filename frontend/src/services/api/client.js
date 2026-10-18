const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function getActiveUserId() {
  return localStorage.getItem('recallgraph_user_id') || 'demo-user'
}

export function setActiveUserId(userId) {
  localStorage.setItem('recallgraph_user_id', userId)
}

export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, timeout = 5000 } = options
  const userId = getActiveUserId()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      ...headers,
    },
    signal: controller.signal,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    clearTimeout(timeoutId)
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const error = new Error(data?.error?.message || `Request failed (${response.status})`)
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

export async function checkBackendHealth() {
  try {
    return await apiRequest('/api/health', { timeout: 3000 })
  } catch (error) {
    return {
      status: 'offline',
      error: error.message,
    }
  }
}
