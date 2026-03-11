const params = new URLSearchParams(window.location.search)
const id = params.get("id")

async function loadShow(){

const res = await fetch("/api/shows")
const shows = await res.json()

const show = shows.find(s => s.id == id)

if(!show) return

document.getElementById("poster").src = show.poster
document.getElementById("title").textContent = show.title
document.getElementById("venue").textContent = show.venue

/* FORMAT DATE */

const dateParts = show.date.split("-")
const formattedDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2])
.toLocaleDateString("en-US",{month:"long", day:"numeric", year:"numeric"})

document.getElementById("date").textContent = formattedDate


/* FORMAT TIME */

const timeParts = show.startTime.split(":")
const formattedTime = new Date(0,0,0,timeParts[0],timeParts[1])
.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})

document.getElementById("time").textContent = formattedTime


document.getElementById("price").textContent = "Price: ₹" + show.price

updateTotal(show.price)

document.getElementById("quantity").addEventListener("input", () => {
updateTotal(show.price)
})

}

function updateTotal(price){

const qty = document.getElementById("quantity").value
const total = qty * price

document.getElementById("total").textContent = "Total: ₹" + total

}

loadShow()