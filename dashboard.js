// Display the logged-in user's name
window.onload = function() {
  // support both possible storage keys (legacy and current)
  const username = localStorage.getItem("loggedInUser") || localStorage.getItem("username");
  const display = document.getElementById("usernameDisplay");
  if (display) {
    display.textContent = username ? username : "Guest";
  }
};

// Logout function
function logout() {
  // remove both legacy and current keys to ensure a clean logout
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedInEmail");
  localStorage.removeItem("username");
  alert("You've been logged out successfully!");
  // use location.replace so the previous page (dashboard) is not kept in history
  window.location.replace("login_main.html");
}
