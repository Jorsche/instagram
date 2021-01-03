import firebase from "firebase";

const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyAkMBfi77NOpkAQFMNWcXYuptUG-cjjZAw",
    authDomain: "instagramclone-bc4f2.firebaseapp.com",
    databaseURL: "https://instagramclone-bc4f2-default-rtdb.firebaseio.com",
    projectId: "instagramclone-bc4f2",
    storageBucket: "instagramclone-bc4f2.appspot.com",
    messagingSenderId: "722814651806",
    appId: "1:722814651806:web:2bdb116db939305a099a8f",
    measurementId: "G-GYHTXPNW7S"
})

const db =firebaseApp.firestore();
const auth= firebase.auth();
const storage = firebase.storage();

export {db, auth, storage}
