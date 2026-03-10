/*
========================================
FORMAT DATE
========================================
*/

function formatDate(dateString){

// Fix timezone shift
const parts = dateString.split("-")
const date = new Date(parts[0], parts[1]-1, parts[2])

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
]

const day = date.getDate()

function getOrdinal(n){
if(n>3 && n<21) return "th"
switch(n % 10){
case 1: return "st"
case 2: return "nd"
case 3: return "rd"
default: return "th"
}
}

return months[date.getMonth()] + " " + day + getOrdinal(day)

}

/*
========================================
LOAD UPCOMING SHOWS
========================================
*/

fetch("/api/shows")

.then(res => res.json())

.then(shows => {

const container = document.getElementById("shows-container")

container.innerHTML = ""

shows.forEach(show => {

const card = document.createElement("div")
card.className = "show-card"

card.style.backgroundImage = `url(${show.poster})`

card.innerHTML = `

<div class="show-info">

<h3>${show.title}</h3>
<p>${show.venue}</p>
<p>${formatDate(show.date)}</p>
<p class="show-price">${show.price ? "₹" + show.price : ""}</p>

</div>

`

container.appendChild(card)

})

})

.catch(error => {

console.error("Failed to fetch shows:", error)

})