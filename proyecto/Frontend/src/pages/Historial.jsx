import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { listarActas } from '../services/api.js'

function Historial() {
  const { token } = useAuth()
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    setLoading(true)
    listarActas(token)
      .then((res) => {
        if (activo) setRegistros(res.data || [])
      })
      .catch((err) => {
        if (activo) setError(err.message || 'No se pudo cargar el historial')
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => {
      activo = false
    }
  }, [token])

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
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline text-on-surface font-label-bold text-label-bold rounded-DEFAULT hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar
          </button>
        </div>
      </div>

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
              {!loading && error && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-error">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && registros.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-on-surface-variant">
                    Aún no hay actas registradas.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
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
                          className="p-1.5 text-secondary hover:bg-secondary-container rounded-DEFAULT transition-colors"
                          title="Ver Detalle"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                        <button
                          className="p-1.5 text-on-surface hover:bg-surface-variant rounded-DEFAULT transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
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
    </div>
  )
}

export default Historial
