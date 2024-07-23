import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyDUohYWS2kSZbNpdf157-HF6wjy1Fxh4Z0",
    authDomain: "login-form-e8b1d.firebaseapp.com",
    projectId: "login-form-e8b1d",
    storageBucket: "login-form-e8b1d.appspot.com",
    messagingSenderId: "1041535815651",
    appId: "1:1041535815651:web:000757fa2de6eca161dad6"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// URL'deki userId parametresini almak
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

// Kullanıcı bilgilerini almak ve form alanlarına yerleştirmek
async function displayUserDetails(userId) {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            document.getElementById('fullName').value = `${userData.firstName || 'N/A'} ${userData.lastName || 'N/A'}`;
            document.getElementById('email').value = userData.email || 'N/A';
            document.getElementById('firstName').value = userData.firstName || 'N/A';
            document.getElementById('welcome-name').innerText = userData.firstName || 'N/A';

            // Şifreyi yıldızlar şeklinde gösterme
            document.getElementById('password').value = '*'.repeat(userData.password.length) || 'N/A';
            
            document.getElementById('description').value = userData.description || '';
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

displayUserDetails(userId);
