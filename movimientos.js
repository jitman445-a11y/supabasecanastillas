// =====================================================
// ===== 📦 MÓDULO MOVIMIENTOS — SUPABASE =====
// =====================================================
window.cargarModulo_movimientos = async function () {
  const hoy = new Date().toISOString().split('T')[0];
  const c = document.getElementById('contenido');
  if (!c) return;

  c.innerHTML = `
<style>
  .oculto { display: none !important; }
  .btn-subpestaña {
    padding: 0.6rem 1rem; border: none; border-radius: 0.5rem;
    background: #e5e7eb; cursor: pointer; font-weight: 500; transition: all 0.2s;
  }
  .btn-subpestaña.activa { background: #2563eb; color: white; }
  .tarjeta {
    background: white; border-radius: 0.75rem; padding: 1.25rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom: 1rem;
  }
  .grupo { margin-bottom: 1rem; }
  .grupo label { display: block; font-weight: 500; margin-bottom: 0.3rem; }
  .campo, select, input, textarea {
    width: 100%; padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 0.375rem;
    font-size: 1rem;
  }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .col-span-2 { grid-column: span 2; }
  .flex { display: flex; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .flex-wrap { flex-wrap: wrap; }
  .justify-between { justify-content: space-between; }
  .items-center { align-items: center; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mt-4 { margin-top: 1rem; }
  .mt-6 { margin-top: 1.5rem; }
  .tabla { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .tabla th, .tabla td { padding: 0.6rem 0.5rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
  .tabla th { background: #f3f4f6; font-weight: 600; }
  .overflow-x-auto { overflow-x: auto; }
  .btn {
    border: none; padding: 0.7rem 1.2rem; border-radius: 0.5rem;
    font-weight: 600; cursor: pointer; transition: background 0.2s;
  }
  .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.875rem; }
  .btn-primario { background: #2563eb; color: white; }
  .btn-primario:hover { background: #1d4ed8; }
  .btn-exito { background: #16a34a; color: white; }
  .btn-exito:hover { background: #15803d; }
  .btn-amarillo { background: #eab308; color: #1f2937; }
  .btn-amarillo:hover { background: #ca8a04; }
  .btn-peligro { background: #dc2626; color: white; }
  .btn-peligro:hover { background: #b91c1c; }
  .text-center { text-align: center; }
  @media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
  }
</style>

    <div class="flex gap-2 mb-4 flex-wrap">
      <button class="btn-subpestaña activa" onclick="cambiarSubpestañaMov('crear', event)">📝 Crear Movimiento</button>
      <button class="btn-subpestaña" onclick="cambiarSubpestañaMov('hoy', event)">📅 Movimientos del Día</button>
      <button class="btn-subpestaña" onclick="cambiarSubpestañaMov('pendientes', event)">⏳ Pendientes por Llegar</button>
      <button class="btn-subpestaña" onclick="cambiarSubpestañaMov('colaboradores', event)">👤 Colaboradores</button>
      <button class="btn-subpestaña" onclick="cambiarSubpestañaMov('vehiculos', event)">🚗 Vehículos</button>
    </div>

    <!-- ===== CREAR / EDITAR MOVIMIENTO ===== -->
    <div id="submov-crear">
      <div class="tarjeta">
        <h3 class="font-bold mb-4">${idEdicion ? '✏️ Editar Movimiento' : '📝 Nuevo Movimiento'}</h3>
        <div class="grid-2">
          <div class="grupo">
            <label>Fecha</label>
            <input type="date" id="fechaMov" value="${hoy}">
          </div>
          <div class="grupo">
            <label>Placa / Vehículo</label>
            <select id="placa">
              <option value="">-- Cargando vehículos... --</option>
            </select>
          </div>
          <div class="grupo">
            <label>Colaborador / Conductor</label>
            <select id="colaborador">
              <option value="">-- Cargando... --</option>
            </select>
          </div>
          <div class="grupo">
            <label>Hora de Salida</label>
            <input type="time" id="horaSalida">
          </div>
          <div class="grupo">
            <label>Canastillas de Salida</label>
            <input type="number" id="canastillasSalida" min="0" value="0">
          </div>
          <div class="grupo">
            <label>Hora de Llegada</label>
            <input type="time" id="horaLlegada">
          </div>
          <div class="grupo">
            <label>Canastillas de Llegada</label>
            <input type="number" id="canastillasLlegada" min="0" value="0">
          </div>
          <div class="grupo">
            <label>Total Kilos Recogidos</label>
            <input type="number" step="0.01" id="totalKilos" min="0" value="0">
          </div>
          <div class="grupo col-span-2">
            <label>Observaciones del Movimiento</label>
            <textarea id="observaciones" rows="2" placeholder="Novedades, ruta, remisiones..."></textarea>
          </div>
        </div>
        <div class="mt-4 mb-2 flex justify-between items-center">
          <h4 class="font-bold">📦 Recogidas</h4>
          <button class="btn btn-sm btn-primario" onclick="agregarFilaRecogida()">+ Agregar Recogida</button>
        </div>
        <div class="overflow-x-auto mb-4">
          <table class="tabla">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>¿A quién?</th>
                <th>Kilos</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody id="cuerpoRecogidas"></tbody>
          </table>
        </div>
        <div class="flex gap-3 mt-4">
          <button class="btn btn-primario" onclick="guardarMovimientoDesdeForm()">💾 ${idEdicion ? 'Actualizar' : 'Guardar'}</button>
          <button class="btn btn-amarillo" onclick="limpiarFormulario()">🔄 Limpiar</button>
          ${idEdicion ? `<button class="btn btn-peligro" onclick="eliminarMovimiento(idEdicion); idEdicion=null;">🗑️ Eliminar</button>` : ''}
        </div>
      </div>
    </div>

    <!-- ===== MOVIMIENTOS DEL DÍA ===== -->
    <div id="submov-hoy" class="oculto">
      <div class="tarjeta">
        <h3 class="font-bold mb-4">📅 Movimientos del Día — ${hoy}</h3>
        <div class="mb-4 flex gap-2 flex-wrap">
          <input type="text" id="buscarMovHoy" placeholder="🔍 Buscar por placa, colaborador..." 
            oninput="filtrarMovimientosHoy()" style="max-width: 400px;">
          <button class="btn btn-sm btn-primario" onclick="exportarExcel()">📊 Exportar Excel</button>
        </div>
        <div class="grid-2 mb-4">
          <div class="tarjeta p-3">
            <strong>🚚 Salidas:</strong> <span id="resumenSalidas">0</span> movimientos
          </div>
          <div class="tarjeta p-3">
            <strong>✅ Completados:</strong> <span id="resumenCompletados">0</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Placa</th>
                <th>Colaborador</th>
                <th>Hora Salida</th>
                <th>Hora Llegada</th>
                <th>Canastillas Salida</th>
                <th>Canastillas Llegada</th>
                <th>Kilos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="tablaMovHoyCuerpo"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== PENDIENTES POR LLEGAR ===== -->
    <div id="submov-pendientes" class="oculto">
      <div class="tarjeta">
        <h3 class="font-bold mb-4">⏳ Pendientes por Llegar</h3>
        <div class="mb-4 flex gap-2 flex-wrap">
          <button class="btn btn-sm btn-exito" onclick="completarSeleccionados()">✅ Completar Seleccionados</button>
          <button class="btn btn-sm btn-primario" onclick="marcarTodosPendientes()">☑️ Seleccionar Todos</button>
        </div>
        <div class="overflow-x-auto">
          <table class="tabla">
            <thead>
              <tr>
                <th><input type="checkbox" id="chkTodosPend" onchange="alternarTodosPendientes(this)"></th>
                <th>Fecha</th>
                <th>Placa</th>
                <th>Colaborador</th>
                <th>Hora Salida</th>
                <th>Canastillas Salida</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="tablaPendientesCuerpo"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== GESTIÓN DE COLABORADORES ===== -->
    <div id="submov-colaboradores" class="oculto"></div>

    <!-- ===== GESTIÓN DE VEHÍCULOS ===== -->
    <div id="submov-vehiculos" class="oculto"></div>
  `;

  setTimeout(() => {
    if (window.actualizarSelectoresMov) actualizarSelectoresMov();
    dibujarTablaRecogidas();
  }, 50);
};

