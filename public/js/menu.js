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