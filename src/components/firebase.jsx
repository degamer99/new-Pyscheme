// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, get} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0ZZdYE0kKtreUDl8NCr0yliO5l8OaF_o",
  authDomain: "pyscheme.firebaseapp.com",
  projectId: "pyscheme",
  storageBucket: "pyscheme.appspot.com",
  messagingSenderId: "725912653800",
  appId: "1:725912653800:web:5f916dbc5d8a0e15915e5d",
  measurementId: "G-Q90LKR00JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// if ( analytics.isSupported ) {
//     const analytics = getAnalytics(app);
// }
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

const storageRef = ref(storage);

const confirmRef = ref(storage, 'confirm');

const upload = async (file, name) => {
  uploadBytes(ref(confirmRef, name ), file).then( async (snapshot) => {

  console.log('Uploaded a blob or file!');
  let link = await getDownloadURL(ref(confirmRef, name ))
  console.log(link)
    return link
});
}

const download = async (name) => { 
 let link = await getDownloadURL(ref(confirmRef, name ))
 return link
}

export { auth, firestore, storage, upload,download };