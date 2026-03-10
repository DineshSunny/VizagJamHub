const params = new URLSearchParams(window.location.search)
const id = params.get("id")

async function loadShow(){

const res = await fetch("/api/shows")
const shows = await res.json()

const show = shows.find(s => s.id == id)

/* SET BROWSER TAB TITLE */
document.title = "Update - " + show.title

document.getElementById("title").value = show.title
document.getElementById("venue").value = show.venue
document.getElementById("address").value = show.address || ""
document.getElementById("date").value = show.date
document.getElementById("startTime").value = show.startTime || ""
document.getElementById("endTime").value = show.endTime || ""
document.getElementById("price").value = show.price
document.getElementById("info").value = show.info

}

loadShow()



document.getElementById("editForm").addEventListener("submit", async e => {

e.preventDefault()

const formData = new FormData(e.target)

await fetch("/api/shows/"+id,{
method:"PUT",
body:formData
})

alert("Show Updated")

window.location.href="/manage-shows.html"

})