// =====================================================
// ===== CAMBIAR SUBPESTAÑA =====
// =====================================================
window.cambiarSubpestañaMov = function (nombre, evt) {
  document.querySelectorAll('.btn-subpestaña').forEach(b => b.classList.remove('activa'));
  if (evt) evt.target.classList.add('activa');
  document.querySelectorAll('[id^="submov-"]').forEach(p => p.classList.add('oculto'));
  const seccion = document.getElementById(`submov-${nombre}`);
  if (seccion) seccion.classList.remove('oculto');
  
  if (nombre === 'hoy') dibujarMovimientosHoy();
  if (nombre === 'pendientes') dibujarMovimientosPendientes();
  if (nombre === 'colaboradores') dibujarSubpestañaColaboradores();
  if (nombre === 'vehiculos') dibujarSubpestañaVehiculos();
};

// =====================================================
// ===== GUARDAR MOVIMIENTO — SUPABASE =====
// =====================================================
async function guardarMovimientoDesdeForm() {
  const datos = {
    fecha: document.getElementById('fechaMov').value,
    placa: document.getElementById('placa').value,
    colaborador: document.getElementById('colaborador').value,
    horaSalida: document.getElementById('horaSalida').value,
    canastillasSalida: parseInt(document.getElementById('canastillasSalida').value) || 0,
    horaLlegada: document.getElementById('horaLlegada').value || null,
    canastillasLlegada: parseInt(document.getElementById('canastillasLlegada').value) || 0,
    totalKilos: parseFloat(document.getElementById('totalKilos').value) || 0,
    observaciones: document.getElementById('observaciones').value.trim() || '',
    recogidas: filasRecogida,
    completado: !!document.getElementById('horaLlegada').value
  };

  if (!datos.fecha || !datos.placa || !datos.colaborador || !datos.horaSalida) {
    return alert('⚠️ Complete fecha, placa, colaborador y hora de salida');
  }

  await guardarMovimiento(datos);
  limpiarFormulario();
}

