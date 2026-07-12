import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { doadoresService } from '../services/api'
import { maskCpf, formatDate } from '../utils/format'
import { filtrarDoadores, ordenarPorNome, TIPOS_BUSCA_DOADOR } from '../utils/buscaDoadores'
import DoadorFormModal from '../components/DoadorFormModal'
import DoadorDetalhesModal from '../components/DoadorDetalhesModal'
import Spinner from '../components/Spinner'
import IconeOlho from '../components/IconeOlho'
import './Doadores.css'

const POR_PAGINA = 20

function Doadores() {
  const navigate = useNavigate()
  const [doadores, setDoadores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [pagina, setPagina] = useState(1)

  const [tipoBusca, setTipoBusca] = useState('nome')
  const [termoBusca, setTermoBusca] = useState('')

  const [detalheId, setDetalheId] = useState(null)
  const [formModal, setFormModal] = useState(null) // { modo: 'criar' } | { modo: 'editar', doador }

  const carregarDoadores = useCallback(() => {
    setCarregando(true)
    setErro('')
    doadoresService
      .listar()
      .then((data) => setDoadores(Array.isArray(data) ? data : []))
      .catch(() => setErro('Não foi possível carregar a lista de doadores.'))
      .finally(() => setCarregando(false))
  }, [])

  useEffect(() => {
    carregarDoadores()
  }, [carregarDoadores])

  // volta pra primeira página sempre que o tipo ou o termo de busca mudam
  useEffect(() => {
    setPagina(1)
  }, [tipoBusca, termoBusca])

  const doadoresOrdenados = ordenarPorNome(filtrarDoadores(doadores, tipoBusca, termoBusca))
  const totalPaginas = Math.max(1, Math.ceil(doadoresOrdenados.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const doadoresPagina = doadoresOrdenados.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA
  )

  function handleFormSuccess(voltarParaPrimeiraPagina) {
    setFormModal(null)
    if (voltarParaPrimeiraPagina) setPagina(1)
    carregarDoadores()
  }

  const labelBuscaAtual = TIPOS_BUSCA_DOADOR.find((op) => op.value === tipoBusca)?.label ?? ''

  return (
    <div className="doadores-page">
      <header className="doadores-header">
        <button className="btn-voltar" onClick={() => navigate('/')}>← Home</button>
        <h1>Doadores</h1>
        <button className="btn-primario" onClick={() => setFormModal({ modo: 'criar' })}>
          + Novo doador
        </button>
      </header>

      <main className="doadores-main">
        {!carregando && !erro && (
          <div className="doadores-busca">
            <select value={tipoBusca} onChange={(e) => setTipoBusca(e.target.value)}>
              {TIPOS_BUSCA_DOADOR.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder={`Buscar por ${labelBuscaAtual.toLowerCase()}...`}
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            {termoBusca && (
              <button type="button" className="btn-secundario" onClick={() => setTermoBusca('')}>
                Limpar
              </button>
            )}
          </div>
        )}

        {carregando && (
          <div className="doadores-loading">
            <Spinner escuro />
            <span>Carregando doadores...</span>
          </div>
        )}

        {erro && <p className="modal-erro">{erro}</p>}

        {!carregando && !erro && doadoresOrdenados.length === 0 && (
          <p className="doadores-vazio">
            {termoBusca ? 'Nenhum doador encontrado para essa busca.' : 'Nenhum doador cadastrado ainda.'}
          </p>
        )}

        {!carregando && doadoresPagina.length > 0 && (
          <>
            <table className="doadores-tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Tipo sanguíneo</th>
                  <th>Sexo</th>
                  <th>Data de nascimento</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {doadoresPagina.map((doador) => (
                  <tr key={doador.id}>
                    <td>{doador.nome}</td>
                    <td>{maskCpf(doador.cpf)}</td>
                    <td>{doador.tipoSang}</td>
                    <td>{doador.sexo}</td>
                    <td>{formatDate(doador.dataNasc)}</td>
                    <td>
                      <button className="btn-icone" onClick={() => setDetalheId(doador.id)} aria-label="Ver detalhes do doador">
                        <IconeOlho aberto />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="doadores-paginacao">
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
        <DoadorDetalhesModal
          doadorId={detalheId}
          onClose={() => setDetalheId(null)}
          onEditar={(doador) => {
            setDetalheId(null)
            setFormModal({ modo: 'editar', doador })
          }}
          onExcluido={() => {
            setDetalheId(null)
            carregarDoadores()
          }}
        />
      )}

      {formModal && (
        <DoadorFormModal
          modo={formModal.modo}
          doador={formModal.doador}
          onClose={() => setFormModal(null)}
          onSuccess={() => handleFormSuccess(formModal.modo === 'criar')}
        />
      )}
    </div>
  )
}

export default Doadores