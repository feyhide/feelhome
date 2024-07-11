// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVX5fgAeNIQsZQjPxXwSIA1s2o0oHxv7E",
  authDomain: "mern-realestate-c8962.firebaseapp.com",
  projectId: "mern-realestate-c8962",
  storageBucket: "mern-realestate-c8962.appspot.com",
  messagingSenderId: "303734280360",
  appId: "1:303734280360:web:d76649ceb8c8cb666c729d",
  measurementId: "G-H3EKT0FHWW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);