document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);

    const value = id =>
        String($(id)?.value ?? "").trim();

    const setText = (id, value) => {

        const element = $(id);

        if (!element) return;

        element.textContent =
            value === undefined ||
            value === null ||
            value === ""
                ? "—"
                : value;
    };

    const capitalize = value => {

        if (!value) return "—";
        return String(value)
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                character =>
                    character.toUpperCase()
            );
    };

    const getRadioValue = name =>
        document.querySelector(
            `input[name="${name}"]:checked`
        )?.value || "";

    const formatMoney = amount =>
        `₹${Number(amount).toLocaleString("en-IN")}`;

    const normalizeText = value =>
        String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

    const normalizePhone = value =>
        String(value || "")
            .replace(/\D/g, "");

    const isNA = value =>
        /^(n\/?a|na|not available|none)$/i.test(
            String(value || "").trim()
        );


    /* ======================================================
       VALIDATION HELPERS
    ====================================================== */

    function isValidPhone(value) {

        if (isNA(value)) {
            return false;
        }

        const digits =
            normalizePhone(value);

        return (
            digits.length >= 7 &&
            digits.length <= 15
        );
    }


    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
            .test(
                String(value || "").trim()
            );
    }


    function isValidName(value) {

        const text =
            String(value || "").trim();

        if (text.length < 2) {
            return false;
        }

        /*
         * Name must contain actual letters.
         * Prevents a phone number from being entered
         * as a person's name.
         */

        if (
            !/[A-Za-z\u00C0-\u024F\u0900-\u097F]/u
                .test(text)
        ) {
            return false;
        }

        if (
            /^\+?[\d\s().-]+$/.test(text)
        ) {
            return false;
        }

        return true;
    }


    /* ======================================================
       LOAD COURSE SELECTION
    ====================================================== */

    let enrollmentData = null;

    try {

        enrollmentData =
            JSON.parse(
                sessionStorage.getItem(
                    "vizagJamHubEnrollment"
                ) || "null"
            );

    }
    catch (error) {

        console.error(
            "Could not read enrollment data:",
            error
        );
    }


    if (!enrollmentData) {

        alert(
            "Your class selection could not be found. Please return to the course page and choose your format, class time and batch again."
        );

        return;
    }


    /* ======================================================
       EXACT COURSE DATA FROM PREVIOUS PAGE
    ====================================================== */

    const course =
        enrollmentData.course ||
        "Beginner Drums";

    const level =
        enrollmentData.level ||
        "Beginner";

    const price =
        Number(
            enrollmentData.price
        ) || 2000;


    const format =
        enrollmentData.format || "";

    const formatLabel =
        enrollmentData.formatLabel ||
        capitalize(format);


    const time =
        enrollmentData.time || "";

    const timeLabel =
        enrollmentData.timeLabel ||
        time;


    const batch =
        enrollmentData.batch || "";

    const batchName =
        enrollmentData.batchName ||
        batch;


    const theoryDay =
        enrollmentData.theoryDay || "";

    const practicalDay =
        enrollmentData.practicalDay || "";

    const songDay =
        enrollmentData.songDay || "";


    const duration =
        enrollmentData.duration ||
        "8 Weeks";

    const classesPerWeek =
        Number(
            enrollmentData.classesPerWeek
        ) || 3;

    const totalClasses =
        Number(
            enrollmentData.totalClasses
        ) || 24;


    const weeklyDays =
        [
            theoryDay,
            practicalDay,
            songDay
        ]
            .filter(Boolean)
            .join(" • ");


    /* ======================================================
       VERIFY PREVIOUS PAGE SELECTION
    ====================================================== */

    const missingSelection = [];


    if (!format) {
        missingSelection.push(
            "format"
        );
    }

    if (!time) {
        missingSelection.push(
            "class time"
        );
    }

    if (!batch) {
        missingSelection.push(
            "batch"
        );
    }

    if (
        !theoryDay ||
        !practicalDay ||
        !songDay
    ) {
        missingSelection.push(
            "weekly batch days"
        );
    }


    if (missingSelection.length) {

        alert(
            "Your previous class selection is incomplete: " +
            missingSelection.join(", ") +
            ". Please return to the Beginner Drums page and select all class options."
        );

        return;
    }


    /* ======================================================
       POPULATE LOCKED COURSE
    ====================================================== */

    function populateCourseInformation() {

        setText(
            "summary-level",
            `${level.toUpperCase()} COURSE`
        );

        setText(
            "summary-course",
            course
        );

        setText(
            "summary-price",
            formatMoney(price)
        );


        setText(
            "summary-format",
            formatLabel
        );

        setText(
            "summary-time",
            timeLabel
        );

        setText(
            "summary-batch",
            batchName
        );

        setText(
            "summary-duration",
            duration
        );


        setText(
            "summary-theory-day",
            theoryDay
        );

        setText(
            "summary-theory-time",
            timeLabel
        );


        setText(
            "summary-practical-day",
            practicalDay
        );

        setText(
            "summary-practical-time",
            timeLabel
        );


        setText(
            "summary-song-day",
            songDay
        );

        setText(
            "summary-song-time",
            timeLabel
        );
    }


    /* ======================================================
       STEPS
    ====================================================== */

    const steps =
        Array.from(
            document.querySelectorAll(
                ".enrollment-step"
            )
        );

    const progressSteps =
        Array.from(
            document.querySelectorAll(
                ".progress-step"
            )
        );

    const progressLines =
        Array.from(
            document.querySelectorAll(
                ".progress-line"
            )
        );


    let currentStep = 1;


    function showStep(stepNumber) {

        currentStep =
            Math.max(
                1,
                Math.min(
                    5,
                    Number(stepNumber) || 1
                )
            );


        /*
         * IMPORTANT:
         * HTML uses the hidden attribute.
         * Remove hidden from the active step.
         */

        steps.forEach(step => {

            const stepValue =
                Number(
                    step.dataset.step
                );

            const active =
                stepValue === currentStep;


            step.hidden =
                !active;

            step.classList.toggle(
                "active",
                active
            );
        });


        progressSteps.forEach(step => {

            const stepValue =
                Number(
                    step.dataset.progress
                );


            step.classList.toggle(
                "active",
                stepValue === currentStep
            );

            step.classList.toggle(
                "completed",
                stepValue < currentStep
            );
        });


        progressLines.forEach(
            (line, index) => {

                line.classList.toggle(
                    "active",
                    index + 1 < currentStep
                );
            }
        );


        clearValidationSummary();


        if (currentStep === 4) {
            updateReview();
        }


        if (currentStep === 5) {
            updatePaymentSummary();
        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /* ======================================================
       ERROR DISPLAY
    ====================================================== */

    function getFieldContainer(field) {

        return field?.closest(
            ".enrollment-field"
        ) || null;
    }


    function getFieldLabel(field) {

        const label =
            getFieldContainer(field)
                ?.querySelector(
                    "label"
                );


        if (!label) {
            return "This field";
        }


        return label.textContent
            .replace(/\*/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }


    function clearFieldError(field) {

        const container =
            getFieldContainer(field);

        if (!container) return;


        container.classList.remove(
            "has-error"
        );


        const error =
            container.querySelector(
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

        if (!field) return;


        const container =
            getFieldContainer(field);


        if (container) {

            container.classList.add(
                "has-error"
            );


            const error =
                container.querySelector(
                    ".field-error"
                );


            if (error) {
                error.textContent =
                    message;
            }
        }
    }


    /*
     * Creates an error box automatically.
     * No HTML changes are required.
     */

    function getValidationSummary() {

        let summary =
            $("validationSummary");


        if (summary) {
            return summary;
        }


        summary =
            document.createElement(
                "div"
            );


        summary.id =
            "validationSummary";

        summary.setAttribute(
            "role",
            "alert"
        );

        summary.setAttribute(
            "aria-live",
            "polite"
        );


        summary.style.display =
            "none";

        summary.style.marginBottom =
            "24px";

        summary.style.padding =
            "16px 18px";

        summary.style.border =
            "1px solid rgba(255,90,90,.5)";

        summary.style.borderRadius =
            "10px";

        summary.style.background =
            "rgba(255,70,70,.10)";

        summary.style.color =
            "#ffd7d7";

        summary.style.fontSize =
            "1rem";

        summary.style.lineHeight =
            "1.6";


        const form =
            $("academy-registration-form");


        if (form) {

            form.insertBefore(
                summary,
                form.firstChild
            );
        }


        return summary;
    }


    function clearValidationSummary() {

        const summary =
            getValidationSummary();

        summary.style.display =
            "none";

        summary.innerHTML =
            "";
    }


    function showValidationSummary(
        errors
    ) {

        if (!errors.length) {
            return;
        }


        const summary =
            getValidationSummary();


        const messages =
            [
                ...new Set(
                    errors.map(
                        error =>
                            error.message
                    )
                )
            ];


        summary.innerHTML = `
            <strong style="
                display:block;
                margin-bottom:6px;
                color:#fff;
                font-size:1.05rem;
            ">
                Please correct the following before continuing:
            </strong>

            ${messages
                .map(
                    message =>
                        `<div>• ${message}</div>`
                )
                .join("")}
        `;


        summary.style.display =
            "block";
    }


    function addError(
        errors,
        field,
        message
    ) {

        errors.push({
            field,
            message
        });


        showFieldError(
            field,
            message
        );
    }


    /* ======================================================
       DATE / AGE
    ====================================================== */

    const MINIMUM_STUDENT_AGE = 6;
    const ADULT_AGE = 18;


    const studentDob =
        $("studentDob");

    const calculatedAge =
        $("calculatedAge");


    function getLocalToday() {

        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        return today;
    }


    function parseLocalDate(value) {

        if (
            !/^\d{4}-\d{2}-\d{2}$/
                .test(value || "")
        ) {
            return null;
        }


        const [
            year,
            month,
            day
        ] =
            value
                .split("-")
                .map(Number);


        const date =
            new Date(
                year,
                month - 1,
                day
            );


        date.setHours(
            0,
            0,
            0,
            0
        );


        if (
            date.getFullYear() !== year ||
            date.getMonth() !==
                month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }


        return date;
    }


    function calculateAge(value) {

        const dob =
            parseLocalDate(value);


        if (!dob) {
            return null;
        }


        const today =
            getLocalToday();


        let age =
            today.getFullYear() -
            dob.getFullYear();


        if (
            today.getMonth() <
                dob.getMonth() ||
            (
                today.getMonth() ===
                    dob.getMonth() &&
                today.getDate() <
                    dob.getDate()
            )
        ) {
            age--;
        }


        return age;
    }


    function studentIsMinor() {

        const age =
            calculateAge(
                value(
                    "studentDob"
                )
            );


        return (
            age !== null &&
            age < ADULT_AGE
        );
    }


    /* ======================================================
       GUARDIAN
    ====================================================== */

    const guardianSection =
        $("guardianSection");

    const guardianRelationship =
        $("guardianRelationship");

    const guardianOtherWrapper =
        $("guardianOtherWrapper");

    const guardianOtherRelationship =
        $("guardianOtherRelationship");


    function updateGuardianSection() {

        const minor =
            studentIsMinor();


        if (guardianSection) {

            guardianSection.hidden =
                !minor;
        }


        [
            "guardianName",
            "guardianRelationship",
            "guardianPhone",
            "guardianEmail"
        ]
            .forEach(id => {

                const field =
                    $(id);


                if (field) {

                    field.required =
                        minor;
                }
            });


        const otherSelected =
            minor &&
            value(
                "guardianRelationship"
            ) === "other";


        if (guardianOtherWrapper) {

            guardianOtherWrapper.hidden =
                !otherSelected;
        }


        if (
            guardianOtherRelationship
        ) {

            guardianOtherRelationship
                .required =
                    otherSelected;


            if (!otherSelected) {

                guardianOtherRelationship
                    .value = "";
            }
        }
    }


    /* ======================================================
       EMERGENCY RELATIONSHIP
    ====================================================== */

    const emergencyRelationship =
        $("emergencyRelationship");

    const emergencyOtherWrapper =
        $("emergencyOtherWrapper");

    const emergencyOtherRelationship =
        $("emergencyOtherRelationship");


    function updateEmergencyRelationship() {

        const otherSelected =
            value(
                "emergencyRelationship"
            ) === "other";


        if (emergencyOtherWrapper) {

            emergencyOtherWrapper.hidden =
                !otherSelected;
        }


        if (
            emergencyOtherRelationship
        ) {

            emergencyOtherRelationship
                .required =
                    otherSelected;


            if (!otherSelected) {

                emergencyOtherRelationship
                    .value = "";
            }
        }
    }


    /* ======================================================
       DOB VALIDATION
    ====================================================== */

    function validateDateOfBirth(
        errors
    ) {

        const dobValue =
            value(
                "studentDob"
            );


        const dob =
            parseLocalDate(
                dobValue
            );


        const today =
            getLocalToday();


        clearFieldError(
            studentDob
        );


        if (!dobValue) {

            if (calculatedAge) {

                calculatedAge.textContent =
                    "Select date of birth";
            }


            addError(
                errors,
                studentDob,
                "Date of Birth is required."
            );

            return;
        }


        if (!dob) {

            if (calculatedAge) {

                calculatedAge.textContent =
                    "Invalid date of birth";
            }


            addError(
                errors,
                studentDob,
                "Please enter a valid date of birth."
            );

            return;
        }


        /*
         * Today's date and future dates
         * are NOT valid.
         */

        if (dob >= today) {

            if (calculatedAge) {

                calculatedAge.textContent =
                    "Invalid date of birth";
            }


            addError(
                errors,
                studentDob,
                "Date of birth must be before today."
            );

            return;
        }


        const age =
            calculateAge(
                dobValue
            );


        if (
            age === null ||
            age < MINIMUM_STUDENT_AGE
        ) {

            if (calculatedAge) {

                calculatedAge.textContent =
                    age === null
                        ? "Invalid date of birth"
                        : `${age} years old`;
            }


            addError(
                errors,
                studentDob,
                "Students must be at least 6 years old to enroll."
            );

            return;
        }


        if (calculatedAge) {

            calculatedAge.textContent =
                age < ADULT_AGE
                    ? `${age} years old • Parent / Guardian required`
                    : `${age} years old`;
        }


        updateGuardianSection();
    }

        /* ======================================================
       GENERIC REQUIRED FIELD VALIDATION
    ====================================================== */

    function validateRequiredFields(
        section,
        errors
    ) {

        const processedRadioGroups =
            new Set();


        section
            .querySelectorAll(
                "input[required], select[required], textarea[required]"
            )
            .forEach(field => {

                /*
                 * Ignore fields inside hidden
                 * conditional sections.
                 */

                if (
                    field.closest(
                        "[hidden]"
                    )
                ) {
                    return;
                }


                clearFieldError(
                    field
                );


                /* RADIO */

                if (
                    field.type ===
                    "radio"
                ) {

                    if (
                        processedRadioGroups
                            .has(
                                field.name
                            )
                    ) {
                        return;
                    }


                    processedRadioGroups
                        .add(
                            field.name
                        );


                    const selected =
                        section
                            .querySelector(
                                `input[name="${field.name}"]:checked`
                            );


                    if (!selected) {

                        addError(
                            errors,
                            field,
                            `Please answer: ${getFieldLabel(field)}.`
                        );
                    }


                    return;
                }


                /* CHECKBOX */

                if (
                    field.type ===
                    "checkbox"
                ) {

                    if (!field.checked) {

                        addError(
                            errors,
                            field,
                            `${getFieldLabel(field)} must be confirmed.`
                        );
                    }


                    return;
                }


                const fieldValue =
                    String(
                        field.value || ""
                    ).trim();


                if (!fieldValue) {

                    addError(
                        errors,
                        field,
                        `${getFieldLabel(field)} is required.`
                    );

                    return;
                }


                /*
                 * EMAIL
                 */

                if (
                    field.type ===
                        "email" &&
                    !isValidEmail(
                        fieldValue
                    )
                ) {

                    addError(
                        errors,
                        field,
                        `${getFieldLabel(field)} must be a valid email address.`
                    );

                    return;
                }


                /*
                 * PHONE
                 *
                 * NA is handled separately
                 * for student/guardian phones.
                 */

                if (
                    field.type ===
                        "tel" &&
                    !isNA(
                        fieldValue
                    ) &&
                    !isValidPhone(
                        fieldValue
                    )
                ) {

                    addError(
                        errors,
                        field,
                        `${getFieldLabel(field)} must be a valid phone number or NA where allowed.`
                    );

                    return;
                }


                if (
                    field.minLength > 0 &&
                    fieldValue.length <
                        field.minLength
                ) {

                    addError(
                        errors,
                        field,
                        `${getFieldLabel(field)} is too short.`
                    );
                }
            });
    }


    /* ======================================================
       COMPLETE STEP VALIDATION
    ====================================================== */

    function validateStep(
        stepNumber
    ) {

        clearValidationSummary();


        const section =
            document.querySelector(
                `.enrollment-step[data-step="${stepNumber}"]`
            );


        if (!section) {
            return true;
        }


        const errors = [];


        /* ==================================================
           STEP 1
        ================================================== */

        if (stepNumber === 1) {

            validateDateOfBirth(
                errors
            );
        }


        validateRequiredFields(
            section,
            errors
        );


        if (stepNumber === 1) {

            const firstName =
                value(
                    "firstName"
                );

            const lastName =
                value(
                    "lastName"
                );


            const studentFullName =
                `${firstName} ${lastName}`
                    .trim();


            if (
                firstName &&
                !isValidName(
                    firstName
                )
            ) {

                addError(
                    errors,
                    $("firstName"),
                    "First Name must contain a valid name, not a phone number."
                );
            }


            if (
                lastName &&
                !isValidName(
                    lastName
                )
            ) {

                addError(
                    errors,
                    $("lastName"),
                    "Last Name must contain a valid name, not a phone number."
                );
            }


            if (
                studentIsMinor()
            ) {

                const guardianName =
                    value(
                        "guardianName"
                    );


                if (
                    guardianName &&
                    !isValidName(
                        guardianName
                    )
                ) {

                    addError(
                        errors,
                        $("guardianName"),
                        "Parent / Guardian Name must contain a valid name, not a phone number."
                    );
                }


                /*
                 * Guardian cannot simply be
                 * entered as the student.
                 */

                if (
                    guardianName &&
                    normalizeText(
                        guardianName
                    ) ===
                    normalizeText(
                        studentFullName
                    )
                ) {

                    addError(
                        errors,
                        $("guardianName"),
                        "Parent / Guardian Name cannot be the same as the student's name."
                    );
                }


                if (
                    value(
                        "guardianRelationship"
                    ) === "other" &&
                    !value(
                        "guardianOtherRelationship"
                    )
                ) {

                    addError(
                        errors,
                        $("guardianOtherRelationship"),
                        "Please specify the parent / guardian relationship."
                    );
                }


                if (
                    value(
                        "guardianEmail"
                    ) &&
                    !isValidEmail(
                        value(
                            "guardianEmail"
                        )
                    )
                ) {

                    addError(
                        errors,
                        $("guardianEmail"),
                        "Parent / Guardian Email must be a valid email address."
                    );
                }
            }
        }


        /* ==================================================
           STEP 2 — CONTACT
        ================================================== */

        if (stepNumber === 2) {

            const studentEmail =
                value(
                    "email"
                );

            const studentPhone =
                value(
                    "phone"
                );


            if (
                !isValidEmail(
                    studentEmail
                )
            ) {

                addError(
                    errors,
                    $("email"),
                    "Student Email must be a valid email address."
                );
            }


            /*
             * MINOR:
             *
             * Student can enter NA.
             * Guardian can enter NA.
             *
             * BUT at least ONE of the two
             * must contain a valid phone number.
             */

            if (
                studentIsMinor()
            ) {

                const guardianPhone =
                    value(
                        "guardianPhone"
                    );


                const studentPhoneValid =
                    isValidPhone(
                        studentPhone
                    );


                const guardianPhoneValid =
                    isValidPhone(
                        guardianPhone
                    );


                if (
                    !studentPhoneValid &&
                    !isNA(
                        studentPhone
                    )
                ) {

                    addError(
                        errors,
                        $("phone"),
                        "Student Phone must be a valid phone number or NA."
                    );
                }


                if (
                    !guardianPhoneValid &&
                    !isNA(
                        guardianPhone
                    )
                ) {

                    addError(
                        errors,
                        $("guardianPhone"),
                        "Parent / Guardian Phone must be a valid phone number or NA."
                    );
                }


                /*
                 * One real phone is compulsory.
                 */

                if (
                    !studentPhoneValid &&
                    !guardianPhoneValid
                ) {

                    addError(
                        errors,
                        $("phone"),
                        "At least one valid phone number is required for the student or parent / guardian."
                    );


                    addError(
                        errors,
                        $("guardianPhone"),
                        "At least one valid phone number is required for the student or parent / guardian."
                    );
                }


                /*
                 * Student and guardian cannot use
                 * the exact same phone number.
                 */

                if (
                    studentPhoneValid &&
                    guardianPhoneValid &&
                    normalizePhone(
                        studentPhone
                    ) ===
                    normalizePhone(
                        guardianPhone
                    )
                ) {

                    addError(
                        errors,
                        $("phone"),
                        "Student and parent / guardian phone numbers must be different."
                    );


                    addError(
                        errors,
                        $("guardianPhone"),
                        "Parent / guardian phone number cannot be the same as the student's phone number."
                    );
                }


                /*
                 * Separate email addresses.
                 */

                const guardianEmail =
                    value(
                        "guardianEmail"
                    );


                if (
                    guardianEmail &&
                    normalizeText(
                        guardianEmail
                    ) ===
                    normalizeText(
                        studentEmail
                    )
                ) {

                    addError(
                        errors,
                        $("email"),
                        "Student and parent / guardian email addresses must be different."
                    );
                }
            }


            /*
             * ADULT:
             *
             * No guardian exists, therefore
             * student phone must be real.
             */

            else {

                if (
                    !isValidPhone(
                        studentPhone
                    )
                ) {

                    addError(
                        errors,
                        $("phone"),
                        "A valid student phone number is required. NA is only allowed for a minor when a valid parent / guardian phone is provided."
                    );
                }
            }
        }


        /* ==================================================
           STEP 3 — EMERGENCY + LEARNING PROFILE
        ================================================== */

        if (stepNumber === 3) {

            const emergencyName =
                value(
                    "emergencyName"
                );

            const emergencyPhone =
                value(
                    "emergencyPhone"
                );


            const studentFullName =
                `${value("firstName")} ${value("lastName")}`
                    .trim();


            if (
                emergencyName &&
                !isValidName(
                    emergencyName
                )
            ) {

                addError(
                    errors,
                    $("emergencyName"),
                    "Emergency Contact Name must contain a valid name, not a phone number."
                );
            }


            if (
                emergencyName &&
                normalizeText(
                    emergencyName
                ) ===
                normalizeText(
                    studentFullName
                )
            ) {

                addError(
                    errors,
                    $("emergencyName"),
                    "Emergency contact cannot be the student."
                );
            }


            if (
                value(
                    "emergencyRelationship"
                ) === "other" &&
                !value(
                    "emergencyOtherRelationship"
                )
            ) {

                addError(
                    errors,
                    $("emergencyOtherRelationship"),
                    "Please specify the emergency contact relationship."
                );
            }


            /*
             * Emergency phone must always
             * be a real phone number.
             */

            if (
                !isValidPhone(
                    emergencyPhone
                )
            ) {

                addError(
                    errors,
                    $("emergencyPhone"),
                    "Emergency Contact Phone must be a valid phone number. NA is not allowed for the emergency contact."
                );
            }


            const studentPhone =
                value(
                    "phone"
                );


            if (
                isValidPhone(
                    studentPhone
                ) &&
                isValidPhone(
                    emergencyPhone
                ) &&
                normalizePhone(
                    emergencyPhone
                ) ===
                normalizePhone(
                    studentPhone
                )
            ) {

                addError(
                    errors,
                    $("emergencyPhone"),
                    "Emergency contact phone number must be different from the student's phone number."
                );
            }


            if (
                studentIsMinor()
            ) {

                const guardianPhone =
                    value(
                        "guardianPhone"
                    );


                if (
                    isValidPhone(
                        guardianPhone
                    ) &&
                    isValidPhone(
                        emergencyPhone
                    ) &&
                    normalizePhone(
                        emergencyPhone
                    ) ===
                    normalizePhone(
                        guardianPhone
                    )
                ) {

                    addError(
                        errors,
                        $("emergencyPhone"),
                        "Emergency contact phone number must be different from the parent / guardian phone number."
                    );
                }
            }
        }


        /* ==================================================
           STOP NAVIGATION IF INVALID
        ================================================== */

        if (errors.length) {

            showValidationSummary(
                errors
            );


            const firstInvalid =
                errors.find(
                    error =>
                        error.field
                )?.field;


            if (firstInvalid) {

                firstInvalid.focus();


                firstInvalid.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }


            return false;
        }


        return true;
    }


    /* ======================================================
       RELATIONSHIPS
    ====================================================== */

    function getGuardianRelationship() {

        const selected =
            value(
                "guardianRelationship"
            );


        return selected === "other"
            ? value(
                "guardianOtherRelationship"
            )
            : capitalize(selected);
    }


    function getEmergencyRelationship() {

        const selected =
            value(
                "emergencyRelationship"
            );


        return selected === "other"
            ? value(
                "emergencyOtherRelationship"
            )
            : capitalize(selected);
    }


    /* ======================================================
       REVIEW
    ====================================================== */

    function updateReview() {

        const studentName =
            `${value("firstName")} ${value("lastName")}`
                .trim();


        setText(
            "review-student-name",
            studentName
        );


        setText(
            "review-date-of-birth",
            value(
                "studentDob"
            )
        );


        setText(
            "review-email",
            value(
                "email"
            )
        );


        setText(
            "review-phone",
            value(
                "phone"
            )
        );


        setText(
            "review-course",
            course
        );


        setText(
            "review-format",
            formatLabel
        );


        setText(
            "review-time",
            timeLabel
        );


        setText(
            "review-batch",
            batchName
        );


        setText(
            "review-days",
            weeklyDays
        );


        setText(
            "review-price",
            formatMoney(price)
        );


        setText(
            "review-emergency-name",
            value(
                "emergencyName"
            )
        );


        setText(
            "review-emergency-relationship",
            getEmergencyRelationship()
        );


        setText(
            "review-emergency-phone",
            value(
                "emergencyPhone"
            )
        );
    }


    /* ======================================================
       PAYMENT
    ====================================================== */

    function updatePaymentSummary() {

        setText(
            "payment-course",
            course
        );


        setText(
            "payment-total",
            formatMoney(price)
        );


        setText(
            "payment-detail-course",
            course
        );


        setText(
            "payment-detail-format",
            formatLabel
        );


        setText(
            "payment-detail-time",
            timeLabel
        );


        setText(
            "payment-detail-batch",
            batchName
        );


        setText(
            "payment-final-total",
            formatMoney(price)
        );


        const buttonText =
            $("payment-button-text");


        if (buttonText) {

            buttonText.textContent =
                `Proceed to Secure Payment • ${formatMoney(price)}`;
        }
    }


    /* ======================================================
       FINAL REGISTRATION OBJECT
    ====================================================== */

    function buildRegistrationData() {

        const studentAge =
            calculateAge(
                value(
                    "studentDob"
                )
            );


        return {

            course: {

                course,
                level,
                price,

                format,
                formatLabel,

                time,
                timeLabel,

                batch,
                batchName,

                theoryDay,
                practicalDay,
                songDay,

                weeklyDays,

                duration,
                classesPerWeek,
                totalClasses
            },


            student: {

                firstName:
                    value(
                        "firstName"
                    ),

                lastName:
                    value(
                        "lastName"
                    ),

                dateOfBirth:
                    value(
                        "studentDob"
                    ),

                age:
                    studentAge,

                gender:
                    value(
                        "gender"
                    )
            },


            guardian:
                studentAge !== null &&
                studentAge < ADULT_AGE

                    ? {

                        name:
                            value(
                                "guardianName"
                            ),

                        relationship:
                            getGuardianRelationship(),

                        phone:
                            value(
                                "guardianPhone"
                            ),

                        email:
                            value(
                                "guardianEmail"
                            )
                    }

                    : null,


            contact: {

                email:
                    value(
                        "email"
                    ),

                phone:
                    value(
                        "phone"
                    ),

                address:
                    value(
                        "address"
                    ),

                city:
                    value(
                        "city"
                    ),

                state:
                    value(
                        "state"
                    ),

                postalCode:
                    value(
                        "postalCode"
                    ),

                country:
                    value(
                        "country"
                    )
            },


            emergencyContact: {

                name:
                    value(
                        "emergencyName"
                    ),

                relationship:
                    getEmergencyRelationship(),

                phone:
                    value(
                        "emergencyPhone"
                    )
            },


            learningProfile: {

                musicExperience:
                    value(
                        "musicExperience"
                    ),

                instrumentAccess:
                    getRadioValue(
                        "instrumentAccess"
                    ),

                songLanguage:
                    getRadioValue(
                        "songLanguage"
                    ),

                notes:
                    value(
                        "studentNotes"
                    )
            },


            payment: {

                method:
                    getRadioValue(
                        "paymentMethod"
                    ),

                amount:
                    price,

                currency:
                    "INR",

                status:
                    "pending"
            },


            createdAt:
                new Date()
                    .toISOString()
        };
    }


    /* ======================================================
       NEXT BUTTONS
    ====================================================== */

    document
        .querySelectorAll(
            ".enrollment-next"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


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
                        ) ||
                        currentStep + 1;


                    showStep(
                        nextStep
                    );
                }
            );
        });


    /* ======================================================
       BACK BUTTONS
    ====================================================== */

    document
        .querySelectorAll(
            ".enrollment-back"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const previousStep =
                        Number(
                            button.dataset.back
                        ) ||
                        currentStep - 1;


                    showStep(
                        previousStep
                    );
                }
            );
        });


    /* ======================================================
       REVIEW EDIT BUTTONS
    ====================================================== */

    document
        .querySelectorAll(
            ".review-edit"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showStep(
                        Number(
                            button.dataset.edit
                        ) || 1
                    );
                }
            );
        });


    /* ======================================================
       CLEAR ERRORS WHEN USER FIXES ANSWER
    ====================================================== */

    document
        .querySelectorAll(
            ".enrollment-field input, .enrollment-field select, .enrollment-field textarea"
        )
        .forEach(field => {

            [
                "input",
                "change"
            ]
                .forEach(eventName => {

                    field.addEventListener(
                        eventName,
                        () => {

                            clearFieldError(
                                field
                            );

                            clearValidationSummary();
                        }
                    );
                });
        });


    /* ======================================================
       DATE LISTENERS
    ====================================================== */

    if (studentDob) {

        /*
         * Browser itself will not allow
         * today or future dates.
         */

        const yesterday =
            new Date();


        yesterday.setDate(
            yesterday.getDate() - 1
        );


        const year =
            yesterday.getFullYear();


        const month =
            String(
                yesterday.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                yesterday.getDate()
            ).padStart(
                2,
                "0"
            );


        studentDob.max =
            `${year}-${month}-${day}`;


        [
            "input",
            "change"
        ]
            .forEach(eventName => {

                studentDob.addEventListener(
                    eventName,
                    () => {

                        const temporaryErrors =
                            [];


                        validateDateOfBirth(
                            temporaryErrors
                        );


                        updateGuardianSection();
                    }
                );
            });
    }


    /* ======================================================
       RELATIONSHIP LISTENERS
    ====================================================== */

    guardianRelationship
        ?.addEventListener(
            "change",
            updateGuardianSection
        );


    emergencyRelationship
        ?.addEventListener(
            "change",
            updateEmergencyRelationship
        );


    /* ======================================================
       PART 3 CONTINUES HERE
       RAZORPAY PAYMENT + INITIALIZATION
    ====================================================== */


        /* ======================================================
       PAYMENT BUTTON — RAZORPAY
    ====================================================== */

    const paymentButton =
        $("payment-button");


    let paymentInProgress =
        false;


    /* ======================================================
       PAYMENT BUTTON LOADING STATE
    ====================================================== */

    function setPaymentButtonLoading(
        loading
    ) {

        if (!paymentButton) {
            return;
        }


        paymentButton.disabled =
            loading;


        const buttonText =
            $("payment-button-text");


        if (buttonText) {

            buttonText.textContent =
                loading
                    ? "Preparing Secure Payment..."
                    : `Proceed to Secure Payment • ${formatMoney(price)}`;
        }
    }


    /* ======================================================
       SAFE SERVER RESPONSE READER
    ====================================================== */

    async function readJsonResponse(
        response
    ) {

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        if (
            contentType.includes(
                "application/json"
            )
        ) {

            return await response.json();
        }


        const text =
            await response.text();


        throw new Error(
            text ||
            `Server returned ${response.status}.`
        );
    }


    /* ======================================================
       PAYMENT BUTTON
    ====================================================== */

    if (paymentButton) {

        paymentButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();


                /*
                 * Prevent duplicate clicks while
                 * Razorpay is being prepared.
                 */

                if (paymentInProgress) {
                    return;
                }


                /* ==========================================
                   VALIDATE FINAL PAYMENT STEP
                ========================================== */

                if (
                    !validateStep(5)
                ) {
                    return;
                }


                /* ==========================================
                   BUILD COMPLETE REGISTRATION
                ========================================== */

                const registrationData =
                    buildRegistrationData();


                /*
                 * Preserve ALL original course-selection
                 * values from the previous course page.
                 */

                const updatedEnrollment = {

                    ...enrollmentData,


                    course:
                        registrationData
                            .course
                            .course,


                    level:
                        registrationData
                            .course
                            .level,


                    price:
                        registrationData
                            .course
                            .price,


                    format:
                        registrationData
                            .course
                            .format,


                    formatLabel:
                        registrationData
                            .course
                            .formatLabel,


                    time:
                        registrationData
                            .course
                            .time,


                    timeLabel:
                        registrationData
                            .course
                            .timeLabel,


                    batch:
                        registrationData
                            .course
                            .batch,


                    batchName:
                        registrationData
                            .course
                            .batchName,


                    theoryDay:
                        registrationData
                            .course
                            .theoryDay,


                    practicalDay:
                        registrationData
                            .course
                            .practicalDay,


                    songDay:
                        registrationData
                            .course
                            .songDay,


                    weeklyDays:
                        registrationData
                            .course
                            .weeklyDays,


                    duration:
                        registrationData
                            .course
                            .duration,


                    classesPerWeek:
                        registrationData
                            .course
                            .classesPerWeek,


                    totalClasses:
                        registrationData
                            .course
                            .totalClasses,


                    student:
                        registrationData
                            .student,


                    guardian:
                        registrationData
                            .guardian,


                    contact:
                        registrationData
                            .contact,


                    emergencyContact:
                        registrationData
                            .emergencyContact,


                    learningProfile:
                        registrationData
                            .learningProfile,


                    payment:
                        registrationData
                            .payment,


                    createdAt:
                        registrationData
                            .createdAt
                };


                /* ==========================================
                   SAVE PENDING ENROLLMENT
                ========================================== */

                sessionStorage.setItem(
                    "vizagJamHubEnrollment",
                    JSON.stringify(
                        updatedEnrollment
                    )
                );


                sessionStorage.setItem(
                    "vizagJamHubPendingEnrollment",
                    JSON.stringify(
                        registrationData
                    )
                );


                try {

                    paymentInProgress =
                        true;


                    setPaymentButtonLoading(
                        true
                    );


                    /* ======================================
                       VERIFY RAZORPAY SCRIPT LOADED
                    ====================================== */

                    if (
                        typeof Razorpay ===
                        "undefined"
                    ) {

                        throw new Error(
                            "Razorpay Checkout could not be loaded. Please refresh the page and try again."
                        );
                    }


                    /* ======================================
                       CREATE ORDER ON OUR SERVER
                    ====================================== */

                    const orderResponse =
                        await fetch(
                            "/api/payment/create-order",
                            {

                                method:
                                    "POST",


                                headers: {

                                    "Content-Type":
                                        "application/json"
                                },


                                body:
                                    JSON.stringify({

                                        course:
                                            registrationData
                                                .course
                                                .course,


                                        level:
                                            registrationData
                                                .course
                                                .level,


                                        format:
                                            registrationData
                                                .course
                                                .format,


                                        time:
                                            registrationData
                                                .course
                                                .time,


                                        batch:
                                            registrationData
                                                .course
                                                .batch
                                    })
                            }
                        );


                    const orderData =
                        await readJsonResponse(
                            orderResponse
                        );


                    /* ======================================
                       VALIDATE SERVER ORDER RESPONSE
                    ====================================== */

                    if (
                        !orderResponse.ok ||
                        !orderData.success ||
                        !orderData.key ||
                        !orderData.order ||
                        !orderData.order.id
                    ) {

                        throw new Error(
                            orderData.message ||
                            "Unable to create the payment order."
                        );
                    }


                    /* ======================================
                       STUDENT DETAILS
                    ====================================== */

                    const studentName =
                        `${registrationData.student.firstName} ${registrationData.student.lastName}`
                            .trim();


                    /*
                     * Find a valid phone number for
                     * Razorpay prefill.
                     *
                     * Student phone is preferred.
                     * For a minor, guardian phone can
                     * be used when student phone is NA.
                     */

                    let razorpayPhone =
                        "";


                    if (
                        isValidPhone(
                            registrationData
                                .contact
                                .phone
                        )
                    ) {

                        razorpayPhone =
                            registrationData
                                .contact
                                .phone;
                    }


                    else if (
                        registrationData
                            .guardian &&
                        isValidPhone(
                            registrationData
                                .guardian
                                .phone
                        )
                    ) {

                        razorpayPhone =
                            registrationData
                                .guardian
                                .phone;
                    }


                    else if (
                        isValidPhone(
                            registrationData
                                .emergencyContact
                                .phone
                        )
                    ) {

                        razorpayPhone =
                            registrationData
                                .emergencyContact
                                .phone;
                    }


                    /* ======================================
                       RAZORPAY CHECKOUT OPTIONS
                    ====================================== */

                    const options = {

                        key:
                            orderData.key,


                        amount:
                            orderData
                                .order
                                .amount,


                        currency:
                            orderData
                                .order
                                .currency,


                        name:
                            "Vizag JamHub",


                        description:
                            `${course} • ${formatLabel} • ${timeLabel}`,


                        order_id:
                            orderData
                                .order
                                .id,


                        /* ==================================
                           PAYMENT SUCCESS
                        ================================== */

                        handler:
                            async function (
                                response
                            ) {

                                try {

                                    /*
                                     * Payment succeeded in Razorpay.
                                     *
                                     * We MUST verify the signature
                                     * on our own server before
                                     * marking enrollment as paid.
                                     */

                                    const verifyResponse =
                                        await fetch(
                                            "/api/payment/verify",
                                            {

                                                method:
                                                    "POST",


                                                headers: {

                                                    "Content-Type":
                                                        "application/json"
                                                },


                                                body:
                                                    JSON.stringify({

                                                        razorpay_payment_id:
                                                            response
                                                                .razorpay_payment_id,


                                                        razorpay_order_id:
                                                            response
                                                                .razorpay_order_id,


                                                        razorpay_signature:
                                                            response
                                                                .razorpay_signature,


                                                        enrollment:
                                                            registrationData
                                                    })
                                            }
                                        );


                                    const verifyData =
                                        await readJsonResponse(
                                            verifyResponse
                                        );


                                    /* ==============================
                                       SERVER VERIFICATION FAILED
                                    ============================== */

                                    if (
                                        !verifyResponse.ok ||
                                        !verifyData.success ||
                                        !verifyData.verified ||
                                        !verifyData.enrollment
                                    ) {

                                        throw new Error(
                                            verifyData.message ||
                                            "Payment could not be verified."
                                        );
                                    }


                                    /* ==============================
                                       VERIFIED ENROLLMENT
                                    ============================== */

                                    const verifiedEnrollment =
                                        verifyData.enrollment;
                                    

                                    /* ==================================
   FIRST LOGIN INFORMATION
================================== */

if (verifyData.firstLogin) {

    verifiedEnrollment.firstLogin = {

        studentId:
            verifyData.firstLogin.studentId,

        temporaryPassword:
            verifyData.firstLogin.temporaryPassword,

        mustChangePassword:
            verifyData.firstLogin.mustChangePassword

    };

}


/* ==================================
   EMAIL CONFIRMATION STATUS
================================== */

verifiedEnrollment.emailConfirmation = {

    ...(verifiedEnrollment.emailConfirmation || {}),

    ...(verifyData.emailConfirmation || {})

};

                                    /*
                                     * Replace pending information
                                     * with the final server-generated
                                     * enrollment.
                                     */

                                    sessionStorage.setItem(
                                        "vizagJamHubEnrollment",
                                        JSON.stringify(
                                            verifiedEnrollment
                                        )
                                    );


                                    /*
                                     * Keep a separate completed
                                     * enrollment record for the
                                     * registration success page.
                                     */

                                    sessionStorage.setItem(
                                        "vizagJamHubCompletedEnrollment",
                                        JSON.stringify(
                                            verifiedEnrollment
                                        )
                                    );


                                    /*
                                     * Payment has now been verified,
                                     * therefore pending data can go.
                                     */

                                    sessionStorage.removeItem(
                                        "vizagJamHubPendingEnrollment"
                                    );


                                    /*
                                     * Prevent another payment click.
                                     */

                                    paymentInProgress =
                                        true;


                                    /* ==============================
                                       REGISTRATION COMPLETE
                                    ============================== */

                                    window.location.href =
                                        "registered.html";

                                }

                                catch (error) {

                                    console.error(
                                        "Payment verification error:",
                                        error
                                    );


                                    paymentInProgress =
                                        false;


                                    setPaymentButtonLoading(
                                        false
                                    );


                                    /*
                                     * IMPORTANT:
                                     *
                                     * Razorpay may already have
                                     * received the payment.
                                     *
                                     * Do NOT instruct the student
                                     * to immediately pay again.
                                     */

                                    alert(
                                        "Your payment was received, but we could not verify the enrollment automatically. Please do not make another payment. Contact Vizag JamHub with your payment details."
                                    );
                                }
                            },


                        /* ==================================
                           PREFILL PAYMENT DETAILS
                        ================================== */

                        prefill: {

                            name:
                                studentName,


                            email:
                                registrationData
                                    .contact
                                    .email,


                            contact:
                                razorpayPhone
                        },


                        /* ==================================
                           PAYMENT NOTES
                        ================================== */

                        notes: {

                            course:
                                course,


                            level:
                                level,


                            format:
                                formatLabel,


                            time:
                                timeLabel,


                            batch:
                                batchName
                        },


                        /* ==================================
                           CHECKOUT APPEARANCE
                        ================================== */

                        theme: {

                            color:
                                "#00d4ff"
                        },


                        /* ==================================
                           CHECKOUT CLOSED
                        ================================== */

                        modal: {

                            ondismiss:
                                function () {

                                    paymentInProgress =
                                        false;


                                    setPaymentButtonLoading(
                                        false
                                    );
                                }
                        }
                    };


                    /* ======================================
                       CREATE RAZORPAY CHECKOUT
                    ====================================== */

                    const razorpayCheckout =
                        new Razorpay(
                            options
                        );


                    /* ======================================
                       PAYMENT FAILURE
                    ====================================== */

                    razorpayCheckout.on(
                        "payment.failed",
                        function (
                            response
                        ) {

                            console.error(
                                "Razorpay payment failed:",
                                response.error
                            );


                            paymentInProgress =
                                false;


                            setPaymentButtonLoading(
                                false
                            );


                            const description =
                                response &&
                                response.error &&
                                response.error.description

                                    ? response
                                        .error
                                        .description

                                    : "The payment was unsuccessful.";


                            alert(
                                `${description} Please try again.`
                            );
                        }
                    );


                    /* ======================================
                       OPEN RAZORPAY
                    ====================================== */

                    razorpayCheckout.open();

                }

                catch (error) {

                    console.error(
                        "Payment initialization error:",
                        error
                    );


                    paymentInProgress =
                        false;


                    setPaymentButtonLoading(
                        false
                    );


                    alert(
                        error.message ||
                        "Unable to start secure payment. Please try again."
                    );
                }
            }
        );
    }


    /* ======================================================
       INITIALIZE
    ====================================================== */

    populateCourseInformation();

    updateEmergencyRelationship();

    updateGuardianSection();

    showStep(1);

});

