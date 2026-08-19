/* global UI_STRINGS */

let currentLang = localStorage.getItem("lang") || "zh";

function t(key) {
  return UI_STRINGS[currentLang][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.dataset.i18nHtml === "true") el.innerHTML = val;
    else el.textContent = val;
  });
  const toggle = document.getElementById("lang-toggle");
  if (toggle) toggle.textContent = t("langLabel");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-toggle")?.addEventListener("click", () => {
    setLang(currentLang === "zh" ? "en" : "zh");
  });
  setLang(currentLang);
});
