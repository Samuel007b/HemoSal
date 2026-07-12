import { useEffect, useState } from 'react'
import { doadoresService } from '../services/api'
import { formatDate, formatCpf } from '../utils/format'
import CampoSigiloso from './CampoSigiloso'
import Spinner from './Spinner'
import './DoadorDetalhesModal.css'

function DoadorDetalhesModal({ doadorId, onClose, onEditar, onExcluido }) {
  const [doador, setDoador] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')

  useEffect(() => {
    setCarregando(true)
    setErro('')
    doadoresService
      .buscarPorId(doadorId)
      .then(setDoador)
      .catch(() => setErro('Não foi possível carregar os dados do doador.'))
      .finally(() => setCarregando(false))
  }, [doadorId])

  async function handleExcluir() {
    setExcluindo(true)
    setErroExclusao('')
    try {
      await doadoresService.deletar(doadorId)
      onExcluido()
    } catch (err) {
      if (err.response?.status === 409) {
        setErroExclusao('Este doador possui viagens cadastradas e não pode ser excluído.')
      } else {
        setErroExclusao('Não foi possível excluir. Tente novamente.')
      }
      setExcluindo(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <button className="modal-fechar" onClick={onClose}>×</button>
        <h2>Detalhes do doador</h2>

        {carregando && (
          <div className="modal-loading">
            <Spinner escuro />
            <span>Carregando...</span>
          </div>
        )}

        {erro && <p className="modal-erro">{erro}</p>}

        {!carregando && doador && (
          <>
            <div className="detalhes-grid">
              <div><span className="detalhes-label">Nome</span><span>{doador.nome}</span></div>
              <div><span className="detalhes-label">Data de nascimento</span><span>{formatDate(doador.dataNasc)}</span></div>
              <div><span className="detalhes-label">Sexo</span><span>{doador.sexo}</span></div>
              <div><span className="detalhes-label">Tipo sanguíneo</span><span>{doador.tipoSang}</span></div>
              <div className="detalhes-full"><span className="detalhes-label">Endereço</span><span>{doador.endereco}</span></div>
            </div>

            <div className="detalhes-sigilosos">
              <CampoSigiloso label="CPF" valor={formatCpf(doador.cpf)} />
              <CampoSigiloso label="RG" valor={doador.rg} />
              <CampoSigiloso label="Cartão SUS" valor={doador.cartaoSus} />
            </div>

            {doador.viagens?.length > 0 && (
              <div className="detalhes-viagens">
                <span className="detalhes-label">Viagens vinculadas</span>
                <ul>
                  {doador.viagens.map((v) => (
                    <li key={v.id}>{formatDate(v.dataSaida)}</li>
                  ))}
                </ul>
              </div>
            )}

            {!confirmandoExclusao ? (
              <div className="detalhes-acoes">
                <button className="btn-perigo" onClick={() => setConfirmandoExclusao(true)}>
                  Excluir
                </button>
                <button className="btn-primario" onClick={() => onEditar(doador)}>
                  Editar
                </button>
              </div>
            ) : (
              <div className="detalhes-confirmacao">
                <p>Tem certeza que deseja excluir este doador?</p>
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

export default DoadorDetalhesModal