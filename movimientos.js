// =====================================================
// ===== 📦 MÓDULO MOVIMIENTOS — SUPABASE =====
// =====================================================
window.cargarModulo_movimientos = async function() {
    const hoy = new Date().toISOString().split('T')[0];
    const c = document.getElementById('contenido');
    if (!c) return;
    c.innerHTML = `
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
                        <option value="">-- Seleccione --</option>
                    </select>
                </div>
                <div class="grupo">
                    <label>Colaborador / Conductor</label>
                    <select id="colaborador">
                        <option value="">-- Seleccione --</option>
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
                    <label>Observaciones</label>
                    <textarea id="observaciones" rows="2" placeholder="Novedades, ruta..."></textarea>
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
            <div class="mb-4 flex gap-2">
                <input type="text" id="buscarMovHoy" placeholder="🔍 Buscar..." oninput="dibujarMovimientosHoy()" style="max-width: 400px;">
            </div>
            <div class="grid-2 mb-4">
                <div class="tarjeta p-3">
                    <strong>🚚 Salidas:</strong> <span id="resumenSalidas">0</span>
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

    <!-- ===== PENDIENTES ===== -->
    <div id="submov-pendientes" class="oculto">
        <div class="tarjeta">
            <h3 class="font-bold mb-4">⏳ Pendientes por Llegar</h3>
            <div class="overflow-x-auto">
                <table class="tabla">
                    <thead>
                        <tr>
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

    <!-- ===== COLABORADORES ===== -->
    <div id="submov-colaboradores" class="oculto">
        <div class="tarjeta">
            <h3 class="font-bold mb-4">👤 Registrar Colaborador</h3>
            <div class="grid-2">
                <div class="grupo">
                    <label>Nombre Completo *</label>
                    <input type="text" id="col_nombre" placeholder="Nombre y apellidos">
                </div>
                <div class="grupo">
                    <label>Teléfono</label>
                    <input type="tel" id="col_telefono" placeholder="3XX XXX XXXX">
                </div>
            </div>
            <div class="flex gap-3 mt-4">
                <button class="btn btn-primario" onclick="guardarColaborador()">💾 Guardar</button>
            </div>
        </div>
        <div class="tarjeta mt-6">
            <h3 class="font-bold mb-3">📋 Lista</h3>
            <table class="tabla"><thead><tr><th>Nombre</th><th>Teléfono</th><th>Estado</th></tr></thead>
                <tbody id="tablaColaboradoresCuerpo"></tbody>
            </table>
        </div>
    </div>

    <!-- ===== VEHÍCULOS ===== -->
    <div id="submov-vehiculos" class="oculto">
        <div class="tarjeta">
            <h3 class="font-bold mb-4">🚗 Registrar Vehículo</h3>
            <div class="grid-2">
                <div class="grupo">
                    <label>Placa *</label>
                    <input type="text" id="veh_placa" placeholder="ABC123">
                </div>
                <div class="grupo">
                    <label>Modelo</label>
                    <input type="text" id="veh_modelo" placeholder="Marca y modelo">
                </div>
            </div>
            <div class="flex gap-3 mt-4">
                <button class="btn btn-primario" onclick="guardarVehiculo()">💾 Guardar</button>
            </div>
        </div>
        <div class="tarjeta mt-6">
            <h3 class="font-bold mb-3">📋 Vehículos Registrados</h3>
            <table class="tabla"><thead><tr><th>Placa</th><th>Modelo</th></tr></thead>
                <tbody id="tablaVehiculosCuerpo"></tbody>
            </table>
        </div>
    </div>
    `;

    // Cargar datos y selectores
    setTimeout(async () => {
        await cargarDatosMovimientos();
        actualizarSelectoresMov();
        dibujarTablaRecogidas();
    }, 50);
};

// =====================================================
// ===== CARGAR DATOS DESDE SUPABASE =====
// =====================================================
async function cargarDatosMovimientos() {
    if (!supabaseClient) return;
    try {
        const [movRes, colRes, vehRes] = await Promise.all([
            supabaseClient.from('movimientos').select('*').order('fecha', { ascending: false }),
            supabaseClient.from('colaboradores').select('*'),
            supabaseClient.from('vehiculos').select('*')
        ]);

        window.movimientos = movRes.data || [];
        window.colaboradores = colRes.data || [];
        window.vehiculos = vehRes.data || [];
    } catch (e) {
        console.error('Error cargando datos:', e);
    }
}

// =====================================================
// ===== CAMBIAR SUBPESTAÑA =====
// =====================================================
function cambiarSubpestañaMov(nombre, evt) {
    document.querySelectorAll('.btn-subpestaña').forEach(b => b.classList.remove('activa'));
    if (evt) evt.target.classList.add('activa');
    document.querySelectorAll('[id^="submov-"]').forEach(p => p.classList.add('oculto'));
    const seccion = document.getElementById(`submov-${nombre}`);
    if (seccion) seccion.classList.remove('oculto');
    
    if (nombre === 'hoy') dibujarMovimientosHoy();
    if (nombre === 'pendientes') dibujarMovimientosPendientes();
    if (nombre === 'colaboradores') dibujarListaColaboradores();
    if (nombre === 'vehiculos') dibujarListaVehiculos();
}

