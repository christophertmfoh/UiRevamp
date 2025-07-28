import React from 'react'

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#0f0f23',
      color: '#ffffff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          ✅ FableCraft
        </h1>
        <p style={{ color: '#888', fontSize: '1.2rem' }}>
          Production-ready React architecture working!
        </p>
        <p style={{ color: '#4ade80', marginTop: '1rem' }}>
          Phase 6 refactor successful - Monorepo structure active
        </p>
      </div>
    </div>
  )
}

export default App