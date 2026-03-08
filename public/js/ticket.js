// Get event from URL
const params = new URLSearchParams(window.location.search);
const event = params.get("event");

// Show event name
document.getElementById("eventName").innerText =
event ? event.replace(/-/g," ").toUpperCase() : "EVENT";

// Form submission
const form = document.getElementById("ticketForm");

form.addEventListener("submit", async function(e){

e.preventDefault();

const formData = new FormData(form);

const data = Object.fromEntries(formData);

// Add event name
data.event = event;

try{

const response = await fetch("http://localhost:3000/tickets",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
});

const result = await response.text();

document.getElementById("successMsg").innerText =
"Ticket booking request sent successfully!";

form.reset();

}catch(error){

document.getElementById("successMsg").innerText =
"Error sending booking request.";

}

});