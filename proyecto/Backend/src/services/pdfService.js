const { PDFDocument, rgb, StandardFonts } = require('pdf-lib')

/**
 * Función principal para seleccionar el formato según el acta ('una_hoja' vs 'dos_hojas')
 */
async function generarPdfActa(acta) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const esUnaHoja = acta.modalidad === 'una_hoja' || acta.modalidad === '1_pagina'

  if (esUnaHoja) {
    await construirPaginaUnaHoja(pdfDoc, acta, font, fontBold)
  } else {
    await construirPaginasDosHojas(pdfDoc, acta, font, fontBold)
  }

  return pdfDoc.save()
}

// --- AUXILIARES DE DIBUJO Y ESTRUCTURA --- //

function dibujarEncabezado(page, font, fontBold, paginaTexto, fechaVigencia = 'Enero 2026') {
  const { width } = page.getSize()
  const topY = 750

  // Cuadro Exterior del Encabezado
  page.drawRectangle({
    x: 40, y: topY - 50, width: width - 80, height: 60,
    borderColor: rgb(0, 0, 0), borderWidth: 1,
  })

  // Divisiones internas del encabezado
  page.drawLine({ start: { x: 200, y: topY + 10 }, end: { x: 200, y: topY - 50 }, strokeWidth: 1 })
  page.drawLine({ start: { x: 380, y: topY + 10 }, end: { x: 380, y: topY - 50 }, strokeWidth: 1 })

  // Columna 1: Título Departamento
  page.drawText('DEPARTAMENTO DE TECNOLOGIA DE', { x: 45, y: topY - 5, size: 7, font: fontBold })
  page.drawText('INFORMACION Y COMUNICACION (TIC)', { x: 45, y: topY - 15, size: 7, font: fontBold })
  page.drawText('Fecha de Emisión: Enero 2025', { x: 45, y: topY - 32, size: 6.5, font })
  page.drawText(`Fecha de Vigencia: ${fechaVigencia}`, { x: 45, y: topY - 42, size: 6.5, font })

  // Columna 2: Procedimiento
  page.drawText('PROCEDIMIENTO', { x: 250, y: topY - 5, size: 8, font: fontBold })
  page.drawText('HOJA DE DEVOLUCION DE EQUIPO', { x: 215, y: topY - 30, size: 7.5, font: fontBold })

  // Columna 3: Código y Páginas
  page.drawText('CODIGO: DEVOLUCION DE EQUIPO', { x: 385, y: topY - 5, size: 7, font: fontBold })
  page.drawText('Edición: No.01', { x: 430, y: topY - 25, size: 7, font })
  page.drawText(`Página ${paginaTexto}`, { x: 435, y: topY - 40, size: 7, font })
}

function dibujarDatosUsuario(page, acta, font, fontBold, startY) {
  let y = startY

  page.drawText('DATOS DEL USUARIO', { x: 230, y, size: 10, font: fontBold })
  y -= 20

  const datos = [
    { label: 'FECHA:', val: acta.fecha ? new Date(acta.fecha).toLocaleDateString('es-GT') : '' },
    { label: 'RESPONSABLE:', val: acta.responsable || '' },
    { label: 'DEPARTAMENTO:', val: acta.departamento || '' },
    { label: 'PUESTO:', val: acta.puesto || '' },
    { label: 'RECIBI DE:', val: 'AGROINDUSTRIA LEGUMEX, S.A.' },
  ]

  datos.forEach((d) => {
    page.drawText(d.label, { x: 40, y, size: 8, font: fontBold })
    page.drawText(d.val, { x: 140, y, size: 8, font })
    page.drawLine({ start: { x: 135, y: y - 2 }, end: { x: 550, y: y - 2 }, strokeWidth: 0.5 })
    y -= 16
  })

  // Planta Checkboxes
  page.drawText('PLANTA:', { x: 40, y, size: 8, font: fontBold })
  const tejarChecked = (acta.planta || '').toLowerCase().includes('tejar') ? '[X]' : '[  ]'
  const parramosChecked = (acta.planta || '').toLowerCase().includes('parramos') ? '[X]' : '[  ]'

  page.drawText(`${tejarChecked} Tejar`, { x: 140, y, size: 8, font })
  page.drawText(`${parramosChecked} Parramos`, { x: 240, y, size: 8, font })

  return y - 25
}

