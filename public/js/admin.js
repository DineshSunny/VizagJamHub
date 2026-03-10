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

await fetch("/api/shows",{
method:"POST",
body:formData
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