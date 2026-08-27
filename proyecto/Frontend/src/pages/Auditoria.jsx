const logs = [
  {
    fecha: '15 Nov 2024',
    hora: '14:32:01 UTC-6',
    iniciales: 'MR',
    usuario: 'Miguel Rojas',
    usuarioColor: 'bg-secondary-container text-on-secondary-container',
    accion: 'Editado',
    accionIcon: 'edit_document',
    accionClasses: 'bg-surface-container-low border-secondary text-secondary',
    registro: 'ACT-2024-8901',
  },
  {
    fecha: '15 Nov 2024',
    hora: '10:15:44 UTC-6',
    iniciales: 'SG',
    usuario: 'Sofia Garza',
    usuarioColor: 'bg-tertiary-container text-on-tertiary',
    accion: 'Creado',
    accionIcon: 'add_circle',
    accionClasses: 'bg-surface-container-highest border-primary text-primary',
    registro: 'ACT-2024-8902',
  },
  {
    fecha: '14 Nov 2024',
    hora: '18:05:12 UTC-6',
    iniciales: 'SYS',
    usuario: 'Sistema (Automático)',
    usuarioColor: 'bg-error-container text-on-error-container',
    usuarioTextClass: 'text-error',
    accion: 'Eliminado',
    accionIcon: 'delete',
    accionClasses: 'bg-error-container border-error text-error',
    registro: 'ACT-2024-8899',
  },
  {
    fecha: '14 Nov 2024',
    hora: '09:22:10 UTC-6',
    iniciales: 'MR',
    usuario: 'Miguel Rojas',
    usuarioColor: 'bg-secondary-container text-on-secondary-container',
    accion: 'Creado',
    accionIcon: 'add_circle',
    accionClasses: 'bg-surface-container-highest border-primary text-primary',
    registro: 'ACT-2024-8901',
  },
]

function Auditoria() {
  return (
    <>
      {/* Top App Bar for Desktop */}
      <div className="hidden md:flex justify-between items-center px-container-padding py-stack-md bg-surface border-b border-outline-variant">
        <div className="font-headline-lg text-headline-lg font-bold text-primary">Registro de Auditoría</div>
        <div className="flex items-center gap-stack-md">
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-bold text-label-bold">
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Exportar
          </button>
        </div>
      </div>

      {/* Scrollable Content Canvas */}
      <div className="flex-1 p-container-padding md:p-stack-lg bg-surface-bright">
        <div className="max-w-[896px] mx-auto flex flex-col gap-stack-lg">
          {/* Mobile Header Title */}
          <div className="md:hidden">
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary">Registro de Auditoría</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Monitoreo de actividades del sistema operativo.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-md shadow-sm border-t-4 border-t-primary">
            <div className="flex flex-col md:flex-row gap-stack-md items-end">
              <div className="flex-1 w-full">
                <label className="block font-label-bold text-label-bold text-on-surface-subtle mb-1 uppercase tracking-wide">
                  Rango de Fechas
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">
                    calendar_month
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-2 bg-surface border border-outline font-body-md text-on-surface rounded-DEFAULT focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                    placeholder="10 Nov 2024 - 15 Nov 2024"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <label className="block font-label-bold text-label-bold text-on-surface-subtle mb-1 uppercase tracking-wide">
                  Usuario / Operador
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">
                    person_search
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-2 bg-surface border border-outline font-body-md text-on-surface rounded-DEFAULT focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                    placeholder="Buscar operador..."
                    type="text"
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <label className="block font-label-bold text-label-bold text-on-surface-subtle mb-1 uppercase tracking-wide">
                  Tipo de Acción
                </label>
                <select className="w-full px-3 py-2 bg-surface border border-outline font-body-md text-on-surface rounded-DEFAULT focus:ring-1 focus:ring-secondary focus:border-secondary transition-all">
                  <option>Todas las acciones</option>
                  <option>Creación (Insert)</option>
                  <option>Edición (Update)</option>
                  <option>Eliminación (Delete)</option>
                </select>
              </div>
              <div>
                <button className="w-full md:w-auto px-4 py-2 bg-secondary text-on-secondary font-label-bold text-label-bold rounded-DEFAULT hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Filtrar
                </button>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-header-fill border-b border-outline-variant">
                    <th className="p-3 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                      Timestamp
                    </th>
                    <th className="p-3 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                      Usuario
                    </th>
                    <th className="p-3 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                      Acción
                    </th>
                    <th className="p-3 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                      Registro Objetivo (ID)
                    </th>
                    <th className="p-3 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-right">
                      Detalle
                    </th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-on-surface divide-y divide-outline-variant">
                  {logs.map((log, i) => (
                    <tr key={i} className="hover:bg-surface-blue transition-colors group">
                      <td className="p-3 whitespace-nowrap font-label-sm text-on-surface-subtle">
                        <div className="font-body-md text-on-surface">{log.fecha}</div>
                        <div>{log.hora}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-label-bold text-[10px] ${log.usuarioColor}`}
                          >
                            {log.iniciales}
                          </div>
                          <span className={`font-medium ${log.usuarioTextClass || ''}`}>{log.usuario}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 border font-label-sm rounded uppercase ${log.accionClasses}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">{log.accionIcon}</span>
                          {log.accion}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-sm text-primary">{log.registro}</td>
                      <td className="p-3 text-right">
                        <button className="text-on-surface-variant hover:text-secondary group-hover:opacity-100 opacity-50 transition-all">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-surface-container px-3 py-2 border-t border-outline-variant flex justify-between items-center">
              <span className="font-label-sm text-on-surface-subtle">Mostrando 1-4 de 248 registros</span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="font-label-bold text-primary px-2">1</span>
                <button className="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Auditoria
