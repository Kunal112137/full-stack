import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB-JVVbBHlUyXX0cPJ0qW4OPVXmew271bU",
    authDomain: "project2-a25fb.firebaseapp.com",
    projectId: "project2-a25fb",
    storageBucket: "project2-a25fb.firebasestorage.app",
    messagingSenderId: "451870971107",
    appId: "1:451870971107:web:9606b0f85b8ea7d806e1d6",
    measurementId: "G-YKYFR30VMP"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
