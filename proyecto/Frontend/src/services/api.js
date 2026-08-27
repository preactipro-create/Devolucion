const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const url = `${API_URL}${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
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

// Llama con el token guardado en el header Authorization: Bearer <token>
function authRequest(path, token, options = {}) {
  return request(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}

export async function login(username, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function crearActa(token, payload) {
  return authRequest('/api/actas', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function listarActas(token) {
  return authRequest('/api/actas', token, { method: 'GET' })
}

export async function obtenerAuditoria(token) {
  return authRequest('/api/auditoria', token, { method: 'GET' })
}

export default {
  checkApiHealth,
  login,
  crearActa,
  listarActas,
  obtenerAuditoria,
}
