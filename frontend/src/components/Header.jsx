import { useEffect, useState, useCallback } from 'react'
import { userAdminService } from '../services/api'
import { getAdminId } from '../utils/auth'
import { useSubtitulo } from '../context/SubtituloContext'
import IconGota from './IconGota'
import AdminMenu from './AdminMenu'
import './Header.css'

function Header() {
  const [admin, setAdmin] = useState(null)
  const { subtitulo } = useSubtitulo()

  const carregarAdmin = useCallback(() => {
    const id = getAdminId()
    if (!id) return
    userAdminService.buscarPorId(id).then(setAdmin).catch(() => {})
  }, [])

  useEffect(() => {
    carregarAdmin()
  }, [carregarAdmin])

  return (
    <header className="app-header">
      <div className="app-header-titulo">
        <span className="app-header-icone"><IconGota size={20} /></span>
        <div>
          <h1>HemoSal</h1>
          <p>{subtitulo}</p>
        </div>
      </div>
      <AdminMenu admin={admin} onAtualizado={carregarAdmin} />
    </header>
  )
}

export default Header