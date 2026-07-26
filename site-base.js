(function () {
  window.SITE_BASE = "";
  window.siteUrl = function (path) {
    const p = path.startsWith("/") ? path : "/" + path;
    return window.SITE_BASE + p;
  };
})();
