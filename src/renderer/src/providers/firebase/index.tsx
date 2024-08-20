// Import the functions you need from the SDKs you need
import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
} from "firebase/messaging";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm7q3WdmVVhheYzXtEwn3W6XfwRaYFIJM",
  authDomain: "fin-planning-firebase-4292f.firebaseapp.com",
  projectId: "fin-planning-firebase-4292f",
  storageBucket: "fin-planning-firebase-4292f.appspot.com",
  messagingSenderId: "636976366188",
  appId: "1:636976366188:web:21a311584f7b2357c80e49",
  measurementId: "G-RF5PP52Y3W",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = async () => {
  try {
    const fcmToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    });
    if (fcmToken) {
      return fcmToken;
    } else {
      // Show permission request UI
      //   console.log(
      //     "No registration token available. Request permission to generate one."
      //   );
    }
  } catch (err) {
    // console.log("An error occurred while retrieving token. ", err);
  }
};

export type OnMessageListener = () => Promise<MessagePayload>;

export const onMessageListener: OnMessageListener = () => {
  return new Promise<MessagePayload>((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
