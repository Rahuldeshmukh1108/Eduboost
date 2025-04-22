document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("student-form")
  
    studentForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Get form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value,
        phone: document.getElementById("phone").value,
        language: document.getElementById("language").value,
        location: document.getElementById("location").value,
      }
  
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!")
        return
      }
  
      // Log form data (in a real app, you would send this to your server)
      console.log("Student form submitted:", formData)
  
      // You could redirect or show a success message here
      alert("Student account created successfully!")
  
      // Optional: Reset the form
      studentForm.reset()
    })
  })
  