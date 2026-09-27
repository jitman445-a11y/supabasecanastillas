// =====================================================
// ===== ⚙️ MÓDULO ADMINISTRACIÓN — SUPABASE =====
// ===== ⚠️ NO DECLARAR VARIABLES AQUÍ =====
// =====================================================
window.cargarModulo_administracion = async function() {
    const c = document.getElementById('contenidoDinamico');
    if (!c) return;

    // 🔒 Solo administradores
    if (usuarioActivo?.rol !== 'admin') {
        c.innerHTML = `<div class="tarjeta text-center py-8 text-red-500">🔒 Solo administradores pueden acceder</div>`;
        return;
    }

    c.innerHTML = `
    <div class="flex gap-2 mb-4">
        <button class="btn-subpestaña activa" onclick="cambiarSubAdmin('colaboradores', event)">👥 Colaboradores</button>
        <button class="btn-subpestaña" onclick="cambiarSubAdmin('vehiculos', event)">🚗 Vehículos</button>
        <button class="btn-subpestaña" onclick="cambiarSubAdmin('usuarios', event)">🔑 Usuarios del Sistema</button>
    </div>
    <!-- COLABORADORES -->
    <div id="subadm-colaboradores">
        <div class="tarjeta">
            <h3 class="font-bold mb-3">👥 Administración de Colaboradores</h3>
            <div class="grid-2 mb-3">
                <div class="grupo"><label>Nombre Completo</label><input type="text" id="nombreCol" placeholder="Nombre del colaborador"></div>
                <div class="grupo"><label>Estado</label>
                    <select id="estadoCol">
                        <option value="activo">✅ Activo</option>
                        <option value="inactivo">❌ Inactivo</option>
                    </select>
                </div>
            </div>
            <button class="btn btn-primario" onclick="guardarColaborador()">💾 Guardar Colaborador</button>
        </div>
        <div class="tarjeta mt-3">
            <h4 class="font-bold mb-2">📋 Lista de Colaboradores</h4>
            <table class="tabla">
                <thead><tr><th>Nombre</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody id="tablaColaboradoresAdmin"></tbody>
            </table>
        </div>
    </div>
    <!-- VEHÍCULOS -->
    <div id="subadm-vehiculos" class="oculto">
        <div class="tarjeta">
            <h3 class="font-bold mb-3">🚗 Administración de Vehículos (Movimientos)</h3>
            <div class="grid-2 mb-3">
                <div class="grupo"><label>Placa</label><input type="text" id="placaVeh" placeholder="ABC-123"></div>
                <div class="grupo"><label>Tipo</label>
                    <select id="tipoVeh">
                        <option value="Moto">🏍️ Moto</option>
                        <option value="Carro">🚗 Carro</option>
                        <option value="Camión">🚛 Camión</option>
                        <option value="Carguero">🚚 Carguero</option>
                        <option value="Furgón">📦 Furgón</option>
                    </select>
                </div>
            </div>
            <button class="btn btn-primario" onclick="guardarVehiculo()">💾 Guardar Vehículo</button>
        </div>
        <div class="tarjeta mt-3">
            <h4 class="font-bold mb-2">📋 Lista de Vehículos de Movimientos</h4>
            <table class="tabla">
                <thead><tr><th>Placa</th><th>Tipo</th><th>Acciones</th></tr></thead>
                <tbody id="tablaVehiculosAdmin"></tbody>
            </table>
        </div>
    </div>
    <!-- USUARIOS DEL SISTEMA -->
    <div id="subadm-usuarios" class="oculto">
        <div class="tarjeta">
            <h3 class="font-bold mb-3">🔑 Usuarios del Sistema</h3>
            <p class="mb-3 text-sm">Usuarios con acceso al sistema y permisos asignados.</p>
            <div class="grid-2 mb-3">
                <div class="grupo"><label>Usuario (Login)</label><input type="text" id="usuarioSis" placeholder="Ej: jperez"></div>
                <div class="grupo"><label>Nombre Completo</label><input type="text" id="nombreSis" placeholder="Nombre completo"></div>
                <div class="grupo"><label>Contraseña</label><input type="text" id="claveSis" placeholder="Escriba contraseña"></div>
                <div class="grupo"><label>Rol / Permisos</label>
                    <select id="rolSis">
                        <option value="usuario">👤 Usuario (Solo ver y registrar)</option>
                        <option value="admin">👑 Administrador (Todo)</option>
                    </select>
                </div>
            </div>
            <button class="btn btn-primario" onclick="guardarUsuarioSistema()">💾 Guardar Usuario</button>
        </div>
        <div class="tarjeta mt-3">
            <h4 class="font-bold mb-2">📋 Lista de Usuarios</h4>
            <table class="tabla">
                <thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr></thead>
                <tbody id="tablaUsuariosSistema"></tbody>
            </table>
        </div>
    </div>
    `;

    dibujarTablaColaboradoresAdmin();
    dibujarTablaVehiculosAdmin();
    dibujarTablaUsuariosSistema();
};