// =====================================================
// ===== ACTUALIZAR SELECTORES =====
// =====================================================
function actualizarSelectoresMov() {
    const selPlaca = document.getElementById('placa');
    const selCol = document.getElementById('colaborador');
    
    if (selPlaca) {
        selPlaca.innerHTML = `<option value="">-- Seleccione --</option>` +
            vehiculos.map(v => `<option value="${v.placa}">${v.placa}</option>`).join('');
    }
    if (selCol) {
        selCol.innerHTML = `<option value="">-- Seleccione --</option>` +
            colaboradores.filter(c => c.activa !== false).map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
    }
}

// =====================================================
// ===== GUARDAR MOVIMIENTO =====
// =====================================================
async function guardarMovimientoDesdeForm() {
    if (!supabaseClient) return alert('❌ Sin conexión');
    
    const datos = {
        fecha: document.getElementById('fechaMov').value,
        placa: document.getElementById('placa').value,
        colaborador: document.getElementById('colaborador').value,
        horaSalida: document.getElementById('horaSalida').value,
        canastillasSalida: parseInt(document.getElementById('canastillasSalida').value) || 0,
        horaLlegada: document.getElementById('horaLlegada').value || null,
        canastillasLlegada: parseInt(document.getElementById('canastillasLlegada').value) || 0,
        totalKilos: parseFloat(document.getElementById('totalKilos').value) || 0,
        observaciones: document.getElementById('observaciones').value.trim(),
        recogidas: filasRecogida,
        completado: !!document.getElementById('horaLlegada').value
    };

    if (!datos.fecha || !datos.placa || !datos.colaborador || !datos.horaSalida) {
        return alert('⚠️ Complete todos los campos obligatorios');
    }

    try {
        if (idEdicion) {
            await supabaseClient.from('movimientos').update(datos).eq('id', idEdicion);
        } else {
            await supabaseClient.from('movimientos').insert([datos]);
        }
        alert('✅ Guardado correctamente');
        idEdicion = null;
        filasRecogida = [];
        await cargarDatosMovimientos();
        limpiarFormulario();
    } catch (e) {
        console.error(e);
        alert('❌ Error al guardar');
    }
}

function limpiarFormulario() {
    idEdicion = null;
    filasRecogida = [];
    const hoy = new Date().toISOString().split('T')[0];
    ['fechaMov','placa','colaborador','horaSalida','horaLlegada','observaciones'].forEach(id => {
        if (document.getElementById(id)) document.getElementById(id).value = id === 'fechaMov' ? hoy : '';
    });
    ['canastillasSalida','canastillasLlegada','totalKilos'].forEach(id => {
        if (document.getElementById(id)) document.getElementById(id).value = '0';
    });
    dibujarTablaRecogidas();
}

// =====================================================
// ===== FILAS DE RECOGIDA =====
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
            <select onchange="filasRecogida[${i}].tipo=this.value">
                <option value="canastilla" ${f.tipo==='canastilla'?'selected':''}>Canastilla</option>
                <option value="bulto" ${f.tipo==='bulto'?'selected':''}>Bulto</option>
            </select>
        </td>
        <td><input type="number" min="0" value="${f.cantidad}" onchange="filasRecogida[${i}].cantidad=parseInt(this.value)||0"></td>
        <td><input type="text" value="${f.paraQuien}" placeholder="Nombre"></td>
        <td><input type="number" step="0.01" value="${f.kilos}" onchange="filasRecogida[${i}].kilos=parseFloat(this.value)||0; recalcularTotalKilos()"></td>
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
// ===== LISTAS DE MOVIMIENTOS =====
// =====================================================
function dibujarMovimientosHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const buscar = (document.getElementById('buscarMovHoy')?.value || '').toLowerCase();
    const filtro = movimientos.filter(m => m.fecha === hoy && (
        !buscar || m.placa?.toLowerCase().includes(buscar) || m.colaborador?.toLowerCase().includes(buscar)
    ));
    
    const completados = filtro.filter(m => m.completado).length;
    document.getElementById('resumenSalidas').textContent = filtro.length;
    document.getElementById('resumenCompletados').textContent = completados;

    const tb = document.getElementById('tablaMovHoyCuerpo');
    if (!tb) return;
    tb.innerHTML = filtro.map(m => `
    <tr>
        <td>${m.fecha}</td>
        <td><strong>${m.placa}</strong></td>
        <td>${m.colaborador}</td>
        <td>${m.horaSalida}</td>
        <td>${m.horaLlegada || '—'}</td>
        <td>${m.canastillasSalida}</td>
        <td>${m.canastillasLlegada}</td>
        <td>${m.totalKilos.toFixed(2)}</td>
        <td><button class="btn btn-sm btn-amarillo" onclick="editarMovimiento('${m.id}')">✏️</button></td>
    </tr>`).join('');
}

