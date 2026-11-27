/** Register the lightweight offline shell worker only in secure production contexts. */
export async function registerAppServiceWorker(onUpdate = () => {}) {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return null
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) onUpdate()
      })
    })
    return registration
  } catch (error) {
    console.warn('Offline support could not be enabled:', error)
    return null
  }
}
