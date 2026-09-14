/* =================================
   EXISTING SHOWS SYSTEM
   PRESERVED
================================= */

async function loadShows(){

const res = await fetch("/api/shows");

const shows = await res.json();

const container = document.getElementById("shows-container");

/* =================================
   PAGE DOES NOT USE SHOWS CONTAINER
================================= */

if (!container) {
    return;
}

container.innerHTML = "";

shows.forEach(show => {

container.innerHTML += `

<a href="/buy-ticket.html?id=${show.id}" class="show-card">

<h2>${show.title}</h2>

<p>Venue: ${show.venue}</p>

<p>${show.address || ""}</p>

<p>Date: ${show.date}</p>

<p>Time: ${show.startTime || ""}</p>

<p>Price: ₹${show.price}</p>

</a>

`;

});

}

loadShows();



/* =================================
   MANAGE SHOWS SYSTEM
================================= */

async function loadManageShows() {

    const container =
        document.getElementById(
            "showsList"
        );


    /* =================================
       PAGE DOES NOT USE MANAGE SHOWS
    ================================= */

    if (!container) {
        return;
    }


    try {

        const res =
            await fetch(
                "/api/shows"
            );


        if (!res.ok) {

            throw new Error(
                "Unable to load shows"
            );

        }


        const shows =
            await res.json();


        container.innerHTML =
            "";


        /* =================================
           NO SHOWS
        ================================= */

        if (
            !Array.isArray(shows) ||
            shows.length === 0
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
           CREATE MANAGE SHOW CARDS
        ================================= */

        shows.forEach(
            (show, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "manage-show-item";


                item.dataset.id =
                    show.id;


                item.style.zIndex =
                    shows.length - index;


                /* =================================
                   FIRST CARD ACTIVE
                ================================= */

                if (index === 0) {

                    item.classList.add(
                        "active"
                    );

                }


                item.innerHTML = `

                    <div class="manage-show-card">


                        ${
                            show.poster
                                ? `

                                    <img
                                        class="manage-poster"
                                        src="${show.poster}"
                                        alt="${show.title || "Show"}"
                                    >

                                `
                                : ""
                        }


                        <div class="manage-info">

                            <h2>
                                ${show.title || ""}
                            </h2>


                            <p>
                                <strong>
                                    Venue:
                                </strong>

                                ${show.venue || ""}
                            </p>


                            ${
                                show.address
                                    ? `

                                        <p>
                                            <strong>
                                                Address:
                                            </strong>

                                            ${show.address}
                                        </p>

                                    `
                                    : ""
                            }


                            <p>
                                <strong>
                                    Date:
                                </strong>

                                ${show.date || ""}
                            </p>


                            <p>
                                <strong>
                                    Time:
                                </strong>

                                ${formatShowTime(show)}
                            </p>


                            <p class="show-price">

                                ₹${show.price || "0"}

                            </p>


                            ${
                                show.info
                                    ? `

                                        <p>
                                            ${show.info}
                                        </p>

                                    `
                                    : ""
                            }


                            <!-- =================================
                                 SHOW ACTIONS
                            ================================== -->

                            <div class="showButtons">

                                <button
                                    type="button"
                                    class="edit-show-btn"
                                >
                                    EDIT
                                </button>


                                <button
                                    type="button"
                                    class="delete-show-btn"
                                >
                                    DELETE
                                </button>

                            </div>

                        </div>


                    </div>

                `;


                container.appendChild(
                    item
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
                    () => {

                        openEditPanel(
                            show
                        );

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
                    () => {

                        deleteShow(
                            show
                        );

                    }
                );

            }
        );


        /* =================================
           ACTIVATE CARD NEAREST CENTER
        ================================= */

        updateActiveShow();


        container.addEventListener(
            "scroll",
            updateActiveShow,
            {
                passive: true
            }
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
   ACTIVE SHOW CARD
================================= */

function updateActiveShow() {

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


    if (!items.length) {
        return;
    }


    const containerRect =
        container.getBoundingClientRect();


    const center =
        containerRect.top +
        (
            containerRect.height / 2
        );


    let activeItem =
        null;


    let closestDistance =
        Infinity;


    items.forEach(
        item => {

            const rect =
                item.getBoundingClientRect();


            const itemCenter =
                rect.top +
                (
                    rect.height / 2
                );


            const distance =
                Math.abs(
                    center -
                    itemCenter
                );


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                activeItem =
                    item;

            }

        }
    );


    items.forEach(
        item => {

            item.classList.toggle(
                "active",
                item === activeItem
            );

        }
    );

}



/* =================================
   OPEN EDIT PANEL
================================= */

function openEditPanel(show) {

    closeEditPanel();


    const panel =
        document.createElement(
            "div"
        );


    panel.className =
        "show-edit-panel active";


    panel.innerHTML = `

        <div class="show-edit-container">


            <h2 class="show-edit-title">
                EDIT SHOW
            </h2>


            <form
                id="showEditForm"
                enctype="multipart/form-data"
            >


                <div class="show-edit-grid">


                    <input
                        type="text"
                        name="title"
                        value="${escapeAttribute(show.title || "")}"
                        placeholder="Show Name"
                        required
                    >


                    <input
                        type="text"
                        name="venue"
                        value="${escapeAttribute(show.venue || "")}"
                        placeholder="Venue / Place"
                        required
                    >


                    <input
                        type="text"
                        name="address"
                        value="${escapeAttribute(show.address || "")}"
                        placeholder="Address"
                    >


                    <input
                        type="date"
                        name="date"
                        value="${escapeAttribute(show.date || "")}"
                        required
                    >


                    <input
                        type="time"
                        name="startTime"
                        value="${escapeAttribute(show.startTime || "")}"
                    >


                    <input
                        type="time"
                        name="endTime"
                        value="${escapeAttribute(show.endTime || "")}"
                    >


                    <input
                        type="number"
                        name="price"
                        value="${escapeAttribute(show.price || "")}"
                        placeholder="Ticket Price (₹)"
                    >


                    <input
                        type="file"
                        name="poster"
                        accept="image/*"
                    >


                    <textarea
                        name="info"
                        class="show-edit-full extra-info"
                        placeholder="Extra Information"
                    >${escapeHTML(show.info || "")}</textarea>


                </div>


                <div class="show-edit-actions">


                    <button
                        type="submit"
                        class="show-save-btn"
                    >
                        SAVE
                    </button>


                    <button
                        type="button"
                        class="show-cancel-btn"
                    >
                        CANCEL
                    </button>


                </div>


            </form>


        </div>

    `;


    document.body.appendChild(
        panel
    );


    const form =
        panel.querySelector(
            "#showEditForm"
        );


    const cancelButton =
        panel.querySelector(
            ".show-cancel-btn"
        );


    /* =================================
       SAVE EDIT
    ================================= */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const formData =
                new FormData(
                    form
                );


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


    /* =================================
       CANCEL EDIT
    ================================= */

    cancelButton.addEventListener(
        "click",
        closeEditPanel
    );


    /* =================================
       CLICK OUTSIDE TO CLOSE
    ================================= */

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

    return escapeHTML(
        value
    );

}



/* =================================
   LOAD MANAGE SHOWS
================================= */

loadManageShows();