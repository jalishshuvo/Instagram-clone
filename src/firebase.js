import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAKxPhS-1EGKviV44TBw0rxb8dVLG1cTzU",
  authDomain: "jalish-instagram.firebaseapp.com",
  databaseURL: "https://jalish-instagram.firebaseio.com",
  projectId: "jalish-instagram",
  storageBucket: "jalish-instagram.appspot.com",
  messagingSenderId: "274993926746",
  appId: "1:274993926746:web:a38c0102f7229fffeabe63",
  measurementId: "G-57MWK5JSW8",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage(); //for uploading img,file

export { db, auth, storage };
