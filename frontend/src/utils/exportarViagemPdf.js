import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDate, formatCpf } from './format'
import { formatDateTime } from './viagem'
import { ordenarPorNome } from './buscaDoadores'

export function exportarViagemPdf(viagem) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.setTextColor(185, 28, 28)
  doc.text('HemoSal', 14, 18)

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Detalhes da viagem', 14, 27)

  doc.setFontSize(10)
  doc.text(`Data e horário: ${formatDateTime(viagem.dataSaida)}`, 14, 36)
  doc.text(`Limite de vagas: ${viagem.limiteVagas}`, 14, 42)
  doc.text(`Doadores inseridos: ${viagem.doadores.length}`, 14, 48)

  const doadoresOrdenados = ordenarPorNome(viagem.doadores)

  autoTable(doc, {
    startY: 56,
    head: [['Nome', 'Nascimento', 'CPF', 'RG', 'Cartão SUS', 'Sexo', 'Tipo sang.']],
    body: doadoresOrdenados.map((d) => [
      d.nome,
      formatDate(d.dataNasc),
      formatCpf(d.cpf),
      d.rg,
      d.cartaoSus,
      d.sexo,
      d.tipoSang,
    ]),
    headStyles: { fillColor: [185, 28, 28] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 38 },
    },
  })

  const nomeArquivo = `viagem-${viagem.dataSaida?.slice(0, 10) ?? 'sem-data'}.pdf`
  doc.save(nomeArquivo)
}