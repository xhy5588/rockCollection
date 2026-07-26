(function () {
  function detectBase() {
    if (!location.hostname.endsWith("github.io")) return "";
    const parts = location.pathname.split("/").filter(Boolean);
    if (!parts.length) return "";
    return "/" + parts[0];
  }

  window.SITE_BASE = detectBase();
  window.siteUrl = function (path) {
    const p = path.startsWith("/") ? path : "/" + path;
    return window.SITE_BASE + p;
  };
})();
