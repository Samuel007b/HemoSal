import { jwtDecode } from 'jwt-decode'

export function getAdminId() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const { id } = jwtDecode(token)
    return id
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}