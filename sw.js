// Service Worker：支撑后台推送通知 + 图标角标（小红点）
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch (_) {}
  var title = data.title || '选股日记已更新';
  var body = data.body || '有新的选股或行情更新';
  e.waitUntil((async function () {
    try { if (typeof self.registration.setAppBadge === 'function') await self.registration.setAppBadge(1); } catch (_) {}
    await self.registration.showNotification(title, {
      body: body,
      icon: 'icon.svg',
      badge: 'icon.svg',
      tag: 'pick-update',
      renotify: true
    });
  })());
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  if (typeof self.registration.setAppBadge === 'function') {
    self.registration.setAppBadge(0).catch(function () {});
  }
  e.waitUntil((async function () {
    var list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (var i = 0; i < list.length; i++) { if ('focus' in list[i]) return list[i].focus(); }
    if (self.clients.openWindow) return self.clients.openWindow('./');
  })());
});