function dibujarTablaAccesorios(page, accesorios = [], font, fontBold, startY) {
  let y = startY
  const colX = [40, 70, 180, 280, 380, 470]

  // Encabezados de tabla
  page.drawRectangle({ x: 40, y: y - 15, width: 510, height: 18, color: rgb(0.9, 0.9, 0.9), borderWidth: 1 })
  const headers = ['NO.', 'ARTICULO', 'MARCA', 'MODELO', 'SERIE', 'NUEVO/USADO']

  headers.forEach((h, idx) => {
    page.drawText(h, { x: colX[idx] + 2, y: y - 11, size: 7, font: fontBold })
  })

  y -= 15
  const maxFilas = 8

  for (let i = 0; i < maxFilas; i++) {
    const item = accesorios[i] || {}
    y -= 16
    page.drawRectangle({ x: 40, y, width: 510, height: 16, borderWidth: 0.5 })

    // Dibujar divisiones verticales
    colX.forEach((xPos) => {
      page.drawLine({ start: { x: xPos, y }, end: { x: xPos, y: y + 16 }, strokeWidth: 0.5 })
    })

    page.drawText(`${i + 1}`, { x: colX[0] + 5, y: y + 4, size: 7, font })
    page.drawText(item.articulo || '', { x: colX[1] + 3, y: y + 4, size: 7, font })
    page.drawText(item.marca || '', { x: colX[2] + 3, y: y + 4, size: 7, font })
    page.drawText(item.modelo || '', { x: colX[3] + 3, y: y + 4, size: 7, font })
    page.drawText(item.serie || '', { x: colX[4] + 3, y: y + 4, size: 7, font })
    page.drawText(item.estado || '', { x: colX[5] + 3, y: y + 4, size: 7, font })
  }

  return y - 20
}

function dibujarConstanciaYFirmas(page, acta, font, fontBold, startY) {
  let y = startY
  const fechaObj = acta.fecha ? new Date(acta.fecha) : new Date()
  const dia = String(fechaObj.getDate()).padStart(2, '0')
  const mes = String(fechaObj.getMonth() + 1).padStart(2, '0')
  const anio = fechaObj.getFullYear()

  const textoConstancia = `Por este medio se hace constar que el día  ${dia}  del mes  ${mes}  del año  ${anio}\n` +
    `Yo  ${acta.responsable || '___________________'}  que me identifico con numero de\n` +
    `documento personal  ${acta.dpi || '___________________'} , hago constar que entrego todo el equipo\n` +
    `descrito arriba.`

  const lineas = textoConstancia.split('\n')
  lineas.forEach((l) => {
    page.drawText(l, { x: 40, y, size: 8, font })
    y -= 12
  })

  y -= 10
  page.drawText('Observaciones:', { x: 40, y, size: 8, font: fontBold })
  y -= 14

  // Líneas para observaciones completadas con texto si existe
  const obsText = acta.observaciones || ''
  page.drawText(obsText.substring(0, 90), { x: 40, y, size: 7.5, font })
  page.drawLine({ start: { x: 40, y: y - 2 }, end: { x: 550, y: y - 2 }, strokeWidth: 0.5 })
  y -= 14
  page.drawText(obsText.substring(90, 180), { x: 40, y, size: 7.5, font })
  page.drawLine({ start: { x: 40, y: y - 2 }, end: { x: 550, y: y - 2 }, strokeWidth: 0.5 })

  // Bloque de Firmas
  y -= 50
  page.drawLine({ start: { x: 80, y }, end: { x: 250, y }, strokeWidth: 1 })
  page.drawLine({ start: { x: 340, y }, end: { x: 510, y }, strokeWidth: 1 })

  y -= 12
  page.drawText('FIRMA RESPONSABLE', { x: 110, y, size: 8, font: fontBold })
  page.drawText('ENCARGADO IT', { x: 385, y, size: 8, font: fontBold })

  // Leyenda pie de página
  page.drawText('Original: IT     Copia: RRHH     Copia: Finanzas', { x: 430, y: 30, size: 6.5, font })
}

// --- CONSTRUCCIÓN DE PLANTILLAS --- //

