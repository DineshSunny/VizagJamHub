const params = new URLSearchParams(window.location.search);

const event = params.get("event");

document.getElementById("eventName").innerText =
event.replace(/-/g," ").toUpperCase();

const form = document.getElementById("ticketForm");

form.addEventListener("submit", async function(e){

e.preventDefault();

const formData = new FormData(form);

const data = Object.fromEntries(formData);

data.event = event;

await fetch("/tickets",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)

});

alert("Ticket booked!");

});