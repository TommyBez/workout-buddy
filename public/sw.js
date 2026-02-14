const CACHE_NAME = 'fitforge-pwa-v1'

// Cache static assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/icon.svg',
        '/icon-192.png',
        '/icon-512.png',
        '/apple-touch-icon.png',
      ])
    })
  )
  self.skipWaiting()
})

// Clean old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    )
  )
  self.clients.claim()
})

// Network-first for navigation, cache fallback for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() =>
          caches.match(event.request).then((r) => r || caches.match('/'))
        )
    )
    return
  }

  // For static assets, use cache-first
  if (
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    event.request.url.includes('/_next/static/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    )
  }
})
