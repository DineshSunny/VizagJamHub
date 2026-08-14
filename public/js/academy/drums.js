/* ==========================================================
                    DRUM SCHOOL
========================================================== */

const courses = {

beginner:{

title:"Beginner Drums",

description:
"Build a strong foundation in rhythm, coordination, timing and confidence. Perfect for complete beginners starting their drumming journey.",

duration:"8 Weeks",

level:"Beginner",

curriculum:[

"Introduction to Drum Kit",
"Holding Drumsticks",
"Proper Sitting Position",
"Basic Drum Notation",
"Quarter & Eighth Notes",
"Simple Rock Beats",
"Timing Exercises",
"Daily Practice Routine"

]

},

intermediate:{

title:"Intermediate Drums",

description:
"Take your drumming to the next level with fills, groove development, speed building and live performance techniques.",

duration:"10 Weeks",

level:"Intermediate",

curriculum:[

"Ghost Notes",
"16th Note Grooves",
"Creative Drum Fills",
"Odd Time Signatures",
"Playing Along With Songs",
"Dynamic Control",
"Performance Techniques",
"Stage Confidence"

]

},

advanced:{

title:"Advanced Drums",

description:
"Master professional techniques used by touring and studio drummers including independence, polyrhythms and advanced coordination.",

duration:"12 Weeks",

level:"Advanced",

curriculum:[

"Linear Drumming",
"Polyrhythms",
"Jazz Independence",
"Fusion Techniques",
"Recording Sessions",
"Professional Drum Solos",
"Live Band Performance",
"Advanced Coordination"

]

}

};

const buttons =
document.querySelectorAll(".drum-btn");

const preview =
document.getElementById("drum-preview");

const buttonContainer =
document.querySelector(".drum-buttons");

/* ==========================================================
                    BUILD PREVIEW
========================================================== */

function showCourse(course){

const item = courses[course];

preview.innerHTML = `

<div class="drum-content">

<h2>${item.title}</h2>

<p>${item.description}</p>

<ul>

${item.curriculum
.map(topic=>`<li>${topic}</li>`)
.join("")}

</ul>

<div class="drum-footer">

<span>

<i class="fa-regular fa-clock"></i>

${item.duration}

</span>

<span>

<i class="fa-solid fa-signal"></i>

${item.level}

</span>

</div>

</div>

`;

}

/* ==========================================================
                RESTORE DEFAULT VIEW
========================================================== */

function resetPreview(){

buttonContainer.classList.remove("preview-active");

buttons.forEach(btn=>{

btn.classList.remove("active");

});

preview.innerHTML = `

<h2>

Choose a Course

</h2>

<p>

Hover over a course to preview the curriculum.<br>

Click to enter the course.

</p>

</div>

`;

}

/* ==========================================================
                DESKTOP HOVER
========================================================== */

buttons.forEach(button=>{

button.addEventListener("mouseenter",()=>{

buttonContainer.classList.add("preview-active");

buttons.forEach(btn=>btn.classList.remove("active"));

button.classList.add("active");

showCourse(button.dataset.course);

});

});

buttonContainer.addEventListener("mouseleave",resetPreview);

/* ==========================================================
                DESKTOP CLICK
========================================================== */

buttons.forEach(button=>{

button.addEventListener("click",()=>{

window.location.href = button.dataset.link;

});

});

/* ==========================================================
                MOBILE HOLD
========================================================== */

let holdTimer;
let holding=false;

buttons.forEach(button=>{

button.addEventListener("touchstart",()=>{

holding=false;

holdTimer=setTimeout(()=>{

holding=true;

buttonContainer.classList.add("preview-active");

buttons.forEach(btn=>btn.classList.remove("active"));

button.classList.add("active");

showCourse(button.dataset.course);

},500);

});

button.addEventListener("touchend",()=>{

clearTimeout(holdTimer);

if(holding){

resetPreview();

}

});

button.addEventListener("touchmove",()=>{

clearTimeout(holdTimer);

});

});

/* ==========================================================
                INITIAL STATE
========================================================== */

resetPreview();