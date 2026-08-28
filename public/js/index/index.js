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
   GALLERY CAROUSEL
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


        /* CREATE POPUP IMAGE */

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
           CLOSE POPUP WHEN PAGE SCROLLS
        ================================= */

        window.addEventListener(
            "scroll",
            closePopup
        );

    }
);


/* ==========================================================
   GALLERY AUTO SCROLL + MOUSE WHEEL CONTROL

   NORMAL:
   Gallery automatically moves LEFT.

   MOUSE HOVER:
   Automatic movement pauses.

   WHEEL DOWN:
   Gallery moves LEFT.

   WHEEL UP:
   Gallery moves RIGHT.

   MOUSE LEAVE:
   Automatic movement resumes.

   NO CLICK-AND-DRAG SCROLLING.
========================================================== */

const gallerySlider =
    document.querySelector(
        ".gallery-wrapper"
    );

const galleryTrack =
    document.querySelector(
        ".gallery-track"
    );


if (
    gallerySlider &&
    galleryTrack
) {

    let manualPosition = 0;

    let galleryHovered = false;


    /* =================================
       GET CURRENT ANIMATED POSITION
    ================================= */

    function getCurrentGalleryPosition() {

        const computedStyle =
            window.getComputedStyle(
                galleryTrack
            );

        const transform =
            computedStyle.transform;


        if (
            !transform ||
            transform === "none"
        ) {
            return 0;
        }


        try {

            const matrix =
                new DOMMatrix(
                    transform
                );

            return matrix.m41;

        }

        catch (error) {

            return 0;

        }

    }


    /* =================================
       GET ONE COMPLETE GALLERY WIDTH

       The gallery contains the repeated
       images required for the continuous
       -50% animation loop.
    ================================= */

    function getGalleryLoopWidth() {

        return (
            galleryTrack.scrollWidth / 2
        );

    }


    /* =================================
       KEEP MANUAL SCROLL INSIDE LOOP

       This allows scrolling left/right
       without running out of gallery.
    ================================= */

    function normalizeGalleryPosition() {

        const loopWidth =
            getGalleryLoopWidth();


        if (!loopWidth) {
            return;
        }


        /* TOO FAR LEFT */

        while (
            manualPosition <=
            -loopWidth
        ) {

            manualPosition +=
                loopWidth;

        }


        /* TOO FAR RIGHT */

        while (
            manualPosition > 0
        ) {

            manualPosition -=
                loopWidth;

        }

    }


    /* =================================
       MOUSE ENTER

       PAUSE THE AUTOMATIC ANIMATION
       EXACTLY WHERE IT CURRENTLY IS.
    ================================= */

    gallerySlider.addEventListener(
        "mouseenter",
        () => {

            galleryHovered = true;


            /* GET CURRENT AUTO-SCROLL POSITION */

            manualPosition =
                getCurrentGalleryPosition();


            /* PAUSE CSS ANIMATION */

            galleryTrack.style.animationPlayState =
                "paused";


            /* FREEZE AT CURRENT POSITION */

            galleryTrack.style.transform =
                `translateX(${manualPosition}px)`;

        }
    );


    /* =================================
       MOUSE WHEEL

       DOWN = LEFT
       UP   = RIGHT
    ================================= */

    gallerySlider.addEventListener(
        "wheel",
        (event) => {

            if (!galleryHovered) {
                return;
            }


            /*
               Prevent normal vertical page
               scrolling while the cursor is
               over the gallery.
            */

            event.preventDefault();


            /*
               CHANGE THIS NUMBER IF YOU WANT:

               0.7  = slower
               1.0  = normal
               1.15 = current
               1.5  = faster
            */

            const scrollSpeed = 1.15;


            /*
               deltaY positive:
               wheel DOWN → move LEFT

               deltaY negative:
               wheel UP → move RIGHT
            */

            manualPosition -=
                event.deltaY *
                scrollSpeed;


            normalizeGalleryPosition();


            galleryTrack.style.transform =
                `translateX(${manualPosition}px)`;

        },
        {
            passive: false
        }
    );


    /* =================================
       MOUSE LEAVE

       REMOVE MANUAL POSITION AND
       RETURN TO AUTOMATIC MOVEMENT.
    ================================= */

    gallerySlider.addEventListener(
        "mouseleave",
        () => {

            galleryHovered = false;


            /*
               Give transform control back
               to the CSS animation.
            */

            galleryTrack.style.transform =
                "";


            /*
               Resume automatic movement.
            */

            galleryTrack.style.animationPlayState =
                "running";

        }
    );

}