document.addEventListener("DOMContentLoaded", () => {
    const teacherForm = document.getElementById("teacher-form")
  
    teacherForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Get basic form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value,
        subjects: [],
        gradeLevels: [],
        availableHours: [],
      }
  
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!")
        return
      }
  
      // Get selected subjects
      document.querySelectorAll('input[name="subjects"]:checked').forEach((checkbox) => {
        formData.subjects.push(checkbox.value)
      })
  
      // Get selected grade levels
      document.querySelectorAll('input[name="gradeLevels"]:checked').forEach((checkbox) => {
        formData.gradeLevels.push(checkbox.value)
      })
  
      // Get selected available hours
      document.querySelectorAll('input[name="availableHours"]:checked').forEach((checkbox) => {
        formData.availableHours.push(checkbox.value)
      })
  
      // Log form data (in a real app, you would send this to your server)
      console.log("Teacher form submitted:", formData)
  
      // You could redirect or show a success message here
      alert("Teacher account created successfully!")
  
      // Optional: Reset the form
      teacherForm.reset()
    })
  })
  