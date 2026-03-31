/*
========================================
LOAD ALL SHOWS FOR ADMIN PANEL
========================================
*/

async function loadShows(){

  const res = await fetch("/api/shows");
  const shows = await res.json();

  const container = document.getElementById("showsList");

  if(!container) return;

  container.innerHTML = "";

  shows.forEach(show => {

    container.innerHTML += `

    <div class="showCard">

      <!-- 🔥 SHOW POSTER -->
      ${show.poster ? `<img src="${show.poster}" class="showPoster">` : ""}

      <h3>${show.title}</h3>
      <p>${show.venue}</p>
      <p>${show.date}</p>
      <p>₹${show.price || "0"}</p>

      <div class="showButtons">

        <button onclick="editShow('${show.id}')">Edit</button>
        <button onclick="deleteShow('${show.id}')">Delete</button>

      </div>

    </div>

    `;
  });
}

loadShows();



/*
========================================
CREATE NEW SHOW
========================================
*/

const showForm = document.getElementById("showForm");

if(showForm){

  showForm.addEventListener("submit", async e => {

    e.preventDefault();

    const formData = new FormData(showForm);

    try {

      const res = await fetch("/api/shows",{
        method:"POST",
        body:formData
      });

      const data = await res.json();

      console.log("Created:", data);

      alert("Show Created ✅");

      showForm.reset();

    } catch(err){

      console.error(err);
      alert("Error creating show ❌");

    }

  });

}



/*
========================================
DELETE SHOW
========================================
*/

async function deleteShow(id){

  await fetch("/api/shows/"+id,{
    method:"DELETE"
  });

  loadShows();

}



/*
========================================
EDIT SHOW PAGE
========================================
*/

function editShow(id){

  window.location.href="/edit-show.html?id="+id;

}