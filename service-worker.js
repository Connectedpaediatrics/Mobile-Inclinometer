// Connected Paediatrics Inclinometer v10: cache static application shell only.
const CACHE = 'cp-inclinometer-v10';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(Promise.all([caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('cp-inclinometer-') && k !== CACHE).map(k => caches.delete(k)))),self.clients.claim()]));
});
self.addEventListener('fetch', event => {
 const req = event.request;
 if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
 if (req.mode === 'navigate') {
  event.respondWith(fetch(req).then(response => {if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}return response;}).catch(() => caches.match('./index.html')));
 } else {
  event.respondWith(caches.match(req).then(hit => hit || fetch(req)));
 }
});
