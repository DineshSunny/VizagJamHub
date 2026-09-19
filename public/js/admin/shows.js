/* =================================
   EXISTING SHOWS SYSTEM
   PRESERVED
================================= */

async function loadShows() {

    const res = await fetch("/api/shows");

    const shows = await res.json();

    const container =
        document.getElementById("shows-container");


    /* =================================
       PAGE DOES NOT USE SHOWS CONTAINER
    ================================= */

    if (!container) {
        return;
    }


    container.innerHTML = "";


    shows.forEach(show => {

        container.innerHTML += `

            <a
                href="/buy-ticket.html?id=${show.id}"
                class="show-card"
            >

                <h2>
                    ${show.title}
                </h2>

                <p>
                    Venue: ${show.venue}
                </p>

                <p>
                    ${show.address || ""}
                </p>

                <p>
                    Date: ${show.date}
                </p>

                <p>
                    Time: ${show.startTime || ""}
                </p>

                <p>
                    Price: ₹${show.price}
                </p>

            </a>

        `;

    });

}


loadShows();



/* =================================
   MANAGE SHOWS CAROUSEL
================================= */

let activeShowIndex = 0;

let manageShowsData = [];

let touchStartX = 0;

let wheelLocked = false;



/* =================================
   LOAD MANAGE SHOWS
================================= */

async function loadManageShows() {

    const container =
        document.getElementById("showsList");


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch("/api/shows");


        if (!response.ok) {

            throw new Error(
                "Unable to load shows"
            );

        }


        manageShowsData =
            await response.json();


        container.innerHTML = "";


        /* =================================
           NO SHOWS
        ================================= */

        if (
            !Array.isArray(manageShowsData) ||
            manageShowsData.length === 0
        ) {

            container.innerHTML = `

                <div class="manage-shows-empty">

                    <h2>
                        No Shows Available
                    </h2>

                    <p>
                        Create a show to manage it here.
                    </p>

                </div>

            `;

            return;

        }


        /* =================================
           KEEP ACTIVE INDEX VALID
        ================================= */

        if (
            activeShowIndex >=
            manageShowsData.length
        ) {

            activeShowIndex =
                manageShowsData.length - 1;

        }


        if (activeShowIndex < 0) {

            activeShowIndex = 0;

        }


        /* =================================
           CREATE CARDS
        ================================= */

        manageShowsData.forEach(
            (show, index) => {

                const item =
                    document.createElement(
                        "article"
                    );


                item.className =
                    "manage-show-item";


                item.dataset.index =
                    index;


                item.dataset.id =
                    show.id;


                item.innerHTML = `

                    <div class="manage-show-card">

                        <div class="manage-poster-frame">

                            ${
                                show.poster
                                    ? `

                                        <img
                                            class="manage-poster"
                                            src="${escapeAttribute(show.poster)}"
                                            alt="${escapeAttribute(show.title || "Show")} poster"
                                        >

                                    `
                                    : `

                                        <div class="manage-poster manage-poster-empty">

                                            <i class="fa-solid fa-music"></i>

                                        </div>

                                    `
                            }

                        </div>


                        <div class="manage-info">

                            <h2>
                                ${escapeHTML(show.title || "")}
                            </h2>


                            ${
                                show.date
                                    ? `

                                        <p class="manage-show-date">

                                            <i class="fa-regular fa-calendar"></i>

                                            <span>
                                                ${escapeHTML(show.date)}
                                            </span>

                                        </p>

                                    `
                                    : ""
                            }


                            <div class="showButtons">

                                <button
                                    type="button"
                                    class="edit-show-btn"
                                >

                                    <i class="fa-solid fa-pen"></i>

                                    <span>
                                        EDIT
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    class="delete-show-btn"
                                >

                                    <i class="fa-regular fa-trash-can"></i>

                                    <span>
                                        DELETE
                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                `;


                container.appendChild(item);


                /* =================================
                   CLICK SIDE CARD
                ================================= */

                item.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.closest("button")
                        ) {
                            return;
                        }


                        if (
                            index !== activeShowIndex
                        ) {

                            activeShowIndex =
                                index;

                            updateCarouselPositions();

                        }

                    }
                );


                /* =================================
                   EDIT BUTTON
                ================================= */

                const editButton =
                    item.querySelector(
                        ".edit-show-btn"
                    );


                editButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openEditPanel(show);

                    }
                );


                /* =================================
                   DELETE BUTTON
                ================================= */

                const deleteButton =
                    item.querySelector(
                        ".delete-show-btn"
                    );


                deleteButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        deleteShow(show);

                    }
                );

            }
        );


        updateCarouselPositions();


        setupCarouselControls(
            container
        );

    }

    catch (error) {

        console.error(
            "MANAGE SHOWS ERROR:",
            error
        );


        container.innerHTML = `

            <p class="shows-message">
                Unable to load shows.
            </p>

        `;

    }

}