async function guardarMovimiento(datos) {
  if (idEdicion) {
    // Actualizar
    const { error } = await supabase
      .from('movimientos')
      .update(datos)
      .eq('id', idEdicion);
    
    if (error) {
      console.error('Error actualizando:', error);
      return alert('❌ No se pudo actualizar: ' + error.message);
    }
    alert('✅ Movimiento actualizado');
  } else {
    // Crear nuevo
    const { data, error } = await supabase
      .from('movimientos')
      .insert([datos])
      .select();
    
    if (error) {
      console.error('Error guardando:', error);
      return alert('❌ No se pudo guardar: ' + error.message);
    }
    alert('✅ Movimiento guardado');
  }

  idEdicion = null;
  await cargarTodosMovimientos(); // Refrescar datos locales
}

window.eliminarMovimiento = async function (id) {
  if (!confirm('¿Eliminar este movimiento?')) return;
  
  const { error } = await supabase
    .from('movimientos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error eliminando:', error);
    return alert('❌ No se pudo eliminar');
  }
  
  alert('✅ Eliminado');
  await cargarTodosMovimientos();
  cambiarSubpestañaMov('hoy');
};

window.editarMovimiento = async function (id) {
  const mov = movimientos.find(m => m.id == id);
  if (!mov) return;

  if (document.getElementById('fechaMov')) document.getElementById('fechaMov').value = mov.fecha || '';
  if (document.getElementById('placa')) document.getElementById('placa').value = mov.placa || '';
  if (document.getElementById('colaborador')) document.getElementById('colaborador').value = mov.colaborador || '';
  if (document.getElementById('horaSalida')) document.getElementById('horaSalida').value = mov.horaSalida || '';
  if (document.getElementById('canastillasSalida')) document.getElementById('canastillasSalida').value = mov.canastillasSalida || 0;
  if (document.getElementById('horaLlegada')) document.getElementById('horaLlegada').value = mov.horaLlegada || '';
  if (document.getElementById('canastillasLlegada')) document.getElementById('canastillasLlegada').value = mov.canastillasLlegada || 0;
  if (document.getElementById('totalKilos')) document.getElementById('totalKilos').value = (mov.totalKilos || 0).toFixed(2);
  if (document.getElementById('observaciones')) document.getElementById('observaciones').value = mov.observaciones || '';
  
  filasRecogida = mov.recogidas ? [...mov.recogidas] : [];
  dibujarTablaRecogidas();
};

