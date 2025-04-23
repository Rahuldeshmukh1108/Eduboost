import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";



  document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const teacherForm = document.getElementById('teacher-form');
 

   teacherForm.addEventListener('submit', async (e) => {
      e.preventDefault();

    // Get basic form data
    
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Get selected checkboxes
  const getCheckedValues = (name) =>
    [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((cb) => cb.value);

  const subjects = getCheckedValues('subjects');
  const gradeLevels = getCheckedValues('gradeLevels');
  const availableHours = getCheckedValues('availableHours');

  if (subjects.length === 0) {
    alert("Please select at least one subject you can teach.");
    return;
  }

  if (gradeLevels.length === 0) {
    alert("Please select at least one grade level you can teach.");
    return;
  }
  if (availableHours.length === 0) {
    alert("Please select at least one available hour you can teach.");
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

    // Firebase Auth: Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore: Save additional teacher info
    await setDoc(doc(db, 'teachers', user.uid), {
      uid: user.uid,
      name,
      email,
      username,
      subjects,
      gradeLevels,
      availableHours,
      createdAt: new Date().toISOString(),
    });

    alert('Teacher account created successfully!');
    window.location.href = 'dashboard.html'; // or login.html or wherever you want to go
  } catch (error) {
    console.error('Error creating account:', error.message);
    alert(error.message);
  }
  })
})
