// =====================================================
// ===== 🔧 MÓDULO MANTENIMIENTO — COMPLETO =====
// ===== SOLO VEHÍCULOS DE MOVIMIENTOS =====
// =====================================================

let placaActual = null;
let datosVehiculoGuardados = null;

window.cargarModulo_mantenimiento = async function () {
  const c = document.getElementById('contenido');
  if (!c) {
    console.log('No se encontró el contenedor principal');
    return;
  }

  c.innerHTML = `
<style>
  .oculto { display: none !important; }
  .grupo { margin-bottom: 1rem; }
  .grupo label { display: block; font-weight: 500; margin-bottom: 0.3rem; }
  .campo, select, textarea {
    width: 100%; padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 0.375rem;
    font-size: 1rem;
  }
  .tarjeta {
    background: white; border-radius: 0.75rem; padding: 1.25rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom: 1rem;
  }
  .grid-2 {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
  }
  .col-span-2 { grid-column: span 2; }
  .btn-subpestaña {
    padding: 0.6rem 1rem; border: none; border-radius: 0.5rem;
    background: #e5e7eb; cursor: pointer; font-weight: 500; transition: all 0.2s;
  }
  .btn-subpestaña.activa { background: #2563eb; color: white; }
  .btn-primario {
    background: #2563eb; color: white; border: none; padding: 0.7rem 1.2rem;
    border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: background 0.2s;
  }
  .btn-primario:hover { background: #1d4ed8; }
  .flex { display: flex; }
  .gap-2 { gap: 0.5rem; }
  .flex-wrap { flex-wrap: wrap; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 0.75rem; }
  .mt-4 { margin-top: 1rem; }
  .text-sm { font-size: 0.875rem; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .rounded { border-radius: 0.375rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .border { border: 1px solid #e5e7eb; }
  .border-l-4 { border-left-width: 4px; }
  @media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
  }
</style>

  <div class="tarjeta">
    <h3 class="font-bold mb-4">🔧 Control de Mantenimiento — Vehículos de Movimientos</h3>
    
    <!-- Selección de Vehículo -->
    <div class="grupo mb-4">
      <label>Seleccionar Vehículo</label>
      <select id="placaMantenimiento" class="campo" onchange="cargarDatosVehiculo()">
        <option value="">-- Seleccione un vehículo --</option>
        ${vehiculosMov && vehiculosMov.length > 0 
          ? vehiculosMov.map(v => `<option value="${v.placa || v.id}">${v.placa || v.id} — ${v.tipo || 'Sin tipo'}</option>`).join('') 
          : '<option value="" disabled>⚠️ No hay vehículos registrados</option>'
        }
      </select>
    </div>

    <!-- Área de Datos del Vehículo -->
    <div id="datosVehiculo" class="oculto">
      <div class="flex gap-2 mb-4 flex-wrap">
        <button class="btn-subpestaña activa" onclick="cambiarSubpestañaMant('general')">📋 Datos Generales</button>
        <button class="btn-subpestaña" onclick="cambiarSubpestañaMant('documentos')">📄 Documentos Legales</button>
        <button class="btn-subpestaña" onclick="cambiarSubpestañaMant('taller')">🏭 Ingreso a Taller</button>
        <button class="btn-subpestaña" onclick="cambiarSubpestañaMant('historial')">📜 Historial</button>
      </div>

      <!-- SUBPESTAÑA: DATOS GENERALES -->
      <div id="submant-general">
        <h4 class="font-bold mb-3">📋 Información del Vehículo</h4>
        <div class="grid-2">
          <div class="grupo">
            <label>Placa</label>
            <input type="text" id="mantPlaca" class="campo" readonly style="background:#f3f4f6;">
          </div>
          <div class="grupo">
            <label>Tipo / Marca</label>
            <input type="text" id="mantTipoMarca" class="campo" placeholder="Ej: Moto / Camión">
          </div>
          <div class="grupo">
            <label>Color</label>
            <input type="text" id="mantColor" class="campo" placeholder="Color del vehículo">
          </div>
          <div class="grupo">
            <label>Kilometraje Actual</label>
            <input type="number" id="mantKmActual" class="campo" min="0" placeholder="0">
          </div>
          <div class="grupo col-span-2">
            <label>Observaciones Generales</label>
            <textarea id="mantObservaciones" class="campo" rows="3" placeholder="Estado general, novedades..."></textarea>
          </div>
        </div>
        <button class="btn-primario mt-3" onclick="guardarDatosGenerales()">💾 Guardar Datos Generales</button>
      </div>

      <!-- SUBPESTAÑA: DOCUMENTOS LEGALES -->
      <div id="submant-documentos" class="oculto">
        <h4 class="font-bold mb-3">📄 Documentos Obligatorios — Bogotá / Colombia</h4>
        <div class="grid-2">
          <div class="grupo">
            <label>SOAT — Vencimiento</label>
            <input type="date" id="mantSoat" class="campo">
          </div>
          <div class="grupo">
            <label>Tecnicomecánica — Vencimiento</label>
            <input type="date" id="mantTecno" class="campo">
          </div>
          <div class="grupo">
            <label>Seguro — Vencimiento</label>
            <input type="date" id="mantSeguro" class="campo">
          </div>
          <div class="grupo">
            <label>Tarjeta de Propiedad</label>
            <input type="text" id="mantTarjeta" class="campo" placeholder="Número o estado del documento">
          </div>
        </div>
        <div id="alertasVencimientos" class="mt-3 p-3 bg-gray-50 rounded"></div>
        <button class="btn-primario mt-3" onclick="guardarDocumentos()">💾 Guardar Documentos</button>
      </div>

      <!-- SUBPESTAÑA: INGRESO A TALLER -->
      <div id="submant-taller" class="oculto">
        <h4 class="font-bold mb-3">🏭 Ingreso y Salida de Taller</h4>
        <div class="grid-2">
          <div class="grupo">
            <label>Fecha de Ingreso al Taller</label>
            <input type="date" id="mantFechaIngresoTaller" class="campo">
          </div>
          <div class="grupo">
            <label>Quién entrega el vehículo</label>
            <select id="mantQuienEntrega" class="campo">
              <option value="">-- Seleccione --</option>
              ${colaboradores && colaboradores.length > 0 
                ? colaboradores.map(c => `<option value="${c.nombre || c.name}">${c.nombre || c.name}</option>`).join('') 
                : ''
              }
            </select>
          </div>
          <div class="grupo col-span-2">
            <label>Diagnóstico / Falla Reportada</label>
            <textarea id="mantDiagnostico" class="campo" rows="3" placeholder="Describa detalladamente la falla..."></textarea>
          </div>
          <div class="grupo">
            <label>Fecha Estimada de Retorno</label>
            <input type="date" id="mantFechaRetornoEstimada" class="campo">
          </div>
          <div class="grupo">
            <label>Fecha Real de Retorno</label>
            <input type="date" id="mantFechaRetornoReal" class="campo">
          </div>
          <div class="grupo">
            <label>Quién recoge el vehículo</label>
            <select id="mantQuienRecoge" class="campo">
              <option value="">-- Seleccione --</option>
              ${colaboradores && colaboradores.length > 0 
                ? colaboradores.map(c => `<option value="${c.nombre || c.name}">${c.nombre || c.name}</option>`).join('') 
                : ''
              }
            </select>
          </div>
          <div class="grupo">
            <label>Costo Total ($)</label>
            <input type="number" id="mantCosto" class="campo" min="0" step="1000" placeholder="0">
          </div>
          <div class="grupo col-span-2">
            <label>Trabajo Realizado / Observaciones</label>
            <textarea id="mantTrabajoRealizado" class="campo" rows="3" placeholder="Reparaciones, repuestos, detalles..."></textarea>
          </div>
        </div>
        <button class="btn-primario mt-3" onclick="registrarIngresoTaller()">💾 Registrar</button>
        <p class="text-sm mt-2 text-gray-500">⚠️ Al registrar fecha de ingreso, el vehículo queda en mantenimiento</p>
      </div>

      <!-- SUBPESTAÑA: HISTORIAL -->
      <div id="submant-historial" class="oculto">
        <h4 class="font-bold mb-3">📜 Historial de Mantenimientos</h4>
        <div id="listadoHistorial"></div>
      </div>
    </div>
  </div>
  `;
};

