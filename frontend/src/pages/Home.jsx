import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAdminService } from '../services/api'
import { getAdminId } from '../utils/auth'
import AdminMenu from '../components/AdminMenu'
import './Home.css'

function Home() {
  const [admin, setAdmin] = useState(null)
  const navigate = useNavigate()

  const carregarAdmin = useCallback(() => {
    const id = getAdminId()
    if (!id) return
    userAdminService.buscarPorId(id).then(setAdmin).catch(() => {})
  }, [])

  useEffect(() => {
    carregarAdmin()
  }, [carregarAdmin])

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>HemoSal</h1>
        <AdminMenu admin={admin} onAtualizado={carregarAdmin} />
      </header>

      <main className="home-main">
        <button className="home-card" onClick={() => navigate('/doadores')}>
          <span className="home-card-titulo">Doadores</span>
          <span className="home-card-desc">Cadastrar, consultar e editar doadores</span>
        </button>

        <button className="home-card" onClick={() => navigate('/viagens')}>
          <span className="home-card-titulo">Viagens</span>
          <span className="home-card-desc">Cadastrar, consultar e editar viagens</span>
        </button>
      </main>
    </div>
  )
}

export default Home