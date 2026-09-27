// =====================================================
// ===== 👥 GESTIÓN DE USUARIOS — SUPABASE =====
// =====================================================

window.cargarModulo_usuarios = async function () {
  const c = document.getElementById('contenido');
  if (!c) return;

  // 🔄 Cargar datos desde Supabase
  const { data: usuariosData, error: usuErr } = await supabase
    .from('usuarios')
    .select('*');
  const { data: rolesData, error: rolesErr } = await supabase
    .from('roles')
    .select('*');
  const { data: colaboradoresData, error: colErr } = await supabase
    .from('colaboradores')
    .select('*');
  const { data: conductoresData, error: condErr } = await supabase
    .from('conductores_transportadora')
    .select('*');

  if (usuErr || rolesErr || colErr || condErr) {
    console.error('Error cargando datos:', { usuErr, rolesErr, colErr, condErr });
    c.innerHTML = `<div class="tarjeta text-red-600">❌ Error cargando datos</div>`;
    return;
  }

  // Cargar a variables globales
  window.usuarios = usuariosData || [];
  window.listaRoles = rolesData || [];
  window.colaboradores = colaboradoresData || [];
  window.conductores = conductoresData || [];

  c.innerHTML = `
<style>
  .tarjeta { background: white; border-radius: 0.75rem; padding: 1.25rem; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom: 1rem; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .grupo { margin-bottom: 0.75rem; }
  .col-span-2 { grid-column: 1 / -1; }
  label { display: block; font-weight: 500; margin-bottom: 0.3rem; }
  input, select { width: 100%; padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.95rem; }
  .flex { display: flex; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .flex-wrap { flex-wrap: wrap; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mt-6 { margin-top: 1.5rem; }
  .oculto { display: none !important; }
  .text-center { text-align: center; }
  .font-bold { font-weight: 700; }
  .btn { padding: 0.6rem 1rem; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .btn-sm { padding: 0.4rem 0.6rem; font-size: 0.875rem; }
  .btn-subpestaña { background: #e5e7eb; margin-bottom: 0.5rem; }
  .btn-subpestaña.activa { background: #2563eb; color: white; }
  .btn-primario { background: #2563eb; color: white; }
  .btn-primario:hover { background: #1d4ed8; }
  .btn-exito { background: #16a34a; color: white; }
  .btn-exito:hover { background: #15803d; }
  .btn-amarillo { background: #eab308; color: #1f2937; }
  .btn-peligro { background: #ef4444; color: white; }
  .btn-peligro:hover { background: #dc2626; }
  .tabla { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .tabla th, .tabla td { padding: 0.6rem 0.5rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
  .tabla th { background: #f3f4f6; font-weight: 600; }
  small { color: #6b7280; font-size: 0.8rem; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
  @media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
  }
</style>

<div class="flex gap-2 mb-4 flex-wrap">
  <button class="btn btn-subpestaña activa" onclick="cambiarSubpestañaUsu('listar', event)">📋 Lista de Usuarios</button>
  <button class="btn btn-subpestaña" onclick="cambiarSubpestañaUsu('crear', event)">➕ Crear Usuario</button>
  <button class="btn btn-subpestaña" onclick="cambiarSubpestañaUsu('roles', event)">⚙️ Gestión de Roles</button>
</div>

<!-- LISTA DE USUARIOS -->
<div id="subusu-listar">
  <div class="tarjeta">
    <h3 class="font-bold mb-4">👥 Usuarios del Sistema</h3>
    <div class="mb-3">
      <input type="text" id="buscarUsuario" placeholder="🔍 Buscar por nombre o usuario..." oninput="filtrarUsuarios()">
    </div>
    <table class="tabla">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Nombre Completo</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tablaUsuariosCuerpo"></tbody>
    </table>
  </div>
</div>

<!-- CREAR/EDITAR USUARIO -->
<div id="subusu-crear" class="oculto">
  <div class="tarjeta">
    <h3 class="font-bold mb-4" id="tituloFormUsu">➕ Nuevo Usuario</h3>
    <div class="grid-2">
      <div class="grupo">
        <label>👤 Usuario (login) *</label>
        <input type="text" id="usu_usuario" placeholder="ej: jperez">
      </div>
      <div class="grupo">
        <label>🔑 Contraseña *</label>
        <input type="password" id="usu_clave" placeholder="Mínimo 6 caracteres">
      </div>
      <div class="grupo col-span-2">
        <label>📝 Nombre Completo *</label>
        <input type="text" id="usu_nombre" placeholder="Nombre y apellidos">
      </div>
      <div class="grupo col-span-2">
        <label>🔗 Vincular a Colaborador/Conductor</label>
        <select id="usu_colaborador_vinculo">
          <option value="">-- No vincular — crear usuario independiente --</option>
          <optgroup label="Colaboradores">
            ${(window.colaboradores || []).map(c => `<option value="${c.id}||colaborador">${c.nombre || c.nombreCompleto || 'Sin nombre'}</option>`).join('')}
          </optgroup>
          <optgroup label="Conductores">
            ${(window.conductores || []).map(c => `<option value="${c.id}||conductor">${c.nombre || c.nombreCompleto || 'Sin nombre'}</option>`).join('')}
          </optgroup>
        </select>
        <small>Selecciona para copiar el nombre y enlazar sus datos</small>
      </div>
      <div class="grupo">
        <label>🎭 Rol *</label>
        <select id="usu_rol">
          <option value="">-- Seleccionar Rol --</option>
          <option value="admin">🔧 Administrador</option>
          <option value="editor">✏️ Editor</option>
          <option value="usuario">👤 Usuario</option>
          ${(window.listaRoles || []).map(r => `<option value="${r.nombre}">${r.nombre}</option>`).join('')}
        </select>
      </div>
      <div class="grupo">
        <label>✅ Estado</label>
        <select id="usu_activo">
          <option value="true" selected>Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
      <div class="grupo col-span-2">
        <label>📋 Permisos de Módulos</label>
        <div id="checkModulosPermisos" class="grid-2" style="max-height:250px; overflow-y:auto; padding:0.5rem; border:1px solid #ddd; border-radius:0.5rem;">
          ${generarCheckModulos()}
        </div>
      </div>
    </div>
    <div class="flex gap-3 mt-6">
      <button class="btn btn-exito" onclick="guardarUsuario()">💾 Guardar</button>
      <button class="btn btn-amarillo" onclick="limpiarFormUsuario()">🔄 Limpiar</button>
      <button class="btn btn-peligro" onclick="cambiarSubpestañaUsu('listar')">❌ Cancelar</button>
    </div>
  </div>
</div>

<!-- GESTIÓN DE ROLES -->
<div id="subusu-roles" class="oculto">
  <div class="tarjeta">
    <h3 class="font-bold mb-4">⚙️ Crear y Configurar Roles</h3>
    <div class="grupo">
      <label>Nombre del Nuevo Rol</label>
      <input type="text" id="nuevoRolNombre" placeholder="ej: Supervisor">
    </div>
    <div class="grupo">
      <label>Permisos para este Rol</label>
      <div id="checkModulosRol" class="grid-2" style="max-height:250px; overflow-y:auto; padding:0.5rem; border:1px solid #ddd; border-radius:0.5rem;">
        ${generarCheckModulos()}
      </div>
    </div>
    <button class="btn btn-exito mb-4" onclick="guardarNuevoRol()">✅ Crear Rol</button>
    
    <hr>
    
    <h4 class="font-bold mb-3">Roles Creados</h4>
    <div id="listaRolesCreados">
      ${(window.listaRoles || []).length === 0 ? '<p style="color:#666;">Aún no hay roles personalizados</p>' : ''}
    </div>
  </div>
</div>
  `;

  dibujarTablaUsuarios();
  dibujarListaRoles();

  // Auto-copiar nombre si se selecciona colaborador
  setTimeout(() => {
    const sel = document.getElementById('usu_colaborador_vinculo');
    if (sel) sel.addEventListener('change', autoCompletarNombreVinculado);
  }, 50);
};