// =====================================================
// ===== CAMBIAR SUBPESTAÑA =====
// =====================================================
window.cambiarSubpestañaMant = function (nombre) {
  document.querySelectorAll('[id^="submant-"]').forEach(d => d.classList.add('oculto'));
  document.querySelectorAll('.btn-subpestaña').forEach(b => b.classList.remove('activa'));
  if (event?.target) event.target.classList.add('activa');
  const seccion = document.getElementById(`submant-${nombre}`);
  if (seccion) seccion.classList.remove('oculto');
  if (nombre === 'historial') cargarHistorial();
  if (nombre === 'documentos') verificarVencimientos();
};

// =====================================================
// ===== CARGAR DATOS DEL VEHÍCULO SELECCIONADO =====
// =====================================================
window.cargarDatosVehiculo = async function () {
  const select = document.getElementById('placaMantenimiento');
  if (!select) return;
  
  placaActual = select.value;
  if (!placaActual) {
    document.getElementById('datosVehiculo').classList.add('oculto');
    return;
  }
  document.getElementById('datosVehiculo').classList.remove('oculto');
  
  try {
    const snap = await db.collection('mantenimiento_vehiculos').doc(placaActual).get();
    datosVehiculoGuardados = snap.exists ? snap.data() : { placa: placaActual };
  } catch (e) {
    console.log('Sin datos previos, nuevo registro');
    datosVehiculoGuardados = { placa: placaActual };
  }
  
  // Llenar formulario
  document.getElementById('mantPlaca').value = placaActual;
  document.getElementById('mantTipoMarca').value = datosVehiculoGuardados.tipoMarca || '';
  document.getElementById('mantColor').value = datosVehiculoGuardados.color || '';
  document.getElementById('mantKmActual').value = datosVehiculoGuardados.kmActual || '';
  document.getElementById('mantObservaciones').value = datosVehiculoGuardados.observaciones || '';
  
  // Documentos
  document.getElementById('mantSoat').value = datosVehiculoGuardados.vencimientoSoat || '';
  document.getElementById('mantTecno').value = datosVehiculoGuardados.vencimientoTecno || '';
  document.getElementById('mantSeguro').value = datosVehiculoGuardados.vencimientoSeguro || '';
  document.getElementById('mantTarjeta').value = datosVehiculoGuardados.tarjeta || '';
  
  // Taller
  document.getElementById('mantFechaIngresoTaller').value = datosVehiculoGuardados.fechaIngresoTaller || '';
  document.getElementById('mantQuienEntrega').value = datosVehiculoGuardados.quienEntrega || '';
  document.getElementById('mantDiagnostico').value = datosVehiculoGuardados.diagnostico || '';
  document.getElementById('mantFechaRetornoEstimada').value = datosVehiculoGuardados.fechaRetornoEstimada || '';
  document.getElementById('mantFechaRetornoReal').value = datosVehiculoGuardados.fechaRetornoReal || '';
  document.getElementById('mantQuienRecoge').value = datosVehiculoGuardados.quienRecoge || '';
  document.getElementById('mantCosto').value = datosVehiculoGuardados.costo || '';
  document.getElementById('mantTrabajoRealizado').value = datosVehiculoGuardados.trabajoRealizado || '';
  
  verificarVencimientos();
};

