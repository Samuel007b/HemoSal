export const TIPOS_BUSCA_DOADOR = [
  { value: 'nome', label: 'Nome' },
  { value: 'cpf', label: 'CPF' },
  { value: 'rg', label: 'RG' },
  { value: 'cartaoSus', label: 'Cartão SUS' },
]

function normalizarTexto(valor) {
  return (valor ?? '').toString().toLowerCase()
}

function normalizarDigitos(valor) {
  return (valor ?? '').toString().replace(/\D/g, '')
}

export function filtrarDoadores(doadores, tipoBusca, termo) {
  const termoLimpo = termo.trim()
  if (!termoLimpo) return doadores

  if (tipoBusca === 'nome') {
    const alvo = normalizarTexto(termoLimpo)
    return doadores.filter((d) => normalizarTexto(d.nome).includes(alvo))
  }

  const alvoDigitos = normalizarDigitos(termoLimpo)
  return doadores.filter((d) => normalizarDigitos(d[tipoBusca]).includes(alvoDigitos))
}

export function ordenarPorNome(doadores) {
  return [...doadores].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}