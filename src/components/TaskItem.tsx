import { useState } from 'react'
import type { Tarea } from '../types/database'

interface Props {
  tarea: Tarea
  onActualizar: (id: string, completada: boolean) => Promise<void>
  onEliminar:   (id: string) => Promise<void>
  onEditar:     (id: string, titulo: string, descripcion: string) => Promise<void>
}

export function TaskItem({ tarea, onActualizar, onEliminar, onEditar }: Props) {
  const [eliminado,   setEliminado]   = useState(false)
  const [editando,    setEditando]    = useState(false)
  const [titulo,      setTitulo]      = useState(tarea.titulo)
  const [descripcion, setDescripcion] = useState(tarea.descripcion ?? '')
  const [guardando,   setGuardando]   = useState(false)

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar esta tarea?')) return
    setEliminado(true)
    await onEliminar(tarea.id)
  }

  const handleGuardar = async () => {
    if (!titulo.trim()) return
    setGuardando(true)
    await onEditar(tarea.id, titulo.trim(), descripcion.trim())
    setGuardando(false)
    setEditando(false)
  }

  const handleCancelar = () => {
    setTitulo(tarea.titulo)
    setDescripcion(tarea.descripcion ?? '')
    setEditando(false)
  }

  return (
    <div style={{ padding:'1rem', border:'1px solid #e2e8f0', borderRadius:'10px',
      marginBottom:'0.5rem', opacity: eliminado ? 0.5 : 1,
      background: tarea.completada ? '#f0fdf4' : 'white',
      transition: 'all 0.15s ease' }}>

      {editando ? (
        /* ── Modo edición ── */
        <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
          <input
            type="text"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Título de la tarea"
            autoFocus
          />
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            style={{ resize:'vertical' }}
          />
          <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end' }}>
            <button onClick={handleCancelar}
              style={{ padding:'0.4rem 0.9rem', borderRadius:'7px',
                border:'1px solid #e2e8f0', background:'white',
                cursor:'pointer', fontSize:'0.85rem', color:'#64748b' }}>
              Cancelar
            </button>
            <button onClick={handleGuardar}
              disabled={guardando || !titulo.trim()}
              className="btn-primary"
              style={{ padding:'0.4rem 0.9rem', fontSize:'0.85rem' }}>
              {guardando ? 'Guardando...' : '💾 Guardar'}
            </button>
          </div>
        </div>
      ) : (
        /* ── Modo visualización ── */
        <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
          <input type="checkbox" checked={tarea.completada ?? undefined}
            onChange={() => onActualizar(tarea.id, !tarea.completada)}
            style={{ width:'16px', height:'16px', cursor:'pointer', flexShrink:0 }} />

          <div style={{ flex:1 }}>
            <strong style={{
              textDecoration: tarea.completada ? 'line-through' : 'none',
              color: tarea.completada ? '#94a3b8' : '#1e293b' }}>
              {tarea.titulo}
            </strong>
            {tarea.descripcion && (
              <p style={{ margin:'0.2rem 0 0', color:'#64748b', fontSize:'0.875rem' }}>
                {tarea.descripcion}
              </p>
            )}
          </div>

          <div style={{ display:'flex', gap:'0.4rem', flexShrink:0 }}>
            <button onClick={() => setEditando(true)}
              style={{ padding:'0.35rem 0.75rem', borderRadius:'7px',
                border:'1px solid #e2e8f0', background:'white',
                cursor:'pointer', fontSize:'0.82rem', color:'#2563eb' }}>
              ✏️ Editar
            </button>
            <button onClick={handleEliminar} disabled={eliminado}
              style={{ padding:'0.35rem 0.75rem', borderRadius:'7px',
                border:'1px solid #fca5a5', background:'#fff5f5',
                cursor:'pointer', fontSize:'0.82rem', color:'#ef4444' }}>
              🗑️ Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}