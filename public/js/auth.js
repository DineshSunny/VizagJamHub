/*
========================================
VizagJamHub Admin Authentication Script
Handles:
1. Admin Login
2. Logout
3. Admin Page Protection
4. Forgot Password Verification
========================================
*/


/* ===============================
   ADMIN LOGIN FUNCTION
   Checks username and password
================================ */

function login(){

// Get values from login inputs
const username = document.getElementById("username").value
const password = document.getElementById("password").value

// Hardcoded admin credentials
if(username === "admin" && password === "vizag123"){

// Store admin session
localStorage.setItem("admin","true")

// Redirect to admin dashboard
window.location.href = "/admin.html"

}else{

// Show error if login fails
alert("Invalid Username or Password")

}

}



/* ===============================
   ADMIN LOGOUT FUNCTION
================================ */

function logout(){

// Remove login session
localStorage.removeItem("admin")

// Redirect to login page
window.location.href="/login.html"

}



/* ==================================
   ADMIN PAGE PROTECTION
   Prevents direct access to admin
================================== */

if(window.location.pathname.includes("admin.html")){

// Check if admin is logged in
if(localStorage.getItem("admin") !== "true"){

// Redirect unauthorized user
window.location.href="/login.html"

}

}



/* ==================================
   FORGOT PASSWORD FUNCTION
   Only accepts official admin email
================================== */

function forgotPassword(){

// Ask user for admin email
const email = prompt("Enter VizagJamHub admin email")

// Official admin email
const ADMIN_EMAIL = "vizagjamhub@gmail.com"

// Verify email
if(email === ADMIN_EMAIL){

alert("Password reset request sent to VizagJamHub Gmail")

}else{

alert("Unauthorized email. Only VizagJamHub admin email allowed.")

}

}