/*
========================================
LOAD ALL SHOWS FOR ADMIN PANEL
========================================
*/

async function loadShows(){

const res = await fetch("/api/shows")
const shows = await res.json()

const container = document.getElementById("showsList")

if(!container) return

container.innerHTML = ""

shows.forEach(show => {

container.innerHTML += `

<div class="showCard">

<h3>${show.title}</h3>
<p>${show.venue}</p>
<p>${show.date}</p>
<p>₹${show.price}</p>

<div class="showButtons">

<button onclick="editShow('${show.id}')">Edit</button>

<button onclick="deleteShow('${show.id}')">Delete</button>

</div>

</div>

`

})

}

loadShows()



/*
========================================
CREATE NEW SHOW
========================================
*/

const showForm = document.getElementById("showForm")

if(showForm){

showForm.addEventListener("submit", async e => {

e.preventDefault()

const formData = new FormData(e.target)

const show = {

title: formData.get("title"),
venue: formData.get("venue"),
address: formData.get("address"),
date: formData.get("date"),
startTime: formData.get("startTime"),
endTime: formData.get("endTime"),
price: formData.get("price"),
info: formData.get("info")

}

await fetch("/api/shows",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(show)
})

alert("Show Created")

// Clear form
showForm.reset()

})

}



/*
========================================
DELETE SHOW
========================================
*/

async function deleteShow(id){

await fetch("/api/shows/"+id,{
method:"DELETE"
})

loadShows()

}



/*
========================================
EDIT SHOW PAGE
========================================
*/

function editShow(id){

window.location.href="/editShow.html?id="+id

}