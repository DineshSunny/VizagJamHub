/* =================================
   VIZAG JAMHUB - INDEX
================================= */


/* ==========================================================
   FULLSCREEN GLASS NAVIGATION
========================================================== */

const menuToggle =
    document.querySelector(".menu-toggle");

const menuClose =
    document.querySelector(".menu-close");

const navOverlay =
    document.querySelector(".nav-overlay");

const navItems =
    document.querySelectorAll(".nav-links a");


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
   CLOSE AFTER CLICKING MENU LINK
================================= */

navItems.forEach((link) => {

    link.addEventListener(
        "click",
        closeMenu
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


/* ==========================================================
   AUTO TYPING TEXT
========================================================== */

const words = [

    "LIVE MUSIC",
    "JAM SESSIONS",
    "VIZAG CULTURE",
    "NIGHT VIBES",
    "LIVE PERFORMANCES",
    "MUSIC COMMUNITY"

];


const typing =
    document.getElementById("typing");


if (typing) {

    let wordIndex = 0;


    /* INITIAL TEXT */

    typing.textContent =
        words[wordIndex];

    typing.classList.add("show");


    /* TEXT LOOP */

    setInterval(() => {


        /* FADE OUT */

        typing.classList.remove("show");

        typing.classList.add("hide");


        setTimeout(() => {


            /* CHANGE TEXT */

            wordIndex =
                (wordIndex + 1) %
                words.length;


            typing.textContent =
                words[wordIndex];


            /* FADE IN */

            typing.classList.remove("hide");

            typing.classList.add("show");


        }, 900);


    }, 3200);

}


/* ==========================================================
   LIVE TEXT SCROLL FADE
========================================================== */

const liveText =
    document.getElementById("live-text");

const lyricsSection =
    document.querySelector(".lyrics-section");


if (liveText && lyricsSection) {

    window.addEventListener(
        "scroll",
        () => {

            const triggerPoint =
                lyricsSection.offsetTop - 850;


            /* FADE OUT */

            if (
                window.scrollY >
                triggerPoint
            ) {

                liveText.style.opacity =
                    "0";

            }


            /* FADE IN */

            else {

                liveText.style.opacity =
                    "1";

            }

        }
    );

}


/* ==========================================================
   OVERLAY LOGO SCROLL FADE
========================================================== */

const overlayLogo =
    document.getElementById("overlay-logo");


if (
    overlayLogo &&
    lyricsSection
) {

    window.addEventListener(
        "scroll",
        () => {

            const lyricsBottom =
                lyricsSection.offsetTop +
                lyricsSection.offsetHeight;


            if (
                window.scrollY >
                lyricsBottom - 1300
            ) {

                overlayLogo.style.opacity =
                    "0";

            }

            else {

                overlayLogo.style.opacity =
                    "0.9";

            }

        }
    );

}


/* ==========================================================
   FORMAT DATE
========================================================== */

function formatDate(dateString) {


    /* FIX TIMEZONE SHIFT */

    const parts =
        dateString.split("-");


    const date =
        new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );


    const months = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    const day =
        date.getDate();


    function getOrdinal(n) {

        if (
            n > 3 &&
            n < 21
        ) {

            return "th";

        }


        switch (n % 10) {

            case 1:
                return "st";

            case 2:
                return "nd";

            case 3:
                return "rd";

            default:
                return "th";

        }

    }


    return (
        months[date.getMonth()] +
        " " +
        day +
        getOrdinal(day)
    );

}


/* ==========================================================
   LOAD UPCOMING SHOWS - 3D CAROUSEL
========================================================== */

fetch("/api/shows")

    .then((res) =>
        res.json()
    )

    .then((shows) => {

        const container =
            document.getElementById(
                "shows-container"
            );

        const indicators =
            document.getElementById(
                "shows-indicators"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";

        if (indicators) {
            indicators.innerHTML = "";
        }


        /* =================================
           NO UPCOMING SHOWS
        ================================= */

        if (!shows.length) {

            container.innerHTML = `
                <div class="no-shows">
                    More shows coming soon.
                </div>
            `;

            return;

        }


        let activeIndex = 0;

        let autoRotate = null;

        const cards = [];


        /* =================================
           CREATE SHOW CARDS
        ================================= */

        shows.forEach((show, index) => {

            const card =
                document.createElement("div");


            card.className =
                "show-card";


            card.innerHTML = `

                <img
                    class="show-poster"
                    src="${show.poster}"
                    alt="${show.title}">

                <div class="show-info">

                    <h3>
                        ${show.title}
                    </h3>

                    <p>
                        <i class="fa-solid fa-location-dot"></i>
                        ${show.venue}
                    </p>

                    <p>
                        <i class="fa-regular fa-calendar"></i>
                        ${formatDate(show.date)}
                    </p>

                    <p class="show-price">
                        ${show.price ? "₹" + show.price : ""}
                    </p>

                </div>

            `;


            /* =================================
               CLICK CARD
            ================================= */

            card.addEventListener(
                "click",
                () => {

                    /*
                       Clicking a side card first
                       moves it into the center.
                    */

                    if (index !== activeIndex) {

                        activeIndex = index;

                        updateCarousel();

                        restartAutoRotate();

                        return;

                    }


                    /*
                       Clicking the center card
                       opens the ticket page.
                    */

                    window.location.href =
                        `/pages/admin/tickets/buyticket.html?id=${show.id}`;

                }
            );


            container.appendChild(card);

            cards.push(card);


            /* =================================
               CREATE INDICATOR
            ================================= */

            if (indicators) {

                const indicator =
                    document.createElement("button");


                indicator.className =
                    "show-indicator";


                indicator.type =
                    "button";


                indicator.setAttribute(
                    "aria-label",
                    `Show ${index + 1}`
                );


                indicator.addEventListener(
                    "click",
                    () => {

                        activeIndex =
                            index;

                        updateCarousel();

                        restartAutoRotate();

                    }
                );


                indicators.appendChild(
                    indicator
                );

            }

        });


        /* =================================
           SHORTEST CAROUSEL DISTANCE
        ================================= */

        function getRelativePosition(
            index
        ) {

            let difference =
                index - activeIndex;


            const half =
                Math.floor(
                    cards.length / 2
                );


            if (
                difference >
                half
            ) {

                difference -=
                    cards.length;

            }


            if (
                difference <
                -half
            ) {

                difference +=
                    cards.length;

            }


            return difference;

        }


        /* =================================
           UPDATE 3D POSITIONS
        ================================= */

        function updateCarousel() {

            cards.forEach(
                (card, index) => {

                    const position =
                        getRelativePosition(
                            index
                        );


                    card.classList.remove(
                        "active",
                        "prev",
                        "next",
                        "prev-far",
                        "next-far",
                        "hidden-left",
                        "hidden-right"
                    );


                    if (position === 0) {

                        card.classList.add(
                            "active"
                        );

                    }

                    else if (
                        position === -1
                    ) {

                        card.classList.add(
                            "prev"
                        );

                    }

                    else if (
                        position === 1
                    ) {

                        card.classList.add(
                            "next"
                        );

                    }

                    else if (
                        position === -2
                    ) {

                        card.classList.add(
                            "prev-far"
                        );

                    }

                    else if (
                        position === 2
                    ) {

                        card.classList.add(
                            "next-far"
                        );

                    }

                    else if (
                        position < 0
                    ) {

                        card.classList.add(
                            "hidden-left"
                        );

                    }

                    else {

                        card.classList.add(
                            "hidden-right"
                        );

                    }

                }
            );


            /* UPDATE DOTS */

            if (indicators) {

                const dots =
                    indicators.querySelectorAll(
                        ".show-indicator"
                    );


                dots.forEach(
                    (dot, index) => {

                        dot.classList.toggle(
                            "active",
                            index === activeIndex
                        );

                    }
                );

            }

        }


        /* =================================
           MOVE TO NEXT SHOW
        ================================= */

        function nextShow() {

            activeIndex =
                (activeIndex + 1) %
                cards.length;


            updateCarousel();

        }


        /* =================================
           AUTO ROTATION
        ================================= */

        function startAutoRotate() {

            if (
                cards.length <= 1
            ) {

                return;

            }


            autoRotate =
                setInterval(
                    nextShow,
                    4000
                );

        }


        function stopAutoRotate() {

            if (autoRotate) {

                clearInterval(
                    autoRotate
                );

                autoRotate =
                    null;

            }

        }


        function restartAutoRotate() {

            stopAutoRotate();

            startAutoRotate();

        }


        /* =================================
           PAUSE WHILE HOVERING
        ================================= */

        const carousel =
            document.querySelector(
                ".shows-carousel"
            );


        if (carousel) {

            carousel.addEventListener(
                "mouseenter",
                stopAutoRotate
            );


            carousel.addEventListener(
                "mouseleave",
                startAutoRotate
            );

        }


        /* =================================
           INITIALIZE
        ================================= */

        updateCarousel();

        startAutoRotate();

    })

    .catch((error) => {

        console.error(
            "Failed to fetch shows:",
            error
        );

    });

    

/* ==========================================================
   GALLERY IMAGE POPUP
========================================================== */

document.addEventListener(
    "click",
    function (event) {


        /* ONLY GALLERY IMAGES */

        if (
            !event.target.matches(
                ".gallery-track img"
            )
        ) {

            return;

        }


        /* CREATE POPUP */

        const popup =
            document.createElement("div");


        popup.classList.add(
            "image-popup"
        );


        /* CREATE IMAGE */

        const popupImage =
            document.createElement("img");


        popupImage.src =
            event.target.src;


        popupImage.alt =
            event.target.alt ||
            "Gallery image";


        popup.appendChild(
            popupImage
        );


        document.body.appendChild(
            popup
        );


        /* =================================
           CLOSE POPUP
        ================================= */

        function closePopup() {

            popup.remove();


            window.removeEventListener(
                "scroll",
                closePopup
            );

        }


        /* =================================
           CLOSE WHEN CLICKING OUTSIDE IMAGE
        ================================= */

        setTimeout(() => {

            function outsideClick(
                clickEvent
            ) {

                if (
                    !clickEvent.target.closest(
                        ".image-popup img"
                    )
                ) {

                    closePopup();


                    document.removeEventListener(
                        "click",
                        outsideClick
                    );

                }

            }


            document.addEventListener(
                "click",
                outsideClick
            );


        }, 100);


        /* =================================
           CLOSE POPUP WHEN SCROLLING
        ================================= */

        window.addEventListener(
            "scroll",
            closePopup
        );

    }
);


/* ==========================================================
   GALLERY DRAG SCROLL
========================================================== */

const gallerySlider =
    document.querySelector(
        ".gallery-wrapper"
    );


if (gallerySlider) {

    let isDragging = false;

    let startX = 0;

    let startingScrollLeft = 0;


    /* =================================
       START DRAG
    ================================= */

    gallerySlider.addEventListener(
        "mousedown",
        (event) => {

            isDragging = true;


            gallerySlider.style.cursor =
                "grabbing";


            startX =
                event.pageX -
                gallerySlider.offsetLeft;


            startingScrollLeft =
                gallerySlider.scrollLeft;

        }
    );


    /* =================================
       STOP DRAG
    ================================= */

    gallerySlider.addEventListener(
        "mouseup",
        () => {

            isDragging = false;


            gallerySlider.style.cursor =
                "default";

        }
    );


    /* =================================
       STOP DRAG WHEN MOUSE LEAVES
    ================================= */

    gallerySlider.addEventListener(
        "mouseleave",
        () => {

            isDragging = false;


            gallerySlider.style.cursor =
                "default";

        }
    );


    /* =================================
       DRAG
    ================================= */

    gallerySlider.addEventListener(
        "mousemove",
        (event) => {

            if (!isDragging) {
                return;
            }


            event.preventDefault();


            const currentX =
                event.pageX -
                gallerySlider.offsetLeft;


            const distance =
                (currentX - startX) * 2;


            gallerySlider.scrollLeft =
                startingScrollLeft -
                distance;

        }
    );

}