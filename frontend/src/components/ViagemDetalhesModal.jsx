import { useEffect, useState } from 'react'
import { viagensService } from '../services/api'
import { formatDate, maskCpf } from '../utils/format'
import { formatDateTime } from '../utils/viagem'
import { ordenarPorNome } from '../utils/buscaDoadores'
import { exportarViagemPdf } from '../utils/exportarViagemPdf'
import Spinner from './Spinner'
import './ViagemDetalhesModal.css'

function ViagemDetalhesModal({ viagemId, onClose, onEditar, onExcluido }) {
  const [viagem, setViagem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')

  useEffect(() => {
    setCarregando(true)
    setErro('')
    viagensService
      .buscarPorId(viagemId)
      .then(setViagem)
      .catch(() => setErro('Não foi possível carregar os dados da viagem.'))
      .finally(() => setCarregando(false))
  }, [viagemId])

  async function handleExcluir() {
    setExcluindo(true)
    setErroExclusao('')
    try {
      await viagensService.deletar(viagemId)
      onExcluido()
    } catch {
      setErroExclusao('Não foi possível excluir. Tente novamente.')
      setExcluindo(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <button className="modal-fechar" onClick={onClose}>×</button>
        <h2>Detalhes da viagem</h2>

        {carregando && (
          <div className="modal-loading">
            <Spinner escuro />
            <span>Carregando...</span>
          </div>
        )}
        {erro && <p className="modal-erro">{erro}</p>}

        {!carregando && viagem && (
          <>
            <div className="viagem-detalhes-resumo">
              <div>
                <span className="detalhes-label">Data e horário</span>
                <span>{formatDateTime(viagem.dataSaida)}</span>
              </div>
              <div>
                <span className="detalhes-label">Limite de vagas</span>
                <span>{viagem.limiteVagas}</span>
              </div>
              <div>
                <span className="detalhes-label">Doadores inseridos</span>
                <span>{viagem.doadores.length}</span>
              </div>
            </div>

            <span className="detalhes-label">Doadores nessa viagem</span>
            <ul className="viagem-detalhes-lista">
              {ordenarPorNome(viagem.doadores).map((doador) => (
                <li key={doador.id}>
                  <span className="viagem-doador-nome">{doador.nome}</span>
                  <span>{maskCpf(doador.cpf)}</span>
                  <span>{doador.tipoSang}</span>
                  <span>{doador.sexo}</span>
                  <span>{formatDate(doador.dataNasc)}</span>
                </li>
              ))}
            </ul>

            {!confirmandoExclusao ? (
              <div className="detalhes-acoes">
                <button className="btn-secundario" onClick={() => exportarViagemPdf(viagem)}>
                  Exportar PDF
                </button>
                <button className="btn-perigo" onClick={() => setConfirmandoExclusao(true)}>
                  Excluir
                </button>
                <button className="btn-primario" onClick={() => onEditar(viagem)}>
                  Editar
                </button>
              </div>
            ) : (
              <div className="detalhes-confirmacao">
                <p>Tem certeza que deseja excluir esta viagem?</p>
                {erroExclusao && <p className="modal-erro">{erroExclusao}</p>}
                <div className="detalhes-acoes">
                  <button className="btn-secundario" onClick={() => setConfirmandoExclusao(false)} disabled={excluindo}>
                    Cancelar
                  </button>
                  <button className="btn-perigo" onClick={handleExcluir} disabled={excluindo}>
                    {excluindo ? <Spinner escuro /> : 'Confirmar exclusão'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ViagemDetalhesModal