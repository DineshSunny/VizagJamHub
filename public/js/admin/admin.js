/* =================================
   VIZAG JAMHUB - ADMIN
================================= */


/* =================================
   ADMIN LOGIN
================================= */

const adminLogin =
    document.getElementById("adminLogin");

const adminPanel =
    document.getElementById("adminPanel");

const passwordField =
    document.getElementById("password");

const errorMessage =
    document.getElementById("error");


/* =================================
   SHOW LOGIN
================================= */

function showLogin() {

    if (adminPanel) {

        adminPanel.style.display = "none";

        adminPanel.classList.remove(
            "admin-panel-active"
        );

    }


    if (adminLogin) {

        adminLogin.style.display = "flex";

    }


    if (passwordField) {

        passwordField.value = "";

        passwordField.type = "password";


        const icon =
            document.getElementById(
                "password-icon"
            );


        if (icon) {

            icon.classList.remove(
                "fa-eye-slash"
            );

            icon.classList.add(
                "fa-eye"
            );

        }


        setTimeout(() => {

            passwordField.focus();

        }, 100);

    }


    if (errorMessage) {

        errorMessage.textContent = "";

    }

}


/* =================================
   SHOW ADMIN PANEL
================================= */

function showAdminPanel() {

    if (adminLogin) {

        adminLogin.style.display = "none";

    }


    if (adminPanel) {

        adminPanel.style.display = "flex";


        adminPanel.classList.remove(
            "admin-panel-active"
        );


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                adminPanel.classList.add(
                    "admin-panel-active"
                );

            });

        });

    }

}


/* =================================
   ADMIN LOGIN
================================= */

function login() {

    if (!passwordField) {
        return;
    }


    const password =
        passwordField.value;

    const correctPassword =
        "VizagJamHub@123d";


    if (password === correctPassword) {

        if (errorMessage) {

            errorMessage.textContent = "";

        }


        showAdminPanel();

    }

    else {

        if (errorMessage) {

            errorMessage.textContent =
                "Incorrect Password";

        }


        passwordField.classList.add(
            "shake"
        );


        passwordField.value = "";

        passwordField.focus();


        setTimeout(() => {

            passwordField.classList.remove(
                "shake"
            );

        }, 400);

    }

}


/* =================================
   PASSWORD EVENTS
================================= */

if (passwordField) {

    passwordField.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                login();

            }

        }
    );


    passwordField.addEventListener(
        "input",
        function() {

            if (errorMessage) {

                errorMessage.textContent = "";

            }

        }
    );

}


/* =================================
   PASSWORD TOGGLE
================================= */

function togglePassword() {

    if (!passwordField) {
        return;
    }


    const icon =
        document.getElementById(
            "password-icon"
        );


    if (passwordField.type === "password") {

        passwordField.type = "text";


        if (icon) {

            icon.classList.remove(
                "fa-eye"
            );

            icon.classList.add(
                "fa-eye-slash"
            );

        }

    }

    else {

        passwordField.type = "password";


        if (icon) {

            icon.classList.remove(
                "fa-eye-slash"
            );

            icon.classList.add(
                "fa-eye"
            );

        }

    }

}


/* =================================
   ADMIN LOGOUT
================================= */

function logout() {

    showLogin();

}


/* =================================
   ADMIN PAGE RETURN
================================= */

if (adminLogin && adminPanel) {

    window.addEventListener(
        "pageshow",
        function() {

            showLogin();

        }
    );

}



/* =================================
   LOAD SHOWS
================================= */

async function loadShows() {

    const container =
        document.getElementById("showsList");


    if (!container) {
        return;
    }


    try {

        const res =
            await fetch("/api/shows");


        if (!res.ok) {

            throw new Error(
                "Unable to load shows"
            );

        }


        const shows =
            await res.json();


        container.innerHTML = "";


        shows.forEach(show => {

            container.innerHTML += `

                <div class="showCard">

                    ${
                        show.poster
                            ? `
                                <img
                                    src="${show.poster}"
                                    class="showPoster"
                                    alt="${show.title || "Show"} Poster"
                                >
                              `
                            : ""
                    }

                    <h3>
                        ${show.title || ""}
                    </h3>

                    <p>
                        ${show.venue || ""}
                    </p>

                    <p>
                        ${show.date || ""}
                    </p>

                    <p>
                        ₹${show.price || "0"}
                    </p>

                    <div class="showButtons">

                        <button
                            type="button"
                            onclick="editShow('${show.id}')"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onclick="deleteShow('${show.id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(
            "Error loading shows:",
            error
        );

    }

}



/* =================================
   CREATE SHOW
================================= */

const showForm =
    document.getElementById("showForm");


if (showForm) {

    showForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const formData =
                new FormData(showForm);


            try {

                const res =
                    await fetch(
                        "/api/shows",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!res.ok) {

                    throw new Error(
                        "Unable to create show"
                    );

                }


                const data =
                    await res.json();


                console.log(
                    "Created:",
                    data
                );


                alert(
                    "Show Created ✅"
                );


                showForm.reset();


                if (
                    document.getElementById(
                        "showsList"
                    )
                ) {

                    loadShows();

                }

            }

            catch (error) {

                console.error(
                    "Error creating show:",
                    error
                );


                alert(
                    "Error creating show ❌"
                );

            }

        }
    );

}



/* =================================
   DELETE SHOW
================================= */

async function deleteShow(id) {

    try {

        const res =
            await fetch(
                "/api/shows/" +
                encodeURIComponent(id),
                {
                    method: "DELETE"
                }
            );


        if (!res.ok) {

            throw new Error(
                "Unable to delete show"
            );

        }


        await loadShows();

    }

    catch (error) {

        console.error(
            "Error deleting show:",
            error
        );


        alert(
            "Error deleting show ❌"
        );

    }

}



/* =================================
   EDIT SHOW
================================= */

function editShow(id) {

    window.location.href =
        "/pages/admin/shows/editshow.html?id="
        + encodeURIComponent(id);

}



/* =================================
   INITIALIZE
================================= */

loadShows();