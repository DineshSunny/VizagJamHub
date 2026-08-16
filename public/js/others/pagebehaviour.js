/* =================================
   PAGE BEHAVIOUR - VIZAG JAMHUB
================================= */


/* =================================
   SCROLL RESTORATION
================================= */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}


/* =================================
   SCROLL TO TOP
================================= */

function resetScroll() {

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  });

}


/* =================================
   SMOOTH SCROLL TO TOP
================================= */

function smoothScrollTop() {

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });

}


/* =================================
   SCROLL CONTROLLER
================================= */

function goTop(smooth = false) {

  if (smooth) {
    smoothScrollTop();
  }
  else {
    resetScroll();
  }

}


/* =================================
   SMOOTH ANCHOR SCROLL
================================= */

function enableSmoothAnchors() {

  const anchors =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  anchors.forEach(anchor => {

    anchor.addEventListener(
      "click",
      function (event) {

        const targetId =
          this.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            targetId
          );

        if (target) {

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  });

}


/* =================================
   INITIALIZE PAGE BEHAVIOUR
================================= */

function initPageBehaviour() {

  resetScroll();
  enableSmoothAnchors();

}


/* =================================
   PAGE LOAD
================================= */

document.addEventListener(
  "DOMContentLoaded",
  initPageBehaviour
);


/* =================================
   FORCE TOP AFTER REFRESH
================================= */

window.addEventListener(
  "pageshow",
  resetScroll
);