import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { viagensService } from '../services/api'
import { formatDateTime } from '../utils/viagem'
import ViagemFormModal from '../components/ViagemFormModal'
import ViagemDetalhesModal from '../components/ViagemDetalhesModal'
import Spinner from '../components/Spinner'
import IconeOlho from '../components/IconeOlho'
import './Viagens.css'

const POR_PAGINA = 20

function Viagens() {
  const navigate = useNavigate()
  const [viagens, setViagens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [pagina, setPagina] = useState(1)

  const [detalheId, setDetalheId] = useState(null)
  const [formModal, setFormModal] = useState(null) // { modo: 'criar' } | { modo: 'editar', viagem }

  const carregarViagens = useCallback(() => {
    setCarregando(true)
    setErro('')
    viagensService
      .listar()
      .then((data) => setViagens(Array.isArray(data) ? data : []))
      .catch(() => setErro('Não foi possível carregar a lista de viagens.'))
      .finally(() => setCarregando(false))
  }, [])

  useEffect(() => {
    carregarViagens()
  }, [carregarViagens])

  // GET /viagens já vem ordenado por dataSaida desc no back — sem reordenar aqui
  const totalPaginas = Math.max(1, Math.ceil(viagens.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const viagensPagina = viagens.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

  function handleFormSuccess(voltarParaPrimeiraPagina) {
    setFormModal(null)
    if (voltarParaPrimeiraPagina) setPagina(1)
    carregarViagens()
  }

  return (
    <div className="viagens-page">
      <header className="viagens-header">
        <button className="btn-voltar" onClick={() => navigate('/')}>← Home</button>
        <h1>Viagens</h1>
        <button className="btn-primario" onClick={() => setFormModal({ modo: 'criar' })}>
          + Nova viagem
        </button>
      </header>

      <main className="viagens-main">
        {carregando && (
          <div className="viagens-loading">
            <Spinner escuro />
            <span>Carregando viagens...</span>
          </div>
        )}

        {erro && <p className="modal-erro">{erro}</p>}

        {!carregando && !erro && viagens.length === 0 && (
          <p className="viagens-vazio">Nenhuma viagem cadastrada ainda.</p>
        )}

        {!carregando && viagensPagina.length > 0 && (
          <>
            <table className="viagens-tabela">
              <thead>
                <tr>
                  <th>Data e horário</th>
                  <th>Doadores inseridos</th>
                  <th>Limite de vagas</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {viagensPagina.map((viagem) => (
                  <tr key={viagem.id}>
                    <td>{formatDateTime(viagem.dataSaida)}</td>
                    <td>{viagem.doadores.length}</td>
                    <td>{viagem.limiteVagas}</td>
                    <td>
                      <button className="btn-icone" onClick={() => setDetalheId(viagem.id)} aria-label="Ver detalhes da viagem">
                        <IconeOlho aberto />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="viagens-paginacao">
              <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={paginaAtual === 1}>
                Anterior
              </button>
              <span>Página {paginaAtual} de {totalPaginas}</span>
              <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas}>
                Próxima
              </button>
            </div>
          </>
        )}
      </main>

      {detalheId && (
        <ViagemDetalhesModal
          viagemId={detalheId}
          onClose={() => setDetalheId(null)}
          onEditar={(viagem) => {
            setDetalheId(null)
            setFormModal({ modo: 'editar', viagem })
          }}
          onExcluido={() => {
            setDetalheId(null)
            carregarViagens()
          }}
        />
      )}

      {formModal && (
        <ViagemFormModal
          modo={formModal.modo}
          viagem={formModal.viagem}
          onClose={() => setFormModal(null)}
          onSuccess={() => handleFormSuccess(formModal.modo === 'criar')}
        />
      )}
    </div>
  )
}

export default Viagens