// =====================================================
// ===== GUARDAR DATOS GENERALES =====
// =====================================================
window.guardarDatosGenerales = async function () {
  if (!placaActual) return alert('⚠️ Seleccione un vehículo');
  
  const datos = {
    placa: placaActual,
    tipoMarca: document.getElementById('mantTipoMarca').value.trim(),
    color: document.getElementById('mantColor').value.trim(),
    kmActual: parseInt(document.getElementById('mantKmActual').value) || 0,
    observaciones: document.getElementById('mantObservaciones').value.trim(),
    ultimaActualizacion: new Date().toISOString()
  };
  
  await db.collection('mantenimiento_vehiculos').doc(placaActual).set(datos, { merge: true });
  alert('✅ Datos generales guardados correctamente');
};

// =====================================================
// ===== GUARDAR DOCUMENTOS =====
// =====================================================
window.guardarDocumentos = async function () {
  if (!placaActual) return alert('⚠️ Seleccione un vehículo');
  
  const datos = {
    vencimientoSoat: document.getElementById('mantSoat').value,
    vencimientoTecno: document.getElementById('mantTecno').value,
    vencimientoSeguro: document.getElementById('mantSeguro').value,
    tarjeta: document.getElementById('mantTarjeta').value.trim()
  };
  
  await db.collection('mantenimiento_vehiculos').doc(placaActual).set(datos, { merge: true });
  alert('✅ Documentos guardados correctamente');
  verificarVencimientos();
};

