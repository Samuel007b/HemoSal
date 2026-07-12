import './Spinner.css'

function Spinner({ escuro = false }) {
  return <span className={`spinner${escuro ? ' spinner-escuro' : ''}`} aria-label="Carregando" />
}

export default Spinner