/*
========================================
LOAD UPCOMING SHOWS
Fetch shows from server and display them
on the homepage
========================================
*/

fetch("/api/shows")

.then(res => res.json())

.then(shows => {

const container = document.getElementById("shows-container")

// Clear old content
container.innerHTML = ""

shows.forEach(show => {

const card = document.createElement("div")
card.className = "card"

/* Create show card */

card.innerHTML = `
<h3>${show.title}</h3>
<p>${show.venue}</p>
<p>${show.date}</p>
`

container.appendChild(card)

})

})

.catch(error => {

console.error("Failed to fetch shows:", error)

})