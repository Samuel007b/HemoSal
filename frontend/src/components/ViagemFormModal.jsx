import { useEffect, useMemo, useState } from 'react'
import { doadoresService, viagensService } from '../services/api'
import { combinarDataHora, separarDataHora, formatDateTime } from '../utils/viagem'
import { doadorDisponivel } from '../utils/disponibilidade'
import { filtrarDoadores, ordenarPorNome, TIPOS_BUSCA_DOADOR } from '../utils/buscaDoadores'
import Spinner from './Spinner'
import './ViagemFormModal.css'

function ViagemFormModal({ modo, viagem, onClose, onSuccess }) {
  const dataHoraInicial = separarDataHora(viagem?.dataSaida)

  const [etapa, setEtapa] = useState('dados') // 'dados' | 'doadores'
  const [data, setData] = useState(dataHoraInicial.data)
  const [hora, setHora] = useState(dataHoraInicial.hora)
  const [limiteVagas, setLimiteVagas] = useState(viagem?.limiteVagas ?? '')
  const [erroDados, setErroDados] = useState('')

  const [selecionados, setSelecionados] = useState(
    () => new Set((viagem?.doadores ?? []).map((d) => d.id))
  )
  const [doadores, setDoadores] = useState([])
  const [carregandoDoadores, setCarregandoDoadores] = useState(false)
  const [erroDoadores, setErroDoadores] = useState('')
  const [tipoBuscaDoador, setTipoBuscaDoador] = useState('nome')
  const [termoBuscaDoador, setTermoBuscaDoador] = useState('')

  const [salvando, setSalvando] = useState(false)
  const [erroSalvar, setErroSalvar] = useState('')

  useEffect(() => {
    if (etapa !== 'doadores' || doadores.length > 0) return
    setCarregandoDoadores(true)
    setErroDoadores('')
    doadoresService
      .listar()
      .then((lista) => setDoadores(Array.isArray(lista) ? lista : []))
      .catch(() => setErroDoadores('Não foi possível carregar os doadores.'))
      .finally(() => setCarregandoDoadores(false))
  }, [etapa, doadores.length])

  const dataReferenciaISO = useMemo(() => combinarDataHora(data, hora), [data, hora])
  const limiteNum = Number(limiteVagas)

  function handleContinuar(e) {
    e.preventDefault()
    setErroDados('')
    if (!data || !hora) {
      setErroDados('Informe a data e o horário da viagem.')
      return
    }
    if (!Number.isInteger(limiteNum) || limiteNum <= 0) {
      setErroDados('Informe um limite de vagas válido.')
      return
    }
    setEtapa('doadores')
  }

  function toggleDoador(id, bloqueado) {
    if (bloqueado) return
    setSelecionados((atual) => {
      const novo = new Set(atual)
      if (novo.has(id)) novo.delete(id)
      else novo.add(id)
      return novo
    })
  }

  const doadoresFiltrados = ordenarPorNome(filtrarDoadores(doadores, tipoBuscaDoador, termoBuscaDoador))

  async function handleSalvar() {
    setErroSalvar('')
    if (selecionados.size === 0) {
      setErroSalvar('Selecione ao menos um doador.')
      return
    }

    setSalvando(true)
    try {
      const payload = {
        dataSaida: dataReferenciaISO,
        limiteVagas: limiteNum,
        doadores: [...selecionados],
      }
      if (modo === 'criar') {
        await viagensService.criar(payload)
      } else {
        await viagensService.atualizar(viagem.id, payload)
      }
      onSuccess()
    } catch (err) {
      setErroSalvar(err.response?.data?.erro ?? 'Não foi possível salvar a viagem.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={salvando ? undefined : onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <button className="modal-fechar" onClick={onClose} disabled={salvando}>×</button>
        <h2>{modo === 'criar' ? 'Nova viagem' : 'Editar viagem'}</h2>

        {etapa === 'dados' && (
          <form onSubmit={handleContinuar} className="viagem-form-dados">
            <label>Data da viagem</label>
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} />

            <label>Horário</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              disabled={!data}
            />

            <label>Limite de vagas</label>
            <input
              type="number"
              min="1"
              value={limiteVagas}
              onChange={(e) => setLimiteVagas(e.target.value)}
            />

            {erroDados && <p className="modal-erro">{erroDados}</p>}

            <div className="viagem-form-acoes">
              <button type="button" className="btn-secundario" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primario">Continuar</button>
            </div>
          </form>
        )}

        {etapa === 'doadores' && (
          <div className="viagem-form-doadores">
            <div className="viagem-form-resumo">
              <span>{formatDateTime(dataReferenciaISO)}</span>
              <button type="button" className="btn-link" onClick={() => setEtapa('dados')}>
                alterar
              </button>
            </div>

            <div className="viagem-form-busca">
              <select value={tipoBuscaDoador} onChange={(e) => setTipoBuscaDoador(e.target.value)}>
                {TIPOS_BUSCA_DOADOR.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder={`Buscar por ${TIPOS_BUSCA_DOADOR.find((o) => o.value === tipoBuscaDoador)?.label.toLowerCase()}...`}
                value={termoBuscaDoador}
                onChange={(e) => setTermoBuscaDoador(e.target.value)}
              />
            </div>

            <div className="viagem-form-contador">
              Selecionados: {selecionados.size} / {limiteNum}
            </div>

            {carregandoDoadores && (
              <div className="modal-loading">
                <Spinner escuro />
                <span>Carregando doadores...</span>
              </div>
            )}
            {erroDoadores && <p className="modal-erro">{erroDoadores}</p>}

            {!carregandoDoadores && (
              <ul className="viagem-form-lista-doadores">
                {doadoresFiltrados.map((doador) => {
                  const disponivel = doadorDisponivel(
                    doador,
                    dataReferenciaISO,
                    modo === 'editar' ? viagem.id : null
                  )
                  const selecionado = selecionados.has(doador.id)
                  const limiteAtingido = !selecionado && selecionados.size >= limiteNum
                  const bloqueado = !disponivel || limiteAtingido

                  return (
                    <li
                      key={doador.id}
                      className={`viagem-doador-item ${bloqueado && !selecionado ? 'indisponivel' : ''}`}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={selecionado}
                          disabled={bloqueado}
                          onChange={() => toggleDoador(doador.id, bloqueado)}
                        />
                        <span className="viagem-doador-nome">{doador.nome}</span>
                        <span className="viagem-doador-tipo">{doador.tipoSang}</span>
                        {!disponivel && <span className="viagem-doador-badge">indisponível</span>}
                        {disponivel && limiteAtingido && (
                          <span className="viagem-doador-badge viagem-doador-badge-limite">
                            limite atingido
                          </span>
                        )}
                      </label>
                    </li>
                  )
                })}
                {doadoresFiltrados.length === 0 && (
                  <li className="viagem-doador-vazio">Nenhum doador encontrado.</li>
                )}
              </ul>
            )}

            {erroSalvar && <p className="modal-erro">{erroSalvar}</p>}

            <div className="viagem-form-acoes">
              <button type="button" className="btn-secundario" onClick={onClose} disabled={salvando}>
                Cancelar
              </button>
              <button type="button" className="btn-primario" onClick={handleSalvar} disabled={salvando}>
                {salvando ? <Spinner /> : modo === 'criar' ? 'Criar viagem' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViagemFormModal