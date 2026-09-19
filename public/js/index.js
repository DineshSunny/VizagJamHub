/* =================================
   VIZAG JAMHUB - INDEX
================================= */

/* ==========================================================
   INDEX SCROLL RESTORATION
========================================================== */

if ("scrollRestoration" in history) {

    history.scrollRestoration = "auto";

}


window.addEventListener(
    "load",
    () => {

        const navigationEntry =
            performance.getEntriesByType(
                "navigation"
            )[0];


        if (
            navigationEntry &&
            navigationEntry.type === "reload"
        ) {

            window.scrollTo(
                0,
                0
            );

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
   INDEX UPCOMING SHOWS
========================================================== */

let indexActiveShowIndex = 0;

let indexShowsData = [];

let indexTouchStartX = 0;

let indexWheelLocked = false;


/* ==========================================================
   LOAD INDEX SHOWS
========================================================== */

async function loadIndexShows() {

    const container =
        document.getElementById(
            "shows-container"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/shows"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load shows"
            );

        }


        indexShowsData =
            await response.json();


        container.innerHTML =
            "";


        /* =================================
           NO UPCOMING SHOWS
        ================================= */

        if (
            !indexShowsData.length
        ) {

            container.innerHTML = `
                <div class="no-shows">
                    More shows coming soon.
                </div>
            `;

            return;

        }


        /* =================================
           KEEP ACTIVE INDEX VALID
        ================================= */

        if (
            indexActiveShowIndex >=
            indexShowsData.length
        ) {

            indexActiveShowIndex =
                0;

        }


        /* =================================
           CREATE INDEX SHOW CARDS
        ================================= */

        indexShowsData.forEach(
            (show, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "index-show-item";


                item.innerHTML = `

                    <div class="index-show-card">

                        <div class="index-show-poster-frame">

                            ${
                                show.poster
                                    ? `
                                        <img
                                            class="index-show-poster"
                                            src="${show.poster}"
                                            alt="${show.title || "Show Poster"}"
                                        >
                                      `
                                    : `
                                        <div class="index-show-poster index-show-poster-empty">
                                            SHOW
                                        </div>
                                      `
                            }

                        </div>


                        <div class="index-show-info">

                            <h2>
                                ${show.title || ""}
                            </h2>


                            <p class="index-show-date">
                                <i class="fa-regular fa-calendar"></i>
                                ${formatDate(show.date)}
                            </p>


                            ${
                                show.price
                                    ? `
                                        <p class="index-show-price">
                                            ₹${show.price}
                                        </p>
                                      `
                                    : ""
                            }


                            <div class="index-show-action">

                                <button
                                    type="button"
                                    class="index-ticket-btn"
                                >
                                    BUY TICKETS
                                </button>

                            </div>

                        </div>

                    </div>

                `;


                /* =================================
                   SIDE CARD CLICK
                ================================= */

                item.addEventListener(
                    "click",
                    (event) => {

                        if (
                            event.target.closest(
                                ".index-ticket-btn"
                            )
                        ) {

                            return;

                        }


                        if (
                            index !==
                            indexActiveShowIndex
                        ) {

                            indexActiveShowIndex =
                                index;


                            updateIndexShowsCarousel();

                        }

                    }
                );


                /* =================================
                   BUY TICKETS
                ================================= */

                const ticketButton =
                    item.querySelector(
                        ".index-ticket-btn"
                    );


                if (ticketButton) {

                    ticketButton.addEventListener(
                        "click",
                        (event) => {

                            event.stopPropagation();


                            window.location.href =
                                `/pages/admin/tickets/buyticket.html?id=${show.id}`;

                        }
                    );

                }


                container.appendChild(
                    item
                );

            }
        );


        /* =================================
           INITIAL CAROUSEL POSITION
        ================================= */

        updateIndexShowsCarousel();


        /* =================================
           INDEX MOUSE WHEEL
        ================================= */

        container.addEventListener(
            "wheel",
            handleIndexShowsWheel,
            {
                passive: false
            }
        );


        /* =================================
           INDEX TOUCH
        ================================= */

        container.addEventListener(
            "touchstart",
            handleIndexShowsTouchStart,
            {
                passive: true
            }
        );


        container.addEventListener(
            "touchend",
            handleIndexShowsTouchEnd,
            {
                passive: true
            }
        );

    }

    catch (error) {

        console.error(
            "Failed to fetch shows:",
            error
        );


        container.innerHTML = `
            <div class="no-shows">
                Unable to load shows.
            </div>
        `;

    }

}


/* ==========================================================
   GET INDEX CAROUSEL POSITION
========================================================== */

function getIndexShowPosition(
    index
) {

    let difference =
        index -
        indexActiveShowIndex;


    const total =
        indexShowsData.length;


    if (!total) {
        return 0;
    }


    const half =
        Math.floor(
            total / 2
        );


    if (
        difference >
        half
    ) {

        difference -=
            total;

    }


    if (
        difference <
        -half
    ) {

        difference +=
            total;

    }


    return difference;

}


/* ==========================================================
   UPDATE INDEX SHOWS CAROUSEL
========================================================== */

function updateIndexShowsCarousel() {

    const items =
        document.querySelectorAll(
            "#shows-container .index-show-item"
        );


    items.forEach(
        (item, index) => {

            const position =
                getIndexShowPosition(
                    index
                );


            item.classList.remove(
                "active",
                "left",
                "right",
                "far-left",
                "far-right",
                "hidden-left",
                "hidden-right"
            );


            if (
                position === 0
            ) {

                item.classList.add(
                    "active"
                );

            }

            else if (
                position === -1
            ) {

                item.classList.add(
                    "left"
                );

            }

            else if (
                position === 1
            ) {

                item.classList.add(
                    "right"
                );

            }

            else if (
                position === -2
            ) {

                item.classList.add(
                    "far-left"
                );

            }

            else if (
                position === 2
            ) {

                item.classList.add(
                    "far-right"
                );

            }

            else if (
                position < 0
            ) {

                item.classList.add(
                    "hidden-left"
                );

            }

            else {

                item.classList.add(
                    "hidden-right"
                );

            }

        }
    );

}


/* ==========================================================
   INDEX SHOWS NEXT
========================================================== */

function indexNextShow() {

    if (
        indexShowsData.length <= 1
    ) {
        return;
    }


    indexActiveShowIndex =
        (
            indexActiveShowIndex +
            1
        ) %
        indexShowsData.length;


    updateIndexShowsCarousel();

}


/* ==========================================================
   INDEX SHOWS PREVIOUS
========================================================== */

function indexPreviousShow() {

    if (
        indexShowsData.length <= 1
    ) {
        return;
    }


    indexActiveShowIndex =
        (
            indexActiveShowIndex -
            1 +
            indexShowsData.length
        ) %
        indexShowsData.length;


    updateIndexShowsCarousel();

}


/* ==========================================================
   INDEX SHOWS MOUSE WHEEL

   ONLY THE CENTER CARD CONTROLS
   THE SHOW CAROUSEL.

   LEFT / RIGHT CARDS AND EMPTY
   SPACE KEEP NORMAL PAGE SCROLL.
========================================================== */

function handleIndexShowsWheel(
    event
) {

    if (
        indexShowsData.length <= 1
    ) {
        return;
    }


    const activeCard =
        document.querySelector(
            "#shows-container .index-show-item.active"
        );


    if (
        !activeCard ||
        !activeCard.contains(event.target)
    ) {

        return;

    }


    event.preventDefault();


    if (indexWheelLocked) {
        return;
    }


    indexWheelLocked =
        true;


    if (
        event.deltaY > 0 ||
        event.deltaX > 0
    ) {

        indexNextShow();

    }

    else {

        indexPreviousShow();

    }


    setTimeout(
        () => {

            indexWheelLocked =
                false;

        },
        450
    );

}


/* ==========================================================
   INDEX SHOWS TOUCH START
========================================================== */

function handleIndexShowsTouchStart(
    event
) {

    if (
        !event.touches.length
    ) {
        return;
    }


    indexTouchStartX =
        event.touches[0].clientX;

}


/* ==========================================================
   INDEX SHOWS TOUCH END
========================================================== */

function handleIndexShowsTouchEnd(
    event
) {

    if (
        !event.changedTouches.length
    ) {
        return;
    }


    const touchEndX =
        event.changedTouches[0].clientX;


    const difference =
        indexTouchStartX -
        touchEndX;


    if (
        Math.abs(difference) <
        50
    ) {
        return;
    }


    if (
        difference > 0
    ) {

        indexNextShow();

    }

    else {

        indexPreviousShow();

    }

}


/* ==========================================================
   INITIALIZE INDEX SHOWS
========================================================== */

loadIndexShows();


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


            event.preventDefault();


            const scrollSpeed = 1.15;


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
    ================================= */

    gallerySlider.addEventListener(
        "mouseleave",
        () => {

            galleryHovered = false;


            galleryTrack.style.transform =
                "";


            galleryTrack.style.animationPlayState =
                "running";

        }
    );

}