window.completarMovimientoDirecto = async function (id) {
  const ahora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  
  const { error } = await supabase
    .from('movimientos')
    .update({ horaLlegada: ahora, completado: true })
    .eq('id', id);
  
  if (error) {
    console.error(error);
    return alert('❌ Error al completar');
  }
  
  alert('✅ Movimiento completado');
  await cargarTodosMovimientos();
  dibujarMovimientosPendientes();
};

async function completarSeleccionados() {
  if (!seleccionadosPendientes.length) return alert('⚠️ Seleccione al menos uno');
  if (!confirm(`¿Completar ${seleccionadosPendientes.length} movimientos?`)) return;
  
  const ahora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  
  for (const id of seleccionadosPendientes) {
    await supabase
      .from('movimientos')
      .update({ horaLlegada: ahora, completado: true })
      .eq('id', id);
  }
  
  alert(`✅ ${seleccionadosPendientes.length} movimientos completados`);
  seleccionadosPendientes = [];
  await cargarTodosMovimientos();
  dibujarMovimientosPendientes();
}

function limpiarFormulario() {
  idEdicion = null;
  filasRecogida = [];
  const hoy = new Date().toISOString().split('T')[0];
  if (document.getElementById('fechaMov')) document.getElementById('fechaMov').value = hoy;
  if (document.getElementById('placa')) document.getElementById('placa').value = '';
  if (document.getElementById('colaborador')) document.getElementById('colaborador').value = '';
  if (document.getElementById('horaSalida')) document.getElementById('horaSalida').value = '';
  if (document.getElementById('canastillasSalida')) document.getElementById('canastillasSalida').value = '0';
  if (document.getElementById('horaLlegada')) document.getElementById('horaLlegada').value = '';
  if (document.getElementById('canastillasLlegada')) document.getElementById('canastillasLlegada').value = '0';
  if (document.getElementById('totalKilos')) document.getElementById('totalKilos').value = '0';
  if (document.getElementById('observaciones')) document.getElementById('observaciones').value = '';
  dibujarTablaRecogidas();
}

// =====================================================
// ===== GESTIÓN DE FILAS DE RECOGIDA =====
// =====================================================
function agregarFilaRecogida() {
  filasRecogida.push({ tipo: 'canastilla', cantidad: 0, paraQuien: '', kilos: 0 });
  dibujarTablaRecogidas();
}

