import React, { useContext, useState } from "react"

const TransposeContext = React.createContext({
  semitones: 0,
  reset: () => null,
  increment: () => null,
  decrement: () => null,
  setValue: (value) => null,
})

export function TransposeProvider({ children }) {
  const [semitones, setSemitones] = useState(0)
  const reset = () => setSemitones(0)
  const setValue = (value) => setSemitones(value)
  const increment = () => setSemitones((semitones + 1) % 12)
  const decrement = () => setSemitones((semitones - 1) % 12)
  return (
    <TransposeContext.Provider
      value={{ semitones, reset, increment, decrement, setValue }}
    >
      {children}
    </TransposeContext.Provider>
  )
}

export const useTransposeContext = () => useContext(TransposeContext)