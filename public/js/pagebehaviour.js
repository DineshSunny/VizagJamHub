/* =================================
   PAGE BEHAVIOUR - VIZAG JAMHUB
================================= */


/* =================================
   FULLSCREEN GLASS NAVIGATION
================================= */

const menuToggle =
  document.querySelector(".menu-toggle");

const menuClose =
  document.querySelector(".menu-close");

const navOverlay =
  document.querySelector(".nav-overlay");

const navItems =
  document.querySelectorAll(
    ".nav-overlay .nav-links a"
  );


/* =================================
   OPEN MENU
================================= */

function openMenu() {

  if (!navOverlay) {
    return;
  }

  navOverlay.classList.add("active");

  document.body.classList.add("menu-open");

  if (menuToggle) {

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

  }

}


/* =================================
   CLOSE MENU
================================= */

function closeMenu() {

  if (!navOverlay) {
    return;
  }

  navOverlay.classList.remove("active");

  document.body.classList.remove("menu-open");

  if (menuToggle) {

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

  }

}


/* =================================
   CLOSE MENU IMMEDIATELY
================================= */

function closeMenuImmediately() {

  if (!navOverlay) {
    return;
  }

  navOverlay.style.transition = "none";

  navOverlay.classList.remove("active");

  document.body.classList.remove("menu-open");

  if (menuToggle) {

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

  }

}


/* =================================
   HAMBURGER CLICK
================================= */

if (menuToggle) {

  menuToggle.addEventListener(
    "click",
    openMenu
  );

}


/* =================================
   CLOSE BUTTON
================================= */

if (menuClose) {

  menuClose.addEventListener(
    "click",
    closeMenu
  );

}


/* =================================
   MENU LINK CLICK
================================= */

navItems.forEach((link) => {

  link.addEventListener(
    "click",
    closeMenuImmediately
  );

});


/* =================================
   CLOSE WITH ESCAPE KEY
================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      navOverlay &&
      navOverlay.classList.contains("active")
    ) {

      closeMenu();

    }

  }
);


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
   PAGE SHOW
================================= */

window.addEventListener(
  "pageshow",
  () => {

    resetScroll();

    if (navOverlay) {

      navOverlay.style.transition = "";

      navOverlay.classList.remove("active");

    }

    document.body.classList.remove(
      "menu-open"
    );

    if (menuToggle) {

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }
);