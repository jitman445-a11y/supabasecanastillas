// =====================================================
// ===== 📋 VARIABLES GLOBALES =====
// =====================================================
let usuarioActivo = null;
let idEdicion = null;

window.colaboradores = [];
window.conductores = [];
window.vehiculos = [];
window.donantes = [];
window.anuncios = [];
window.usuarios = [];
window.listaRoles = [];

// Esperar conexión
async function esperarSupabase() {
  if (window.supabaseConectado) return true;
  return new Promise(resolve => {
    const revisar = setInterval(() => {
      if (window.supabaseConectado) {
        clearInterval(revisar);
        resolve(true);
      }
    }, 100);
  });
}

// =====================================================
// ===== 🔐 INICIO / CIERRE DE SESIÓN =====
// =====================================================
async function iniciarSesion(usuario, clave) {
  if (!window.supabaseConectado) await esperarSupabase();
  if (!window.supabase) {
    alert('❌ Supabase no está conectado');
    return false;
  }

  const { data, error } = await window.supabase
    .from('usuarios')
    .select('*')
    .eq('usuario', usuario)
    .eq('clave', clave)
    .eq('activa', true)
    .single();

  if (error || !data) {
    console.error('Error login:', error);
    alert('❌ Usuario o contraseña incorrectos');
    return false;
  }

  usuarioActivo = data;
  localStorage.setItem('usuarioActivo', JSON.stringify(data));
  console.log('✅ Sesión iniciada:', data.nombre, `(${data.rol})`);
  return true;
}

function cerrarSesion() {
  usuarioActivo = null;
  localStorage.removeItem('usuarioActivo');
  location.reload();
}

function recuperarSesion() {
  const guardada = localStorage.getItem('usuarioActivo');
  if (guardada) {
    usuarioActivo = JSON.parse(guardada);
    return true;
  }
  return false;
}

// =====================================================
// ===== 🔄 CARGA DE DATOS =====
// =====================================================
async function cargarDatosGlobales() {
  if (!window.supabaseConectado) await esperarSupabase();
  if (!window.supabase) return;

  try {
    const [col, cond, veh, don, usu, roles] = await Promise.all([
      window.supabase.from('colaboradores').select('*'),
      window.supabase.from('conductores_transportadora').select('*'),
      window.supabase.from('vehiculos').select('*'),
      window.supabase.from('donantes').select('*'),
      window.supabase.from('usuarios').select('*'),
      window.supabase.from('roles').select('*')
    ]);

    window.colaboradores = col.data || [];
    window.conductores = cond.data || [];
    window.vehiculos = veh.data || [];
    window.donantes = don.data || [];
    window.usuarios = usu.data || [];
    window.listaRoles = roles.data || [];

    console.log('✅ Datos cargados:', window.usuarios.length, 'usuarios');
  } catch (e) {
    console.error('❌ Error cargando datos:', e);
  }
}

// =====================================================
// ===== 🔒 PERMISOS =====
// =====================================================
function tienePermiso(modulo) {
  if (!usuarioActivo) return false;
  if (usuarioActivo.rol === 'admin') return true;
  return !!usuarioActivo.permisos?.[modulo];
}

// =====================================================
// ===== 📦 CARGA DE MÓDULOS =====
// =====================================================
const modulosDisponibles = {
  movimientos:     { archivo: 'movimientos.js',      nombre: 'Movimientos' },
  transportadora:  { archivo: 'transportadora.js',   nombre: 'Transportadora' },
  misCanastillas:  { archivo: 'misCanastillas.js',   nombre: 'Mis Canastillas' },
  recoleccion:     { archivo: 'recoleccion.js',      nombre: 'Recolección' },
  anuncios:        { archivo: 'anuncios.js',         nombre: 'Anuncios' },
  donantes:        { archivo: 'donantes.js',         nombre: 'Donantes' },
  combustible:     { archivo: 'combustible.js',      nombre: 'Combustible' },
  informes:        { archivo: 'informes.js',         nombre: 'Informes' },
  usuarios:        { archivo: 'usuarios.js',         nombre: 'Usuarios' }
};

async function cargarModulo(nombreModulo) {
  const contenedor = document.getElementById('contenido');
  if (!contenedor) return;

  if (!tienePermiso(nombreModulo)) {
    contenedor.innerHTML = `<div class="tarjeta text-center" style="color:#ef4444;">🔒 Sin permiso para este módulo</div>`;
    return;
  }

  const mod = modulosDisponibles[nombreModulo];
  if (!mod) return;

  if (!window[`__cargado_${nombreModulo}`]) {
    const script = document.createElement('script');
    script.src = mod.archivo;
    await new Promise((res, rej) => {
      script.onload = res;
      script.onerror = rej;
      document.head.appendChild(script);
    });
    window[`__cargado_${nombreModulo}`] = true;
    console.log(`✅ ${mod.archivo} cargado`);
  }

  if (window[`cargarModulo_${nombreModulo}`]) {
    await window[`cargarModulo_${nombreModulo}`]();
  }
}

console.log('✅ funciones.js cargado');