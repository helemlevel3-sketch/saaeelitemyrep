self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {
    data = { title: 'Report Tim Efan', body: event.data ? event.data.text() : 'Ada pengingat baru.' };
  }
  const title = data.title || 'Report Tim Efan';
  const options = {
    body: data.body || 'Ada pengingat baru.',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    tag: data.tag || 'report-tim-efan',
    renotify: !!data.renotify,
    data: { url: data.url || '/', type: data.type || '' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil((async () => {
    const list = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of list) {
      if ('focus' in client) {
        try { await client.navigate(url); } catch (_) {}
        return client.focus();
      }
    }
    if (clients.openWindow) return clients.openWindow(url);
  })());
});
