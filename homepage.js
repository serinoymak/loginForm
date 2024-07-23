import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const auth = getAuth();
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const loggedInUserId = user.uid;
        const docRef = doc(db, "users", loggedInUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            // DOM elemanları için `innerText` güncelleme işlemi, gerekli değilse kaldırılabilir.
        }

        const usersSnapshot = await getDocs(collection(db, "users"));
        const userListElement = document.getElementById('userList');

        usersSnapshot.forEach((doc) => {
            const user = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="user-info" onclick="goToUserDetail('${doc.id}')">
                        <div class="user-icon">
                            <i class="fa-regular fa-user"></i>
                        </div>
                        <strong>${user.firstName}</strong>
                    </div>
                </td>
                <td><strong>${user.lastName}</td>
                <td style="font-size: 12px;"><strong>${user.email}</td>
                <td style="color: gray; font-size: 12px;"><strong>${user.jobRole || ''}</td>
                <td style="color: gray; font-size: 12px;"><strong>${user.status || ''}</td>
                <td style="color: gray;"><strong>${user.salary || ''}</td>
                <td style="color: gray; font-size: 12px;"><strong>${user.appliedOn || ''}</td>
            `;
            userListElement.appendChild(tr);
        });
    } else {
        window.location.href = "login.html";
    }
});

// Kullanıcı detay sayfasına yönlendirme işlemi
window.goToUserDetail = function(userId) {
    window.location.href = `userDetail.html?userId=${userId}`;
}

// Bu fonksiyon, belirli bir kullanıcının açıklama (description) alanını güncellemek için kullanılır. userId ile 
// kullanıcı belgesine referans oluşturur (doc(db, "users", userId)) ve updateDoc ile açıklama alanını günceller. 
// Başarılı olursa bir mesaj ("Description updated successfully"), hata olursa bir hata mesajı ("Error updating description:") 
// konsola yazdırılır.
window.updateDescription = async function(userId, description) {
    const userDocRef = doc(db, "users", userId);
    try {
        await updateDoc(userDocRef, { description });
        console.log("Description updated successfully");
    } catch (error) {
        console.error("Error updating description:", error);
    }
};

// Bu satırlar, kullanıcı çıkış işlemini yönetir. logout butonuna tıklanıldığında (addEventListener), signOut fonksiyonu 
// çağrılır ve başarılı olursa kullanıcı login.html sayfasına yönlendirilir. Hata olursa bir hata mesajı konsola yazdırılır.
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});