/* =================================
   UPDATE CAROUSEL POSITIONS
================================= */

function updateCarouselPositions() {

    const container =
        document.getElementById(
            "showsList"
        );


    if (!container) {
        return;
    }


    const items =
        container.querySelectorAll(
            ".manage-show-item"
        );


    items.forEach(
        (item, index) => {

            item.classList.remove(
                "active",
                "left",
                "right",
                "far-left",
                "far-right",
                "hidden"
            );


            const difference =
                index -
                activeShowIndex;


            if (difference === 0) {

                item.classList.add(
                    "active"
                );

            }

            else if (difference === -1) {

                item.classList.add(
                    "left"
                );

            }

            else if (difference === 1) {

                item.classList.add(
                    "right"
                );

            }

            else if (difference === -2) {

                item.classList.add(
                    "far-left"
                );

            }

            else if (difference === 2) {

                item.classList.add(
                    "far-right"
                );

            }

            else {

                item.classList.add(
                    "hidden"
                );

            }

        }
    );

}



/* =================================
   NEXT SHOW
================================= */

function nextManageShow() {

    if (
        activeShowIndex <
        manageShowsData.length - 1
    ) {

        activeShowIndex++;

        updateCarouselPositions();

    }

}



/* =================================
   PREVIOUS SHOW
================================= */

function previousManageShow() {

    if (
        activeShowIndex > 0
    ) {

        activeShowIndex--;

        updateCarouselPositions();

    }

}



/* =================================
   CAROUSEL CONTROLS
================================= */

function setupCarouselControls(container) {

    if (
        container.dataset.controlsReady ===
        "true"
    ) {
        return;
    }


    container.dataset.controlsReady =
        "true";


    /* =================================
       MOUSE WHEEL / TRACKPAD
    ================================= */

    container.addEventListener(
        "wheel",
        event => {

            if (wheelLocked) {
                return;
            }


            const movement =
                Math.abs(event.deltaX) >
                Math.abs(event.deltaY)

                    ? event.deltaX

                    : event.deltaY;


            if (
                Math.abs(movement) < 10
            ) {
                return;
            }


            event.preventDefault();


            wheelLocked = true;


            if (movement > 0) {

                nextManageShow();

            }

            else {

                previousManageShow();

            }


            setTimeout(
                () => {

                    wheelLocked = false;

                },
                420
            );

        },
        {
            passive: false
        }
    );


    /* =================================
       TOUCH START
    ================================= */

    container.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    /* =================================
       TOUCH END
    ================================= */

    container.addEventListener(
        "touchend",
        event => {

            const touchEndX =
                event.changedTouches[0].clientX;


            const distance =
                touchEndX -
                touchStartX;


            if (
                Math.abs(distance) < 45
            ) {
                return;
            }


            if (distance < 0) {

                nextManageShow();

            }

            else {

                previousManageShow();

            }

        },
        {
            passive: true
        }
    );

}



/* =================================
   OPEN EDIT PANEL
================================= */

