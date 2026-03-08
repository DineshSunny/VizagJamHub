async function loadShows(){

const res = await fetch("/api/shows");

const shows = await res.json();

const container = document.getElementById("shows");

shows.forEach(show=>{

container.innerHTML += `

<div>

<h2>${show.title}</h2>

<p>Venue: ${show.venue}</p>

<p>Date: ${show.date}</p>

<p>Price: ₹${show.price}</p>

<a href="/ticket.html?show=${show.id}">
<button>Get Tickets</button>
</a>

</div>

`;

});

}

loadShows();