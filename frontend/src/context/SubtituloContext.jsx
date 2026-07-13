import { createContext, useContext, useState } from 'react'

const SubtituloContext = createContext(null)

export function SubtituloProvider({ children }) {
  const [subtitulo, setSubtitulo] = useState('')
  return (
    <SubtituloContext.Provider value={{ subtitulo, setSubtitulo }}>
      {children}
    </SubtituloContext.Provider>
  )
}

export function useSubtitulo() {
  return useContext(SubtituloContext)
}