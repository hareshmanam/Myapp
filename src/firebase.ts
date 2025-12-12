import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC1qJiouTbb0-FpByi4cxxFBBu0WY2OUHw",
authDomain: "rtc-bliss-drive---blog-page.firebaseapp.com",
projectId: "rtc-bliss-drive---blog-page",
storageBucket: "rtc-bliss-drive---blog-page.firebasestorage.app",
messagingSenderId: "72145260591",
appId: "1:72145260591:web:8398d75239318c6e0976da",
measurementId: "G-FQWJ9RBGD2"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)