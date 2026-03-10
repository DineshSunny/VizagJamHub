async function loadShows(){

const res = await fetch("/shows")
const shows = await res.json()

const container = document.getElementById("showsList")

container.innerHTML=""

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



document.getElementById("showForm").addEventListener("submit", async e => {

e.preventDefault()

const formData = new FormData(e.target)

await fetch("/admin/addShow",{
method:"POST",
body:formData
})

alert("Show Created")

loadShows()

})



async function deleteShow(id){

await fetch("/admin/deleteShow/"+id,{
method:"DELETE"
})

loadShows()

}



function editShow(id){

window.location.href="/editShow.html?id="+id

}