function dibujarTablaRecogidas() {
  const tb = document.getElementById('cuerpoRecogidas');
  if (!tb) return;
  tb.innerHTML = filasRecogida.map((f, i) => `
  <tr>
    <td>
      <select onchange="filasRecogida[${i}].tipo=this.value; recalcularTotalKilos()">
        <option value="canastilla" ${f.tipo==='canastilla'?'selected':''}>Canastilla</option>
        <option value="bulto" ${f.tipo==='bulto'?'selected':''}>Bulto</option>
        <option value="atado" ${f.tipo==='atado'?'selected':''}>Atado</option>
        <option value="caja" ${f.tipo==='caja'?'selected':''}>Caja</option>
        <option value="racimo" ${f.tipo==='racimo'?'selected':''}>Racimo</option>
      </select>
    </td>
    <td><input type="number" min="0" value="${f.cantidad}" onchange="filasRecogida[${i}].cantidad=parseInt(this.value)||0" style="width:80px;"></td>
    <td><input type="text" value="${f.paraQuien}" placeholder="Nombre" onchange="filasRecogida[${i}].paraQuien=this.value"></td>
    <td><input type="number" step="0.01" min="0" value="${f.kilos}" onchange="filasRecogida[${i}].kilos=parseFloat(this.value)||0; recalcularTotalKilos()" style="width:90px;"></td>
    <td><button class="btn btn-sm btn-peligro" onclick="filasRecogida.splice(${i},1); dibujarTablaRecogidas(); recalcularTotalKilos()">✕</button></td>
  </tr>`).join('');
  recalcularTotalKilos();
}

function recalcularTotalKilos() {
  const total = filasRecogida.reduce((s, f) => s + (f.kilos || 0), 0);
  const campo = document.getElementById('totalKilos');
  if (campo) campo.value = total.toFixed(2);
}

// =====================================================
// ===== CARGAR DATOS DESDE SUPABASE =====
// =====================================================
window.cargarTodosMovimientos = async function () {
  const { data, error } = await supabase
    .from('movimientos')
    .select('*')
    .order('fecha', { ascending: false });
  
  if (error) {
    console.error('Error cargando movimientos:', error);
    return;
  }
  movimientos = data || [];
};

// =====================================================
// ===== DIBUJAR TABLAS =====
// =====================================================
function dibujarMovimientosHoy() {
  const hoy = new Date().toISOString().split('T')[0];
  const tb = document.getElementById('tablaMovHoyCuerpo');
  if (!tb) return;
  
  const filtro = movimientos.filter(m => m.fecha === hoy);
  const buscar = (document.getElementById('buscarMovHoy')?.value || '').toLowerCase();
  const filtrado = buscar ? filtro.filter(m =>
    (m.placa||'').toLowerCase().includes(buscar) ||
    (m.colaborador||'').toLowerCase().includes(buscar)
  ) : filtro;

  filtrado.sort((a, b) => (b.horaSalida || '').localeCompare(a.horaSalida || ''));
  const completados = filtrado.filter(m => m.horaLlegada).length;
  
  document.getElementById('resumenSalidas').textContent = filtrado.length;
  document.getElementById('resumenCompletados').textContent = completados;

  tb.innerHTML = filtrado.map(m => `
  <tr>
    <td>${m.fecha}</td>
    <td><strong>${m.placa}</strong></td>
    <td>${m.colaborador}</td>
    <td>${m.horaSalida}</td>
    <td>${m.horaLlegada || '—'}</td>
    <td>${m.canastillasSalida || 0}</td>
    <td>${m.canastillasLlegada || 0}</td>
    <td>${(m.totalKilos || 0).toFixed(2)}</td>
    <td>
      <button class="btn btn-sm btn-amarillo" onclick="irAEditarMovimiento('${m.id}')">✏️ Editar</button>
    </td>
  </tr>`).join('');
}

function filtrarMovimientosHoy() {
  dibujarMovimientosHoy();
}

function irAEditarMovimiento(id) {
  idEdicion = id;
  cambiarSubpestañaMov('crear');
  setTimeout(() => {
    if (window.editarMovimiento) editarMovimiento(id);
  }, 100);
}

