// src/pages/Profile.tsx
import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

export function Profile() {
  const { user } = useAuthContext()

  const [nombre,       setNombre]      = useState(user?.user_metadata?.nombre ?? '')
  const [currentPass,  setCurrentPass] = useState('')
  const [newPassword,  setNewPassword] = useState('')
  const [confirmPass,  setConfirmPass] = useState('')

  const [loadingNombre, setLoadingNombre] = useState(false)
  const [loadingPass,   setLoadingPass]   = useState(false)
  const [msgNombre,     setMsgNombre]     = useState<{ tipo: 'ok'|'err', texto: string } | null>(null)
  const [msgPass,       setMsgPass]       = useState<{ tipo: 'ok'|'err', texto: string } | null>(null)

  // ── Guardar nombre ──────────────────────────────────────────
  const handleSaveNombre = async () => {
    setLoadingNombre(true)
    setMsgNombre(null)
    const { error } = await supabase.auth.updateUser({ data: { nombre } })
    setMsgNombre(error
      ? { tipo: 'err', texto: error.message }
      : { tipo: 'ok',  texto: '✅ Nombre actualizado correctamente' }
    )
    setLoadingNombre(false)
  }

  // ── Cambiar contraseña ──────────────────────────────────────
  const handleSavePass = async () => {
    if (newPassword !== confirmPass) {
      setMsgPass({ tipo: 'err', texto: '❌ Las contraseñas nuevas no coinciden' })
      return
    }
    if (newPassword.length < 6) {
      setMsgPass({ tipo: 'err', texto: '❌ Mínimo 6 caracteres' })
      return
    }

    setLoadingPass(true)
    setMsgPass(null)

    // 1️⃣ Verificar contraseña actual haciendo un signIn
    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    user?.email ?? '',
      password: currentPass
    })

    if (authError) {
      setMsgPass({ tipo: 'err', texto: '❌ La contraseña actual es incorrecta' })
      setLoadingPass(false)
      return
    }

    // 2️⃣ Si es correcta, actualizar a la nueva
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setMsgPass(error
      ? { tipo: 'err', texto: error.message }
      : { tipo: 'ok',  texto: '✅ Contraseña actualizada correctamente' }
    )
    if (!error) {
      setCurrentPass('')
      setNewPassword('')
      setConfirmPass('')
    }
    setLoadingPass(false)
  }

  return (
    <div className="page" style={{ maxWidth: '600px' }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem',
        marginBottom:'2rem' }}>
        <div style={{ width:'60px', height:'60px', borderRadius:'50%',
          background:'linear-gradient(135deg, #2563eb, #60a5fa)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.5rem', color:'white', fontWeight:700, flexShrink:0 }}>
          {nombre ? nombre[0].toUpperCase() : '?'}
        </div>
        <div>
          <h1 style={{ margin:0, fontSize:'1.4rem' }}>{nombre || 'Sin nombre'}</h1>
          <p style={{ margin:0, fontSize:'0.875rem', color:'#94a3b8' }}>
            {user?.email}
          </p>
        </div>
      </div>

      {/* ── Información personal ── */}
      <div className="card" style={{ marginBottom:'1.25rem' }}>
        <h3 style={{ margin:'0 0 1.25rem' }}>👤 Información personal</h3>

        <div style={{ marginBottom:'1rem' }}>
          <label>Nombre</label>
          <input type="text" value={nombre} placeholder="Tu nombre"
            onChange={e => setNombre(e.target.value)} />
        </div>

        <div style={{ marginBottom:'1rem' }}>
          <label>Email</label>
          <input type="email" value={user?.email ?? ''} disabled
            style={{ opacity:0.6, cursor:'not-allowed' }} />
          <p style={{ margin:'0.35rem 0 0', fontSize:'0.78rem', color:'#94a3b8' }}>
            El email no se puede cambiar
          </p>
        </div>

        {msgNombre && (
          <div className={`alert ${msgNombre.tipo === 'ok' ? 'alert-success' : 'alert-error'}`}
            style={{ marginBottom:'1rem' }}>
            {msgNombre.texto}
          </div>
        )}

        <button className="btn-primary" onClick={handleSaveNombre}
          disabled={loadingNombre || !nombre.trim()}>
          {loadingNombre ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* ── Cambiar contraseña ── */}
      <div className="card">
        <h3 style={{ margin:'0 0 1.25rem' }}>🔒 Cambiar contraseña</h3>

        <div style={{ marginBottom:'1rem' }}>
          <label>Contraseña actual</label>
          <input type="password" value={currentPass}
            onChange={e => setCurrentPass(e.target.value)}
            placeholder="Ingresa tu contraseña actual" />
        </div>

        <hr className="divider" />

        <div style={{ marginBottom:'1rem' }}>
          <label>Nueva contraseña</label>
          <input type="password" value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres" />
        </div>

        <div style={{ marginBottom:'1rem' }}>
          <label>Confirmar nueva contraseña</label>
          <input type="password" value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
            placeholder="Repite la nueva contraseña" />
          {/* Indicador visual si coinciden */}
          {confirmPass && (
            <p style={{ margin:'0.35rem 0 0', fontSize:'0.78rem',
              color: newPassword === confirmPass ? '#16a34a' : '#ef4444' }}>
              {newPassword === confirmPass ? '✅ Las contraseñas coinciden' : '❌ No coinciden'}
            </p>
          )}
        </div>

        {msgPass && (
          <div className={`alert ${msgPass.tipo === 'ok' ? 'alert-success' : 'alert-error'}`}
            style={{ marginBottom:'1rem' }}>
            {msgPass.texto}
          </div>
        )}

        <button className="btn-primary" onClick={handleSavePass}
          disabled={loadingPass || !currentPass || !newPassword || !confirmPass}>
          {loadingPass ? 'Verificando...' : 'Cambiar contraseña'}
        </button>
      </div>

    </div>
  )
}