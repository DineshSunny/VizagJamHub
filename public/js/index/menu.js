const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {

navLinks.classList.toggle("active");

document.body.classList.toggle("menu-open");

});

/* CLOSE MENU WHEN CLICKING OUTSIDE */

document.addEventListener("click", (e) => {

if(
!navLinks.contains(e.target) &&
!menuToggle.contains(e.target)
){

navLinks.classList.remove("active");

/* REMOVE PAGE BLUR */

document.body.classList.remove("menu-open");

}

});


/* CLOSE MENU AFTER CLICKING LINKS */

const navItems =
document.querySelectorAll(".nav-links a");

navItems.forEach(link => {

link.addEventListener("click", () => {

navLinks.classList.remove("active");

document.body.classList.remove("menu-open");

});

});


/* CLOSE MENU ON TOUCH SWIPE */

document.addEventListener("touchmove", () => {

if(navLinks.classList.contains("active")){

navLinks.classList.remove("active");

document.body.classList.remove("menu-open");

}

});


/* CLOSE MENU ON MOUSE WHEEL */

document.addEventListener("wheel", () => {

if(navLinks.classList.contains("active")){

navLinks.classList.remove("active");

document.body.classList.remove("menu-open");

}

});