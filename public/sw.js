const CACHE_NAME = 'harmonious-home-shell-v3'
const SHELL = ['/', '/index.html', '/favicon.svg', '/manifest.webmanifest']
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('harmonious-home-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put('/index.html', response.clone()))
      return response
    }).catch(() => caches.match('/index.html').then(cached => cached || caches.match('/'))))
    return
  }
  if (/\.(?:js|css|svg|woff2?|png|webp|ico)$/.test(url.pathname)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()))
      return response
    })))
  }
})
self.addEventListener('push', event => {
  let data = { title: 'Harmonious Home', body: 'You have a home maintenance reminder.', url: '/' }
  try { data = { ...data, ...event.data.json() } } catch {}
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: '/favicon.svg', badge: '/favicon.svg', data: { url: data.url || '/' }, tag: 'harmonious-home-maintenance' }))
})
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
    const existing = windows.find(client => 'focus' in client)
    return existing ? existing.navigate(url).then(() => existing.focus()) : clients.openWindow(url)
  }))
})
