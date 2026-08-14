async function loadShows(){

const res = await fetch("/api/shows");

const shows = await res.json();

const container = document.getElementById("shows-container");

container.innerHTML = "";

shows.forEach(show => {

container.innerHTML += `

<a href="/buy-ticket.html?id=${show.id}" class="show-card">

<h2>${show.title}</h2>

<p>Venue: ${show.venue}</p>

<p>${show.address || ""}</p>

<p>Date: ${show.date}</p>

<p>Time: ${show.startTime || ""}</p>

<p>Price: ₹${show.price}</p>

</a>

`;

});

}

loadShows();