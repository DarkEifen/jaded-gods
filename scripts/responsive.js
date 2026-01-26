/**
 * responsive.js — escalado proporcional para layouts fijos de Adobe Muse.
 * Objetivo: que el sitio sea “presentable” en GitHub Pages y pantallas pequeñas
 * sin re-diseñar todos los elementos posicionados por Muse.
 */
(function () {
  var BASE_WIDTH = 1200; // ancho de diseño que usa Muse en este sitio

  function applyScale() {
    var page = document.getElementById('page');
    if (!page) return;

    // Calcula escala: nunca amplía por encima de 1 (desktop se queda igual)
    var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    var scale = Math.min(1, vw / BASE_WIDTH);

    // Aplica transform
    page.style.transformOrigin = 'top center';
    page.style.transform = 'scale(' + scale.toFixed(4) + ')';

    // Ajusta el alto del body para evitar “recortes” y footer que se sube/encoge
    // (getBoundingClientRect ya refleja el transform)
    var rect = page.getBoundingClientRect();
    var scaledHeight = rect.height;

    // Preserva un mínimo para evitar saltos en iOS/Android
    document.body.style.minHeight = Math.max(scaledHeight, window.innerHeight) + 'px';
  }

  // Aplica al cargar, y cuando cambie el viewport
  window.addEventListener('load', applyScale);
  window.addEventListener('resize', applyScale);

  // En algunos navegadores el DOM “termina” antes que los assets (imágenes); re-aplica luego.
  window.setTimeout(applyScale, 300);
  window.setTimeout(applyScale, 1200);
})();
