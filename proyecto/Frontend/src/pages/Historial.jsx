import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  listarActas,
  obtenerActa,
  editarActa,
  eliminarActa,
  descargarPdfActa,
  reiniciarFirma,
} from '../services/api.js'

const CAMPOS_EDITABLES = [
  { key: 'fecha', label: 'Fecha', type: 'date' },
  { key: 'responsable', label: 'Responsable', type: 'text' },
  { key: 'departamento', label: 'Departamento', type: 'text' },
  { key: 'planta', label: 'Planta', type: 'text' },
  { key: 'marca', label: 'Marca', type: 'text' },
  { key: 'serie', label: 'No. de Serie', type: 'text' },
  { key: 'nombre_equipo', label: 'Nombre del Equipo', type: 'text' },
  { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
]

function ActaModal({ acta, modo, onClose, onGuardado }) {
  const { token } = useAuth()
  const [datos, setDatos] = useState(() => {
    const base = {}
    CAMPOS_EDITABLES.forEach((c) => {
      base[c.key] = acta[c.key]
        ? c.type === 'date'
          ? String(acta[c.key]).slice(0, 10)
          : acta[c.key]
        : ''
    })
    return base
  })
  const [password, setPassword] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [firmaEntregaUrl, setFirmaEntregaUrl] = useState(acta.firma_entrega_url || null)
  const [firmaRecibeUrl, setFirmaRecibeUrl] = useState(acta.firma_recibe_url || null)

  const soloLectura = modo === 'ver'

  async function handleReiniciarFirma(tipo) {
    const passwordReinicio = window.prompt('Ingresa tu contraseña para reiniciar esta firma:')
    if (!passwordReinicio) return
    try {
      await reiniciarFirma(token, acta.id, tipo, passwordReinicio)
      if (tipo === 'entrega') setFirmaEntregaUrl(null)
      else setFirmaRecibeUrl(null)
      onGuardado()
    } catch (err) {
      setError(err.message || 'No se pudo reiniciar la firma')
    }
  }

  async function handleGuardar(e) {
    e.preventDefault()
    if (!password) {
      setError('Ingresa tu contraseña para confirmar los cambios.')
      return
    }
    setGuardando(true)
    setError('')
    try {
      await editarActa(token, acta.id, { ...datos, password })
      onGuardado()
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo guardar el acta')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-lg shadow-lg border border-outline-variant max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
          <h3 className="font-headline-lg text-headline-lg text-primary">
            {soloLectura ? 'Detalle del Acta' : 'Editar Acta'}
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleGuardar} className="px-5 py-4 flex flex-col gap-stack-md">
          {CAMPOS_EDITABLES.map((campo) => (
            <div key={campo.key} className="flex flex-col gap-1">
              <label className="font-label-bold text-label-bold text-on-surface">{campo.label}</label>
              {campo.type === 'textarea' ? (
                <textarea
                  className="w-full bg-surface-bright border border-outline rounded px-3 py-2 font-body-md text-body-md text-on-surface disabled:opacity-60"
                  rows={3}
                  value={datos[campo.key]}
                  disabled={soloLectura}
                  onChange={(e) => setDatos((d) => ({ ...d, [campo.key]: e.target.value }))}
                />
              ) : (
                <input
                  type={campo.type}
                  className="w-full bg-surface-bright border border-outline rounded px-3 py-2 font-body-md text-body-md text-on-surface disabled:opacity-60"
                  value={datos[campo.key]}
                  disabled={soloLectura}
                  onChange={(e) => setDatos((d) => ({ ...d, [campo.key]: e.target.value }))}
                />
              )}
            </div>
          ))}

          <div className="flex flex-col gap-3 pt-2 border-t border-outline-variant">
            <p className="font-label-bold text-label-bold text-on-surface">Firmas</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { tipo: 'entrega', label: 'Quien Entrega', url: firmaEntregaUrl },
                { tipo: 'recibe', label: 'Quien Recibe', url: firmaRecibeUrl },
              ].map(({ tipo, label, url }) => (
                <div key={tipo} className="flex flex-col items-center gap-1 border border-outline-variant rounded p-2">
                  {url ? (
                    <img src={url} alt={`Firma ${label}`} className="h-16 object-contain" />
                  ) : (
                    <p className="font-label-sm text-label-sm text-on-surface-variant py-4">Sin firma</p>
                  )}
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
                  {url && (
                    <button
                      type="button"
                      onClick={() => handleReiniciarFirma(tipo)}
                      className="text-error font-label-sm text-label-sm underline"
                    >
                      Reiniciar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!soloLectura && (
            <div className="flex flex-col gap-1 pt-2 border-t border-outline-variant">
              <label className="font-label-bold text-label-bold text-on-surface">
                Tu contraseña (para confirmar el cambio)
              </label>
              <input
                type="password"
                className="w-full bg-surface-bright border border-outline rounded px-3 py-2 font-body-md text-body-md text-on-surface"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {error && (
            <p className="text-error font-label-sm text-label-sm bg-error-container/40 border border-error/30 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline text-on-surface-variant rounded font-label-bold text-label-bold hover:bg-surface-container-low"
            >
              Cerrar
            </button>
            {!soloLectura && (
              <button
                type="submit"
                disabled={guardando}
                className="px-4 py-2 bg-primary-container text-on-primary rounded font-label-bold text-label-bold hover:opacity-90 disabled:opacity-60"
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

function Historial() {
  const { token } = useAuth()
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // { acta, modo: 'ver' | 'editar' }
  const [descargandoId, setDescargandoId] = useState(null)

  function cargar() {
    setLoading(true)
    listarActas(token)
      .then((res) => setRegistros(res.data || []))
      .catch((err) => setError(err.message || 'No se pudo cargar el historial'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function abrirModal(id, modo) {
    setError('')
    try {
      const acta = await obtenerActa(token, id)
      setModal({ acta, modo })
    } catch (err) {
      setError(err.message || 'No se pudo cargar el acta')
    }
  }

  async function handleEliminar(id) {
    const password = window.prompt('Ingresa tu contraseña para confirmar la eliminación:')
    if (!password) return
    if (!window.confirm('¿Seguro que deseas eliminar esta acta? Esta acción no se puede deshacer.')) return

    try {
      await eliminarActa(token, id, password)
      cargar()
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el acta')
    }
  }

  async function handleDescargarPdf(id) {
    setDescargandoId(id)
    setError('')
    try {
      const blob = await descargarPdfActa(token, id)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (err) {
      setError(err.message || 'No se pudo generar el PDF')
    } finally {
      setDescargandoId(null)
    }
  }

  return (
    <div className="pt-4 md:pt-8 px-4 md:px-8 pb-8 w-full max-w-[1200px] mx-auto">
      {/* Header Section */}
      <div className="mb-stack-lg flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Historial de Actas</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Equipos y accesorios devueltos, por responsable y fecha.
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-stack-md text-error font-label-sm text-label-sm bg-error-container/40 border border-error/30 rounded px-3 py-2">
          {error}
        </p>
      )}

      {/* Search Toolbar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-stack-md mb-stack-lg shadow-sm">
        <div className="w-full relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-outline rounded-DEFAULT text-body-md focus:ring-1 focus:ring-secondary focus:border-secondary transition-all outline-none"
            placeholder="Buscar por nombre o producto..."
            type="text"
          />
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface-container-lowest border-t-4 border-t-primary border-l border-r border-b border-outline-variant rounded-b-DEFAULT shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-header-fill border-b border-outline-variant">
                <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface uppercase tracking-wider border-r border-outline-variant">
                  Producto
                </th>
                <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface uppercase tracking-wider border-r border-outline-variant">
                  Nombre
                </th>
                <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface uppercase tracking-wider border-r border-outline-variant">
                  Fecha
                </th>
                <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md">
              {loading && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-on-surface-variant">
                    Cargando...
                  </td>
                </tr>
              )}
              {!loading && registros.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-on-surface-variant">
                    Aún no hay actas registradas.
                  </td>
                </tr>
              )}
              {!loading &&
                registros.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-outline-variant hover:bg-surface-blue transition-colors group"
                  >
                    <td className="py-4 px-4 border-r border-outline-variant">
                      <div className="flex items-center gap-1.5 text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          assignment_return
                        </span>
                        <span>{r.nombre_equipo || r.marca || 'Sin especificar'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-r border-outline-variant font-bold text-on-surface">
                      {r.responsable}
                    </td>
                    <td className="py-4 px-4 border-r border-outline-variant text-on-surface-variant whitespace-nowrap">
                      {r.fecha ? new Date(r.fecha).toLocaleDateString('es-GT') : '-'}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDescargarPdf(r.id)}
                          disabled={descargandoId === r.id}
                          className="p-1.5 text-on-surface-variant hover:bg-surface-variant rounded-DEFAULT transition-colors disabled:opacity-50"
                          title="Descargar PDF"
                        >
                          <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                        </button>
                        <button
                          onClick={() => abrirModal(r.id, 'ver')}
                          className="p-1.5 text-secondary hover:bg-secondary-container rounded-DEFAULT transition-colors"
                          title="Ver Detalle"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                        <button
                          onClick={() => abrirModal(r.id, 'editar')}
                          className="p-1.5 text-on-surface hover:bg-surface-variant rounded-DEFAULT transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => handleEliminar(r.id)}
                          className="p-1.5 text-error hover:bg-error-container rounded-DEFAULT transition-colors"
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <ActaModal
          acta={modal.acta}
          modo={modal.modo}
          onClose={() => setModal(null)}
          onGuardado={cargar}
        />
      )}
    </div>
  )
}

export default Historial
