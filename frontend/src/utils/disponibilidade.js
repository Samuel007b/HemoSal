export function doadorDisponivel(doador, dataReferenciaISO, viagemIdIgnorado = null) {
  if (!dataReferenciaISO) return true

  const referencia = new Date(dataReferenciaISO)
  const viagens = viagemIdIgnorado
    ? (doador.viagens ?? []).filter((v) => v.id !== viagemIdIgnorado)
    : (doador.viagens ?? [])

  if (viagens.length === 0) return true

  const intervaloDias = doador.sexo === 'M' ? 60 : 90
  const intervaloMs = intervaloDias * 24 * 60 * 60 * 1000

  return viagens.every((viagem) => {
    const dataViagem = new Date(viagem.dataSaida)
    const diferencaMs = Math.abs(referencia.getTime() - dataViagem.getTime())
    return diferencaMs >= intervaloMs
  })
}