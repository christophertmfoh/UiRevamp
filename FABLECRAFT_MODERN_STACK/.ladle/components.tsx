import type { GlobalProvider } from '@ladle/react'
import '../src/index.css'
import '../src/shared/lib/theme/variables.css'

export const Provider: GlobalProvider = ({ children }) => {
  return <>{children}</>
}