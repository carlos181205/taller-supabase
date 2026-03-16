// src/pages/ResetPassword.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export function ResetPassword() {
  const navigate = useNavigate()
  const [newPassword,  setNewPassword]  = useState('')
  const [confirmPass,  setConfirmPass]  = useState('')
  const [loading,      setLoading]      = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'ok'|'err', texto: string } | null>(null)
  const [sessionReady, setSessionReady] = useState(false)

  // Supabase inyecta la sesión en la URL al hacer clic en el enlace del email
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setSessionReady(true)
    })
  }, [])

  const handleReset = async () => {
    if (newPassword !== confirmPass) {
      setMsg({ tipo: 'err', texto: '❌ Las contraseñas no coinciden' })
      return
    }
    if (newPassword.length < 6) {
      setMsg({ tipo: 'err', texto: '❌ Mínimo 6 caracteres' })
      return
    }

    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setMsg({ tipo: 'err', texto: error.message })
    } else {
      setMsg({ tipo: 'ok', texto: '✅ Contraseña restablecida correctamente' })
      setTimeout(() => navigate('/login'), 2000)
    }
    setLoading(false)
  }

  // Si la sesión no está lista aún (token no procesado)
  if (!sessionReady) return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Verificando enlace...</h2>
        <p className="subtitle">
          Si llegaste aquí desde tu correo, espera un momento.
          Si no, solicita un nuevo enlace.
        </p>
        <a href="/forgot-password" className="btn-primary"
          style={{ display:'block', textAlign:'center', marginTop:'1rem' }}>
          Solicitar nuevo enlace
        </a>
      </div>
    </div>
  )

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Nueva contraseña</h2>
        <p className="subtitle">Elige una contraseña segura.</p>

        {msg && (
          <div className={`alert ${msg.tipo === 'ok' ? 'alert-success' : 'alert-error'}`}
            style={{ marginBottom:'1rem' }}>
            {msg.texto}
          </div>
        )}

        <div style={{ marginBottom:'1rem' }}>
          <label>Nueva contraseña</label>
          <input type="password" value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres" />
        </div>

        <div style={{ marginBottom:'1rem' }}>
          <label>Confirmar contraseña</label>
          <input type="password" value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
            placeholder="Repite la contraseña" />
          {confirmPass && (
            <p style={{ margin:'0.35rem 0 0', fontSize:'0.78rem',
              color: newPassword === confirmPass ? '#16a34a' : '#ef4444' }}>
              {newPassword === confirmPass ? '✅ Coinciden' : '❌ No coinciden'}
            </p>
          )}
        </div>

        <button className="btn-primary" onClick={handleReset}
          disabled={loading || !newPassword || !confirmPass}
          style={{ width:'100%' }}>
          {loading ? 'Guardando...' : 'Restablecer contraseña'}
        </button>
      </div>
    </div>
  )
}