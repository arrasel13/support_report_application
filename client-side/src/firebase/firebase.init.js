// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_WPDEV_apiKey,
  authDomain: import.meta.env.VITE_WPDEV_authDomain,
  projectId: import.meta.env.VITE_WPDEV_projectId,
  storageBucket: import.meta.env.VITE_WPDEV_storageBucket,
  messagingSenderId: import.meta.env.VITE_WPDEV_messagingSenderId,
  appId: import.meta.env.VITE_WPDEV_appId,
};

// Secondary app instance
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
// Secondary auth instance
export const secondaryAuth = getAuth(secondaryApp);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