// =====================================================
// ===== VARIABLES LOCALES =====
// =====================================================
let idEdicion = null;

// =====================================================
// ===== CAMBIAR SUBPESTAÑA =====
// =====================================================
function cambiarSubpestañaUsu(nombre, evt) {
  document.querySelectorAll('[id^="subusu-"]').forEach(p => p.classList.add('oculto'));
  document.querySelectorAll('.btn-subpestaña').forEach(b => b.classList.remove('activa'));
  if (evt?.currentTarget) evt.currentTarget.classList.add('activa');
  document.getElementById(`subusu-${nombre}`).classList.remove('oculto');
  if (nombre === 'crear') {
    document.getElementById('tituloFormUsu').textContent = idEdicion ? '✏️ Editar Usuario' : '➕ Nuevo Usuario';
  }
}

// =====================================================
// ===== GENERAR CHECKBOX DE MÓDULOS =====
// =====================================================
function generarCheckModulos() {
  const modulos = [
    { id: 'movimientos', nombre: '🚚 Movimientos' },
    { id: 'transportadora', nombre: '🚛 Transportadora' },
    { id: 'misCanastillas', nombre: '📋 Mis Canastillas' },
    { id: 'recoleccion', nombre: '📥 Recolección' },
    { id: 'anuncios', nombre: '📢 Anuncios' },
    { id: 'donantes', nombre: '🤝 Donantes' },
    { id: 'combustible', nombre: '⛽ Combustible' },
    { id: 'mantenimiento', nombre: '🔧 Mantenimiento' },
    { id: 'informes', nombre: '📊 Informes' },
    { id: 'usuarios', nombre: '👥 Gestión Usuarios' },
    { id: 'admin', nombre: '⚙️ Administración' }
  ];

  return modulos.map(m => `
    <div style="display:flex; align-items:center; gap:0.5rem; padding:0.3rem 0;">
      <input type="checkbox" id="perm_${m.id}" data-modulo="${m.id}">
      <label for="perm_${m.id}" style="margin:0; font-size:0.9rem;">${m.nombre}</label>
    </div>
  `).join('');
}

