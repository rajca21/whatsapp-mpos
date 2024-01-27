import { initializeApp } from 'firebase/app';

export const getFirebaseApp = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyBIBnRLgurlgPQ8iwGGSFZGUXwo5WZKnEM',
    authDomain: 'whatsapp-92fdd.firebaseapp.com',
    projectId: 'whatsapp-92fdd',
    storageBucket: 'whatsapp-92fdd.appspot.com',
    messagingSenderId: '198287883600',
    appId: '1:198287883600:web:f5242a24add99ae8dd4055',
    measurementId: 'G-71SFT41MY2',
  };

  return initializeApp(firebaseConfig);
};
