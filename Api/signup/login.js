import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.querySelector('input[type="submit"]');

  signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const usernameInput = document.querySelector('input[placeholder="Username"]').value.trim();
    const passwordInput = document.querySelector('input[placeholder="Password"]').value;

    try {
      // Search for the username in both 'students' and 'teachers' collections
      const collectionsToCheck = ['students', 'teachers'];
      let userData = null;
      let userRole = null;

      for (const collectionName of collectionsToCheck) {
        const q = query(collection(db, collectionName), where("username", "==", usernameInput));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          userData = querySnapshot.docs[0].data();
          userRole = collectionName === 'students' ? 'student' : 'tutor';
          break;
        }
      }

      if (!userData) {
        // Username not found
        alert("User not found. Redirecting to signup...");
        window.location.href = "../sign-up/student-signup.html";
        return;
      }

      // Try signing in using email and password
      const userCredential = await signInWithEmailAndPassword(auth, userData.email, passwordInput);
      const user = userCredential.user;

      // Redirect based on role
      if (userRole === "student") {
        window.location.href = "../student%20landing%20page/index.html";
      } else if (userRole === "tutor") {
        window.location.href = "../liveregional/tchr.html";
      }

    } catch (error) {
      console.error("Login error:", error.message);
      alert("Invalid credentials. Please try again.");
    }
  });
});  