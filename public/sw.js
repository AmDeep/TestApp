self.addEventListener('push', event => {
  let data = { title: 'Harmonious Home', body: 'You have a home maintenance reminder.', url: '/' }
  try { data = { ...data, ...event.data.json() } } catch {}
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: { url: data.url || '/' },
    tag: 'harmonious-home-maintenance'
  }))
})
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
    const existing = windows.find(client => 'focus' in client)
    return existing ? existing.focus() : clients.openWindow(url)
  }))
})