function openEditPanel(show) {

    closeEditPanel();


    const originalValues = {

        title:
            String(show.title || ""),

        venue:
            String(show.venue || ""),

        address:
            String(show.address || ""),

        date:
            String(show.date || ""),

        startTime:
            String(show.startTime || ""),

        endTime:
            String(show.endTime || ""),

        price:
            String(show.price || ""),

        info:
            String(show.info || "")

    };


    const panel =
        document.createElement(
            "div"
        );


    panel.className =
        "show-edit-panel active";


    panel.innerHTML = `

        <div class="show-edit-container">

            <button
                type="button"
                class="show-edit-close"
                aria-label="Close edit show"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <h2 class="show-edit-title">
                EDIT SHOW
            </h2>


            ${
                show.poster
                    ? `

                        <div class="show-edit-current-poster">

                            <img
                                src="${escapeAttribute(show.poster)}"
                                alt="${escapeAttribute(show.title || "Show")} poster"
                            >

                            <p>
                                Current Poster
                            </p>

                        </div>

                    `
                    : ""
            }


            <form
                class="create-show-form"
                id="showEditForm"
                enctype="multipart/form-data"
            >

                <input
                    type="text"
                    name="title"
                    id="editShowName"
                    value="${escapeAttribute(show.title || "")}"
                    placeholder="Show Name"
                    required
                >

                <input
                    type="text"
                    name="venue"
                    id="editVenue"
                    value="${escapeAttribute(show.venue || "")}"
                    placeholder="Venue / Place"
                    required
                >

                <input
                    type="text"
                    name="address"
                    id="editAddress"
                    value="${escapeAttribute(show.address || "")}"
                    placeholder="Address"
                    required
                >

                <input
                    type="date"
                    name="date"
                    id="editDate"
                    value="${escapeAttribute(show.date || "")}"
                    required
                >

                <input
                    type="time"
                    name="startTime"
                    id="editStartTime"
                    value="${escapeAttribute(show.startTime || "")}"
                    required
                >

                <input
                    type="time"
                    name="endTime"
                    id="editEndTime"
                    value="${escapeAttribute(show.endTime || "")}"
                    required
                >

                <input
                    type="number"
                    name="price"
                    id="editPrice"
                    value="${escapeAttribute(show.price || "")}"
                    placeholder="Ticket Price (₹)"
                >

                <input
                    type="file"
                    name="poster"
                    id="editPoster"
                    accept="image/*"
                >

                <textarea
                    name="info"
                    id="editInfo"
                    class="extra-info"
                    placeholder="Extra Information"
                >${escapeHTML(show.info || "")}</textarea>


                <div class="create-show-action">

                    <div class="login-form">

                        <button
                            type="submit"
                            class="login-btn"
                        >
                            UPDATE
                        </button>

                    </div>

                </div>


                <div class="create-show-action">

                    <div class="login-form">

                        <button
                            type="button"
                            class="login-btn show-cancel-btn"
                        >
                            CANCEL
                        </button>

                    </div>

                </div>

            </form>

        </div>

    `;


    document.body.appendChild(panel);


    const form =
        panel.querySelector(
            "#showEditForm"
        );


    const cancelButton =
        panel.querySelector(
            ".show-cancel-btn"
        );


    const closeButton =
        panel.querySelector(
            ".show-edit-close"
        );


    const posterInput =
        panel.querySelector(
            "#editPoster"
        );


    /* =================================
       UPDATE SHOW
    ================================= */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const currentValues = {

                title:
                    String(
                        form.elements.title.value
                    ),

                venue:
                    String(
                        form.elements.venue.value
                    ),

                address:
                    String(
                        form.elements.address.value
                    ),

                date:
                    String(
                        form.elements.date.value
                    ),

                startTime:
                    String(
                        form.elements.startTime.value
                    ),

                endTime:
                    String(
                        form.elements.endTime.value
                    ),

                price:
                    String(
                        form.elements.price.value
                    ),

                info:
                    String(
                        form.elements.info.value
                    )

            };


            const valuesChanged =
                Object.keys(
                    originalValues
                ).some(
                    key => {

                        return (
                            originalValues[key] !==
                            currentValues[key]
                        );

                    }
                );


            const posterChanged =
                posterInput.files.length > 0;


            if (
                !valuesChanged &&
                !posterChanged
            ) {

                alert(
                    "No changes were made."
                );

                return;

            }


            const confirmed =
                confirm(
                    "Update this show with the changes?"
                );


            if (!confirmed) {
                return;
            }


            const formData =
                new FormData(form);


            try {

                const response =
                    await fetch(
                        `/api/shows/${show.id}`,
                        {

                            method:
                                "PUT",

                            body:
                                formData

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to update show"
                    );

                }


                closeEditPanel();


                await loadManageShows();

            }

            catch (error) {

                console.error(
                    "UPDATE SHOW ERROR:",
                    error
                );


                alert(
                    "Unable to update show."
                );

            }

        }
    );


    cancelButton.addEventListener(
        "click",
        closeEditPanel
    );


    closeButton.addEventListener(
        "click",
        closeEditPanel
    );


    panel.addEventListener(
        "click",
        event => {

            if (
                event.target === panel
            ) {

                closeEditPanel();

            }

        }
    );

}



