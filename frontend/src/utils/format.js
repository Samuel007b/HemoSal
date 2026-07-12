export function maskCpf(cpf) {
  const digitos = (cpf || '').replace(/\D/g, '')
  if (digitos.length !== 11) return cpf
  return `${digitos.slice(0, 3)}.***.***-${digitos.slice(9)}`
}

export function formatCpf(cpf) {
  const digitos = (cpf || '').replace(/\D/g, '')
  if (digitos.length !== 11) return cpf
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`
}

export function formatDate(isoString) {
  if (!isoString) return '-'
  const data = new Date(isoString)
  if (Number.isNaN(data.getTime())) return '-'
  // timeZone: 'UTC' evita a data "voltar um dia" no fuso do Brasil,
  // já que o back armazena dataNasc como meia-noite UTC
  return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

export function dateToInputValue(isoString) {
  if (!isoString) return ''
  return isoString.slice(0, 10) // "2001-11-09T00:00:00.000Z" -> "2001-11-09"
}