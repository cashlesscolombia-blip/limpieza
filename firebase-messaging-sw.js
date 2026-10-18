/* Service worker de Firebase Cloud Messaging: recibe las push con la app cerrada
   (aviso a los supervisores VL cuando una habitación queda EN VERIFICACIÓN). */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyA6m1FFeRtDhqgzwASpHSZinLVF897za3s',
  authDomain: 'house-53644.firebaseapp.com',
  projectId: 'house-53644',
  storageBucket: 'house-53644.firebasestorage.app',
  messagingSenderId: '144124364159',
  appId: '1:144124364159:web:e9b662d0bb45b7f79d864a'
});

const messaging = firebase.messaging();
const APP_URL = 'https://cashlesscolombia-blip.github.io/limpieza/?view=supervisor';
const ICON = 'icons/icon-192.png';

// Los mensajes con bloque "notification" los muestra FCM solo; este manejador cubre los de solo "data".
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const d = payload.data || {};
  self.registration.showNotification('Habitación por verificar', {
    body: d.number ? 'Habitación ' + d.number + ' lista para verificación' : 'Hay una habitación lista para verificación',
    icon: ICON, badge: ICON, data: { link: d.link || APP_URL }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const link = (data.FCM_MSG && data.FCM_MSG.data && data.FCM_MSG.data.link) || data.link ||
    (data.FCM_MSG && data.FCM_MSG.notification && data.FCM_MSG.notification.click_action) || APP_URL;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.startsWith(new URL(link).origin + '/limpieza') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(link);
    })
  );
});
