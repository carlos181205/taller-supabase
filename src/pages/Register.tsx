// src/pages/Register.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export function Register() {
  const navigate  = useNavigate()
  const [nombre,   setNombre]   = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { nombre } }
    })
    if (error) setError(error.message)
    else navigate('/')
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>Crear cuenta</h2>
        <p className="subtitle">Completa los datos para registrarte</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom:'1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label>Nombre</label>
            <input type="text" placeholder="Tu nombre"
              value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div>
            <label>Correo electrónico</label>
            <input type="email" placeholder="correo@ejemplo.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Contraseña</label>
            <input type="password" placeholder="Mínimo 6 caracteres"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button
            className="btn-primary"
            onClick={handleRegister}
            disabled={loading || !email || !password || !nombre}
            style={{ marginTop:'0.5rem' }}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:'1.25rem',
          fontSize:'0.875rem', color:'#64748b' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}