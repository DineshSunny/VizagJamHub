/* ================================
   PAGE BEHAVIOUR - Vizag JamHub
================================ */

// ✅ Always start page from top
function resetScroll() {
  window.scrollTo(0, 0);
}

// ✅ Smooth scroll to top
function smoothScrollTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ✅ Smart scroll controller
function goTop(smooth = false) {
  if (smooth) {
    smoothScrollTop();
  } else {
    resetScroll();
  }
}

// ================================
// 📱 MOBILE DETECTION
// ================================

function isMobile() {
  return window.innerWidth <= 768;
}

// ================================
// 📱 MOBILE UI ADJUSTMENTS
// ================================

function applyMobileFixes() {

  if (!isMobile()) return;

  document.body.style.fontSize = "14px";

  const hero = document.querySelector(".hero-content");
  if (hero) {
    hero.style.padding = "20px";
  }

  const buttons = document.querySelectorAll(".lyrics-btn");
  buttons.forEach(btn => {
    btn.style.width = "90%";
  });

  const search = document.querySelector(".search-bar");
  if (search) {
    search.style.width = "90%";
  }
}

// ================================
// 🔗 SMOOTH ANCHOR SCROLL
// ================================

function enableSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function(e) {

      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }

    });

  });
}

// ================================
// 📱 RESIZE HANDLER
// ================================

function handleResize() {
  applyMobileFixes();
}

// ================================
// 🚀 INIT FUNCTION
// ================================

function initPageBehaviour() {

  resetScroll();
  applyMobileFixes();
  enableSmoothAnchors();

  window.addEventListener("resize", handleResize);
}

// ✅ Auto run
document.addEventListener("DOMContentLoaded", initPageBehaviour);