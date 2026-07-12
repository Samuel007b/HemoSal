import { useState } from 'react'
import IconeOlho from './IconeOlho'

function CampoSigiloso({ label, valor }) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="campo-sigiloso">
      <span className="campo-sigiloso-label">{label}</span>
      <div className="campo-sigiloso-valor">
        <span>{visivel ? valor : '•'.repeat(9)}</span>
        <button
          type="button"
          className="campo-sigiloso-olho"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? `Ocultar ${label}` : `Mostrar ${label}`}
        >
          <IconeOlho aberto={!visivel} />
        </button>
      </div>
    </div>
  )
}

export default CampoSigiloso