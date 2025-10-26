async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get all users from localStorage
function getAllUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

// Save all users to localStorage
function saveAllUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Check if username already exists
function userExists(username) {
  const users = getAllUsers();
  return users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

// Check if email already exists
function emailExists(email) {
  const users = getAllUsers();
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// SIGNUP FUNCTION
async function signup(event) {
  event.preventDefault();
  
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  // Validation
  if (!username || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  if (username.length < 3) {
    alert("Username must be at least 3 characters long!");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  // Check if user already exists
  if (userExists(username)) {
    alert("Username already exists! Please choose another one.");
    return;
  }

  if (emailExists(email)) {
    alert("Email already registered! Please use another email or login.");
    return;
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Get existing users and add new user
  const users = getAllUsers();
  const newUser = {
    username: username,
    email: email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveAllUsers(users);

  alert("Signup successful! Please login now.");
  
  // Clear form
  document.getElementById("signupUsername").value = "";
  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPassword").value = "";
  
  // Redirect to login page
  window.location.href = "login_main.html";
}

// LOGIN FUNCTION
async function login(event) {
  event.preventDefault();
  
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    alert("Please fill all fields!");
    return;
  }

  // Hash the entered password
  const hashedPassword = await hashPassword(password);

  // Get all users and find matching user
  const users = getAllUsers();
  const user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && 
    u.password === hashedPassword
  );

  if (user) {
    // Store logged in user info
    localStorage.setItem("loggedInUser", user.username);
    localStorage.setItem("loggedInEmail", user.email);
    alert("Login successful! Welcome back, " + user.username + "!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password!");
  }
}

// DASHBOARD LOAD
window.onload = function () {
  const username = localStorage.getItem("loggedInUser");
  const email = localStorage.getItem("loggedInEmail");
  
  // Display username if element exists
  if (username && document.getElementById("usernameDisplay")) {
    document.getElementById("usernameDisplay").textContent = username;
  }
  
  // Display email if element exists
  if (email && document.getElementById("emailDisplay")) {
    document.getElementById("emailDisplay").textContent = email;
  }

  // If on dashboard but not logged in, redirect to login
  if (window.location.pathname.includes("dashboard.html") && !username) {
    alert("Please login first!");
    window.location.href = "login_main.html";
  }

  // If on login page but already logged in, redirect to dashboard
  if (window.location.pathname.includes("login_main.html") && username) {
    window.location.href = "dashboard.html";
  }
};

// LOGOUT FUNCTION
function logout() {
  const confirmation = confirm("Are you sure you want to logout?");
  if (confirmation) {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInEmail");
    alert("Logged out successfully!");
    window.location.href = "login_main.html";
  }
}

// BONUS: Delete Account Function (optional - add button in dashboard if needed)
async function deleteAccount() {
  const confirmation = confirm("Are you sure you want to delete your account? This cannot be undone!");
  if (!confirmation) return;

  const password = prompt("Please enter your password to confirm:");
  if (!password) return;

  const username = localStorage.getItem("loggedInUser");
  const hashedPassword = await hashPassword(password);
  
  const users = getAllUsers();
  const userIndex = users.findIndex(u => 
    u.username === username && u.password === hashedPassword
  );

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    saveAllUsers(users);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInEmail");
    alert("Account deleted successfully!");
    window.location.href = "login_main.html";
  } else {
    alert("Incorrect password!");
  }
}

// BONUS: View all registered users (for testing - remove in production!)
function viewAllUsers() {
  const users = getAllUsers();
  console.log("Total registered users:", users.length);
  users.forEach((user, index) => {
    console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, Created At: ${user.createdAt}`);
  });
}
// Uncomment to view users in console
// viewAllUsers();

// Attach event listeners if forms exist
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", signup);
}
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", login);
}