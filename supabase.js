// =====================================================
// 🔌 CONEXIÓN A TU PROYECTO SUPABASE — Control Corabastos
// =====================================================

const SUPABASE_URL = 'https://dhyuqpnrugebowrjxeo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeXVxcGducnVnZWJvd3JqeGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NDI1MDksImV4cCI6MjEwNjAxODUwOX0.025FneEmdDkErLvOBkxz7sT6xcHwg9IKct2XEPy9BDc';

// Verificar que la librería esté cargada
if (typeof supabase !== 'undefined') {
  // Crear la conexión
  window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window.supabaseConectado = true;
  console.log('✅ Supabase CONECTADO correctamente');
  console.log('📍 Proyecto:', SUPABASE_URL);
} else {
  console.error('❌ La librería de Supabase NO está cargada');
  console.error('💡 Verifica que en el index.html esté la línea:');
  console.error('<script src="https://unpkg.com/@supabase/supabase-js@2/dist/supabase.min.js"></script>');
}