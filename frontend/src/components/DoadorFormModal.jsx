import { useState } from 'react'
import { doadoresService } from '../services/api'
import { SEXO_OPCOES, TIPO_SANG_OPCOES } from '../utils/enums'
import { dateToInputValue, cpfValido } from '../utils/format'
import Spinner from './Spinner'
import './DoadorFormModal.css'

function valoresIniciais(doador) {
  return {
    cpf: doador?.cpf ?? '',
    rg: doador?.rg ?? '',
    cartaoSus: doador?.cartaoSus ?? '',
    nome: doador?.nome ?? '',
    dataNasc: dateToInputValue(doador?.dataNasc),
    sexo: doador?.sexo ?? 'M',
    tipoSang: doador?.tipoSang ?? 'O+',
    endereco: doador?.endereco ?? '',
  }
}

function DoadorFormModal({ modo, doador, onClose, onSuccess }) {
  const [form, setForm] = useState(valoresIniciais(doador))
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function handleChange(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    const algumCampoVazio = Object.values(form).some((v) => !v)
    if (algumCampoVazio) {
      setErro('Preencha todos os campos.')
      return
    }

    if (!cpfValido(form.cpf)) {
    setErro('O CPF deve conter 11 dígitos.')
      return
    }

    setCarregando(true)
    try {
      if (modo === 'criar') {
        await doadoresService.criar(form)
      } else {
        await doadoresService.atualizar(doador.id, form)
      }
      onSuccess()
    } catch (err) {
      if (err.response?.status === 409) {
        setErro('CPF, RG e/ou Cartão SUS já cadastrado(s).')
      } else if (err.response?.status === 400) {
        setErro(err.response.data?.erro ?? 'Dados inválidos.')
      } else {
        setErro('Não foi possível salvar. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={carregando ? undefined : onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <button className="modal-fechar" onClick={onClose} disabled={carregando}>×</button>
        <h2>{modo === 'criar' ? 'Cadastrar doador' : 'Editar doador'}</h2>

        <form onSubmit={handleSubmit} className="doador-form">
          <div className="doador-form-grid">
            <div>
              <label>Nome</label>
              <input value={form.nome} onChange={(e) => handleChange('nome', e.target.value)} />
            </div>
            <div>
              <label>Data de nascimento</label>
              <input type="date" value={form.dataNasc} onChange={(e) => handleChange('dataNasc', e.target.value)} />
            </div>
            <div>
              <label>CPF</label>
              <input value={form.cpf} onChange={(e) => handleChange('cpf', e.target.value)} placeholder="000.000.000-00" />
            </div>
            <div>
              <label>RG</label>
              <input value={form.rg} onChange={(e) => handleChange('rg', e.target.value)} />
            </div>
            <div>
              <label>Cartão SUS</label>
              <input value={form.cartaoSus} onChange={(e) => handleChange('cartaoSus', e.target.value)} />
            </div>
            <div>
              <label>Sexo</label>
              <select value={form.sexo} onChange={(e) => handleChange('sexo', e.target.value)}>
                {SEXO_OPCOES.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Tipo sanguíneo</label>
              <select value={form.tipoSang} onChange={(e) => handleChange('tipoSang', e.target.value)}>
                {TIPO_SANG_OPCOES.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div className="doador-form-full">
              <label>Endereço</label>
              <input value={form.endereco} onChange={(e) => handleChange('endereco', e.target.value)} />
            </div>
          </div>

          {erro && <p className="modal-erro">{erro}</p>}

          <div className="doador-form-acoes">
            <button type="button" className="btn-secundario" onClick={onClose} disabled={carregando}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario" disabled={carregando}>
              {carregando ? <Spinner /> : modo === 'criar' ? 'Criar' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DoadorFormModal