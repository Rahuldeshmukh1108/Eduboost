import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit-btn');
  const studentForm = document.getElementById('student-form');

  studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value.trim();
    const language = document.getElementById('language').value;
    const location = document.getElementById('location').value.trim();


    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    
  try {
    // ✅ Check if username already exists
    const q = query(collection(db, "students"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("Username is already taken. Please choose another.");
      return;
    }

        // Create user with Firebase Auth (email already checked by Firebase)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
         // ✅ Save user data in Firestore
    await setDoc(doc(db, "students", user.uid), {
      uid: user.uid,
      name,
      email,
      username,
      phone,
      language,
      location,
      role: "student"  ,
      createdAt: new Date()
    });
    

    

    // You could redirect or show a success message here
    alert("Signup successful!");
    window.location.href="../student%20landing%20page/index.html"
  } catch (error) {
    console.error("Signup error:", error);
    alert(error.message);
    
  }
  })
})
