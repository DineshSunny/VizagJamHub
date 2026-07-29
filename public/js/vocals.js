/* ==========================================================
                    VOCALS SCHOOL
========================================================== */

const vocalsCourses = {

beginner:{

title:"Beginner Vocals",

description:
"Build confidence in your singing by learning breathing, pitch control, rhythm and vocal techniques. Perfect for complete beginners.",

duration:"8 Weeks",

level:"Beginner",

curriculum:[

"Breathing Techniques",
"Vocal Warmups",
"Pitch Matching",
"Rhythm & Timing",
"Vocal Exercises",
"First Songs",
"Microphone Basics",
"Daily Practice Routine"

]

},

intermediate:{

title:"Intermediate Vocals",

description:
"Improve vocal control, harmony singing, vibrato and stage confidence while developing your own unique singing style.",

duration:"10 Weeks",

level:"Intermediate",

curriculum:[

"Voice Control",
"Harmony Singing",
"Ear Training",
"Vibrato Techniques",
"Vocal Dynamics",
"Performance Skills",
"Stage Presence",
"Song Interpretation"

]

},

advanced:{

title:"Advanced Vocals",

description:
"Master professional vocal techniques including riffs, improvisation, recording sessions and live stage performance.",

duration:"12 Weeks",

level:"Advanced",

curriculum:[

"Advanced Vocal Techniques",
"Riffs & Runs",
"Vocal Health",
"Recording Studio Techniques",
"Live Performance",
"Improvisation",
"Artist Development",
"Professional Performance"

]

}

};

const buttons =
document.querySelectorAll(".vocals-btn");

const preview =
document.getElementById("vocals-preview");

const buttonContainer =
document.querySelector(".vocals-buttons");

/* ==========================================================
                    BUILD PREVIEW
========================================================== */

function showVocalsCourse(course){

const item = vocalsCourses[course];

preview.innerHTML = `

<div class="vocals-content">

<h2>${item.title}</h2>

<p>${item.description}</p>

<ul>

${item.curriculum
.map(topic=>`<li>${topic}</li>`)
.join("")}

</ul>

<div class="vocals-footer">

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

function resetVocalsPreview(){

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

showVocalsCourse(button.dataset.course);

});

});

buttonContainer.addEventListener("mouseleave",resetVocalsPreview);

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

showVocalsCourse(button.dataset.course);

},500);

});

button.addEventListener("touchend",()=>{

clearTimeout(holdTimer);

if(holding){

resetVocalsPreview();

}

});

button.addEventListener("touchmove",()=>{

clearTimeout(holdTimer);

});

});

/* ==========================================================
                INITIAL STATE
========================================================== */

resetVocalsPreview();