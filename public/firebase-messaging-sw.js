importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Firebase config will be read/initialized on load.
// Under standard firebase hosting, firebase-config is initialized automatically
// or we can initialize with placeholders that work out-of-the-box.
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Scanron Radar';
  const notificationOptions = {
    body: payload.notification?.body || 'Shenron QR codes are ready!',
    icon: '/favicon.svg',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
