const registros = [
  {
    producto: 'Laptop Dell Latitude 5420',
    nombre: 'Emmanuel Reyes',
    fecha: '24 Oct, 2024',
  },
  {
    producto: 'Monitor LG 24"',
    nombre: 'Lucía Martínez',
    fecha: '23 Oct, 2024',
  },
  {
    producto: 'Mouse + Teclado Logitech',
    nombre: 'Carlos Gómez',
    fecha: '22 Oct, 2024',
  },
]

function Historial() {
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
              {registros.map((r) => (
                <tr
                  key={`${r.nombre}-${r.producto}`}
                  className="border-b border-outline-variant hover:bg-surface-blue transition-colors group"
                >
                  <td className="py-4 px-4 border-r border-outline-variant">
                    <div className="flex items-center gap-1.5 text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        assignment_return
                      </span>
                      <span>{r.producto}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 border-r border-outline-variant font-bold text-on-surface">
                    {r.nombre}
                  </td>
                  <td className="py-4 px-4 border-r border-outline-variant text-on-surface-variant whitespace-nowrap">
                    {r.fecha}
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

        {/* Pagination */}
        <div className="mt-auto px-4 py-3 bg-surface border-t border-outline-variant flex items-center justify-between">
          <span className="text-label-sm text-on-surface-variant">Mostrando 1-3 de 45 registros</span>
          <div className="flex gap-1">
            <button
              className="p-1.5 border border-outline-variant rounded-DEFAULT text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
              disabled
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-DEFAULT font-label-bold text-label-bold">
              1
            </button>
            <button className="px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-DEFAULT hover:bg-surface-container font-label-bold text-label-bold">
              2
            </button>
            <button className="px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-DEFAULT hover:bg-surface-container font-label-bold text-label-bold">
              3
            </button>
            <button className="p-1.5 border border-outline-variant rounded-DEFAULT text-on-surface-variant hover:bg-surface-container">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Historial
