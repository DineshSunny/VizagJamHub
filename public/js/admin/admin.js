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