const pool = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

// Cruza usuario_id y registro_id con sus tablas para evitar exponer UUIDs
// crudos al frontend del administrador.
const obtenerAuditoria = asyncHandler(async (req, res) => {
  const query = `
    SELECT
      a.id,
      a.accion,
      a.fecha,
      a.detalle,
      u.username AS usuario,
      acta.responsable AS acta_responsable,
      acta.nombre_equipo
    FROM auditoria a
    LEFT JOIN usuarios u ON a.usuario_id = u.id
    LEFT JOIN actas_devolucion acta ON a.registro_id = acta.id
    ORDER BY a.fecha DESC
  `

  const { rows } = await pool.query(query)
  res.json(rows)
})

module.exports = { obtenerAuditoria }