async function construirPaginaUnaHoja(pdfDoc, acta, font, fontBold) {
  const page = pdfDoc.addPage([612, 792]) // Tamaño Carta Standard
  dibujarEncabezado(page, font, fontBold, '1 - 1', 'Enero 2025')

  let y = dibujarDatosUsuario(page, acta, font, fontBold, 680)

  // Sección Descripción de Equipo (Versión 1 Hoja)
  page.drawText('DESCRIPCION DE EQUIPO A ENTREGAR', { x: 190, y, size: 9, font: fontBold })
  y -= 20

  // Checkboxes de Artículos Frecuentes
  const equipoTipo = (acta.tipo_equipo || '').toLowerCase()
  const checks = [
    `[${equipoTipo.includes('monitor') ? 'X' : '  '}] MONITOR`,
    `[${equipoTipo.includes('mouse') ? 'X' : '  '}] MOUSE`,
    `[${equipoTipo.includes('teclado') ? 'X' : '  '}] TECLADO`,
    `[${equipoTipo.includes('ups') ? 'X' : '  '}] UPS`,
    `[${equipoTipo.includes('laptop') ? 'X' : '  '}] LAPTOP`,
    `[${equipoTipo.includes('cargador') ? 'X' : '  '}] CARGADOR`,
    `[${equipoTipo.includes('tablet') ? 'X' : '  '}] TABLET`,
    `[${equipoTipo.includes('disco') ? 'X' : '  '}] DISCO EXTERNO`,
    `[${equipoTipo.includes('celular') ? 'X' : '  '}] CELULAR`,
    `[${equipoTipo.includes('radio') ? 'X' : '  '}] RADIO`,
  ]

  let cX = 40
  let cY = y
  checks.forEach((chk, i) => {
    page.drawText(chk, { x: cX, y: cY, size: 7.5, font })
    cX += 100
    if ((i + 1) % 5 === 0) {
      cX = 40
      cY -= 14
    }
  })

  y = cY - 15

  // Tabla compacta de accesorios/equipos entregados
  y = dibujarTablaAccesorios(page, acta.accesorios || [], font, fontBold, y)

  // Bloque final de Constancia y Firmas
  dibujarConstanciaYFirmas(page, acta, font, fontBold, y)
}

async function construirPaginasDosHojas(pdfDoc, acta, font, fontBold) {
  // --- PÁGINA 1 ---
  const page1 = pdfDoc.addPage([612, 792])
  dibujarEncabezado(page1, font, fontBold, '1 - 2', 'Enero 2026')

  let y1 = dibujarDatosUsuario(page1, acta, font, fontBold, 680)

  page1.drawText('DESCRIPCION DE EQUIPO A ENTREGAR', { x: 180, y: y1, size: 10, font: fontBold })
  y1 -= 25

  const esLaptop = (acta.tipo_equipo || '').toLowerCase().includes('laptop') ? '[X]' : '[  ]'
  const esEscritorio = (acta.tipo_equipo || '').toLowerCase().includes('escritorio') ? '[X]' : '[  ]'
  const esNuevo = (acta.estado_equipo || '').toLowerCase().includes('nuevo') ? '[X]' : '[  ]'
  const esUsado = (acta.estado_equipo || '').toLowerCase().includes('usado') ? '[X]' : '[  ]'

  page1.drawText('TIPO:', { x: 40, y: y1, size: 8, font: fontBold })
  page1.drawText(`${esLaptop} Laptop`, { x: 140, y: y1, size: 8, font })
  page1.drawText(`${esEscritorio} Escritorio`, { x: 230, y: y1, size: 8, font })
  y1 -= 20

  page1.drawText('ESTADO:', { x: 40, y: y1, size: 8, font: fontBold })
  page1.drawText(`${esNuevo} Nuevo`, { x: 140, y: y1, size: 8, font })
  page1.drawText(`${esUsado} Usado`, { x: 230, y: y1, size: 8, font })
  y1 -= 20

  const specs = [
    { label: 'MARCA:', val: acta.marca || '' },
    { label: 'MODELO:', val: acta.modelo || '' },
    { label: 'No. SERIE:', val: acta.serie || '' },
    { label: 'PROCESADOR:', val: acta.procesador || '' },
    { label: 'MEMORIA RAM:', val: acta.memoria_ram || '' },
    { label: 'DISCO DURO:', val: acta.disco_duro || '' },
    { label: 'NOMBRE EQUIPO:', val: acta.nombre_equipo || '' },
  ]

  specs.forEach((s) => {
    page1.drawText(s.label, { x: 40, y: y1, size: 8, font: fontBold })
    page1.drawText(s.val, { x: 140, y: y1, size: 8, font })
    page1.drawLine({ start: { x: 135, y: y1 - 2 }, end: { x: 550, y: y1 - 2 }, strokeWidth: 0.5 })
    y1 -= 22
  })

  page1.drawText('Original: IT     Copia: RRHH', { x: 450, y: 30, size: 6.5, font })

  // --- PÁGINA 2 ---
  const page2 = pdfDoc.addPage([612, 792])
  dibujarEncabezado(page2, font, fontBold, '2 - 2', 'Enero 2026')

  let y2 = 680
  page2.drawText('ACCESORIOS', { x: 250, y: y2, size: 10, font: fontBold })
  y2 -= 20

  y2 = dibujarTablaAccesorios(page2, acta.accesorios || [], font, fontBold, y2)
  dibujarConstanciaYFirmas(page2, acta, font, fontBold, y2)
}

module.exports = { generarPdfActa }
