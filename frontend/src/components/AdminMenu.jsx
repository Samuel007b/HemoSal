import { useState } from 'react'
import { authService, userAdminService } from '../services/api'
import { logout } from '../utils/auth'
import CampoSenha from './CampoSenha'
import './AdminMenu.css'

function AdminMenu({ admin, onAtualizado }) {
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <div className="admin-menu">
      <button className="btn-secundario" onClick={() => setModalAberto(true)} disabled={!admin}>
        Alterar senha
      </button>
      <button className="admin-menu-sair" onClick={logout}>
        Sair
      </button>

      {modalAberto && (
        <EditarAdminModal
          admin={admin}
          onClose={() => setModalAberto(false)}
          onAtualizado={onAtualizado}
        />
      )}
    </div>
  )
}

function EditarAdminModal({ admin, onClose, onAtualizado }) {
  const [etapa, setEtapa] = useState('confirmar')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novoLogin, setNovoLogin] = useState(admin?.login ?? '')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  async function handleConfirmarSenha(e) {
    e.preventDefault()
    setErro('')
    if (!senhaAtual) {
      setErro('Digite sua senha atual.')
      return
    }
    setCarregando(true)
    try {
      await authService.login(admin.login, senhaAtual)
      setEtapa('editar')
    } catch {
      setErro('Senha incorreta.')
    } finally {
      setCarregando(false)
    }
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setErro('')
    if (!novoLogin || !novaSenha) {
      setErro('Preencha login e nova senha.')
      return
    }
    if (novaSenha !== confirmaSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    setCarregando(true)
    try {
      await userAdminService.atualizar(admin.id, { login: novoLogin, senha: novaSenha })
      setSucesso(true)
      onAtualizado()
      setTimeout(onClose, 1200)
    } catch (err) {
      if (err.response?.status === 409) {
        setErro('Esse login já está em uso.')
      } else {
        setErro('Não foi possível salvar. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-fechar" onClick={onClose}>×</button>

        {etapa === 'confirmar' && (
          <form onSubmit={handleConfirmarSenha} className="admin-menu-form">
            <h2>Confirme sua senha</h2>
            <p className="modal-subtitulo">Por segurança, digite sua senha atual para continuar.</p>
            <label htmlFor="senhaAtual">Senha atual</label>
            <CampoSenha id="senhaAtual" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} autoFocus />
            {erro && <p className="modal-erro">{erro}</p>}
            <button type="submit" className="btn-primario" disabled={carregando}>
              {carregando ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
        )}

        {etapa === 'editar' && !sucesso && (
          <form onSubmit={handleSalvar} className="admin-menu-form">
            <h2>Editar meus dados</h2>
            <label htmlFor="novoLogin">Login</label>
            <input id="novoLogin" type="text" value={novoLogin} onChange={(e) => setNovoLogin(e.target.value)} />
            <label htmlFor="novaSenha">Nova senha</label>
            <CampoSenha id="novaSenha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
            <label htmlFor="confirmaSenha">Confirmar nova senha</label>
            <CampoSenha id="confirmaSenha" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} />
            {erro && <p className="modal-erro">{erro}</p>}
            <button type="submit" className="btn-primario" disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </form>
        )}

        {sucesso && <p className="modal-sucesso">Dados atualizados com sucesso!</p>}
      </div>
    </div>
  )
}

export default AdminMenu