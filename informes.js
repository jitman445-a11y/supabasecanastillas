// =====================================================
// ===== 📊 MÓDULO INFORMES — COMPLETO =====
// ===== ✅ BOTONES RESPONSIVOS PARA MÓVIL =====
// =====================================================
window.cargarModulo_informes = async function () {
  const c = document.getElementById('contenido');
  if (!c) return;

  c.innerHTML = `
<style>
  /* Estilos mejorados para botones de subinforme */
  .contenedor-botones-subinforme {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
    width: 100%;
  }
  .btn-subinforme {
    flex: 1 1 auto;
    min-width: 140px;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: none;
    background: #e5e7eb;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    text-align: center;
  }
  .btn-subinforme:hover {
    background: #d1d5db;
  }
  .btn-subinforme.activa {
    background: #2563eb;
    color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .tarjeta {
    background: white;
    border-radius: 0.75rem;
    padding: 1.25rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    margin-bottom: 1rem;
  }
  .tabla {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  .tabla th, .tabla td {
    padding: 0.6rem 0.5rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  .tabla th {
    background: #f3f4f6;
    font-weight: 600;
  }
  .tabla tr:hover {
    background: #f9fafb;
  }
  .btn-principal {
    background: #2563eb;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s;
  }
  .btn-principal:hover {
    background: #1d4ed8;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  @media (max-width: 768px) {
    .grid-3 {
      grid-template-columns: 1fr;
    }
  }
</style>

  <div class="tarjeta">
    <h3 class="font-bold text-xl mb-4">📊 Informes y Reportes</h3>
    
    <div class="contenedor-botones-subinforme">
      <button class="btn-subinforme activa" data-sub="movimientos" onclick="cambiarSubinforme('movimientos', event)">
        📦 Movimientos
      </button>
      <button class="btn-subinforme" data-sub="kilometraje" onclick="cambiarSubinforme('kilometraje', event)">
        📏 Kilometraje
      </button>
      <button class="btn-subinforme" data-sub="combustible" onclick="cambiarSubinforme('combustible', event)">
        ⛽ Combustible
      </button>
      <button class="btn-subinforme" data-sub="anuncios" onclick="cambiarSubinforme('anuncios', event)">
        📢 Anuncios y Recogidas
      </button>
    </div>
  </div>

  <div id="contenidoInforme"></div>
  `;

  // Cargar primer informe por defecto
  await cambiarSubinforme('movimientos');
};

