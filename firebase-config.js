// TODO: Replace with your Firebase project config (Prompt Galaxy / surajfx2 project or a new one)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// TODO: Replace with your Gemini API key
// Get one free at https://aistudio.google.com/apikey
const GEMINI_API_KEY = "AQ.Ab8RN6IEnmJ7NLccXVp7mwxYvad15ytA9dSjVr4aItODZuR2pA";

