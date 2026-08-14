/* ==========================================================
                    GUITAR SCHOOL
========================================================== */

const guitarCourses = {

beginner:{

title:"Beginner Guitar",

description:
"Build a strong musical foundation by learning chords, rhythm, strumming patterns and proper playing techniques. Perfect for complete beginners.",

duration:"8 Weeks",

level:"Beginner",

curriculum:[

"Parts of the Guitar",
"Proper Playing Posture",
"Tuning Your Guitar",
"Basic Chords",
"Chord Switching",
"Strumming Patterns",
"Simple Songs",
"Daily Practice Routine"

]

},

intermediate:{

title:"Intermediate Guitar",

description:
"Develop confidence with barre chords, fingerstyle, rhythm variations and lead guitar techniques while expanding your musical vocabulary.",

duration:"10 Weeks",

level:"Intermediate",

curriculum:[

"Barre Chords",
"Fingerstyle Basics",
"Power Chords",
"Scales & Exercises",
"Lead Guitar Basics",
"Rhythm Variations",
"Playing Along With Songs",
"Performance Techniques"

]

},

advanced:{

title:"Advanced Guitar",

description:
"Master advanced techniques used by professional guitarists including improvisation, advanced harmony, solo construction and live performance.",

duration:"12 Weeks",

level:"Advanced",

curriculum:[

"Advanced Scales",
"Improvisation",
"Solo Construction",
"Hybrid Picking",
"Sweep Picking",
"Music Theory",
"Recording Sessions",
"Live Performance"

]

}

};

const buttons =
document.querySelectorAll(".guitar-btn");

const preview =
document.getElementById("guitar-preview");

const buttonContainer =
document.querySelector(".guitar-buttons");

/* ==========================================================
                    BUILD PREVIEW
========================================================== */

function showGuitarCourse(course){

const item = guitarCourses[course];

preview.innerHTML = `

<div class="guitar-content">

<h2>${item.title}</h2>

<p>${item.description}</p>

<ul>

${item.curriculum
.map(topic=>`<li>${topic}</li>`)
.join("")}

</ul>

<div class="guitar-footer">

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

function resetGuitarPreview(){

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

showGuitarCourse(button.dataset.course);

});

});

buttonContainer.addEventListener("mouseleave",resetGuitarPreview);

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

showGuitarCourse(button.dataset.course);

},500);

});

button.addEventListener("touchend",()=>{

clearTimeout(holdTimer);

if(holding){

resetGuitarPreview();

}

});

button.addEventListener("touchmove",()=>{

clearTimeout(holdTimer);

});

});

/* ==========================================================
                INITIAL STATE
========================================================== */

resetGuitarPreview();