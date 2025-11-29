// ADD these lines at the TOP of your sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// ADD Firebase initialization
firebase.initializeApp({
  apiKey: "AIzaSyDHrwJ44p_-MromirwB-sjNCJGJfVaI5BA",
  authDomain: "the-songa-welfare.firebaseapp.com",
  projectId: "the-songa-welfare",
  storageBucket: "the-songa-welfare.firebasestorage.app",
  messagingSenderId: "595080025220",
  appId: "1:595080025220:web:fe4c833c55de37abdd1ed1"
});

const messaging = firebase.messaging();
// sw.js - Service Worker for THE SONGA WELFARE
const CACHE_NAME = 'songa-welfare-v1.0';
const urlsToCache = [
  '/innercircle/',
  '/innercircle/index.html',
  '/innercircle/events.html',
  '/innercircle/library.html', 
  '/innercircle/about.html',
  '/innercircle/manifest.json',
  'https://i.postimg.cc/QCfkMpcM/20251121-1617-Golden-Lion-Emblem-remix-01kak8vrfpfb9r1335qyg8w1gt.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches  
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
// ADD these lines at the BOTTOM of your sw.js

// Handle background messages (when app is closed)
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification?.title || 'THE SONGA WELFARE';
  const notificationOptions = {
    body: payload.notification?.body || 'New update available!',
    icon: 'https://i.postimg.cc/QCfkMpcM/20251121-1617-Golden-Lion-Emblem-remix-01kak8vrfpfb9r1335qyg8w1gt.png',
    badge: 'https://i.postimg.cc/QCfkMpcM/20251121-1617-Golden-Lion-Emblem-remix-01kak8vrfpfb9r1335qyg8w1gt.png',
    data: payload.data || {},
    tag: 'songawelfare-update'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window or open new one
      for (const client of clientList) {
        if (client.url.includes('/innercircle/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/innercircle/');
      }
    })
  );
});