function cambiarSubAdmin(nombre, evento) {
    document.querySelectorAll('#subadm-colaboradores, #subadm-vehiculos, #subadm-usuarios').forEach(d => d.classList.add('oculto'));
    document.querySelectorAll('#contenidoDinamico .btn-subpestaña').forEach(b => b.classList.remove('activa'));
    if (evento && evento.currentTarget) evento.currentTarget.classList.add('activa');
    document.getElementById(`subadm-${nombre}`).classList.remove('oculto');
}

// ===== COLABORADORES =====
async function guardarColaborador() {
    const nombre = document.getElementById('nombreCol').value.trim();
    const estado = document.getElementById('estadoCol').value;
    if (!nombre) return alert('⚠️ Escriba el nombre del colaborador');

    try {
        await guardarRegistro('colaboradores', {
            nombre,
            estado,
            usuarioRegistro: usuarioActivo?.nombre || 'Desconocido'
        });
        alert('✅ Colaborador guardado');
        document.getElementById('nombreCol').value = '';
        await cargarTabla('colaboradores', 'colaboradores');
        dibujarTablaColaboradoresAdmin();
    } catch (e) {
        alert('❌ Error: ' + e.message);
    }
}

function dibujarTablaColaboradoresAdmin() {
    const tb = document.getElementById('tablaColaboradoresAdmin');
    if (!tb) return;
    tb.innerHTML = colaboradores.map(c => `
        <tr>
            <td>${c.nombre}</td>
            <td>${(c.estado || 'activo') === 'activo' ? '✅ Activo' : '❌ Inactivo'}</td>
            <td>
                <button class="btn btn-amarillo btn-sm" onclick="editarColaborador('${c.id}','${c.nombre}','${c.estado||'activo'}')">✏️ Editar</button>
                <button class="btn btn-peligro btn-sm" onclick="eliminarColaborador('${c.id}')">🗑️ Eliminar</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="3" class="text-center">📭 Sin colaboradores</td></tr>';
}

async function editarColaborador(id, nombre, estado) {
    const nuevoNombre = prompt('Editar Nombre:', nombre);
    if (nuevoNombre === null) return;
    const nuevoEstado = confirm('¿Marcar como Inactivo?') ? 'inactivo' : 'activo';

    try {
        await actualizarRegistro('colaboradores', id, {
            nombre: nuevoNombre.trim(),
            estado: nuevoEstado
        });
        alert('✅ Colaborador actualizado');
        await cargarTabla('colaboradores', 'colaboradores');
        dibujarTablaColaboradoresAdmin();
    } catch (e) {
        alert('❌ Error: ' + e.message);
    }
}

async function eliminarColaborador(id) {
    if (!confirm('⚠️ ¿Eliminar este colaborador? Esta acción no se puede deshacer.')) return;

    try {
        await eliminarRegistro('colaboradores', id);
        alert('✅ Colaborador eliminado');
        await cargarTabla('colaboradores', 'colaboradores');
        dibujarTablaColaboradoresAdmin();
    } catch (e) {
        alert('❌ Error: ' + e.message);
    }
}

// ===== VEHÍCULOS =====
async function guardarVehiculo() {
    const placa = document.getElementById('placaVeh').value.trim().toUpperCase();
    const tipo = document.getElementById('tipoVeh').value;
    if (!placa) return alert('⚠️ Escriba la placa');

    try {
        await guardarRegistro('vehiculos_movimientos', {
            placa,
            tipo,
            usuarioRegistro: usuarioActivo?.nombre || 'Desconocido'
        });
        alert('✅ Vehículo guardado');
        document.getElementById('placaVeh').value = '';
        await cargarTabla('vehiculos_movimientos', 'vehiculosMov');
        dibujarTablaVehiculosAdmin();
    } catch (e) {
        alert('❌ Error: ' + e.message);
    }
}

function dibujarTablaVehiculosAdmin() {
    const tb = document.getElementById('tablaVehiculosAdmin');
    if (!tb) return;
    tb.innerHTML = vehiculosMov.map(v => `
        <tr>
            <td>${v.placa}</td>
            <td>${v.tipo}</td>
            <td>
                <button class="btn btn-amarillo btn-sm" onclick="editarVehiculo('${v.id}','${v.placa}','${v.tipo}')">✏️ Editar</button>
                <button class="btn btn-peligro btn-sm" onclick="eliminarVehiculo('${v.id}')">🗑️ Eliminar</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="3" class="text-center">📭 Sin vehículos</td></tr>';
}

async function editarVehiculo(id, placa, tipo) {
    const nuevaPlaca = prompt('Editar Placa:', placa);
    if (nuevaPlaca === null) return;

    try {
        await actualizarRegistro('vehiculos_movimientos', id, {
            placa: nuevaPlaca.trim().toUpperCase()
        });
        alert('✅ Vehículo actualizado');
        await cargarTabla('vehiculos_movimientos', 'vehiculosMov');
        dibujarTablaVehiculosAdmin();
    } catch (e) {
        alert('❌ Error: ' + e.message);
    }
}

async function eliminarVehiculo(id) {
    if (!confirm('⚠️ ¿Eliminar este vehículo? Esta acción no se puede deshacer.')) return;

    try {
        await eliminarRegistro('vehiculos_movimientos', id);
        alert('✅ Vehículo eliminado');
        await cargarTabla('vehiculos_movimientos', 'vehiculosMov');
        dibujarTablaVehiculosAdmin();
    } catch (e) {
        alert('❌ Error: ' + e.message);
    }
}

// ===== USUARIOS DEL SISTEMA =====
async function guardarUsuarioSistema() {
    const usuario = document.getElementById('usuarioSis').value.trim();
    const nombre = document.getElementById('nombreSis').value.trim();
    const clave = document.getElementById('claveSis').value;
    const rol = document.getElementById('rolSis').value;

    if (!usuario || !nombre || !clave) return alert('⚠️ Complete todos los campos');

    try {
        // Verificar si ya existe
        const { data: existente } = await db().from('usuarios').select('usuario').eq('usuario', usuario).maybeSingle();
        if (existente) return alert('⚠️ Este usuario ya existe');

        await guardarRegistro('usuarios', {
            usuario,
            nombre,
            clave,
            rol,
            usuarioRegistro: usuarioActivo?.nombre || 'Desconocido'
        });
        alert('✅ Usuario guardado');
        document.getElementById('usuarioSis').value = '';
        document.getElementById('nombreSis').value = '';
        document.getElementById('claveSis').value = '';
        await cargarTabla('usuarios', 'usuarios');
        dibujarTablaUsuariosSistema();
    } catch (e) {
        alert('❌ Error: ' + e.message);
    }
}

function dibujarTablaUsuariosSistema() {
    const tb = document.getElementById('tablaUsuariosSistema');
    if (!tb) return;
    // Combinar usuarios fijos (del sistema) + usuarios de la base de datos
    const todos = [...usuariosFijos, ...(usuarios.filter(u => !usuariosFijos.some(f => f.usuario === u.usuario)) || [])];
    tb.innerHTML = todos.map(u => `
        <tr>
            <td>${u.usuario}</td>
            <td>${u.nombre}</td>
            <td>${u.rol === 'admin' ? '👑 Admin' : '👤 Usuario'}</td>
            <td>
                ${usuariosFijos.some(f => f.usuario === u.usuario)
                    ? '<span class="text-xs text-gray-400">Fijo del sistema</span>'
                    : `<button class="btn btn-amarillo btn-sm" onclick="editarUsuarioSistema('${u.id}','${u.usuario}','${u.nombre}','${u.rol}')">✏️ Editar</button>`
                }
            </td>
        </tr>
    `).join('') || '<tr><td colspan="4" class="text-center">📭 Sin usuarios registrados</td></tr>';
}

async function editarUsuarioSistema(id, usuario, nombre, rol) {
    const nuevoNombre = prompt('Editar Nombre:', nombre);
    if (nuevoNombre === null) return;
    const nuevoRol = confirm('¿Es Administrador?') ? 'admin' : 'usuario';

    try {
        await actualizarRegistro('usuarios', id, {
            nombre: nuevoNombre.trim(),
            rol: nuevoRol
        });
        alert('✅ Usuario actualizado');
        await cargarTabla('usuarios', 'usuarios');
        dibujarTablaUsuariosSistema();
    } catch (e) {
        alert('❌ Error: ' + e.message);
    }
}