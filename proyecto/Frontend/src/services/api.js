const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const url = `${API_URL}${path}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null
  try {
    data = await response.json()
  } catch (_) {
    // respuesta sin cuerpo JSON
  }

  if (!response.ok) {
    const message = (data && data.message) || `Error ${response.status}`
    throw new Error(message)
  }

  return data
}

export async function checkApiHealth() {
  return request('/api/health', { method: 'GET' })
}

// Punto centralizado para futuras llamadas CRUD (Fase 2):
// export function getRecords() { return request('/api/records') }
// export function createRecord(payload) { return request('/api/records', { method: 'POST', body: JSON.stringify(payload) }) }
// export function updateRecord(id, payload) { return request(`/api/records/${id}`, { method: 'PUT', body: JSON.stringify(payload) }) }
// export function deleteRecord(id) { return request(`/api/records/${id}`, { method: 'DELETE' }) }

export default {
  checkApiHealth,
}