/* =================================
   CLOSE EDIT PANEL
================================= */

function closeEditPanel() {

    const panel =
        document.querySelector(
            ".show-edit-panel"
        );


    if (panel) {

        panel.remove();

    }

}



/* =================================
   DELETE SHOW
================================= */

async function deleteShow(show) {

    const confirmed =
        confirm(
            `Delete "${show.title}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/shows/${show.id}`,
                {

                    method:
                        "DELETE"

                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete show"
            );

        }


        if (
            activeShowIndex > 0 &&
            activeShowIndex >=
            manageShowsData.length - 1
        ) {

            activeShowIndex--;

        }


        await loadManageShows();

    }

    catch (error) {

        console.error(
            "DELETE SHOW ERROR:",
            error
        );


        alert(
            "Unable to delete show."
        );

    }

}



/* =================================
   FORMAT SHOW TIME
================================= */

function formatShowTime(show) {

    const start =
        show.startTime || "";


    const end =
        show.endTime || "";


    if (
        start &&
        end
    ) {

        return (
            start +
            " - " +
            end
        );

    }


    return (
        start ||
        end ||
        ""
    );

}



/* =================================
   SAFE HTML
================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}



/* =================================
   SAFE ATTRIBUTE
================================= */

function escapeAttribute(value) {

    return escapeHTML(value);

}



/* =================================
   START MANAGE SHOWS
================================= */

loadManageShows();



/* =================================
   CREATE SHOW
================================= */

const createShowForm =
    document.getElementById(
        "showForm"
    );


if (createShowForm) {

    let showCreatedSuccessfully =
        false;


    /* =================================
       CREATE SHOW SUBMISSION
    ================================= */

    createShowForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const createButton =
                createShowForm.querySelector(
                    'button[type="submit"]'
                );


            const formData =
                new FormData(
                    createShowForm
                );


            try {

                /* =================================
                   PREVENT DOUBLE SUBMISSION
                ================================= */

                if (createButton) {

                    createButton.disabled =
                        true;

                    createButton.textContent =
                        "CREATING...";

                }


                /* =================================
                   SAVE SHOW TO MASTER DATABASE
                ================================= */

                const response =
                    await fetch(
                        "/api/shows",
                        {

                            method:
                                "POST",

                            body:
                                formData

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to create show"
                    );

                }


                /* =================================
                   SERVER CONFIRMED SHOW
                ================================= */

                const createdShow =
                    await response.json();


                console.log(
                    "SHOW CREATED:",
                    createdShow
                );


                /* =================================
                   RESET ALL CREATE SHOW FIELDS
                ================================= */

                createShowForm.reset();


                const posterInput =
                    document.getElementById(
                        "poster"
                    );


                if (posterInput) {

                    posterInput.value = "";

                }


                if (
                    document.activeElement &&
                    typeof document.activeElement.blur ===
                        "function"
                ) {

                    document.activeElement.blur();

                }


                /* =================================
                   MARK CREATION COMPLETE
                ================================= */

                showCreatedSuccessfully =
                    true;


                /* =================================
                   SUCCESS NOTIFICATION
                ================================= */

                alert(
                    "Show created successfully."
                );

            }

            catch (error) {

                console.error(
                    "CREATE SHOW ERROR:",
                    error
                );


                alert(
                    "Unable to create show."
                );

            }

            finally {

                /* =================================
                   RESTORE CREATE BUTTON
                ================================= */

                if (createButton) {

                    createButton.disabled =
                        false;

                    createButton.textContent =
                        "CREATE";

                }

            }

        }
    );


    /* =================================
       BROWSER BACK AFTER CREATION
       GO TO SHOWS MENU
    ================================= */

    window.addEventListener(
        "popstate",
        function() {

            if (
                showCreatedSuccessfully
            ) {

                window.location.replace(
                    "/pages/admin/shows/shows.html"
                );

            }

        }
    );


    /* =================================
       CLEAR RESTORED FORM
       IF BROWSER CACHE RESTORES PAGE
    ================================= */

    window.addEventListener(
        "pageshow",
        function(event) {

            if (
                event.persisted &&
                showCreatedSuccessfully
            ) {

                createShowForm.reset();


                const posterInput =
                    document.getElementById(
                        "poster"
                    );


                if (posterInput) {

                    posterInput.value = "";

                }

            }

        }
    );

}