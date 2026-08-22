self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // We just need a basic fetch handler for the PWA install prompt to trigger.
  // Not implementing aggressive offline caching for the hackathon MVP.
  event.respondWith(fetch(event.request));
});//hello 
