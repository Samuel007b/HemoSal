import { useState } from 'react'
import IconeOlho from './IconeOlho'
import './CampoSenha.css'

function CampoSenha({ id, value, onChange, placeholder, autoComplete, autoFocus }) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="campo-senha">
      <input
        id={id}
        className="campo-senha-input"
        type={visivel ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
      <button
        type="button"
        className="campo-senha-olho"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        tabIndex={-1}
      >
        <IconeOlho aberto={!visivel} />
      </button>
    </div>
  )
}

export default CampoSenha