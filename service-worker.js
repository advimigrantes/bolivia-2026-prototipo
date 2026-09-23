/* O shell é público; os dados reais ficam somente no snapshot local do navegador. */
const CACHE_NAME = "bolivia-2026-v5";
const APP_SHELL = ["./","./index.html","./manifest.webmanifest","./css/styles.css","./js/data.js","./js/maps.js","./js/api.js","./js/app.js","./assets/logo-pldf-com-fundo.png","./assets/foto-perfil.jpg","./assets/aviao.png","./assets/icon-bolivia.svg","./assets/icon-bolivia-180.png","./assets/icon-bolivia-192.png","./assets/icon-bolivia-512.png"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request,copy)); return response; }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html"))));
});