// =====================================================
// ===== VERIFICAR VENCIMIENTOS =====
// =====================================================
function verificarVencimientos() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const alertas = [];
  
  const campos = [
    { nombre: 'SOAT', valor: document.getElementById('mantSoat').value },
    { nombre: 'Tecnicomecánica', valor: document.getElementById('mantTecno').value },
    { nombre: 'Seguro', valor: document.getElementById('mantSeguro').value }
  ];
  
  campos.forEach(c => {
    if (!c.valor) {
      alertas.push(`<p class="text-yellow-600">⚠️ <strong>${c.nombre}:</strong> Sin fecha registrada</p>`);
      return;
    }
    
    const fecha = new Date(c.valor);
    const dias = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
    
    if (dias < 0) {
      alertas.push(`<p class="text-red-600 font-bold">🔴 <strong>${c.nombre}:</strong> VENCIDO hace ${Math.abs(dias)} días</p>`);
    } else if (dias <= 7) {
      alertas.push(`<p class="text-orange-500 font-bold">🟠 <strong>${c.nombre}:</strong> Vence en ${dias} días — ¡URGENTE!</p>`);
    } else if (dias <= 30) {
      alertas.push(`<p class="text-yellow-600">🟡 <strong>${c.nombre}:</strong> Vence en ${dias} días</p>`);
    } else {
      alertas.push(`<p class="text-green-600">🟢 <strong>${c.nombre}:</strong> Vigente (${dias} días restantes)</p>`);
    }
  });
  
  const contenedor = document.getElementById('alertasVencimientos');
  if (contenedor) {
    contenedor.innerHTML = alertas.join('');
  }
}

