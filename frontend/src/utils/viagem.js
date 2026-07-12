export function combinarDataHora(data, hora) {
  if (!data || !hora) return null
  const local = new Date(`${data}T${hora}:00`)
  if (Number.isNaN(local.getTime())) return null
  return local.toISOString()
}

export function separarDataHora(isoString) {
  if (!isoString) return { data: '', hora: '' }
  const d = new Date(isoString)
  const data = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const hora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return { data, hora }
}

export function formatDateTime(isoString) {
  if (!isoString) return '-'
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}