let seleccionadosPendientes = [];
function dibujarMovimientosPendientes() {
  const hoy = new Date().toISOString().split('T')[0];
  const tb = document.getElementById('tablaPendientesCuerpo');
  if (!tb) return;
  
  const pendientes = movimientos.filter(m => m.fecha === hoy && !m.horaLlegada);
  pendientes.sort((a, b) => (b.horaSalida || '').localeCompare(a.horaSalida || ''));
  seleccionadosPendientes = [];

  tb.innerHTML = pendientes.map(m => `
  <tr>
    <td><input type="checkbox" class="chk-pendiente" data-id="${m.id}" onchange="toggleSeleccionPendiente('${m.id}', this.checked)"></td>
    <td>${m.fecha}</td>
    <td><strong>${m.placa}</strong></td>
    <td>${m.colaborador}</td>
    <td>${m.horaSalida}</td>
    <td>${m.canastillasSalida || 0}</td>
    <td>
      <button class="btn btn-sm btn-exito" onclick="completarMovimientoDirecto('${m.id}')">✅ Llegó</button>
      <button class="btn btn-sm btn-amarillo" onclick="irAEditarMovimiento('${m.id}')">✏️ Editar</button>
    </td>
  </tr>`).join('');
}

function toggleSeleccionPendiente(id, checked) {
  if (checked) {
    if (!seleccionadosPendientes.includes(id)) seleccionadosPendientes.push(id);
  } else {
    seleccionadosPendientes = seleccionadosPendientes.filter(i => i !== id);
  }
}

function marcarTodosPendientes() {
  const todos = document.querySelectorAll('.chk-pendiente');
  const todosSeleccionados = seleccionadosPendientes.length === todos.length;
  todos.forEach(chk => chk.checked = !todosSeleccionados);
  seleccionadosPendientes = !todosSeleccionados 
    ? movimientos.filter(m => !m.horaLlegada).map(m => m.id) 
    : [];
}

function alternarTodosPendientes(chk) {
  document.querySelectorAll('.chk-pendiente').forEach(c => c.checked = chk.checked);
  seleccionadosPendientes = chk.checked 
    ? movimientos.filter(m => !m.horaLlegada).map(m => m.id) 
    : [];
}

// =====================================================
// ===== GESTIÓN DE COLABORADORES =====
// =====================================================
function dibujarSubpestañaColaboradores() {
  const cont = document.getElementById('submov-colaboradores');
  if (!cont) return;
  
  cont.innerHTML = `
  <div class="tarjeta">
    <h3 class="font-bold mb-4">👤 Registrar Colaborador / Conductor</h3>
    <div class="grid-2">
      <div class="grupo">
        <label>Nombre Completo *</label>
        <input type="text" id="col_nombre" placeholder="Nombre y apellidos">
      </div>
      <div class="grupo">
        <label>Teléfono</label>
        <input type="tel" id="col_telefono" placeholder="3XX XXX XXXX">
      </div>
      <div class="grupo">
        <label>Tipo</label>
        <select id="col_tipo">
          <option value="colaborador">Colaborador</option>
          <option value="conductor">Conductor</option>
        </select>
      </div>
      <div class="grupo">
        <label>Estado</label>
        <select id="col_activo">
          <option value="true" selected>Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
    </div>
    <div class="flex gap-3 mt-4">
      <button class="btn btn-primario" onclick="guardarColaborador()">💾 Guardar</button>
      <button class="btn btn-amarillo" onclick="limpiarFormColaborador()">🔄 Limpiar</button>
    </div>
  </div>
  <div class="tarjeta mt-6">
    <h3 class="font-bold mb-3">📋 Lista de Colaboradores</h3>
    <table class="tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tablaColaboradoresCuerpo"></tbody>
    </table>
  </div>
  `;
  dibujarTablaColaboradores();
}