// =====================================================
// ===== AUTO-COMPLETAR NOMBRE AL VINCULAR =====
// =====================================================
function autoCompletarNombreVinculado() {
  const valor = document.getElementById('usu_colaborador_vinculo').value;
  if (!valor) return;

  const [id, tipo] = valor.split('||');
  let persona = null;

  if (tipo === 'colaborador') {
    persona = (window.colaboradores || []).find(c => String(c.id) === String(id));
  } else {
    persona = (window.conductores || []).find(c => String(c.id) === String(id));
  }

  if (persona) {
    const nombre = persona.nombre || persona.nombreCompleto || '';
    document.getElementById('usu_nombre').value = nombre;
    document.getElementById('usu_usuario').value = nombre.toLowerCase().replace(/\s+/g, '.');
  }
}

// =====================================================
// ===== DIBUJAR TABLA =====
// =====================================================
function dibujarTablaUsuarios() {
  const tb = document.getElementById('tablaUsuariosCuerpo');
  if (!tb) return;

  const todos = window.usuarios || [];

  tb.innerHTML = todos.length === 0
    ? '<tr><td colspan="5" class="text-center">📭 Sin usuarios registrados</td></tr>'
    : todos.map(u => `
    <tr>
      <td><strong>${u.usuario}</strong></td>
      <td>${u.nombre}</td>
      <td><span style="background:${u.rol==='admin'?'#D1FAE5':'#E0E7FF'}; padding:0.2rem 0.6rem; border-radius:1rem; font-size:0.85rem; font-weight:600;">${u.rol}</span></td>
      <td>${u.activo !== false ? '<span style="color:green; font-weight:bold;">✅ Activo</span>' : '<span style="color:red; font-weight:bold;">❌ Inactivo</span>'}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-sm btn-amarillo" onclick="editarUsuario('${u.id}')">✏️</button>
          <button class="btn btn-sm ${u.activo !== false ? 'btn-peligro' : 'btn-exito'}" onclick="cambiarEstadoUsuario('${u.id}', ${u.activo !== false})">
            ${u.activo !== false ? '🔇 Desactivar' : '🔊 Activar'}
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function filtrarUsuarios() {
  const b = (document.getElementById('buscarUsuario')?.value || '').toLowerCase();
  const filas = document.querySelectorAll('#tablaUsuariosCuerpo tr');
  filas.forEach(f => {
    const t = f.textContent.toLowerCase();
    f.style.display = !b || t.includes(b) ? '' : 'none';
  });
}

// =====================================================
// ===== GUARDAR USUARIO =====
// =====================================================
async function guardarUsuario() {
  const usuario = (document.getElementById('usu_usuario').value || '').trim();
  const clave = document.getElementById('usu_clave').value;
  const nombre = (document.getElementById('usu_nombre').value || '').trim();
  const rol = document.getElementById('usu_rol').value;
  const activo = document.getElementById('usu_activo').value === 'true';
  const vinculadoA = document.getElementById('usu_colaborador_vinculo').value || null;
  const permisos = obtenerPermisosSeleccionados();

  if (!usuario || !nombre || !rol) {
    return alert('⚠️ Complete usuario, nombre y rol');
  }
  if (!idEdicion && (!clave || clave.length < 6)) {
    return alert('⚠️ La contraseña debe tener al menos 6 caracteres');
  }

  const datos = { usuario, nombre, rol, activo, vinculadoA, permisos };
  if (clave) datos.clave = clave;

  try {
    if (idEdicion) {
      const { error } = await supabase
        .from('usuarios')
        .update(datos)
        .eq('id', idEdicion);
      if (error) throw error;
      const idx = window.usuarios.findIndex(u => u.id === idEdicion);
      if (idx >= 0) window.usuarios[idx] = { ...window.usuarios[idx], ...datos };
      alert('✅ Usuario actualizado');
    } else {
      const existe = window.usuarios.find(u => u.usuario === usuario);
      if (existe) return alert('⚠️ Este nombre de usuario ya existe');
      const { data, error } = await supabase
        .from('usuarios')
        .insert(datos)
        .select()
        .single();
      if (error) throw error;
      window.usuarios.push(data);
      alert('✅ Usuario creado correctamente');
    }
    limpiarFormUsuario();
    cambiarSubpestañaUsu('listar');
    dibujarTablaUsuarios();
  } catch (e) {
    alert('❌ Error: ' + e.message);
  }
}

function obtenerPermisosSeleccionados() {
  const permisos = {};
  document.querySelectorAll('#checkModulosPermisos input[type="checkbox"]').forEach(cb => {
    permisos[cb.dataset.modulo] = cb.checked;
  });
  return permisos;
}

function limpiarFormUsuario() {
  idEdicion = null;
  document.getElementById('usu_usuario').value = '';
  document.getElementById('usu_clave').value = '';
  document.getElementById('usu_nombre').value = '';
  document.getElementById('usu_colaborador_vinculo').value = '';
  document.getElementById('usu_rol').value = '';
  document.getElementById('usu_activo').value = 'true';
  document.querySelectorAll('#checkModulosPermisos input[type="checkbox"]').forEach(cb => cb.checked = false);
}

async function editarUsuario(id) {
  const u = window.usuarios.find(x => String(x.id) === String(id));
  if (!u) return;

  idEdicion = id;
  cambiarSubpestañaUsu('crear');

  setTimeout(() => {
    document.getElementById('usu_usuario').value = u.usuario || '';
    document.getElementById('usu_nombre').value = u.nombre || '';
    document.getElementById('usu_rol').value = u.rol || '';
    document.getElementById('usu_activo').value = String(u.activo !== false);
    document.getElementById('usu_colaborador_vinculo').value = u.vinculadoA || '';
    // Marcar permisos
    const permisos = u.permisos || {};
    document.querySelectorAll('#checkModulosPermisos input[type="checkbox"]').forEach(cb => {
      cb.checked = !!permisos[cb.dataset.modulo];
    });
  }, 50);
}

async function cambiarEstadoUsuario(id, estaActivo) {
  const nuevoEstado = !estaActivo;
  if (!confirm(`¿${nuevoEstado ? '✅ Activar' : '🔇 Desactivar'} este usuario?`)) return;

  const { error } = await supabase
    .from('usuarios')
    .update({ activo: nuevoEstado })
    .eq('id', id);

  if (error) return alert('❌ Error: ' + error.message);

  const u = window.usuarios.find(x => String(x.id) === String(id));
  if (u) u.activo = nuevoEstado;
  dibujarTablaUsuarios();
}

// =====================================================
// ===== GESTIÓN DE ROLES =====
// =====================================================
async function guardarNuevoRol() {
  const nombre = (document.getElementById('nuevoRolNombre').value || '').trim();
  if (!nombre) return alert('⚠️ Escriba un nombre para el rol');

  const existe = window.listaRoles.find(r => r.nombre === nombre);
  if (existe) return alert('⚠️ Este rol ya existe');

  const permisos = {};
  document.querySelectorAll('#checkModulosRol input[type="checkbox"]').forEach(cb => {
    permisos[cb.dataset.modulo] = cb.checked;
  });

  try {
    const { data, error } = await supabase
      .from('roles')
      .insert({ nombre, permisos })
      .select()
      .single();
    if (error) throw error;
    window.listaRoles.push(data);
    alert(`✅ Rol "${nombre}" creado`);
    document.getElementById('nuevoRolNombre').value = '';
    document.querySelectorAll('#checkModulosRol input[type="checkbox"]').forEach(cb => cb.checked = false);
    dibujarListaRoles();
  } catch (e) {
    alert('❌ Error: ' + e.message);
  }
}

function dibujarListaRoles() {
  const cont = document.getElementById('listaRolesCreados');
  if (!cont) return;

  cont.innerHTML = window.listaRoles.length === 0
    ? '<p style="color:#666;">Aún no hay roles personalizados</p>'
    : window.listaRoles.map((r, i) => `
    <div class="tarjeta" style="padding:1rem; margin-bottom:0.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h4 class="font-bold">${r.nombre}</h4>
        <button class="btn btn-sm btn-peligro" onclick="eliminarRol(${r.id})">🗑️ Eliminar</button>
      </div>
      <div style="margin-top:0.5rem; font-size:0.85rem; color:#555;">
        Módulos: ${Object.entries(r.permisos || {}).filter(([_, v]) => v).map(([m]) => m).join(', ') || 'Ninguno seleccionado'}
      </div>
    </div>`).join('');
}

async function eliminarRol(id) {
  if (!confirm('⚠️ ¿Eliminar este rol?')) return;

  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);

  if (error) return alert('❌ Error: ' + error.message);

  window.listaRoles = window.listaRoles.filter(r => r.id !== id);
  dibujarListaRoles();
}

console.log('✅ usuarios.js cargado — Supabase');