// =====================================================
// ===== 📦 MÓDULO: RECOLECCIÓN DE PRODUCTO — SUPABASE =====
// =====================================================

window.cargarModulo_recoleccion = async function () {
  const c = document.getElementById('contenido');
  if (!c) return;

  const usuarioActual = usuarioActivo?.nombre;
  if (!usuarioActual) {
    c.innerHTML = `<div class="tarjeta">⚠️ No se identificó el usuario activo</div>`;
    return;
  }

  // 🔄 Cargar anuncios desde Supabase
  const { data: anuncios, error } = await supabase
    .from('anuncios')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error cargando anuncios:', error);
    c.innerHTML = `<div class="tarjeta text-red-600">❌ Error cargando datos: ${error.message}</div>`;
    return;
  }

  // Filtrar: asignados a este usuario
  const asignados = (anuncios || []).filter(a =>
    ['asignado', 'en_proceso'].includes(a.estado) &&
    a.asignados?.includes(usuarioActual)
  );

  const terminados = (anuncios || []).filter(a =>
    a.estado === 'terminado' &&
    a.asignados?.includes(usuarioActual)
  );

  c.innerHTML = `
<style>
  .tarjeta {
    background: white; border-radius: 0.75rem; padding: 1.25rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom: 1rem;
  }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .border { border: 1px solid #e5e7eb; }
  .p-4 { padding: 1rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 0.75rem; }
  .mt-4 { margin-top: 1rem; }
  .w-full { width: 100%; }
  .text-center { text-align: center; }
  .text-blue-600 { color: #2563eb; }
  .text-green-600 { color: #16a34a; }
  .text-red-600 { color: #dc2626; }
  .text-gray-500 { color: #6b7280; }
  .bg-yellow-50 { background: #fffbeb; }
  .bg-blue-50 { background: #eff6ff; }
  label { display: block; font-weight: 500; margin-bottom: 0.3rem; margin-top: 0.75rem; }
  input, button {
    padding: 0.6rem; border-radius: 0.375rem; border: 1px solid #d1d5db;
    font-size: 0.95rem;
  }
  button { border: none; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .btn { background: #e5e7eb; }
  .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.875rem; }
  .btn-amarillo { background: #eab308; color: #1f2937; }
  .btn-exito { background: #16a34a; color: white; }
  .btn-exito:hover { background: #15803d; }
  table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  th, td { padding: 0.6rem 0.5rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
  th { background: #f3f4f6; font-weight: 600; }
  a { text-decoration: none; }
  @media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
  }
</style>

<div class="tarjeta">
  <h3 class="font-bold mb-4">📦 Recolección de Producto — ${usuarioActual}</h3>
  
  ${asignados.length === 0
    ? '<p class="text-center text-gray-500 py-4">✅ No tienes recogidas asignadas</p>'
    : `<h4 class="font-bold mb-3">📍 Mis Recogidas</h4>` +
      asignados.map(p => `
      <div class="border rounded-lg p-4 mb-4 ${p.estado === 'en_proceso' ? 'bg-yellow-50' : 'bg-blue-50'}" id="rec-${p.id}">
        <div class="grid-2 mb-3">
          <div>
            <strong>${p.comerciante}</strong><br>
            📍 Bodega: ${p.bodega || '—'} | Puesto: ${p.puesto || '—'}<br>
            📞 ${p.telefono || 'Sin teléfono'}<br>
            📦 ${p.producto || 'Producto'} — ${p.cantidad || ''}<br>
            👥 Asignado: ${(p.asignados || []).join(', ')}
          </div>
          <div>
            <p class="mb-2">
              Estado: <strong>${p.estado === 'asignado' ? '🔵 Pendiente de Llegada' : '🟠 En Proceso'}</strong>
            </p>
            
            ${p.estado === 'asignado'
              ? `<button class="btn btn-amarillo w-full" onclick="marcarEnProceso(${p.id})">🚩 Ya llegué — Iniciar Recolección</button>`
              : `<div>
                  <label>Número de Recibo *</label>
                  <input type="text" id="recibo-${p.id}" placeholder="Ej: REC-001" value="${p.numeroRecibo || ''}" style="width:100%;">
                  
                  <label>Ubicación GPS</label>
                  <div style="display:flex; gap:0.5rem; margin-top:0.3rem;">
                    <input type="text" id="ubicacion-${p.id}" placeholder="Latitud, Longitud" value="${p.ubicacion || ''}" readonly style="flex:1; background:#f3f4f6;">
                    <button class="btn btn-sm" onclick="capturarUbicacion(${p.id})" id="btnGps-${p.id}">📍 Obtener</button>
                  </div>
                  <small id="estadoGps-${p.id}" class="text-green-600" style="display:block; margin-top:0.3rem;">
                    ${p.ubicacion ? '✅ Ubicación guardada' : ''}
                  </small>
                  
                  <button class="btn btn-exito w-full mt-3" onclick="marcarTerminado(${p.id})">✅ Finalizar Recolección</button>
                </div>`
            }
          </div>
        </div>
      </div>
      `).join('')
  }
</div>

${terminados.length > 0 ? `
<div class="tarjeta mt-4">
  <h4 class="font-bold mb-3">✅ Mis Recogidas Terminadas (${terminados.length})</h4>
  <div style="overflow-x:auto;">
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Recibo N°</th>
          <th>Comerciante</th>
          <th>Bodega/Puesto</th>
          <th>Ubicación</th>
        </tr>
      </thead>
      <tbody>
        ${terminados.map(r => `
        <tr>
          <td>${r.fechaTerminado?.split('T')[0] || r.fecha || '—'}</td>
          <td><strong>${r.numeroRecibo || '—'}</strong></td>
          <td>${r.comerciante || '—'}</td>
          <td>${r.bodega || '—'} / ${r.puesto || '—'}</td>
          <td>
            ${r.ubicacion
              ? `<a href="https://www.google.com/maps?q=${r.ubicacion}" target="_blank" class="text-blue-600">📍 Ver mapa</a>`
              : 'Sin ubicación'}
          </td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</div>
` : ''}
  `;
};

// =====================================================
// ✅ MARCAR COMO EN PROCESO = LLEGÓ AL LUGAR
// =====================================================
window.marcarEnProceso = async function (id) {
  if (!confirm('🚩 ¿Confirmas que ya llegaste al punto de recolección?')) return;

  const { error } = await supabase
    .from('anuncios')
    .update({
      estado: 'en_proceso',
      fechaLlegada: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error(error);
    return alert('❌ Error: ' + error.message);
  }

  alert('✅ Estado cambiado: EN PROCESO\nAhora puedes capturar ubicación y finalizar');
  cargarModulo_recoleccion();
};

// =====================================================
// 📍 CAPTURAR UBICACIÓN GPS
// =====================================================
window.capturarUbicacion = function (idAnuncio) {
  const input = document.getElementById(`ubicacion-${idAnuncio}`);
  const estado = document.getElementById(`estadoGps-${idAnuncio}`);
  const btn = document.getElementById(`btnGps-${idAnuncio}`);

  if (!navigator.geolocation) {
    estado.textContent = '❌ GPS no soportado en este dispositivo';
    return;
  }

  btn.disabled = true;
  btn.textContent = '🔄...';
  estado.textContent = 'Obteniendo ubicación...';

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      const ubicacionTexto = `${lat}, ${lon}`;

      input.value = ubicacionTexto;
      estado.textContent = '✅ Ubicación capturada — Guardando...';

      // Guardar en Supabase
      const { error } = await supabase
        .from('anuncios')
        .update({ ubicacion: ubicacionTexto })
        .eq('id', idAnuncio);

      if (error) {
        estado.textContent = `⚠️ Capturada pero sin guardar: ${error.message}`;
      } else {
        estado.textContent = '✅ Ubicación guardada';
      }

      btn.disabled = false;
      btn.textContent = '📍 Obtener';
    },
    (err) => {
      estado.textContent = `❌ Error: ${err.message}`;
      btn.disabled = false;
      btn.textContent = '📍 Obtener';
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
};

// =====================================================
// ✅ MARCAR COMO TERMINADO
// =====================================================
window.marcarTerminado = async function (id) {
  const recibo = document.getElementById(`recibo-${id}`)?.value.trim();
  const ubicacion = document.getElementById(`ubicacion-${id}`)?.value.trim() || null;

  if (!recibo) {
    return alert('⚠️ Ingrese el número de recibo');
  }

  const { error } = await supabase
    .from('anuncios')
    .update({
      estado: 'terminado',
      numeroRecibo: recibo,
      ubicacion: ubicacion,
      fechaTerminado: new Date().toISOString(),
      recogidoPor: usuarioActivo?.nombre
    })
    .eq('id', id);

  if (error) {
    console.error(error);
    return alert('❌ Error al finalizar: ' + error.message);
  }

  alert(`✅ Recolección FINALIZADA!\nRecibo: ${recibo}\n${ubicacion ? 'Ubicación guardada ✅' : 'Sin ubicación'}`);
  cargarModulo_recoleccion();
};

console.log('✅ recoleccion.js cargado — Supabase');