window.guardarColaborador = async function () {
  const nombre = document.getElementById('col_nombre').value.trim();
  const telefono = document.getElementById('col_telefono').value.trim();
  const tipo = document.getElementById('col_tipo').value;
  const activo = document.getElementById('col_activo').value === 'true';

  if (!nombre) return alert('⚠️ Escriba el nombre');

  const tabla = tipo === 'conductor' ? 'conductores' : 'colaboradores';
  const { error } = await supabase
    .from(tabla)
    .insert([{ nombre, telefono, activo }]);

  if (error) {
    console.error(error);
    return alert('❌ Error al guardar: ' + error.message);
  }

  alert('✅ Guardado correctamente');
  limpiarFormColaborador();
  if (window.cargarListasColaboradores) await cargarListasColaboradores();
  dibujarTablaColaboradores();
  if (window.actualizarSelectoresMov) actualizarSelectoresMov();
};

function limpiarFormColaborador() {
  document.getElementById('col_nombre').value = '';
  document.getElementById('col_telefono').value = '';
  document.getElementById('col_tipo').value = 'colaborador';
  document.getElementById('col_activo').value = 'true';
}

function dibujarTablaColaboradores() {
  const tb = document.getElementById('tablaColaboradoresCuerpo');
  if (!tb) return;
  
  const todos = [
    ...colaboradores.map(c => ({ ...c, tipo: 'colaborador' })),
    ...conductores.map(c => ({ ...c, tipo: 'conductor' }))
  ].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

  tb.innerHTML = todos.map(c => `
  <tr>
    <td>${c.nombre || ''}</td>
    <td>${c.tipo === 'conductor' ? '🚛 Conductor' : '👤 Colaborador'}</td>
    <td>${c.telefono || '—'}</td>
    <td>${c.activo !== false ? '✅ Activo' : '❌ Inactivo'}</td>
    <td>
      <button class="btn btn-sm ${c.activo ? 'btn-amarillo' : 'btn-exito'}" 
        onclick="cambiarEstadoColaborador('${c.id}', '${c.tipo}', ${!c.activo})">
        ${c.activo ? 'Desactivar' : 'Activar'}
      </button>
    </td>
  </tr>`).join('');
}

window.cambiarEstadoColaborador = async function (id, tipo, nuevoEstado) {
  const tabla = tipo === 'conductor' ? 'conductores' : 'colaboradores';
  const { error } = await supabase
    .from(tabla)
    .update({ activo: nuevoEstado })
    .eq('id', id);

  if (error) return alert('❌ Error: ' + error.message);
  
  alert(`✅ ${nuevoEstado ? 'Activado' : 'Desactivado'}`);
  if (window.cargarListasColaboradores) await cargarListasColaboradores();
  dibujarTablaColaboradores();
};

// =====================================================
// ===== GESTIÓN DE VEHÍCULOS =====
// =====================================================
function dibujarSubpestañaVehiculos() {
  const cont = document.getElementById('submov-vehiculos');
  if (!cont) return;
  
  cont.innerHTML = `
  <div class="tarjeta">
    <h3 class="font-bold mb-4">🚗 Registrar Vehículo</h3>
    <div class="grid-2">
      <div class="grupo">
        <label>Placa *</label>
        <input type="text" id="veh_placa" placeholder="Ej: ABC123" style="text-transform:uppercase;">
      </div>
      <div class="grupo">
        <label>Marca / Modelo</label>
        <input type="text" id="veh_modelo" placeholder="Ej: HINO Dutro">
      </div>
      <div class="grupo">
        <label>SOAT Vence</label>
        <input type="date" id="veh_soat">
      </div>
      <div class="grupo">
        <label>Tecnicomecánica Vence</label>
        <input type="date" id="veh_mecanica">
      </div>
      <div class="grupo col-span-2">
        <label>Observaciones</label>
        <textarea id="veh_obs" rows="2" placeholder="Estado, detalles..."></textarea>
      </div>
    </div>
    <div class="flex gap-3 mt-4">
      <button class="btn btn-primario" onclick="guardarVehiculo()">💾 Guardar</button>
      <button class="btn btn-amarillo" onclick="limpiarFormVehiculo()">🔄 Limpiar</button>
    </div>
  </div>
  <div class="tarjeta mt-6">
    <h3 class="font-bold mb-3">📋 Vehículos Registrados</h3>
    <table class="tabla">
      <thead>
        <tr>
          <th>Placa</th>
          <th>Modelo</th>
          <th>SOAT</th>
          <th>Tecnicomecánica</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tablaVehiculosCuerpo"></tbody>
    </table>
  </div>
  `;
  dibujarTablaVehiculos();
}

