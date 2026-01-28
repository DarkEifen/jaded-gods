/* Responsive helper for Adobe Muse exports on static hosting (GitHub Pages).
   Goals:
   - Keep the original 1200px composition (horizontal header, etc.)
   - Scale the whole Muse canvas down on small viewports
   - Disable Muse scroll effects/parallax when scaled (they break under scaling)
*/
(function () {
  "use strict";

  function viewportW() {
    return Math.min(window.innerWidth || 0, document.documentElement.clientWidth || 0) || 0;
  }

  function patchMuseScrollEffects() {
    if (!window.__DISABLE_MUSE_SCROLL_EFFECTS__) return;
    var $ = window.jQuery;
    if (!$ || $.fn.__museScrollPatched) return;

    var noop = function(){ return this; };
    // Muse scroll-effects plugin methods (no-op for mobile)
    $.fn.registerPositionScrollEffect = noop;
    $.fn.registerOpacityScrollEffect = noop;
    $.fn.registerBackgroundPositionScrollEffect = noop;
    $.fn.registerBackgroundScrollEffect = noop;

    $.fn.__museScrollPatched = true;
  }

  function applyScale() {
    var page = document.getElementById("page");
    if (!page) return;

    var baseW = parseFloat((getComputedStyle(page).width || "1200").replace("px","")) || 1200;
    var w = viewportW();
    if (!w) return;

    // Scale only when viewport is narrower than the design width
    var scale = Math.min(1, w / baseW);

    // Disable scroll effects/parallax when scaled
    window.__DISABLE_MUSE_SCROLL_EFFECTS__ = (scale < 1);

    // Prefer zoom where supported (keeps layout/scroll consistent)
    var supportsZoom = false;
    try { supportsZoom = CSS && CSS.supports && CSS.supports("zoom", "1"); } catch(e) {}

    if (supportsZoom) {
      page.style.zoom = String(scale);
      page.style.transform = "none";
    } else {
      page.style.zoom = "1";
      page.style.transform = "scale(" + scale + ")";
    }

    page.style.transformOrigin = "top center";
  }

  function onReady(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  onReady(function () {
    applyScale();
    // Patch after jQuery loads (Muse loads it late via require.js)
    var tries = 0;
    var t = setInterval(function(){
      patchMuseScrollEffects();
      tries += 1;
      if (tries > 60 || (window.jQuery && window.jQuery.fn.__museScrollPatched)) clearInterval(t);
    }, 100);

    window.addEventListener("resize", function () {
      applyScale();
      patchMuseScrollEffects();
    });
    window.addEventListener("orientationchange", function () {
      setTimeout(function(){
        applyScale();
        patchMuseScrollEffects();
      }, 150);
    });
  });
})();
