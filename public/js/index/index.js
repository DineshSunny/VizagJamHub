

/* =================================
   AUTO TYPING TEXT
================================= */

const words = [

  "LIVE MUSIC",
  "JAM SESSIONS",
  "VIZAG CULTURE",
  "NIGHT VIBES",
  "LIVE PERFORMANCES",
  "MUSIC COMMUNITY"

];


const typing =
  document.getElementById("typing");


if (typing) {

  let wordIndex = 0;


  /* INITIAL TEXT */

  typing.textContent =
    words[wordIndex];

  typing.classList.add("show");


  /* TEXT LOOP */

  setInterval(() => {

    /* FADE OUT */

    typing.classList.remove("show");
    typing.classList.add("hide");


    setTimeout(() => {

      /* CHANGE TEXT */

      wordIndex =
        (wordIndex + 1) %
        words.length;


      typing.textContent =
        words[wordIndex];


      /* FADE IN */

      typing.classList.remove("hide");
      typing.classList.add("show");

    }, 900);

  }, 3200);

}







/* =================================
   LIVE TEXT SCROLL FADE
================================= */

const liveText =
  document.getElementById("live-text");

const lyricsSection =
  document.querySelector(".lyrics-section");


if (liveText && lyricsSection) {

  window.addEventListener("scroll", () => {

    const triggerPoint =
      lyricsSection.offsetTop - 800;


    /* FADE OUT */

    if (window.scrollY > triggerPoint) {

      liveText.style.opacity = "0";

    }

    /* FADE IN */

    else {

      liveText.style.opacity = "1";

    }

  });

}


/* =================================
   OVERLAY LOGO SCROLL FADE
================================= */

const overlayLogo =
  document.getElementById("overlay-logo");


if (overlayLogo && lyricsSection) {

  window.addEventListener("scroll", () => {

    const lyricsBottom =
      lyricsSection.offsetTop +
      lyricsSection.offsetHeight;


    if (
      window.scrollY >
      lyricsBottom - 800
    ) {

      overlayLogo.style.opacity = "0";

    }
    else {

      overlayLogo.style.opacity = "0.9";

    }

  });

}









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

card.onclick = () => {

  window.location.href =
    `/pages/admin/tickets/buyticket.html?id=${show.id}`;

};

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








/* =================================
   GALLERY IMAGE POPUP
================================= */

document.addEventListener("click", function (event) {

  if (!event.target.matches(".gallery-track img")) {
    return;
  }


  const popup =
    document.createElement("div");

  popup.classList.add("image-popup");


  const popupImage =
    document.createElement("img");

  popupImage.src =
    event.target.src;

  popupImage.alt =
    event.target.alt || "Gallery image";


  popup.appendChild(popupImage);

  document.body.appendChild(popup);


  function closePopup() {

    popup.remove();

    window.removeEventListener(
      "scroll",
      closePopup
    );

  }


  setTimeout(() => {

    function outsideClick(clickEvent) {

      if (
        !clickEvent.target.closest(
          ".image-popup img"
        )
      ) {

        closePopup();

        document.removeEventListener(
          "click",
          outsideClick
        );

      }

    }


    document.addEventListener(
      "click",
      outsideClick
    );

  }, 100);


  window.addEventListener(
    "scroll",
    closePopup
  );

});




/* =================================
   GALLERY DRAG SCROLL
================================= */

const gallerySlider =
  document.querySelector(
    ".gallery-wrapper"
  );


if (gallerySlider) {

  let isDragging = false;
  let startX = 0;
  let startingScrollLeft = 0;


  /* START DRAG */

  gallerySlider.addEventListener(
    "mousedown",
    (event) => {

      isDragging = true;

      gallerySlider.style.cursor =
        "grabbing";

      startX =
        event.pageX -
        gallerySlider.offsetLeft;

      startingScrollLeft =
        gallerySlider.scrollLeft;

    }
  );


  /* STOP DRAG */

  gallerySlider.addEventListener(
    "mouseup",
    () => {

      isDragging = false;

      gallerySlider.style.cursor =
        "default";

    }
  );


  gallerySlider.addEventListener(
    "mouseleave",
    () => {

      isDragging = false;

      gallerySlider.style.cursor =
        "default";

    }
  );


  /* DRAG */

  gallerySlider.addEventListener(
    "mousemove",
    (event) => {

      if (!isDragging) {
        return;
      }


      event.preventDefault();


      const currentX =
        event.pageX -
        gallerySlider.offsetLeft;

      const distance =
        (currentX - startX) * 2;


      gallerySlider.scrollLeft =
        startingScrollLeft -
        distance;

    }
  );

}







