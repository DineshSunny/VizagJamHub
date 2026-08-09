/* ==========================================================
   VIZAG JAMHUB MUSIC ACADEMY
   ENROLLMENT SYSTEM

   Shared enrollment logic for all academy courses.
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ======================================================
       ELEMENTS
    ====================================================== */

    const form =
        document.getElementById(
            "academy-registration-form"
        );


    const steps =
        document.querySelectorAll(
            ".enrollment-step"
        );


    const indicators =
        document.querySelectorAll(
            ".progress-step"
        );


    const progressLines =
        document.querySelectorAll(
            ".progress-line"
        );


    const nextButtons =
        document.querySelectorAll(
            ".enrollment-next"
        );


    const backButtons =
        document.querySelectorAll(
            ".enrollment-back"
        );


    const editButtons =
        document.querySelectorAll(
            ".review-edit"
        );


    const paymentButton =
        document.getElementById(
            "payment-button"
        );


    let currentStep = 1;



    /* ======================================================
       LOAD SAVED COURSE SELECTION
    ====================================================== */

    let enrollmentData = null;


    try {

        enrollmentData =
            JSON.parse(
                sessionStorage.getItem(
                    "vizagJamHubEnrollment"
                )
            );

    }

    catch (error) {

        console.error(
            "Unable to read enrollment selection:",
            error
        );

    }



    /* ======================================================
       INVALID / MISSING COURSE SELECTION
    ====================================================== */

    if (
        !enrollmentData ||
        !enrollmentData.course ||
        !enrollmentData.format ||
        !enrollmentData.time ||
        !enrollmentData.batch
    ) {

        console.warn(
            "No valid course enrollment selection was found."
        );


        /*
         * The student should normally reach this page
         * from one of the academy course pages.
         *
         * We do not create fake/default enrollment data here.
         */

        window.location.href =
            "/index.html#school";


        return;

    }



    /* ======================================================
       HELPERS
    ====================================================== */

    function getElement(id) {

        return document.getElementById(id);

    }


    function setText(id, value) {

        const element =
            getElement(id);


        if (!element) {

            return;

        }


        element.textContent =
            value || "—";

    }


    function formatPrice(price) {

        const numericPrice =
            Number(price);


        if (!Number.isFinite(numericPrice)) {

            return "—";

        }


        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(numericPrice);

    }


    function formatDate(dateValue) {

        if (!dateValue) {

            return "—";

        }


        const parts =
            dateValue.split("-");


        if (parts.length !== 3) {

            return dateValue;

        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]) - 1;

        const day =
            Number(parts[2]);


        const date =
            new Date(
                year,
                month,
                day
            );


        if (Number.isNaN(date.getTime())) {

            return dateValue;

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }


    function getFieldValue(id) {

        const field =
            getElement(id);


        if (!field) {

            return "";

        }


        return field.value.trim();

    }


    function getCheckedValue(name) {

        const selected =
            document.querySelector(
                `input[name="${name}"]:checked`
            );


        return selected
            ? selected.value
            : "";

    }


    function capitalizeValue(value) {

        if (!value) {

            return "—";

        }


        return value
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                letter => letter.toUpperCase()
            );

    }



    /* ======================================================
       COURSE DISPLAY VALUES
    ====================================================== */

    const courseName =
        enrollmentData.course || "—";


    const level =
        enrollmentData.level || "—";


    const levelDisplay =
        level !== "—"
            ? `${String(level).toUpperCase()} COURSE`
            : "—";


    const priceDisplay =
        formatPrice(
            enrollmentData.price
        );


    const formatDisplay =
        enrollmentData.formatLabel ||
        capitalizeValue(
            enrollmentData.format
        );


    const timeDisplay =
        enrollmentData.timeLabel ||
        enrollmentData.time
            .replace(
                " - ",
                " – "
            );


    const batchDisplay =
        enrollmentData.batchName ||
        capitalizeValue(
            enrollmentData.batch
        );


    const durationDisplay =
        enrollmentData.duration ||
        "8 Weeks";


    const theoryDay =
        enrollmentData.theoryDay || "—";


    const practicalDay =
        enrollmentData.practicalDay || "—";


    const songDay =
        enrollmentData.songDay || "—";



    /* ======================================================
       POPULATE SELECTED COURSE SUMMARY
    ====================================================== */

    setText(
        "summary-level",
        levelDisplay
    );


    setText(
        "summary-course",
        courseName
    );


    setText(
        "summary-price",
        priceDisplay
    );


    setText(
        "summary-format",
        formatDisplay
    );


    setText(
        "summary-time",
        timeDisplay
    );


    setText(
        "summary-batch",
        batchDisplay
    );


    setText(
        "summary-duration",
        durationDisplay
    );



    /* ======================================================
       POPULATE WEEKLY SCHEDULE
    ====================================================== */

    setText(
        "summary-theory-day",
        theoryDay
    );


    setText(
        "summary-practical-day",
        practicalDay
    );


    setText(
        "summary-song-day",
        songDay
    );


    setText(
        "summary-theory-time",
        timeDisplay
    );


    setText(
        "summary-practical-time",
        timeDisplay
    );


    setText(
        "summary-song-time",
        timeDisplay
    );



    /* ======================================================
       SHOW STEP
    ====================================================== */

    function showStep(stepNumber) {


        const requestedStep =
            Number(stepNumber);


        if (
            !Number.isInteger(requestedStep) ||
            requestedStep < 1 ||
            requestedStep > steps.length
        ) {

            return;

        }


        currentStep =
            requestedStep;



        /* STEP CONTENT */

        steps.forEach(step => {


            const number =
                Number(
                    step.dataset.step
                );


            const active =
                number === currentStep;


            step.classList.toggle(
                "active",
                active
            );


            step.hidden =
                !active;

        });



        /* PROGRESS INDICATORS */

        indicators.forEach(indicator => {


            const number =
                Number(
                    indicator.dataset.progress
                );


            indicator.classList.remove(
                "active",
                "completed"
            );


            if (number < currentStep) {

                indicator.classList.add(
                    "completed"
                );

            }


            if (number === currentStep) {

                indicator.classList.add(
                    "active"
                );

            }

        });



        /* PROGRESS LINES */

        progressLines.forEach(
            (line, index) => {


                line.classList.toggle(
                    "completed",
                    index < currentStep - 1
                );

            }
        );



        /* UPDATE REVIEW WHEN ENTERING STEP 4 */

        if (currentStep === 4) {

            updateReview();

        }



        /* UPDATE PAYMENT WHEN ENTERING STEP 5 */

        if (currentStep === 5) {

            updatePaymentSummary();

        }



        /* SCROLL TO REGISTRATION AREA */

        const enrollmentHeader =
            document.querySelector(
                ".enrollment-header"
            );


        if (enrollmentHeader) {

            enrollmentHeader.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }



    /* ======================================================
       FIELD ERROR HELPERS
    ====================================================== */

    function clearFieldError(field) {


        field.classList.remove(
            "invalid"
        );


        const enrollmentField =
            field.closest(
                ".enrollment-field"
            );


        if (!enrollmentField) {

            return;

        }


        enrollmentField.classList.remove(
            "has-error"
        );


        const error =
            enrollmentField.querySelector(
                ".field-error"
            );


        if (error) {

            error.textContent = "";

        }

    }


    function showFieldError(
        field,
        message
    ) {


        field.classList.add(
            "invalid"
        );


        const enrollmentField =
            field.closest(
                ".enrollment-field"
            );


        if (!enrollmentField) {

            return;

        }


        enrollmentField.classList.add(
            "has-error"
        );


        const error =
            enrollmentField.querySelector(
                ".field-error"
            );


        if (error) {

            error.textContent =
                message;

        }

    }



    /* ======================================================
       REQUIRED FIELD MESSAGE
    ====================================================== */

    function getRequiredMessage(field) {


        const label =
            field
                .closest(".enrollment-field")
                ?.querySelector("label");


        if (label) {


            const labelText =
                label.childNodes[0]
                    ?.textContent
                    ?.trim();


            if (labelText) {

                return `${labelText} is required.`;

            }

        }


        return "This field is required.";

    }



    /* ======================================================
       VALIDATE STEP
    ====================================================== */

    function validateStep(stepNumber) {


        const currentSection =
            document.querySelector(
                `.enrollment-step[data-step="${stepNumber}"]`
            );


        if (!currentSection) {

            return false;

        }


        const requiredFields =
            currentSection.querySelectorAll(
                "input[required], select[required], textarea[required]"
            );


        let firstInvalidField =
            null;


        requiredFields.forEach(field => {


            clearFieldError(field);


            /*
             * RADIO GROUP
             */

            if (field.type === "radio") {


                const checked =
                    currentSection.querySelector(
                        `input[name="${field.name}"]:checked`
                    );


                if (!checked) {


                    if (!firstInvalidField) {

                        firstInvalidField =
                            field;

                    }


                    showFieldError(
                        field,
                        "Please select an option."
                    );

                }


                return;

            }



            /*
             * NORMAL REQUIRED FIELD
             */

            if (!field.checkValidity()) {


                if (!firstInvalidField) {

                    firstInvalidField =
                        field;

                }


                let message =
                    getRequiredMessage(
                        field
                    );


                if (
                    field.type === "email" &&
                    field.value.trim()
                ) {

                    message =
                        "Please enter a valid email address.";

                }


                showFieldError(
                    field,
                    message
                );

            }

        });



        if (firstInvalidField) {


            firstInvalidField.focus();


            firstInvalidField.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            return false;

        }


        return true;

    }



    /* ======================================================
       CLEAR ERRORS WHILE TYPING
    ====================================================== */

    if (form) {


        form.addEventListener(
            "input",
            event => {


                const field =
                    event.target;


                if (
                    field.matches(
                        "input, select, textarea"
                    )
                ) {

                    clearFieldError(
                        field
                    );

                }

            }
        );


        form.addEventListener(
            "change",
            event => {


                const field =
                    event.target;


                if (
                    field.matches(
                        "input, select, textarea"
                    )
                ) {

                    clearFieldError(
                        field
                    );

                }

            }
        );

    }



    /* ======================================================
       UPDATE REVIEW
    ====================================================== */

    function updateReview() {


        const firstName =
            getFieldValue(
                "firstName"
            );


        const lastName =
            getFieldValue(
                "lastName"
            );


        const fullName =
            `${firstName} ${lastName}`
                .trim();


        const dateOfBirth =
            getFieldValue(
                "dateOfBirth"
            );


        const email =
            getFieldValue(
                "email"
            );


        const phone =
            getFieldValue(
                "phone"
            );


        const emergencyName =
            getFieldValue(
                "emergencyName"
            );


        const emergencyRelationship =
            getFieldValue(
                "emergencyRelationship"
            );


        const emergencyPhone =
            getFieldValue(
                "emergencyPhone"
            );



        /* STUDENT */

        setText(
            "review-student-name",
            fullName
        );


        setText(
            "review-date-of-birth",
            formatDate(
                dateOfBirth
            )
        );


        setText(
            "review-email",
            email
        );


        setText(
            "review-phone",
            phone
        );



        /* COURSE */

        setText(
            "review-course",
            courseName
        );


        setText(
            "review-format",
            formatDisplay
        );


        setText(
            "review-time",
            timeDisplay
        );


        setText(
            "review-batch",
            batchDisplay
        );


        setText(
            "review-days",
            `${theoryDay} • ${practicalDay} • ${songDay}`
        );


        setText(
            "review-price",
            priceDisplay
        );



        /* EMERGENCY CONTACT */

        setText(
            "review-emergency-name",
            emergencyName
        );


        setText(
            "review-emergency-relationship",
            emergencyRelationship
        );


        setText(
            "review-emergency-phone",
            emergencyPhone
        );

    }



    /* ======================================================
       UPDATE PAYMENT SUMMARY
    ====================================================== */

    function updatePaymentSummary() {


        setText(
            "payment-course",
            courseName
        );


        setText(
            "payment-total",
            priceDisplay
        );


        setText(
            "payment-detail-course",
            courseName
        );


        setText(
            "payment-detail-format",
            formatDisplay
        );


        setText(
            "payment-detail-time",
            timeDisplay
        );


        setText(
            "payment-detail-batch",
            `${batchDisplay} • ${theoryDay}, ${practicalDay}, ${songDay}`
        );


        setText(
            "payment-final-total",
            priceDisplay
        );

    }



    /* ======================================================
       BUILD REGISTRATION DATA
    ====================================================== */

    function buildRegistrationData() {


        return {


            /* COURSE */

            course: {

                course:
                    courseName,

                level:
                    enrollmentData.level,

                price:
                    enrollmentData.price,

                format:
                    enrollmentData.format,

                formatLabel:
                    formatDisplay,

                time:
                    enrollmentData.time,

                timeLabel:
                    timeDisplay,

                batch:
                    enrollmentData.batch,

                batchName:
                    batchDisplay,

                theoryDay:
                    theoryDay,

                practicalDay:
                    practicalDay,

                songDay:
                    songDay,

                duration:
                    durationDisplay,

                classesPerWeek:
                    enrollmentData.classesPerWeek || 3,

                totalClasses:
                    enrollmentData.totalClasses || 24

            },


            /* STUDENT */

            student: {

                firstName:
                    getFieldValue(
                        "firstName"
                    ),

                lastName:
                    getFieldValue(
                        "lastName"
                    ),

                dateOfBirth:
                    getFieldValue(
                        "dateOfBirth"
                    ),

                gender:
                    getFieldValue(
                        "gender"
                    )

            },


            /* CONTACT */

            contact: {

                email:
                    getFieldValue(
                        "email"
                    ),

                phone:
                    getFieldValue(
                        "phone"
                    ),

                address:
                    getFieldValue(
                        "address"
                    ),

                city:
                    getFieldValue(
                        "city"
                    ),

                state:
                    getFieldValue(
                        "state"
                    ),

                postalCode:
                    getFieldValue(
                        "postalCode"
                    ),

                country:
                    getFieldValue(
                        "country"
                    )

            },


            /* EMERGENCY */

            emergencyContact: {

                name:
                    getFieldValue(
                        "emergencyName"
                    ),

                relationship:
                    getFieldValue(
                        "emergencyRelationship"
                    ),

                phone:
                    getFieldValue(
                        "emergencyPhone"
                    )

            },


            /* LEARNING PROFILE */

            learningProfile: {

                musicExperience:
                    getFieldValue(
                        "musicExperience"
                    ),

                instrumentAccess:
                    getCheckedValue(
                        "instrumentAccess"
                    ),

                songLanguage:
                    getCheckedValue(
                        "songLanguage"
                    ),

                notes:
                    getFieldValue(
                        "studentNotes"
                    )

            }

        };

    }



    /* ======================================================
       NEXT BUTTONS
    ====================================================== */

    nextButtons.forEach(button => {


        button.addEventListener(
            "click",
            () => {


                if (
                    !validateStep(
                        currentStep
                    )
                ) {

                    return;

                }


                const nextStep =
                    Number(
                        button.dataset.next
                    );


                if (
                    Number.isInteger(nextStep)
                ) {

                    showStep(
                        nextStep
                    );

                }

            }
        );

    });



    /* ======================================================
       BACK BUTTONS
    ====================================================== */

    backButtons.forEach(button => {


        button.addEventListener(
            "click",
            () => {


                const backStep =
                    Number(
                        button.dataset.back
                    );


                if (
                    Number.isInteger(backStep)
                ) {

                    showStep(
                        backStep
                    );

                }

            }
        );

    });



    /* ======================================================
       REVIEW EDIT BUTTONS
    ====================================================== */

    editButtons.forEach(button => {


        button.addEventListener(
            "click",
            () => {


                const editStep =
                    Number(
                        button.dataset.edit
                    );


                if (
                    Number.isInteger(editStep)
                ) {

                    showStep(
                        editStep
                    );

                }

            }
        );

    });



    /* ======================================================
       PREVENT NORMAL FORM SUBMISSION
    ====================================================== */

    if (form) {


        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

            }
        );

    }



    /* ======================================================
       PAYMENT BUTTON
    ====================================================== */

    if (paymentButton) {


        paymentButton.addEventListener(
            "click",
            () => {


                /*
                 * Build the complete registration object.
                 *
                 * This is useful when we connect the backend,
                 * but it is NOT proof of enrollment.
                 */

                const registrationData =
                    buildRegistrationData();


                /*
                 * Temporarily save the pending registration
                 * in this browser session.
                 *
                 * This is NOT a permanent database record.
                 */

                sessionStorage.setItem(

                    "vizagJamHubPendingRegistration",

                    JSON.stringify(
                        registrationData
                    )

                );


                /*
                 * =================================================
                 * IMPORTANT — PAYMENT SECURITY
                 * =================================================
                 *
                 * Do NOT:
                 *
                 * - Generate a real Student ID here.
                 * - Mark the student as enrolled here.
                 * - Trust the ₹ amount stored in JavaScript.
                 * - Grant student portal access here.
                 * - Create a certificate here.
                 *
                 *
                 * When the backend/payment system is added:
                 *
                 * 1. Send the registration request to the server.
                 *
                 * 2. The SERVER determines the real course
                 *    and price.
                 *
                 * 3. The server creates a payment order.
                 *
                 * 4. Open the payment provider.
                 *
                 * 5. Verify successful payment SERVER-SIDE.
                 *
                 * 6. Store the enrollment in the database.
                 *
                 * 7. Generate the official Student ID.
                 *
                 * 8. Create student portal/course access.
                 *
                 * 9. Redirect to enrollment-success.html.
                 *
                 * =================================================
                 */


                alert(
                    "Payment integration is the next step. " +
                    "No payment has been charged."
                );

            }
        );

    }



    /* ======================================================
       INITIALIZE PAYMENT DISPLAY
    ====================================================== */

    updatePaymentSummary();



    /* ======================================================
       INITIALIZE PAGE
    ====================================================== */

    showStep(1);


});