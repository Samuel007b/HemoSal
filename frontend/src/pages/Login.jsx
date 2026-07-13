import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import CampoSenha from '../components/CampoSenha'
import IconGota from '../components/IconGota'
import './Login.css'

function Login() {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (!login || !senha) {
      setErro('Preencha login e senha.')
      return
    }
    setCarregando(true)
    try {
      const { token } = await authService.login(login, senha)
      localStorage.setItem('token', token)
      navigate('/', { replace: true })
    } catch (err) {
      if (err.response?.status === 401) {
        setErro('Login e/ou senha incorreto(s).')
      } else {
        setErro('Não foi possível entrar. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="login-icone"><IconGota size={22} /></span>
        <h1>HemoSal</h1>
        <p className="login-subtitle">Controle de doadores de sangue</p>

        <label htmlFor="login">Login</label>
        <input id="login" type="text" value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" autoFocus />

        <label htmlFor="senha">Senha</label>
        <CampoSenha id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" />

        {erro && <p className="login-erro">{erro}</p>}

        <button type="submit" className="btn-primario" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

export default Login