// =====================================================
// ===== REGISTRAR INGRESO/SALIDA DE TALLER =====
// =====================================================
window.registrarIngresoTaller = async function () {
  if (!placaActual) return alert('⚠️ Seleccione un vehículo');
  
  const fechaIngreso = document.getElementById('mantFechaIngresoTaller').value;
  if (!fechaIngreso) return alert('⚠️ Ingrese la fecha de ingreso al taller');
  
  const fechaRetornoReal = document.getElementById('mantFechaRetornoReal').value;
  
  const datos = {
    placa: placaActual,
    fechaIngresoTaller: fechaIngreso,
    quienEntrega: document.getElementById('mantQuienEntrega').value,
    diagnostico: document.getElementById('mantDiagnostico').value.trim(),
    fechaRetornoEstimada: document.getElementById('mantFechaRetornoEstimada').value,
    fechaRetornoReal: fechaRetornoReal || '',
    quienRecoge: document.getElementById('mantQuienRecoge').value,
    costo: parseInt(document.getElementById('mantCosto').value) || 0,
    trabajoRealizado: document.getElementById('mantTrabajoRealizado').value.trim(),
    enMantenimiento: !fechaRetornoReal,
    fechaRegistro: new Date().toISOString()
  };
  
  await db.collection('mantenimiento_vehiculos').doc(placaActual).set(datos, { merge: true });
  
  // Agregar al historial
  await db.collection('historial_mantenimientos').add({
    ...datos,
    tipoMovimiento: fechaRetornoReal ? 'salida_taller' : 'ingreso_taller'
  });
  
  alert(fechaRetornoReal 
    ? '✅ Vehículo retirado de taller — Disponible para uso' 
    : '✅ Ingreso registrado — Vehículo en mantenimiento');
  
  cargarHistorial();
};

// =====================================================
// ===== CARGAR HISTORIAL =====
// =====================================================
async function cargarHistorial() {
  if (!placaActual) return;
  
  const lista = document.getElementById('listadoHistorial');
  if (!lista) return;
  
  try {
    const snap = await db.collection('historial_mantenimientos')
      .where('placa', '==', placaActual)
      .orderBy('fechaRegistro', 'desc')
      .limit(20)
      .get();
    
    if (snap.empty) {
      lista.innerHTML = '<p class="text-center text-gray-500 py-4">📭 Sin historial de mantenimiento para este vehículo</p>';
      return;
    }
    
    let totalCosto = 0;
    
    lista.innerHTML = snap.docs.map(doc => {
      const h = doc.data();
      const esIngreso = h.tipoMovimiento !== 'salida_taller';
      if (h.costo) totalCosto += h.costo;
      
      return `
      <div class="p-3 mb-3 border-l-4 rounded ${esIngreso ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}">
        <p class="font-bold text-lg mb-2 ${esIngreso ? 'text-yellow-700' : 'text-green-700'}">
          ${esIngreso ? '🏭 EN MANTENIMIENTO' : '✅ RETIRADO DE TALLER'}
        </p>
        <div class="grid-2 text-sm">
          <p><strong>📅 Fecha Ingreso:</strong> ${h.fechaIngresoTaller || '—'}</p>
          ${h.fechaRetornoEstimada ? `<p><strong>⏰ Retorno Estimado:</strong> ${h.fechaRetornoEstimada}</p>` : ''}
          ${h.fechaRetornoReal ? `<p><strong>✅ Fecha Retorno Real:</strong> ${h.fechaRetornoReal}</p>` : ''}
          <p><strong>👤 Entregó:</strong> ${h.quienEntrega || '—'}</p>
          ${h.quienRecoge ? `<p><strong>👤 Recogió:</strong> ${h.quienRecoge}</p>` : ''}
          <p class="col-span-2"><strong>🔍 Diagnóstico:</strong> ${h.diagnostico || 'Sin detalle'}</p>
          ${h.trabajoRealizado ? `<p class="col-span-2"><strong>🔧 Trabajo realizado:</strong> ${h.trabajoRealizado}</p>` : ''}
          ${h.costo ? `<p class="col-span-2 font-bold text-lg"><strong>💰 Costo:</strong> $${h.costo.toLocaleString()}</p>` : ''}
        </div>
      </div>
      `;
    }).join('');
    
    // Total acumulado
    lista.innerHTML += `
    <div class="p-3 mt-4 border-l-4 border-blue-500 rounded bg-blue-50">
      <p class="font-bold text-lg">💰 COSTO TOTAL EN MANTENIMIENTO: $${totalCosto.toLocaleString()}</p>
    </div>
    `;
    
  } catch (e) {
    console.error('Error cargando historial:', e);
    lista.innerHTML = '<p class="text-red-600">❌ Error al cargar historial</p>';
  }
}