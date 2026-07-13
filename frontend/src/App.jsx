import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Doadores from './pages/Doadores'
import Viagens from './pages/Viagens'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/doadores" replace />} />
          <Route path="doadores" element={<Doadores />} />
          <Route path="viagens" element={<Viagens />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App