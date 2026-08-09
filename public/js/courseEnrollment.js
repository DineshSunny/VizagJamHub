/* ==========================================================
   VIZAG JAMHUB MUSIC ACADEMY
   COURSE ENROLLMENT AGREEMENT
   Shared course selection logic
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const formatInputs =
        document.querySelectorAll(
            'input[name="courseFormat"]'
        );


    const timeInputs =
        document.querySelectorAll(
            'input[name="courseTime"]'
        );


    const batchInputs =
        document.querySelectorAll(
            'input[name="courseBatch"]'
        );


    const agreements =
        document.querySelectorAll(
            ".course-agreement"
        );


    const scheduleMessage =
        document.getElementById(
            "schedule-selection-message"
        );


    const timeSection =
        document.getElementById(
            "class-time-section"
        );


    const batchSection =
        document.getElementById(
            "batch-selection-section"
        );


    const batchDescription =
        document.getElementById(
            "batch-selection-description"
        );


    const enrollButton =
        document.getElementById(
            "final-enroll-btn"
        );


    const agreementStatus =
        document.getElementById(
            "agreement-status"
        );



    /* =========================================================
       STATE
    ========================================================= */

    let selectedFormat = "";

    let selectedTime = "";

    let selectedBatch = null;



    /* =========================================================
       HELPERS
    ========================================================= */

    function getFormatLabel(value) {

        if (value === "in-person") {

            return "In Person";

        }


        if (value === "online") {

            return "Online";

        }


        return "";

    }



    function displayTime(value) {

        if (!value) {

            return "";

        }


        return value.replace(
            " - ",
            " – "
        );

    }



    /* =========================================================
       FORMAT SELECTION
       ONLINE / IN PERSON
    ========================================================= */

    formatInputs.forEach(input => {

        input.addEventListener(
            "change",
            () => {


                selectedFormat =
                    input.value;


                /*
                 * Changing format means the student
                 * must choose the time and batch again.
                 */

                selectedTime = "";

                selectedBatch = null;



                /* RESET TIME */

                timeInputs.forEach(time => {

                    time.checked = false;

                });



                /* RESET BATCH */

                batchInputs.forEach(batch => {

                    batch.checked = false;

                });



                /* CLEAR BATCH TIMES */

                document
                    .querySelectorAll(
                        ".batch-time-display"
                    )
                    .forEach(display => {

                        display.textContent = "";

                    });



                /* HIDE INITIAL MESSAGE */

                if (scheduleMessage) {

                    scheduleMessage.hidden = true;

                }



                /* SHOW TIME SELECTION */

                if (timeSection) {

                    timeSection.hidden = false;

                }



                /* HIDE BATCHES UNTIL TIME SELECTED */

                if (batchSection) {

                    batchSection.hidden = true;

                }



                /*
                 * Remove incomplete previous selection.
                 */

                sessionStorage.removeItem(
                    "vizagJamHubEnrollment"
                );


                updateEnrollmentState();

            }
        );

    });



    /* =========================================================
       TIME SELECTION
       5–6 / 6–7 / 7–8
    ========================================================= */

    timeInputs.forEach(input => {

        input.addEventListener(
            "change",
            () => {


                selectedTime =
                    input.value;


                /*
                 * Changing the time requires the
                 * student to choose a batch again.
                 */

                selectedBatch = null;



                batchInputs.forEach(batch => {

                    batch.checked = false;

                });



                /*
                 * Display selected time inside
                 * every available batch.
                 */

                document
                    .querySelectorAll(
                        ".batch-time-display"
                    )
                    .forEach(display => {

                        display.textContent =
                            displayTime(
                                selectedTime
                            );

                    });



                /*
                 * Update batch section description.
                 */

                if (batchDescription) {

                    batchDescription.textContent =
                        `${getFormatLabel(selectedFormat)} • ${displayTime(selectedTime)} • Choose your preferred weekly batch.`;

                }



                /* SHOW BATCHES */

                if (batchSection) {

                    batchSection.hidden = false;

                }



                /*
                 * Remove old incomplete selection.
                 */

                sessionStorage.removeItem(
                    "vizagJamHubEnrollment"
                );


                updateEnrollmentState();

            }
        );

    });



    /* =========================================================
       BATCH SELECTION
    ========================================================= */

    batchInputs.forEach(input => {

        input.addEventListener(
            "change",
            () => {


                selectedBatch =
                    input;


                /*
                 * Save immediately once the complete
                 * class selection exists.
                 */

                saveEnrollmentSelection();


                updateEnrollmentState();

            }
        );

    });



    /* =========================================================
       SAVE COMPLETE COURSE SELECTION
    ========================================================= */

    function saveEnrollmentSelection() {


        if (
            !selectedFormat ||
            !selectedTime ||
            !selectedBatch
        ) {

            return false;

        }



        /*
         * Batch information comes directly from
         * the selected batch input in beginnerdrums.html.
         *
         * Expected attributes:
         *
         * data-batch-name
         * data-theory-day
         * data-practical-day
         * data-song-day
         */


        const batchName =
            selectedBatch.dataset.batchName ||
            selectedBatch.value ||
            "";


        const theoryDay =
            selectedBatch.dataset.theoryDay ||
            "";


        const practicalDay =
            selectedBatch.dataset.practicalDay ||
            "";


        const songDay =
            selectedBatch.dataset.songDay ||
            "";



        const enrollmentData = {


            /* COURSE */

            course:
                "Beginner Drums",


            level:
                "Beginner",


            price:
                2000,



            /* CLASS FORMAT */

            format:
                selectedFormat,


            formatLabel:
                getFormatLabel(
                    selectedFormat
                ),



            /* CLASS TIME */

            time:
                selectedTime,


            timeLabel:
                displayTime(
                    selectedTime
                ),



            /* WEEKLY BATCH */

            batch:
                selectedBatch.value,


            batchName:
                batchName,


            theoryDay:
                theoryDay,


            practicalDay:
                practicalDay,


            songDay:
                songDay,



            /* COURSE STRUCTURE */

            duration:
                "8 Weeks",


            classesPerWeek:
                3,


            totalClasses:
                24

        };



        /*
         * SAVE FOR enrollment.html
         */

        sessionStorage.setItem(

            "vizagJamHubEnrollment",

            JSON.stringify(
                enrollmentData
            )

        );


        return true;

    }



    /* =========================================================
       AGREEMENTS
    ========================================================= */

    agreements.forEach(checkbox => {

        checkbox.addEventListener(
            "change",
            updateEnrollmentState
        );

    });



    /* =========================================================
       ENROLLMENT STATE
    ========================================================= */

    function updateEnrollmentState() {


        const classSelected =
            Boolean(
                selectedFormat &&
                selectedTime &&
                selectedBatch
            );


        const agreementsAccepted =
            agreements.length > 0 &&
            [...agreements].every(
                checkbox =>
                    checkbox.checked
            );


        const ready =
            classSelected &&
            agreementsAccepted;



        /* =====================================================
           ENROLL BUTTON
        ===================================================== */

        if (enrollButton) {


            enrollButton.disabled =
                !ready;


            enrollButton.classList.toggle(
                "ready",
                ready
            );


            if (ready) {

                enrollButton.innerHTML = `

                    <i class="fa-solid fa-arrow-right"></i>
                    Continue to Registration

                `;

            }

            else {

                enrollButton.innerHTML = `

                    <i class="fa-solid fa-lock"></i>
                    Continue to Registration

                `;

            }

        }



        /* =====================================================
           AGREEMENT STATUS
        ===================================================== */

        if (!agreementStatus) {

            return;

        }


        const icon =
            agreementStatus.querySelector(
                "i"
            );


        const text =
            agreementStatus.querySelector(
                "span"
            );



        /* FORMAT NOT SELECTED */

        if (!selectedFormat) {


            agreementStatus.classList.remove(
                "accepted"
            );


            if (icon) {

                icon.className =
                    "fa-solid fa-lock";

            }


            if (text) {

                text.textContent =
                    "Select Online or In Person to continue.";

            }


            return;

        }



        /* TIME NOT SELECTED */

        if (!selectedTime) {


            agreementStatus.classList.remove(
                "accepted"
            );


            if (icon) {

                icon.className =
                    "fa-solid fa-clock";

            }


            if (text) {

                text.textContent =
                    "Choose your preferred class time.";

            }


            return;

        }



        /* BATCH NOT SELECTED */

        if (!selectedBatch) {


            agreementStatus.classList.remove(
                "accepted"
            );


            if (icon) {

                icon.className =
                    "fa-solid fa-calendar-days";

            }


            if (text) {

                text.textContent =
                    "Choose your preferred weekly batch.";

            }


            return;

        }



        /* AGREEMENTS NOT ACCEPTED */

        if (!agreementsAccepted) {


            agreementStatus.classList.remove(
                "accepted"
            );


            if (icon) {

                icon.className =
                    "fa-solid fa-lock";

            }


            if (text) {

                text.textContent =
                    "Your class is selected. Accept all required agreements to continue.";

            }


            return;

        }



        /* EVERYTHING READY */

        agreementStatus.classList.add(
            "accepted"
        );


        if (icon) {

            icon.className =
                "fa-solid fa-circle-check";

        }


        if (text) {

            text.textContent =
                "Everything is ready. Continue to registration.";

        }

    }



    /* =========================================================
       CONTINUE TO REGISTRATION
    ========================================================= */

    if (enrollButton) {

        enrollButton.addEventListener(
            "click",
            () => {


                if (enrollButton.disabled) {

                    return;

                }



                /*
                 * Save one final time immediately
                 * before leaving the course page.
                 */

                const saved =
                    saveEnrollmentSelection();


                if (!saved) {

                    console.error(
                        "Course selection could not be saved."
                    );

                    return;

                }



                /*
                 * OPEN ENROLLMENT PAGE
                 */

                window.location.href =
                    "enrollment.html";

            }
        );

    }



    /* =========================================================
       INITIAL PAGE STATE
    ========================================================= */

    if (timeSection) {

        timeSection.hidden = true;

    }


    if (batchSection) {

        batchSection.hidden = true;

    }


    updateEnrollmentState();


});