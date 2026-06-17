const firebaseConfig = {
  apiKey: "AIzaSyC70V_HMClWJGBAkNU05LXaicnRQBsfcls",
  authDomain: "online-job-applicant-portfolio.firebaseapp.com",
  projectId: "online-job-applicant-portfolio",
  storageBucket: "online-job-applicant-portfolio.firebasestorage.app",
  messagingSenderId: "775451627598",
  appId: "1:775451627598:web:0c353e3e31f4197c10331f"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
