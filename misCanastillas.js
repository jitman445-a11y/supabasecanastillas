// =====================================================
// ===== 📦 MÓDULO MIS CANASTILLAS — SUPABASE =====
// =====================================================

window.transferenciasCanastillas = window.transferenciasCanastillas || [];

window.cargarModulo_misCanastillas = async function () {
  const c = document.getElementById('contenido');
  if (!c) return;

  const colaboradorActual = usuarioActivo?.nombre || '';
  if (!colaboradorActual) {
    c.innerHTML = `<div class="tarjeta">⚠️ No se identificó el colaborador activo</div>`;
    return;
  }

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
  .flex-wrap { flex-wrap: wrap; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mt-4 { margin-top: 1rem; }
  .resumen {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem; padding: 1rem; background: #eff6ff; border-radius: 0.5rem;
  }
  .resumen > div { text-align: center; padding: 0.5rem; }
  .tabla { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .tabla th, .tabla td { padding: 0.6rem 0.5rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
  .tabla th { background: #f3f4f6; font-weight: 600; }
  .btn {
    background: #e5e7eb; border: none; padding: 0.7rem 1.2rem; border-radius: 0.5rem;
    font-weight: 600; cursor: pointer; transition: background 0.2s;
  }
  .btn-exito { background: #16a34a; color: white; }
  .btn-exito:hover { background: #15803d; }
  .text-center { text-align: center; }
  @media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
  }
</style>

    <div class="flex gap-2 mb-4 flex-wrap">
      <button class="btn-subpestaña activa" onclick="cambiarSubpestañaCanastillas('miControl', event)">📋 Mi Control</button>
      <button class="btn-subpestaña" onclick="cambiarSubpestañaCanastillas('transferir', event)">🔄 Transferir</button>
      <button class="btn-subpestaña" onclick="cambiarSubpestañaCanastillas('historial', event)">📜 Historial</button>
    </div>

    <!-- ===== MI CONTROL ===== -->
    <div id="subcanastillas-miControl">
      <div class="tarjeta">
        <h3 class="font-bold mb-3">📋 Mis Canastillas — ${colaboradorActual}</h3>
        
        <div class="resumen mb-4">
          <div>📦 En mi poder: <strong id="misCanastillasActuales">0</strong></div>
          <div>✅ Recibidas: <strong id="misCanastillasRecibidas">0</strong></div>
          <div>📤 Enviadas: <strong id="misCanastillasEnviadas">0</strong></div>
          <div>⚖️ Kilos enviados: <strong id="misKilosEnviados">0</strong></div>
          <div>📥 Kilos recibidos: <strong id="misKilosRecibidos">0</strong></div>
        </div>

        <div id="miMovimientoActivo" class="mb-4" style="display:none;">
          <h4 class="font-bold text-blue-700 mb-2">🚗 Movimiento Activo</h4>
          <div class="tarjeta p-3" style="background:#eff6ff;">
            <p><strong>Placa:</strong> <span id="miPlacaActiva">—</span></p>
            <p><strong>Hora de salida:</strong> <span id="miHoraSalida">—</span></p>
            <p><strong>Canastillas que salí con:</strong> <span id="misCanastillasSalida">0</span></p>
          </div>
        </div>

        <h4 class="font-bold mb-2">🔄 Intercambios recientes</h4>
        <table class="tabla">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Tipo</th>
              <th>Colaborador</th>
              <th>Cantidad</th>
              <th>Kilos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody id="tablaIntercambiosCuerpo"></tbody>
        </table>
      </div>
    </div>

    <!-- ===== TRANSFERIR ===== -->
    <div id="subcanastillas-transferir" class="oculto">
      <div class="tarjeta">
        <h3 class="font-bold mb-3">🔄 Transferir Canastillas</h3>
        <div class="grupo mb-3">
          <label>📦 Disponibles: <strong id="dispCanastillas">0</strong></label>
        </div>
        <div class="grid-2">
          <div class="grupo">
            <label>Destino (con salida activa)</label>
            <select id="destinoTransferencia" class="campo">
              <option value="">-- Seleccione --</option>
            </select>
          </div>
          <div class="grupo">
            <label>Cantidad</label>
            <input type="number" id="cantidadTransferir" class="campo" min="1" value="1">
          </div>
          <div class="grupo col-span-2">
            <label>Observaciones</label>
            <input type="text" id="obsTransferencia" class="campo" placeholder="Lugar, motivo...">
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-exito" onclick="confirmarTransferencia()">✅ Confirmar</button>
          <button class="btn" onclick="cargarModulo_misCanastillas()">🔄 Cancelar</button>
        </div>
      </div>
    </div>

    <!-- ===== HISTORIAL ===== -->
    <div id="subcanastillas-historial" class="oculto">
      <div class="tarjeta">
        <h3 class="font-bold mb-3">📜 Historial</h3>
        <div class="grupo mb-3">
          <label>🔍 Buscar:</label>
          <input type="text" id="buscarHistorialCan" class="campo" placeholder="Fecha o nombre..." oninput="filtrarHistorialCan()">
        </div>
        <table class="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Tipo</th>
              <th>Con</th>
              <th>Cantidad</th>
              <th>Kilos</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody id="tablaHistorialCanCuerpo"></tbody>
        </table>
      </div>
    </div>
  `;

  await actualizarVistaMisCanastillas();
  cargarColaboradoresDisponibles();
};

// =====================================================
// ===== CAMBIAR SUBPESTAÑA =====
// =====================================================
window.cambiarSubpestañaCanastillas = function (nombre, evento) {
  document.querySelectorAll('.btn-subpestaña').forEach(b => b.classList.remove('activa'));
  if (evento) evento.currentTarget.classList.add('activa');
  document.querySelectorAll('[id^="subcanastillas-"]').forEach(d => d.classList.add('oculto'));
  document.getElementById(`subcanastillas-${nombre}`).classList.remove('oculto');
  
  if (nombre === 'transferir') {
    cargarColaboradoresDisponibles();
    actualizarVistaMisCanastillas();
  }
  if (nombre === 'historial') dibujarHistorialCan();
};

// =====================================================
// ===== ESTADO ACTUAL DEL COLABORADOR =====
// =====================================================
function obtenerEstadoColaborador(nombreColab) {
  const movimientoActivo = movimientos.find(m =>
    m.colaborador === nombreColab && !m.horaLlegada
  );
  const salidasActivas = movimientos
    .filter(m => m.colaborador === nombreColab && !m.horaLlegada)
    .reduce((s, m) => s + (m.canastillasSalida || 0), 0);
  const recibidas = window.transferenciasCanastillas
    .filter(t => t.destino === nombreColab)
    .reduce((s, t) => s + (t.cantidad || 0), 0);
  const enviadas = window.transferenciasCanastillas
    .filter(t => t.origen === nombreColab)
    .reduce((s, t) => s + (t.cantidad || 0), 0);
  const kilosEnviados = window.transferenciasCanastillas
    .filter(t => t.origen === nombreColab)
    .reduce((s, t) => s + (t.kilos || 0), 0);
  const kilosRecibidos = window.transferenciasCanastillas
    .filter(t => t.destino === nombreColab)
    .reduce((s, t) => s + (t.kilos || 0), 0);

  return {
    movimientoActivo,
    canastillasActuales: salidasActivas + recibidas - enviadas,
    transferenciasRecibidas: recibidas,
    transferenciasEnviadas: enviadas,
    kilosEnviados,
    kilosRecibidos
  };
}

// =====================================================
// ===== ACTUALIZAR VISTA =====
// =====================================================
async function actualizarVistaMisCanastillas() {
  const nombre = usuarioActivo?.nombre;
  if (!nombre) return;
  const estado = obtenerEstadoColaborador(nombre);

  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  set('misCanastillasActuales', estado.canastillasActuales);
  set('misCanastillasRecibidas', estado.transferenciasRecibidas);
  set('misCanastillasEnviadas', estado.transferenciasEnviadas);
  set('misKilosEnviados', estado.kilosEnviados.toFixed(2));
  set('misKilosRecibidos', estado.kilosRecibidos.toFixed(2));
  set('dispCanastillas', estado.canastillasActuales);

  const divMov = document.getElementById('miMovimientoActivo');
  if (estado.movimientoActivo) {
    divMov.style.display = 'block';
    set('miPlacaActiva', estado.movimientoActivo.placa || '—');
    set('miHoraSalida', estado.movimientoActivo.horaSalida || '—');
    set('misCanastillasSalida', estado.movimientoActivo.canastillasSalida || 0);
  } else {
    divMov.style.display = 'none';
  }
  dibujarIntercambiosRecientes();
}

// =====================================================
// ===== CARGAR COLABORADORES DISPONIBLES =====
// =====================================================
function cargarColaboradoresDisponibles() {
  const sel = document.getElementById('destinoTransferencia');
  if (!sel) return;
  const yo = usuarioActivo?.nombre;
  const conSalida = colaboradores.filter(c => {
    if (!c.nombre || c.nombre === yo) return false;
    return movimientos.some(m => m.colaborador === c.nombre && !m.horaLlegada);
  });
  sel.innerHTML = `<option value="">-- Seleccione --</option>` +
    conSalida.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
}

// =====================================================
// ===== GUARDAR TRANSFERENCIA EN SUPABASE =====
// =====================================================
window.confirmarTransferencia = async function () {
  const origen = usuarioActivo?.nombre;
  const destino = document.getElementById('destinoTransferencia').value;
  const cantidad = parseInt(document.getElementById('cantidadTransferir').value) || 0;
  const obs = document.getElementById('obsTransferencia').value;

  if (!origen || !destino || cantidad <= 0) return alert('⚠️ Complete todos los datos');
  
  const estado = obtenerEstadoColaborador(origen);
  if (cantidad > estado.canastillasActuales) {
    return alert(`⚠️ Solo tiene ${estado.canastillasActuales} disponibles`);
  }

  const movActivo = movimientos.find(m => m.colaborador === origen && !m.horaLlegada);
  let kilos = 0;
  if (movActivo?.recogidas) {
    const r = movActivo.recogidas.find(x => x.recogeA === destino);
    if (r) kilos = r.kilos || 0;
  }

  if (!confirm(`¿Transferir ${cantidad} canastillas de ${origen} → ${destino}?`)) return;

  const nueva = {
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('es-CO', {hour:'2-digit', minute:'2-digit'}),
    origen, destino, cantidad, kilos, observaciones: obs, estado: 'completada'
  };

  // ✅ SUPABASE — INSERTAR
  const { data, error } = await supabase
    .from('transferencias_canastillas')
    .insert([nueva])
    .select();

  if (error) {
    console.error('Error guardando:', error);
    return alert('❌ No se pudo guardar: ' + error.message);
  }

  window.transferenciasCanastillas.unshift(data[0]);
  localStorage.setItem('transferenciasCanastillas', JSON.stringify(window.transferenciasCanastillas));

  alert(`✅ Transferencia exitosa:\n${cantidad} canastillas → ${destino}\n${kilos.toFixed(2)} kg`);
  
  await actualizarVistaMisCanastillas();
  cargarColaboradoresDisponibles();
  document.getElementById('cantidadTransferir').value = '1';
  document.getElementById('obsTransferencia').value = '';
  document.getElementById('destinoTransferencia').value = '';
};

// =====================================================
// ===== CARGAR TRANSFERENCIAS DESDE SUPABASE =====
// =====================================================
window.cargarTransferenciasCanastillas = async function () {
  const { data, error } = await supabase
    .from('transferencias_canastillas')
    .select('*')
    .order('fecha', { ascending: false })
    .order('hora', { ascending: false })
    .limit(100);

  if (error) {
    console.warn('Cargando desde localStorage:', error);
    const guardadas = localStorage.getItem('transferenciasCanastillas');
    window.transferenciasCanastillas = guardadas ? JSON.parse(guardadas) : [];
    return;
  }

  window.transferenciasCanastillas = data || [];
  localStorage.setItem('transferenciasCanastillas', JSON.stringify(window.transferenciasCanastillas));
};

// =====================================================
// ===== RENDERIZAR TABLAS =====
// =====================================================
function dibujarIntercambiosRecientes() {
  const tb = document.getElementById('tablaIntercambiosCuerpo');
  const yo = usuarioActivo?.nombre;
  if (!tb || !yo) return;

  const lista = window.transferenciasCanastillas
    .filter(t => t.origen === yo || t.destino === yo)
    .slice(0, 10);

  tb.innerHTML = lista.length === 0
    ? '<tr><td colspan="6" class="text-center">📭 Sin intercambios</td></tr>'
    : lista.map(t => {
        const esSalida = t.origen === yo;
        return `<tr>
          <td>${t.fecha} ${t.hora}</td>
          <td>${esSalida ? '<span style="color:#dc2626">📤 Envié</span>' : '<span style="color:#16a34a">📥 Recibí</span>'}</td>
          <td>${esSalida ? t.destino : t.origen}</td>
          <td><strong>${t.cantidad}</strong></td>
          <td>${t.kilos.toFixed(2)}</td>
          <td>✅ Completada</td>
        </tr>`;
      }).join('');
}

function dibujarHistorialCan() {
  const tb = document.getElementById('tablaHistorialCanCuerpo');
  const yo = usuarioActivo?.nombre;
  if (!tb || !yo) return;

  const buscar = (document.getElementById('buscarHistorialCan')?.value || '').toLowerCase();
  const lista = window.transferenciasCanastillas
    .filter(t => t.origen === yo || t.destino === yo)
    .filter(t => !buscar || t.fecha.includes(buscar) || t.origen.toLowerCase().includes(buscar) || t.destino.toLowerCase().includes(buscar));

  tb.innerHTML = lista.length === 0
    ? '<tr><td colspan="7" class="text-center">📭 Sin registros</td></tr>'
    : lista.map(t => {
        const esSalida = t.origen === yo;
        return `<tr>
          <td>${t.fecha}</td><td>${t.hora}</td>
          <td>${esSalida ? '📤 Enviado' : '📥 Recibido'}</td>
          <td>${esSalida ? t.destino : t.origen}</td>
          <td>${t.cantidad}</td><td>${t.kilos.toFixed(2)}</td>
          <td>${t.observaciones || '—'}</td>
        </tr>`;
      }).join('');
}

window.filtrarHistorialCan = dibujarHistorialCan;

// =====================================================
// ===== SINCRONIZAR AL CERRAR MOVIMIENTO =====
// =====================================================
const origCompletarMov = window.completarMovimientoDirecto;
window.completarMovimientoDirecto = async function(id) {
  if (origCompletarMov) await origCompletarMov(id);
  if (document.getElementById('misCanastillasActuales')) await actualizarVistaMisCanastillas();
};

// Cargar al iniciar
window.cargarTransferenciasCanastillas();