// ===== CAMBIAR DE SUBINFORME =====
window.cambiarSubinforme = async function (tipo, evento) {
  // Quitar clase activa a todos
  document.querySelectorAll('.btn-subinforme').forEach(b => b.classList.remove('activa'));
  // Poner activa al botón seleccionado
  if (evento?.target) {
    evento.target.classList.add('activa');
  } else {
    const btn = document.querySelector(`[data-sub="${tipo}"]`);
    if (btn) btn.classList.add('activa');
  }

  const c = document.getElementById('contenidoInforme');
  if (!c) return;

  // Cargar colecciones necesarias
  movimientos = await cargarColeccion('movimientos');
  kilometraje = await cargarColeccion('kilometraje');
  tanqueo = await cargarColeccion('tanqueo');
  anuncios = await cargarColeccion('anuncios');

  // ==============================================
  // SUBINFORME: MOVIMIENTOS
  // ==============================================
  if (tipo === 'movimientos') {
    c.innerHTML = `
    <div class="tarjeta">
      <h4 class="font-bold mb-4">📦 Reporte de Movimientos</h4>
      
      <div class="grid-3 mb-6">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-2xl font-bold text-gray-800">${movimientos.length}</p>
          <p class="text-sm text-gray-500">Total Movimientos</p>
        </div>
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">${movimientos.filter(m => m.estado === 'salida').length}</p>
          <p class="text-sm text-blue-500">Salidas</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">${movimientos.filter(m => m.estado === 'llegada').length}</p>
          <p class="text-sm text-green-500">Llegadas</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Colaborador</th>
              <th>Vehículo</th>
              <th>Canastillas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(m => `
              <tr>
                <td>${new Date(m.fecha).toLocaleDateString()}</td>
                <td>${m.colaborador || '—'}</td>
                <td>${m.vehiculo || '—'}</td>
                <td>${m.cantidadCanastillas || 0}</td>
                <td>${m.estado === 'salida' ? '🚀 En salida' : '✅ Llegada'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <button onclick="exportarMovimientosExcel()" class="btn-principal mt-4">📥 Exportar a Excel</button>
    </div>
    `;
  }

  // ==============================================
  // SUBINFORME: KILOMETRAJE
  // ==============================================
  if (tipo === 'kilometraje') {
    const totalKm = kilometraje.reduce((sum, k) => sum + (Number(k.kmFinal || 0) - Number(k.kmInicial || 0)), 0);
    
    c.innerHTML = `
    <div class="tarjeta">
      <h4 class="font-bold mb-4">📏 Reporte de Kilometraje</h4>
      
      <div class="grid-3 mb-6">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-2xl font-bold">${kilometraje.length}</p>
          <p class="text-sm text-gray-500">Registros</p>
        </div>
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">${totalKm.toFixed(0)} km</p>
          <p class="text-sm text-blue-500">Total Recorrido</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">${kilometraje.length > 0 ? (totalKm / kilometraje.length).toFixed(1) : 0} km</p>
          <p class="text-sm text-green-500">Promedio/Registro</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Vehículo</th>
              <th>Km Inicial</th>
              <th>Km Final</th>
              <th>Recorrido</th>
              <th>Conductor</th>
            </tr>
          </thead>
          <tbody>
            ${kilometraje.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(k => {
              const recorrido = Number(k.kmFinal || 0) - Number(k.kmInicial || 0);
              return `
              <tr>
                <td>${new Date(k.fecha).toLocaleDateString()}</td>
                <td>${k.vehiculo || '—'}</td>
                <td>${k.kmInicial || 0}</td>
                <td>${k.kmFinal || 0}</td>
                <td>${recorrido} km</td>
                <td>${k.conductor || '—'}</td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      
      <button onclick="exportarKilometrajeExcel()" class="btn-principal mt-4">📥 Exportar a Excel</button>
    </div>
    `;
  }

  // ==============================================
  // SUBINFORME: COMBUSTIBLE
  // ==============================================
  if (tipo === 'combustible') {
    const totalGalones = tanqueo.reduce((sum, t) => sum + (Number(t.cantidadGalones || 0)), 0);
    const totalValor = tanqueo.reduce((sum, t) => sum + (Number(t.valor || 0)), 0);
    
    c.innerHTML = `
    <div class="tarjeta">
      <h4 class="font-bold mb-4">⛽ Reporte de Combustible</h4>
      
      <div class="grid-3 mb-6">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-2xl font-bold">${tanqueo.length}</p>
          <p class="text-sm text-gray-500">Tanqueos</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <p class="text-2xl font-bold text-yellow-600">${totalGalones.toFixed(2)}</p>
          <p class="text-sm text-yellow-500">Galones Totales</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-xl font-bold text-green-600">$${totalValor.toLocaleString('es-CO')}</p>
          <p class="text-sm text-green-500">Valor Total</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Vehículo</th>
              <th>Galones</th>
              <th>Valor</th>
              <th>Responsable</th>
              <th>Estación</th>
            </tr>
          </thead>
          <tbody>
            ${tanqueo.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(t => `
              <tr>
                <td>${new Date(t.fecha).toLocaleDateString()}</td>
                <td>${t.vehiculo || '—'}</td>
                <td>${t.cantidadGalones || 0}</td>
                <td>$${(t.valor || 0).toLocaleString('es-CO')}</td>
                <td>${t.responsable || '—'}</td>
                <td>${t.estacion || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <button onclick="exportarCombustibleExcel()" class="btn-principal mt-4">📥 Exportar a Excel</button>
    </div>
    `;
  }

  // ==============================================
  // SUBINFORME: ANUNCIOS Y RECOGIDAS ✅ COMPLETO
  // ==============================================
  if (tipo === 'anuncios') {
    const recogidos = anuncios.filter(a => a.estado === 'recogido');
    const pendientes = anuncios.filter(a => a.estado === 'pendiente' || a.estado === 'asignado');
    const enProceso = anuncios.filter(a => a.estado === 'en_proceso');

    // Agrupar por quien recogió
    const porRecolector = {};
    recogidos.forEach(a => {
      const nombre = a.recogidoPor || 'Sin registro';
      porRecolector[nombre] = (porRecolector[nombre] || 0) + 1;
    });

    c.innerHTML = `
    <div class="tarjeta">
      <h4 class="font-bold mb-4">📢 Informe de Anuncios y Recogidas</h4>
      
      <div class="grid-3 mb-6">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-2xl font-bold">${anuncios.length}</p>
          <p class="text-sm text-gray-500">Total Anuncios</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">${recogidos.length}</p>
          <p class="text-sm text-green-500">✅ Recogidos</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <p class="text-2xl font-bold text-yellow-600">${pendientes.length + enProceso.length}</p>
          <p class="text-sm text-yellow-500">⏳ Pendientes</p>
        </div>
      </div>

      ${Object.keys(porRecolector).length > 0 ? `
      <div class="mb-6 p-4 bg-blue-50 rounded-lg">
        <h5 class="font-semibold mb-3">👥 Recogidas por Colaborador</h5>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          ${Object.entries(porRecolector).map(([nombre, cant]) => `
            <div class="bg-white p-2 rounded text-center">
              <p class="font-bold">${cant}</p>
              <p class="text-xs text-gray-500">${nombre}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <h5 class="font-semibold mb-2">Detalle Completo</h5>
      <div class="overflow-x-auto">
        <table class="tabla">
          <thead>
            <tr>
              <th>Fecha Creado</th>
              <th>Donante</th>
              <th>Bodega / Puesto</th>
              <th>Producto</th>
              <th>Estado</th>
              <th>Recogido Por</th>
              <th>Recibo N°</th>
              <th>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            ${anuncios.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(a => `
              <tr>
                <td>${new Date(a.fecha).toLocaleDateString()}</td>
                <td>${a.nombreDonante}</td>
                <td>${a.bodega} / ${a.puesto}</td>
                <td>${a.producto} (${a.cantidad || 's/cantidad'})</td>
                <td>
                  <span class="${
                    a.estado === 'recogido' ? 'text-green-600 font-semibold' :
                    a.estado === 'en_proceso' ? 'text-yellow-600 font-semibold' :
                    'text-gray-500'
                  }">
                    ${a.estado.replace('_', ' ')}
                  </span>
                </td>
                <td>${a.recogidoPor || '—'}</td>
                <td>${a.numeroRecibo || '—'}</td>
                <td>
                  ${a.ubicacion ? `
                    <a href="https://www.google.com/maps?q=${a.ubicacion.lat},${a.ubicacion.lng}" 
                       target="_blank" class="text-blue-600">Ver 📍</a>
                  ` : '—'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <button onclick="exportarAnunciosExcel()" class="btn-principal mt-4">📥 Exportar a Excel</button>
    </div>
    `;
  }
};

// =====================================================
// ===== FUNCIONES DE EXPORTACIÓN A EXCEL =====
// =====================================================

window.exportarMovimientosExcel = function () {
  const datos = movimientos.map(m => ({
    Fecha: new Date(m.fecha).toLocaleDateString(),
    Colaborador: m.colaborador || '',
    Vehículo: m.vehiculo || '',
    CantidadCanastillas: m.cantidadCanastillas || 0,
    Estado: m.estado === 'salida' ? 'En salida' : 'Llegada',
    Observaciones: m.observaciones || ''
  }));
  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Movimientos');
  XLSX.writeFile(libro, `movimientos_${new Date().toISOString().split('T')[0]}.xlsx`);
};

window.exportarKilometrajeExcel = function () {
  const datos = kilometraje.map(k => ({
    Fecha: new Date(k.fecha).toLocaleDateString(),
    Vehículo: k.vehiculo || '',
    KmInicial: k.kmInicial || 0,
    KmFinal: k.kmFinal || 0,
    Recorrido: (Number(k.kmFinal || 0) - Number(k.kmInicial || 0)),
    Conductor: k.conductor || '',
    Observaciones: k.observaciones || ''
  }));
  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Kilometraje');
  XLSX.writeFile(libro, `kilometraje_${new Date().toISOString().split('T')[0]}.xlsx`);
};

window.exportarCombustibleExcel = function () {
  const datos = tanqueo.map(t => ({
    Fecha: new Date(t.fecha).toLocaleDateString(),
    Vehículo: t.vehiculo || '',
    Galones: t.cantidadGalones || 0,
    Valor: t.valor || 0,
    Responsable: t.responsable || '',
    Estación: t.estacion || '',
    KmActual: t.kmActual || ''
  }));
  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Combustible');
  XLSX.writeFile(libro, `combustible_${new Date().toISOString().split('T')[0]}.xlsx`);
};

window.exportarAnunciosExcel = function () {
  const datos = anuncios.map(a => ({
    FechaCreación: new Date(a.fecha).toLocaleDateString(),
    Donante: a.nombreDonante || '',
    Bodega: a.bodega || '',
    Puesto: a.puesto || '',
    Teléfono: a.telefono || '',
    Producto: a.producto || '',
    Cantidad: a.cantidad || '',
    Estado: (a.estado || '').replace('_', ' '),
    AsignadoA: a.asignadoA?.join(', ') || '',
    RecibidoPor: a.recogidoPor || '',
    NúmeroRecibo: a.numeroRecibo || '',
    FechaRecogida: a.fechaRecogida ? new Date(a.fechaRecogida).toLocaleDateString() : '',
    Ubicación: a.ubicacion ? `lat: ${a.ubicacion.lat}, lng: ${a.ubicacion.lng}` : ''
  }));
  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Anuncios');
  XLSX.writeFile(libro, `anuncios_${new Date().toISOString().split('T')[0]}.xlsx`);
};