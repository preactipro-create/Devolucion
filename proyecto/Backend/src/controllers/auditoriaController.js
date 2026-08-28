const pool = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

// Cruza usuario_id con su tabla para no exponer IDs crudos al frontend.
// Para el nombre del acta afectada, se prefiere el snapshot congelado en
// detalle._contexto (guardado en el momento exacto de la acción); solo se
// usa el JOIN en vivo como respaldo para registros creados antes de este fix,
// que no tienen ese snapshot.
const obtenerAuditoria = asyncHandler(async (req, res) => {
  const query = `
    SELECT
      a.id,
      a.accion,
      a.fecha,
      a.detalle,
      u.username AS usuario,
      acta.responsable AS acta_responsable_actual,
      acta.nombre_equipo AS acta_nombre_equipo_actual
    FROM auditoria a
    LEFT JOIN usuarios u ON a.usuario_id = u.id
    LEFT JOIN actas_devolucion acta ON a.registro_id = acta.id
    ORDER BY a.fecha DESC
  `

  const { rows } = await pool.query(query)

  const resultado = rows.map((row) => {
    const detalleCompleto = row.detalle || {}
    const { _contexto, ...detalle } = detalleCompleto

    return {
      id: row.id,
      accion: row.accion,
      fecha: row.fecha,
      usuario: row.usuario,
      detalle,
      acta_responsable: _contexto?.responsable ?? row.acta_responsable_actual,
      nombre_equipo: _contexto?.nombre_equipo ?? row.acta_nombre_equipo_actual,
    }
  })

  res.json(resultado)
})

module.exports = { obtenerAuditoria }
