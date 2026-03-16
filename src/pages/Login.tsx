import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function Login() {
  const { signIn } = useAuthContext()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

// En Login.tsx reemplaza el return por:
return (
  <div className="auth-page">
    <div className="auth-card">
      <h2>Iniciar sesión</h2>
      <p className="subtitle">Bienvenido de nuevo</p>

      {error && (
        <div className="alert alert-error" style={{ marginBottom:'1rem' }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ gap:'1rem' }}>
        <div>
          <label>Correo electrónico</label>
          <input type="email" placeholder="correo@ejemplo.com"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" placeholder="Tu contraseña"
            value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary"
          disabled={loading} style={{ marginTop:'0.5rem' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

<p style={{ textAlign:'right', margin:'-0.0rem 0 0.5rem',
  fontSize:'0.82rem' }}>
  <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
</p>
      <p style={{ textAlign:'center', marginTop:'1.25rem',
        fontSize:'0.875rem', color:'#64748b' }}>
        ¿No tienes cuenta?{' '}
        <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  </div>
)
}