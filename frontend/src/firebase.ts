import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBez6-CbCyqurGnUxi0AbBAibYNRXCxojc",
  authDomain: "cyberagents.app",
  projectId: "cyber-agents-app",
  storageBucket: "cyber-agents-app.firebasestorage.app",
  messagingSenderId: "890584437356",
  appId: "1:890584437356:web:222bfbfb59a1a4b621be49"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const githubProvider = new GithubAuthProvider();
