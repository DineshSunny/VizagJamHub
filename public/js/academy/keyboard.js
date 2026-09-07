/* ==========================================================
                    KEYBOARD SCHOOL
========================================================== */

const courses = {

beginner:{

title:"Beginner Keyboard",

description:
"Build a strong foundation in keyboard playing, notes, chords, rhythm and coordination. Perfect for complete beginners starting their keyboard journey.",

duration:"8 Weeks",

level:"Beginner",

curriculum:[

"Introduction to the Keyboard",
"Understanding Keys and Notes",
"Finger Numbers and Hand Position",
"Basic Music Theory",
"Major and Minor Chords",
"Simple Rhythm Patterns",
"Playing Beginner Songs",
"Daily Practice Routine"

]

},

intermediate:{

title:"Intermediate Keyboard",

description:
"Take your keyboard playing to the next level with chord progressions, scales, accompaniment patterns and performance techniques.",

duration:"10 Weeks",

level:"Intermediate",

curriculum:[

"Major and Minor Scales",
"Chord Progressions",
"Chord Inversions",
"Left and Right Hand Coordination",
"Arpeggios",
"Accompaniment Patterns",
"Playing Along With Songs",
"Performance Techniques"

]

},

advanced:{

title:"Advanced Keyboard",

description:
"Develop advanced keyboard skills including complex harmony, improvisation, professional accompaniment and live performance techniques.",

duration:"12 Weeks",

level:"Advanced",

curriculum:[

"Advanced Chord Voicings",
"Extended Chords",
"Advanced Scales",
"Improvisation Techniques",
"Advanced Hand Independence",
"Professional Accompaniment",
"Live Band Performance",
"Advanced Keyboard Techniques"

]

}

};

const buttons =
document.querySelectorAll(".keyboard-btn");

const preview =
document.getElementById("keyboard-preview");

const buttonContainer =
document.querySelector(".keyboard-buttons");

/* ==========================================================
                    BUILD PREVIEW
========================================================== */

function showCourse(course){

const item = courses[course];

preview.innerHTML = `

<div class="keyboard-content">

<h2>${item.title}</h2>

<p>${item.description}</p>

<ul>

${item.curriculum
.map(topic=>`<li>${topic}</li>`)
.join("")}

</ul>

<div class="keyboard-footer">

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