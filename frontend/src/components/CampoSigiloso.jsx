import { useState } from 'react'

function CampoSigiloso({ label, valor }) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="campo-sigiloso">
      <span className="campo-sigiloso-label">{label}</span>
      <div className="campo-sigiloso-valor">
        <span>{visivel ? valor : '•'.repeat(9)}</span>
        <button type="button" onClick={() => setVisivel((v) => !v)}>
          {visivel ? 'ocultar' : 'mostrar'}
        </button>
      </div>
    </div>
  )
}

export default CampoSigiloso