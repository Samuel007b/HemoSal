export function calculaDisponibilidade(doador, dataReferencia = new Date()) {
    const referencia = new Date(dataReferencia);
    if (Number.isNaN(referencia.getTime())) {
        throw new Error("Data inválida");
    }
    if (!doador.viagens || doador.viagens.length === 0) {
        return true;
    }
    const intervaloDias = doador.sexo === "MASCULINO" ? 60 : 90;
    const intervaloMs = intervaloDias * 24 * 60 * 60 * 1000;
    return doador.viagens.every(viagem => {
        const dataViagem = new Date(viagem.dataSaida);
        const diferencaMs = Math.abs(
            referencia.getTime() - dataViagem.getTime()
        );
        return diferencaMs >= intervaloMs;
    });
}