function dibujarMovimientosPendientes() {
    const hoy = new Date().toISOString().split('T')[0];
    const pendientes = movimientos.filter(m => m.fecha === hoy && !m.completado);
    const tb = document.getElementById('tablaPendientesCuerpo');
    if (!tb) return;
    tb.innerHTML = pendientes.map(m => `
    <tr>
        <td>${m.fecha}</td>
        <td><strong>${m.placa}</strong></td>
        <td>${m.colaborador}</td>
        <td>${m.horaSalida}</td>
        <td>${m.canastillasSalida}</td>
        <td>
            <button class="btn btn-sm btn-exito" onclick="marcarLlegada('${m.id}')">✅ Llegó</button>
        </td>
    </tr>`).join('');
}

async function marcarLlegada(id) {
    const hora = new Date().toLocaleTimeString('es-CO', {hour:'2-digit', minute:'2-digit'});
    await supabaseClient.from('movimientos').update({
        horaLlegada: hora,
        completado: true
    }).eq('id', id);
    await cargarDatosMovimientos();
    dibujarMovimientosPendientes();
}

async function editarMovimiento(id) {
    idEdicion = id;
    const m = movimientos.find(x => x.id === id);
    if (!m) return;
    
    cambiarSubpestañaMov('crear');
    setTimeout(() => {
        if (document.getElementById('fechaMov')) document.getElementById('fechaMov').value = m.fecha;
        if (document.getElementById('placa')) document.getElementById('placa').value = m.placa;
        if (document.getElementById('colaborador')) document.getElementById('colaborador').value = m.colaborador;
        if (document.getElementById('horaSalida')) document.getElementById('horaSalida').value = m.horaSalida;
        if (document.getElementById('canastillasSalida')) document.getElementById('canastillasSalida').value = m.canastillasSalida;
        if (document.getElementById('horaLlegada')) document.getElementById('horaLlegada').value = m.horaLlegada || '';
        if (document.getElementById('canastillasLlegada')) document.getElementById('canastillasLlegada').value = m.canastillasLlegada;
        if (document.getElementById('totalKilos')) document.getElementById('totalKilos').value = m.totalKilos;
        if (document.getElementById('observaciones')) document.getElementById('observaciones').value = m.observaciones || '';
        filasRecogida = m.recogidas || [];
        dibujarTablaRecogidas();
    }, 50);
}

async function eliminarMovimiento(id) {
    if (!confirm('¿Eliminar este movimiento?')) return;
    await supabaseClient.from('movimientos').delete().eq('id', id);
    await cargarDatosMovimientos();
    cambiarSubpestañaMov('hoy');
}

// =====================================================
// ===== COLABORADORES =====
// =====================================================
async function guardarColaborador() {
    const nombre = document.getElementById('col_nombre').value.trim();
    const telefono = document.getElementById('col_telefono').value.trim();
    if (!nombre) return alert('Escriba el nombre');
    
    await supabaseClient.from('colaboradores').insert([{ nombre, telefono, activa: true }]);
    alert('✅ Guardado');
    document.getElementById('col_nombre').value = '';
    document.getElementById('col_telefono').value = '';
    await cargarDatosMovimientos();
    dibujarListaColaboradores();
}

function dibujarListaColaboradores() {
    const tb = document.getElementById('tablaColaboradoresCuerpo');
    if (!tb) return;
    tb.innerHTML = colaboradores.map(c => `
    <tr>
        <td>${c.nombre}</td>
        <td>${c.telefono || '—'}</td>
        <td>${c.activa !== false ? '✅ Activo' : '❌ Inactivo'}</td>
    </tr>`).join('');
}

// =====================================================
// ===== VEHÍCULOS =====
// =====================================================
async function guardarVehiculo() {
    const placa = document.getElementById('veh_placa').value.trim().toUpperCase();
    const modelo = document.getElementById('veh_modelo').value.trim();
    if (!placa) return alert('Escriba la placa');
    
    const { error } = await supabaseClient.from('vehiculos').insert([{ placa, modelo }]);
    if (error) return alert('⚠️ Placa ya registrada');
    
    alert('✅ Vehículo guardado');
    document.getElementById('veh_placa').value = '';
    document.getElementById('veh_modelo').value = '';
    await cargarDatosMovimientos();
    dibujarListaVehiculos();
}

function dibujarListaVehiculos() {
    const tb = document.getElementById('tablaVehiculosCuerpo');
    if (!tb) return;
    tb.innerHTML = vehiculos.map(v => `
    <tr>
        <td><strong>${v.placa}</strong></td>
        <td>${v.modelo || '—'}</td>
    </tr>`).join('');
}

console.log('✅ movimientos.js cargado — Supabase listo');