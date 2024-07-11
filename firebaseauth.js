// Firebase uygulamasını başlatmak, Firebase Authentication (kimlik doğrulama) ile ilgili işlevler,
// Firebase Firestore (veritabanı) ile ilgili işlevleri import etmek
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDUohYWS2kSZbNpdf157-HF6wjy1Fxh4Z0",
  authDomain: "login-form-e8b1d.firebaseapp.com",
  projectId: "login-form-e8b1d",
  storageBucket: "login-form-e8b1d.appspot.com",
  messagingSenderId: "1041535815651",
  appId: "1:1041535815651:web:000757fa2de6eca161dad6"
};

// Firebase uygulamasını başlatmak
const app = initializeApp(firebaseConfig);

// Firebase Authentication ve Firestore bağlantıları alınır.
const auth = getAuth();
const db = getFirestore();

// showMessage: Belirli bir mesajı belirli bir HTML div elementinde göstermek için kullanılır.
// message: Gösterilecek mesaj. divId: Mesajın gösterileceği div elementinin id'si.
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Kayıt işlemi event listener'ı
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    
    // Kullanıcı bilgileri bir nesne olarak userData değişkenine atanır.
    const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        // jobRole: "manager",
    };
    
    // createUserWithEmailAndPassword fonksiyonuyla kullanıcı e-posta ve şifre ile oluşturulur.
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // showMessage fonksiyonuyla kullanıcıya başarı mesajı gösterilir.
            showMessage('Hesap Başarıyla Oluşturuldu', 'signUpMessage');

            // Firestore'da kullanıcı bilgilerini kaydetmek için setDoc kullanılır.
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error("Belge yazılırken hata oluştu", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Bu e-posta adresi zaten kullanılıyor!', 'signUpMessage');
            } else {
                showMessage('Kullanıcı oluşturulamadı', 'signUpMessage');
            }
        });
});

// Giriş işlemi event listener'ı
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // signInWithEmailAndPassword fonksiyonuyla kullanıcı girişi yapılır.
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Giriş Başarılı', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'homepage.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Geçersiz E-posta veya Şifre', 'signInMessage')
            } else {
                showMessage('Hesap bulunamadı', 'signInMessage');
            }
        });
});
