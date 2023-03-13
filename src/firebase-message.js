
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import { getToken, getMessaging } from 'firebase/messaging';
import notifyApi from './api/notifyApi';
import { firebaseConfig } from './firebase';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

let messaging = getMessaging(firebase.initializeApp(firebaseConfig));

if (typeof window !== 'undefined') {
  if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
  }
}
export const fetchNotify = async () => {
  let currentToken = '';
  if (!messaging) return;
  try {
    currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_FCM_VAPID_KEY,
    });
    const response = await notifyApi.getNotify(currentToken);
    console.log(response);
    console.log('FCM registration token', currentToken);
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }
};

export const setFcmTokenNotify = async () => {
  let currentToken = '';
  if (!messaging) return;
  try {
    currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_FCM_VAPID_KEY,
    });
    const setNotify = await notifyApi.setFcmToken(currentToken);

    console.log(setNotify);
    console.log('FCM for set', currentToken);
    localStorage.setItem('fcmToken', currentToken);

  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }
};

// export const getMessagingToken = async () => {
//   let currentToken = '';
//   if (!messaging) return;
//   try {
//     currentToken = await getToken(messaging, {
//       vapidKey: process.env.REACT_APP_FIREBASE_FCM_VAPID_KEY,
//     });
//     fetchNotify(currentToken);
//     console.log('FCM registration token', currentToken);
//   } catch (error) {
//     console.log('An error occurred while retrieving token. ', error);
//   }
// };

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
