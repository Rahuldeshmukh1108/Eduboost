
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBOOaPReHRxAseJ7ex2acYdv0EIZHA3QX0",
    authDomain: "eduboost-2a2b7.firebaseapp.com",
    projectId: "eduboost-2a2b7",
    storageBucket: "eduboost-2a2b7.firebasestorage.app",
    messagingSenderId: "485084624409",
    appId: "1:485084624409:web:c2672be7915026c22c9c88",
    measurementId: "G-91JHQ1R243"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  export const auth = getAuth(app);
  export const db = getFirestore(app);