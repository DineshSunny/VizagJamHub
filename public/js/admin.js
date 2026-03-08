const form = document.getElementById("showForm");

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const show = {

title: document.getElementById("title").value,
venue: document.getElementById("venue").value,
date: document.getElementById("date").value,
price: document.getElementById("price").value

};

await fetch("/api/shows",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(show)

});

alert("Show Created");

loadShows();

});

async function loadShows(){

const res = await fetch("/api/shows");

const shows = await res.json();

const container = document.getElementById("shows");

container.innerHTML = "";

shows.forEach(show=>{

container.innerHTML += `

<div>

<h3>${show.title}</h3>
<p>${show.venue}</p>
<p>${show.date}</p>
<p>₹${show.price}</p>

</div>

`;

});

}

loadShows();