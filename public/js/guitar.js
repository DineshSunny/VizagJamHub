const form = document.getElementById("guitarForm");

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const data = {

name: document.getElementById("name").value,
email: document.getElementById("email").value,
level: document.getElementById("level").value

};

await fetch("/guitar",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(data)

});

alert("Enrollment successful!");

form.reset();

});