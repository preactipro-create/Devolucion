const pool = require('../config/db')

// Helper interno que se inyecta directamente en las transacciones de las
// actas: si se le pasa el client transaccional de la ruta, un fallo aquí
// revierte también el cambio del CRUD (o viceversa). Si no hay client
// (ej. eliminarActa, que no abre transacción explícita), usa el pool directo.
async function registrarAuditoria({ client, usuarioId, accion, registroId, detalle }) {
  const db = client || pool

  const query = `
    INSERT INTO auditoria (usuario_id, accion, registro_id, detalle)
    VALUES ($1, $2, $3, $4)
  `

  const valores = [
    usuarioId,
    accion,
    registroId,
    detalle ? JSON.stringify(detalle) : null,
  ]

  await db.query(query, valores)
}

module.exports = { registrarAuditoria }
