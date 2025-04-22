// Check for saved theme preference or use system preference
const getThemePreference = () => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme")
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  
  // Apply the theme
  const setTheme = (theme) => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }
  
  // Initialize theme
  document.addEventListener("DOMContentLoaded", () => {
    setTheme(getThemePreference())
  
    // Set up theme toggle
    const themeToggle = document.getElementById("theme-toggle")
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light"
      const newTheme = currentTheme === "dark" ? "light" : "dark"
      setTheme(newTheme)
    })
  })
  