window.guardarVehiculo = async function () {
  const placa = document.getElementById('veh_placa').value.trim().toUpperCase();
  const modelo = document.getElementById('veh_modelo').value.trim();
  const soat = document.getElementById('veh_soat').value;
  const mecanica = document.getElementById('veh_mecanica').value;
  const obs = document.getElementById('veh_obs').value.trim();

  if (!placa) return alert('⚠️ Escriba la placa');
  if (vehiculosMov.find(v => v.placa === placa)) return alert('⚠️ Esta placa ya está registrada');

  const { error } = await supabase
    .from('vehiculos')
    .insert([{ placa, modelo, soatVence: soat, mecanicaVence: mecanica, observaciones: obs }]);

  if (error) {
    console.error(error);
    return alert('❌ Error al guardar: ' + error.message);
  }

  alert('✅ Vehículo guardado');
  limpiarFormVehiculo();
  if (window.cargarListasVehiculos) await cargarListasVehiculos();
  dibujarTablaVehiculos();
  if (window.actualizarSelectoresMov) actualizarSelectoresMov();
};

function limpiarFormVehiculo() {
  document.getElementById('veh_placa').value = '';
  document.getElementById('veh_modelo').value = '';
  document.getElementById('veh_soat').value = '';
  document.getElementById('veh_mecanica').value = '';
  document.getElementById('veh_obs').value = '';
}

function dibujarTablaVehiculos() {
  const tb = document.getElementById('tablaVehiculosCuerpo');
  if (!tb) return;
  tb.innerHTML = vehiculosMov.map(v => `
  <tr>
    <td><strong>${v.placa}</strong></td>
    <td>${v.modelo || '—'}</td>
    <td>${v.soatVence || '—'}</td>
    <td>${v.mecanicaVence || '—'}</td>
    <td>
      <button class="btn btn-sm btn-peligro" onclick="eliminarVehiculo('${v.id}')">🗑️ Eliminar</button>
    </td>
  </tr>`).join('');
}

window.eliminarVehiculo = async function (id) {
  if (!confirm('¿Eliminar este vehículo?')) return;
  
  const { error } = await supabase
    .from('vehiculos')
    .delete()
    .eq('id', id);

  if (error) return alert('❌ Error: ' + error.message);
  
  alert('✅ Eliminado');
  if (window.cargarListasVehiculos) await cargarListasVehiculos();
  dibujarTablaVehiculos();
};

// =====================================================
// ===== CARGAR LISTAS PARA SELECTORES =====
// =====================================================
window.actualizarSelectoresMov = function () {
  const selPlaca = document.getElementById('placa');
  const selColab = document.getElementById('colaborador');
  
  if (selPlaca && vehiculosMov.length > 0) {
    selPlaca.innerHTML = `<option value="">-- Seleccione vehículo --</option>` +
      vehiculosMov.map(v => `<option value="${v.placa}">${v.placa} — ${v.modelo || ''}</option>`).join('');
  }
  
  if (selColab) {
    const todosColabs = [
      ...colaboradores.filter(c => c.activo !== false).map(c => c.nombre),
      ...conductores.filter(c => c.activo !== false).map(c => c.nombre)
    ].sort();
    selColab.innerHTML = `<option value="">-- Seleccione colaborador --</option>` +
      todosColabs.map(n => `<option value="${n}">${n}</option>`).join('');
  }
};

console.log('✅ movimientos.js cargado — Supabase');