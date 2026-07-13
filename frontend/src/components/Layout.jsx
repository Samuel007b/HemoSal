import { Outlet } from 'react-router-dom'
import { SubtituloProvider } from '../context/SubtituloContext'
import Header from './Header'
import Sidebar from './Sidebar'
import './Layout.css'

function Layout() {
  return (
    <SubtituloProvider>
      <div className="app-shell">
        <Header />
        <div className="app-body">
          <Sidebar />
          <main className="app-content">
            <Outlet />
          </main>
        </div>
      </div>
    </SubtituloProvider>
  )
}

export default Layout