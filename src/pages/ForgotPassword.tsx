// src/pages/ForgotPassword.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [msg,     setMsg]     = useState<{ tipo: 'ok'|'err', texto: string } | null>(null)

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    setMsg(error
      ? { tipo: 'err', texto: error.message }
      : { tipo: 'ok',  texto: '📧 Revisa tu correo, te enviamos un enlace para restablecer tu contraseña.' }
    )
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>¿Olvidaste tu contraseña?</h2>
        <p className="subtitle">
          Ingresa tu email y te enviaremos un enlace para restablecerla.
        </p>

        {msg && (
          <div className={`alert ${msg.tipo === 'ok' ? 'alert-success' : 'alert-error'}`}
            style={{ marginBottom:'1rem' }}>
            {msg.texto}
          </div>
        )}

        {/* Si el correo fue enviado, no mostrar el form */}
        {msg?.tipo !== 'ok' && (
          <>
            <div style={{ marginBottom:'1rem' }}>
              <label>Correo electrónico</label>
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com" />
            </div>

            <button className="btn-primary" onClick={handleSubmit}
              disabled={loading || !email}
              style={{ width:'100%' }}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </>
        )}

        <p style={{ textAlign:'center', marginTop:'1.25rem',
          fontSize:'0.875rem', color:'#64748b' }}>
          <Link to="/login">← Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  )
}