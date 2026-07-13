import { useEffect, useState, useCallback } from 'react'
import { doadoresService } from '../services/api'
import { maskCpf, formatDate } from '../utils/format'
import { filtrarDoadores, ordenarPorNome, TIPOS_BUSCA_DOADOR } from '../utils/buscaDoadores'
import { TIPO_SANG_OPCOES } from '../utils/enums'
import { useSubtitulo } from '../context/SubtituloContext'
import DoadorFormModal from '../components/DoadorFormModal'
import DoadorDetalhesModal from '../components/DoadorDetalhesModal'
import IconeOlho from '../components/IconeOlho'
import Spinner from '../components/Spinner'
import './Doadores.css'

const POR_PAGINA = 20

function IconeBusca(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function Doadores() {
  const { setSubtitulo } = useSubtitulo()
  const [doadores, setDoadores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [pagina, setPagina] = useState(1)

  const [tipoBusca, setTipoBusca] = useState('nome')
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [somenteAptos, setSomenteAptos] = useState(false)

  const [detalheId, setDetalheId] = useState(null)
  const [formModal, setFormModal] = useState(null)

  const carregarDoadores = useCallback(() => {
    setCarregando(true)
    setErro('')
    doadoresService
      .listar()
      .then((data) => setDoadores(Array.isArray(data) ? data : []))
      .catch(() => setErro('Não foi possível carregar a lista de doadores.'))
      .finally(() => setCarregando(false))
  }, [])

  useEffect(() => { carregarDoadores() }, [carregarDoadores])
  useEffect(() => { setPagina(1) }, [tipoBusca, termoBusca, filtroTipo, somenteAptos])

  useEffect(() => {
    const total = doadores.length
    setSubtitulo(`${total} doador${total === 1 ? '' : 'es'} cadastrado${total === 1 ? '' : 's'}`)
  }, [doadores.length, setSubtitulo])

  let listaFiltrada = filtrarDoadores(doadores, tipoBusca, termoBusca)
  if (filtroTipo) listaFiltrada = listaFiltrada.filter((d) => d.tipoSang === filtroTipo)
  if (somenteAptos) listaFiltrada = listaFiltrada.filter((d) => d.disponivel)
  const doadoresOrdenados = ordenarPorNome(listaFiltrada)

  const totalPaginas = Math.max(1, Math.ceil(doadoresOrdenados.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const doadoresPagina = doadoresOrdenados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

  function handleFormSuccess(voltarParaPrimeiraPagina) {
    setFormModal(null)
    if (voltarParaPrimeiraPagina) setPagina(1)
    carregarDoadores()
  }

  const labelBuscaAtual = TIPOS_BUSCA_DOADOR.find((op) => op.value === tipoBusca)?.label ?? ''

  return (
    <div className="doadores-conteudo">
      {!carregando && !erro && (
        <div className="doadores-filtros">
          <div className="doadores-busca-linha">
            <select value={tipoBusca} onChange={(e) => setTipoBusca(e.target.value)}>
              {TIPOS_BUSCA_DOADOR.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            <div className="doadores-busca-input">
              <IconeBusca />
              <input
                type="text"
                placeholder={`Buscar por ${labelBuscaAtual.toLowerCase()}...`}
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
          </div>

          <select className="doadores-filtro-tipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="">Todos os tipos</option>
            {TIPO_SANG_OPCOES.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>

          <div className="doadores-linha-acoes">
            <label className="doadores-checkbox">
              <input type="checkbox" checked={somenteAptos} onChange={(e) => setSomenteAptos(e.target.checked)} />
              Somente aptos
            </label>
            <button className="btn-primario" onClick={() => setFormModal({ modo: 'criar' })}>
              + Novo doador
            </button>
          </div>
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
          {termoBusca || filtroTipo || somenteAptos ? 'Nenhum doador encontrado para esse filtro.' : 'Nenhum doador cadastrado ainda.'}
        </p>
      )}

      {!carregando && doadoresPagina.length > 0 && (
        <>
          <table className="doadores-tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Sexo</th>
                <th>Nascimento</th>
                <th>Tipo</th>
                <th>Aptidão</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {doadoresPagina.map((doador) => (
                <tr key={doador.id}>
                  <td>{doador.nome}</td>
                  <td>{maskCpf(doador.cpf)}</td>
                  <td>{doador.sexo}</td>
                  <td>{formatDate(doador.dataNasc)}</td>
                  <td><span className="badge-tipo">{doador.tipoSang}</span></td>
                  <td>
                    <span className={`badge-aptidao ${doador.disponivel ? 'apto' : 'indisponivel'}`}>
                      {doador.disponivel ? 'Apto' : 'Indisponível'}
                    </span>
                  </td>
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
            <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={paginaAtual === 1}>Anterior</button>
            <span>Página {paginaAtual} de {totalPaginas}</span>
            <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas}>Próxima</button>
          </div>
        </>
      )}

      {detalheId && (
        <DoadorDetalhesModal
          doadorId={detalheId}
          onClose={() => setDetalheId(null)}
          onEditar={(doador) => { setDetalheId(null); setFormModal({ modo: 'editar', doador }) }}
          onExcluido={() => { setDetalheId(null); carregarDoadores() }}
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