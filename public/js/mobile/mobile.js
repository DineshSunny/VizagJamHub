/* =================================
   MOBILE BEHAVIOUR - VIZAG JAMHUB
================================= */


/* =================================
   MOBILE DETECTION
================================= */

function isMobile() {

  return window.innerWidth <= 768;

}


/* =================================
   MOBILE UI ADJUSTMENTS
================================= */

function applyMobileFixes() {

  if (!isMobile()) {
    return;
  }


  /* BODY FONT SIZE */

  document.body.style.fontSize = "14px";


  /* HERO */

  const hero =
    document.querySelector(".hero-content");

  if (hero) {

    hero.style.padding = "20px";

  }


  /* LYRICS BUTTON */

  const buttons =
    document.querySelectorAll(".lyrics-btn");

  buttons.forEach(button => {

    button.style.width = "90%";

  });


  /* SEARCH BAR */

  const search =
    document.querySelector(".search-bar");

  if (search) {

    search.style.width = "90%";

  };

}


/* =================================
   RESIZE HANDLER
================================= */

function handleResize() {

  applyMobileFixes();

}


/* =================================
   INITIALIZE MOBILE BEHAVIOUR
================================= */

function initMobileBehaviour() {

  applyMobileFixes();

  window.addEventListener(
    "resize",
    handleResize
  );

}


/* =================================
   PAGE LOAD
================================= */

document.addEventListener(
  "DOMContentLoaded",
  initMobileBehaviour
);