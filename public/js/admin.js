/*
========================================
LOAD ALL SHOWS FOR ADMIN PANEL
========================================
*/

async function loadShows(){

const res = await fetch("/api/shows")
const shows = await res.json()

const container = document.getElementById("showsList")

container.innerHTML = ""

shows.forEach(show => {

container.innerHTML += `

<div class="showCard">

<h3>${show.title}</h3>
<p>${show.venue}</p>
<p>${show.date}</p>

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

document.getElementById("showForm").addEventListener("submit", async e => {

e.preventDefault()

const formData = new FormData(e.target)

const show = {
title: formData.get("title"),
venue: formData.get("venue"),
date: formData.get("date"),
price: formData.get("price")
}

await fetch("/api/shows",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(show)
})

alert("Show Created")

loadShows()

})



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