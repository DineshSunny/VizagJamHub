document.addEventListener(
    "DOMContentLoaded",
    () => {


    // =========================================================
    // ENROLLMENT DATA
    // =========================================================

    const storedEnrollment =
        sessionStorage.getItem(
            "vizagJamHubEnrollment"
        );


    if (!storedEnrollment) {

        alert(
            "Your class selection could not be found. " +
            "Please return to the course page and choose " +
            "your format, class time and batch again."
        );

        return;
    }


    let enrollmentSelection;


    try {

        enrollmentSelection =
            JSON.parse(storedEnrollment);

    }

    catch (error) {

        console.error(
            "Unable to read enrollment selection:",
            error
        );

        alert(
            "Your class selection could not be read. " +
            "Please return to the course page and select " +
            "your class again."
        );

        return;
    }



    // =========================================================
    // SELECTED COURSE
    // =========================================================

    const instrument =
        String(
            enrollmentSelection.instrument || ""
        )
            .trim()
            .toLowerCase();


    const level =
        String(
            enrollmentSelection.level || ""
        )
            .trim()
            .toLowerCase();


    const course =
        String(
            enrollmentSelection.course || ""
        ).trim();


    const price =
        Number(
            enrollmentSelection.price
        );


    const format =
        String(
            enrollmentSelection.format || ""
        ).trim();


    const formatLabel =
        String(
            enrollmentSelection.formatLabel ||
            enrollmentSelection.format ||
            ""
        ).trim();


    const time =
        String(
            enrollmentSelection.time || ""
        ).trim();


    const timeLabel =
        String(
            enrollmentSelection.timeLabel ||
            enrollmentSelection.time ||
            ""
        ).trim();


    const batch =
        String(
            enrollmentSelection.batch || ""
        ).trim();


    const batchName =
        String(
            enrollmentSelection.batchName ||
            enrollmentSelection.batch ||
            ""
        ).trim();


    const theoryDay =
        String(
            enrollmentSelection.theoryDay || ""
        ).trim();


    const practicalDay =
        String(
            enrollmentSelection.practicalDay || ""
        ).trim();


    const songDay =
        String(
            enrollmentSelection.songDay || ""
        ).trim();


    const duration =
        String(
            enrollmentSelection.duration ||
            "8 Weeks"
        ).trim();


    const classesPerWeek =
        Number(
            enrollmentSelection.classesPerWeek
        ) || 3;


    const totalClasses =
        Number(
            enrollmentSelection.totalClasses
        ) || 24;



    // =========================================================
    // VALIDATE COURSE SELECTION
    // =========================================================

    const supportedInstruments = [
        "drums",
        "guitar",
        "vocals",
        "keyboard"
    ];


    const supportedLevels = [
        "beginner",
        "intermediate",
        "advanced"
    ];


    const validSelection =
        supportedInstruments.includes(instrument) &&
        supportedLevels.includes(level) &&
        course &&
        Number.isFinite(price) &&
        price > 0 &&
        format &&
        time &&
        batch &&
        theoryDay &&
        practicalDay &&
        songDay;


    if (!validSelection) {

        console.error(
            "Incomplete enrollment selection:",
            enrollmentSelection
        );

        alert(
            "Your class selection is incomplete. " +
            "Please return to the course page and choose " +
            "your format, class time and batch again."
        );

        return;
    }



    // =========================================================
    // HELPERS
    // =========================================================

    const $ =
        id =>
            document.getElementById(id);


    const value =
        id => {

            const element = $(id);

            return element
                ? element.value.trim()
                : "";
        };


    const text =
        (id, content) => {

            const element = $(id);

            if (element) {

                element.textContent =
                    content;
            }
        };


    const getRadioValue =
        name => {

            const selected =
                document.querySelector(
                    `input[name="${name}"]:checked`
                );

            return selected
                ? selected.value
                : "";
        };


    const formatPrice =
        amount => {

            return new Intl.NumberFormat(
                "en-IN",
                {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0
                }
            ).format(amount);
        };



    // =========================================================
    // INSTRUMENT INFORMATION
    // =========================================================

    const instrumentInformation = {

        drums: {

            icon:
                "fa-solid fa-drum",

            access:
                "Do you have access to a drum kit or practice pad?",

            options: [

                {
                    value: "drum-kit",
                    label: "Drum Kit",
                    icon: "fa-solid fa-drum"
                },

                {
                    value: "practice-pad",
                    label: "Practice Pad",
                    icon: "fa-solid fa-circle"
                },

                {
                    value: "both",
                    label: "Both",
                    icon: "fa-solid fa-check-double"
                },

                {
                    value: "none",
                    label: "Not Yet",
                    icon: "fa-solid fa-xmark"
                }

            ]
        },


        guitar: {

            icon:
                "fa-solid fa-guitar",

            access:
                "Do you have access to a guitar?",

            options: [

                {
                    value: "acoustic-guitar",
                    label: "Acoustic Guitar",
                    icon: "fa-solid fa-guitar"
                },

                {
                    value: "electric-guitar",
                    label: "Electric Guitar",
                    icon: "fa-solid fa-guitar"
                },

                {
                    value: "both",
                    label: "Both",
                    icon: "fa-solid fa-check-double"
                },

                {
                    value: "none",
                    label: "Not Yet",
                    icon: "fa-solid fa-xmark"
                }

            ]
        },


        keyboard: {

            icon:
                "fa-solid fa-keyboard",

            access:
                "Do you have access to a keyboard or piano?",

            options: [

                {
                    value: "keyboard",
                    label: "Keyboard",
                    icon: "fa-solid fa-keyboard"
                },

                {
                    value: "piano",
                    label: "Piano",
                    icon: "fa-solid fa-music"
                },

                {
                    value: "both",
                    label: "Both",
                    icon: "fa-solid fa-check-double"
                },

                {
                    value: "none",
                    label: "Not Yet",
                    icon: "fa-solid fa-xmark"
                }

            ]
        },


        vocals: {

            icon:
                "fa-solid fa-microphone",

            access:
                "Do you have access to a pitch reference instrument?",

            options: [

                {
                    value: "yes",
                    label: "Yes",
                    icon: "fa-solid fa-check"
                },

                {
                    value: "none",
                    label: "Not Yet",
                    icon: "fa-solid fa-xmark"
                }

            ]
        }

    };


    const selectedInstrument =
        instrumentInformation[instrument];



    // =========================================================
    // POPULATE INSTRUMENT INFORMATION
    // =========================================================

    function populateInstrumentInformation() {

        const icon =
            $("summary-instrument-icon");


        if (icon) {

            icon.className =
                selectedInstrument.icon;
        }


        const description =
            $("instrument-access-description");


        if (description) {

            description.textContent =
                selectedInstrument.access;


            const required =
                document.createElement("span");

            required.textContent = "*";

            description.appendChild(required);
        }


        const choices =
            $("instrument-access-choices");


        if (choices) {

            choices.innerHTML =
                selectedInstrument.options
                    .map(
                        (option, index) => `

                            <label class="registration-choice">

                                <input
                                    type="radio"
                                    name="instrumentAccess"
                                    value="${option.value}"
                                    ${index === 0
                                        ? "required"
                                        : ""}>

                                <span>

                                    <i class="${option.icon}"></i>

                                    ${option.label}

                                </span>

                            </label>

                        `
                    )
                    .join("");
        }
    }

        // =========================================================
    // POPULATE COURSE SUMMARY
    // =========================================================

    function populateCourseSummary() {

        text(
            "summary-level",
            `${level.toUpperCase()} COURSE`
        );


        text(
            "summary-course",
            course
        );


        text(
            "summary-duration",
            duration
        );


        text(
            "summary-price",
            formatPrice(price)
        );


        text(
            "summary-format",
            formatLabel
        );


        text(
            "summary-time",
            timeLabel
        );


        text(
            "summary-batch",
            batchName
        );


        text(
            "summary-theory-day",
            theoryDay
        );


        text(
            "summary-theory-time",
            timeLabel
        );


        text(
            "summary-practical-day",
            practicalDay
        );


        text(
            "summary-practical-time",
            timeLabel
        );


        text(
            "summary-song-day",
            songDay
        );


        text(
            "summary-song-time",
            timeLabel
        );


        text(
            "summary-classes-per-week",
            `${classesPerWeek} Classes / Week`
        );


        text(
            "summary-total-classes",
            `${totalClasses} Classes`
        );
    }



    // =========================================================
    // FORM / STEP ELEMENTS
    // =========================================================

    const form =
        $("enrollment-form");


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



    // =========================================================
    // VALIDATION SUMMARY
    // =========================================================

    function clearValidationSummary() {

        const existing =
            document.querySelector(
                ".validation-summary"
            );


        if (existing) {

            existing.remove();
        }
    }



    function showValidationSummary(
        messages
    ) {

        clearValidationSummary();


        if (
            !messages ||
            !messages.length ||
            !form
        ) {

            return;
        }


        const summary =
            document.createElement("div");


        summary.className =
            "validation-summary";


        const title =
            document.createElement("strong");


        title.textContent =
            "Please check the following:";


        const list =
            document.createElement("ul");


        messages.forEach(
            message => {

                const item =
                    document.createElement("li");


                item.textContent =
                    message;


                list.appendChild(item);
            }
        );


        summary.appendChild(title);

        summary.appendChild(list);


        form.prepend(summary);
    }



    // =========================================================
    // SHOW STEP
    // =========================================================

    function showStep(stepNumber) {

        const requestedStep =
            Number(stepNumber);


        currentStep =
            Math.min(
                Math.max(
                    requestedStep,
                    1
                ),
                5
            );


        steps.forEach(
            step => {

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
            }
        );


        progressSteps.forEach(
            step => {

                const stepValue =
                    Number(
                        step.dataset.progressStep
                    );


                step.classList.toggle(
                    "active",
                    stepValue <= currentStep
                );
            }
        );


        progressLines.forEach(
            (line, index) => {

                line.classList.toggle(
                    "active",
                    index + 1 < currentStep
                );
            }
        );


        // Selected Course is only shown on Step 1.

        const courseSummary =
            document.querySelector(
                ".enrollment-course-summary"
            );


        if (courseSummary) {

            courseSummary.hidden =
                currentStep !== 1;
        }


        clearValidationSummary();


        if (currentStep === 4) {

            updateReview();
        }


        if (currentStep === 5) {

            updatePaymentSummary();
        }


        window.scrollTo(
            {
                top: 0,
                behavior: "smooth"
            }
        );
    }

        // =========================================================
    // POPULATE COURSE SUMMARY
    // =========================================================

    function populateCourseSummary() {

        text(
            "summary-level",
            `${level.toUpperCase()} COURSE`
        );


        text(
            "summary-course",
            course
        );


        text(
            "summary-duration",
            duration
        );


        text(
            "summary-price",
            formatPrice(price)
        );


        text(
            "summary-format",
            formatLabel
        );


        text(
            "summary-time",
            timeLabel
        );


        text(
            "summary-batch",
            batchName
        );


        text(
            "summary-theory-day",
            theoryDay
        );


        text(
            "summary-theory-time",
            timeLabel
        );


        text(
            "summary-practical-day",
            practicalDay
        );


        text(
            "summary-practical-time",
            timeLabel
        );


        text(
            "summary-song-day",
            songDay
        );


        text(
            "summary-song-time",
            timeLabel
        );


        text(
            "summary-classes-per-week",
            `${classesPerWeek} Classes / Week`
        );


        text(
            "summary-total-classes",
            `${totalClasses} Classes`
        );
    }



    // =========================================================
    // FORM / STEP ELEMENTS
    // =========================================================

    const form =
        $("enrollment-form");


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



    // =========================================================
    // VALIDATION SUMMARY
    // =========================================================

    function clearValidationSummary() {

        const existing =
            document.querySelector(
                ".validation-summary"
            );


        if (existing) {

            existing.remove();
        }
    }



    function showValidationSummary(
        messages
    ) {

        clearValidationSummary();


        if (
            !messages ||
            !messages.length ||
            !form
        ) {

            return;
        }


        const summary =
            document.createElement("div");


        summary.className =
            "validation-summary";


        const title =
            document.createElement("strong");


        title.textContent =
            "Please check the following:";


        const list =
            document.createElement("ul");


        messages.forEach(
            message => {

                const item =
                    document.createElement("li");


                item.textContent =
                    message;


                list.appendChild(item);
            }
        );


        summary.appendChild(title);

        summary.appendChild(list);


        form.prepend(summary);
    }



    // =========================================================
    // SHOW STEP
    // =========================================================

    function showStep(stepNumber) {

        const requestedStep =
            Number(stepNumber);


        currentStep =
            Math.min(
                Math.max(
                    requestedStep,
                    1
                ),
                5
            );


        steps.forEach(
            step => {

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
            }
        );


        progressSteps.forEach(
            step => {

                const stepValue =
                    Number(
                        step.dataset.progressStep
                    );


                step.classList.toggle(
                    "active",
                    stepValue <= currentStep
                );
            }
        );


        progressLines.forEach(
            (line, index) => {

                line.classList.toggle(
                    "active",
                    index + 1 < currentStep
                );
            }
        );


        // Selected Course is only shown on Step 1.

        const courseSummary =
            document.querySelector(
                ".enrollment-course-summary"
            );


        if (courseSummary) {

            courseSummary.hidden =
                currentStep !== 1;
        }


        clearValidationSummary();


        if (currentStep === 4) {

            updateReview();
        }


        if (currentStep === 5) {

            updatePaymentSummary();
        }


        window.scrollTo(
            {
                top: 0,
                behavior: "smooth"
            }
        );
    }

        // =========================================================
    // FORMAT DISPLAY VALUES
    // =========================================================

    function formatDisplayValue(
        value
    ) {

        if (!value) {

            return "—";
        }


        return String(value)
            .replace(
                /-/g,
                " "
            )
            .replace(
                /\b\w/g,
                character =>
                    character.toUpperCase()
            );
    }



    // =========================================================
    // UPDATE REVIEW
    // =========================================================

    function updateReview() {

        // STUDENT INFORMATION

        const fullName =
            [
                value("firstName"),
                value("lastName")
            ]
                .filter(Boolean)
                .join(" ");


        text(
            "review-name",
            fullName || "—"
        );


        text(
            "review-date-of-birth",
            value("dateOfBirth") || "—"
        );


        text(
            "review-gender",
            formatDisplayValue(
                value("gender")
            )
        );


        text(
            "review-age",
            value("age") || "—"
        );


        text(
            "review-occupation",
            formatDisplayValue(
                value("occupation")
            )
        );


        const location =
            [
                value("city"),
                value("country")
            ]
                .filter(Boolean)
                .join(", ");


        text(
            "review-location",
            location || "—"
        );



        // CONTACT INFORMATION

        text(
            "review-email",
            value("email") || "—"
        );


        text(
            "review-phone",
            value("phone") || "—"
        );


        text(
            "review-whatsapp",
            value("whatsapp") || "—"
        );


        text(
            "review-preferred-contact",
            formatDisplayValue(
                value("preferredContact")
            )
        );


        text(
            "review-guardian-name",
            value("guardianName") || "—"
        );


        text(
            "review-guardian-phone",
            value("guardianPhone") || "—"
        );



        // LEARNING DETAILS

        text(
            "review-music-experience",
            formatDisplayValue(
                value("musicExperience")
            )
        );


        text(
            "review-instrument-access",
            formatDisplayValue(
                getRadioValue(
                    "instrumentAccess"
                )
            )
        );


        text(
            "review-song-language",
            formatDisplayValue(
                getRadioValue(
                    "songLanguage"
                )
            )
        );


        text(
            "review-notes",
            value("studentNotes") || "—"
        );



        // COURSE

        const reviewInstrumentIcon =
            $("review-instrument-icon");


        if (reviewInstrumentIcon) {

            reviewInstrumentIcon.className =
                selectedInstrument.icon;
        }


        text(
            "review-level",
            `${level.toUpperCase()} COURSE`
        );


        text(
            "review-course",
            course
        );


        text(
            "review-duration",
            duration
        );


        text(
            "review-price",
            formatPrice(price)
        );


        text(
            "review-format",
            formatLabel
        );


        text(
            "review-time",
            timeLabel
        );


        text(
            "review-batch",
            batchName
        );


        text(
            "review-class-count",
            `${totalClasses} Classes`
        );



        // WEEKLY SCHEDULE

        text(
            "review-theory",
            `${theoryDay} · ${timeLabel}`
        );


        text(
            "review-practical",
            `${practicalDay} · ${timeLabel}`
        );


        text(
            "review-song",
            `${songDay} · ${timeLabel}`
        );
    }



    // =========================================================
    // UPDATE PAYMENT SUMMARY
    // =========================================================

    function updatePaymentSummary() {

        const paymentInstrumentIcon =
            $("payment-instrument-icon");


        if (paymentInstrumentIcon) {

            paymentInstrumentIcon.className =
                selectedInstrument.icon;
        }


        text(
            "payment-level",
            `${level.toUpperCase()} COURSE`
        );


        text(
            "payment-course",
            course
        );


        text(
            "payment-duration",
            duration
        );


        text(
            "payment-format",
            formatLabel
        );


        text(
            "payment-time",
            timeLabel
        );


        text(
            "payment-batch",
            batchName
        );


        text(
            "payment-total-classes",
            `${totalClasses} Classes`
        );


        text(
            "payment-course-fee",
            formatPrice(price)
        );


        text(
            "payment-total",
            formatPrice(price)
        );
    }

        // =========================================================
    // EDIT FROM REVIEW
    // =========================================================

    document
        .querySelectorAll(
            ".review-edit"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        const editStep =
                            Number(
                                button.dataset.editStep
                            );


                        if (editStep) {

                            showStep(
                                editStep
                            );
                        }
                    }
                );
            }
        );



    // =========================================================
    // CLEAR FIELD ERRORS WHILE EDITING
    // =========================================================

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



    // =========================================================
    // NEXT BUTTONS
    // =========================================================

    document
        .querySelectorAll(
            ".enrollment-next"
        )
        .forEach(
            button => {

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
            }
        );



    // =========================================================
    // BACK BUTTONS
    // =========================================================

    document
        .querySelectorAll(
            ".enrollment-back"
        )
        .forEach(
            button => {

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
            }
        );



    // =========================================================
    // BUILD REGISTRATION DATA
    // =========================================================

    function buildRegistrationData() {

        return {

            student: {

                firstName:
                    value("firstName"),

                lastName:
                    value("lastName"),

                dateOfBirth:
                    value("dateOfBirth"),

                gender:
                    value("gender"),

                age:
                    value("age"),

                occupation:
                    value("occupation"),

                city:
                    value("city"),

                country:
                    value("country")
            },


            contact: {

                email:
                    value("email"),

                phone:
                    value("phone"),

                whatsapp:
                    value("whatsapp"),

                preferredContact:
                    value(
                        "preferredContact"
                    ),

                guardianName:
                    value(
                        "guardianName"
                    ),

                guardianPhone:
                    value(
                        "guardianPhone"
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


            course: {

                instrument,

                level,

                course,

                price,

                duration,

                classesPerWeek,

                totalClasses,

                format,

                formatLabel,

                time,

                timeLabel,

                batch,

                batchName,

                theoryDay,

                practicalDay,

                songDay
            }
        };
    }

        // =========================================================
    // PAYMENT STATUS
    // =========================================================

    function setPaymentStatus(
        title,
        message,
        type = "processing"
    ) {

        const status =
            $("payment-status");


        const statusTitle =
            $("payment-status-title");


        const statusMessage =
            $("payment-status-message");


        if (!status) {

            return;
        }


        status.hidden = false;


        status.classList.remove(
            "success",
            "error",
            "processing"
        );


        status.classList.add(type);


        if (statusTitle) {

            statusTitle.textContent =
                title;
        }


        if (statusMessage) {

            statusMessage.textContent =
                message;
        }


        const icon =
            status.querySelector(
                ".payment-status-icon i"
            );


        if (icon) {

            if (type === "success") {

                icon.className =
                    "fa-solid fa-circle-check";
            }

            else if (type === "error") {

                icon.className =
                    "fa-solid fa-circle-xmark";
            }

            else {

                icon.className =
                    "fa-solid fa-spinner fa-spin";
            }
        }
    }



    // =========================================================
    // CREATE PAYMENT ORDER
    // =========================================================

    async function createPaymentOrder() {

        const response =
            await fetch(
                "/api/payment/create-order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        {
                            amount:
                                price,

                            instrument,

                            course,

                            level,

                            format,

                            time,

                            batch
                        }
                    )
                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result
        ) {

            throw new Error(
                result?.message ||
                "Unable to create payment order."
            );
        }


        return result;
    }



    // =========================================================
    // VERIFY PAYMENT
    // =========================================================

    async function verifyPayment(
        paymentResponse,
        registrationData
    ) {

        const response =
            await fetch(
                "/api/payment/verify",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        {
                            razorpay_order_id:
                                paymentResponse
                                    .razorpay_order_id,

                            razorpay_payment_id:
                                paymentResponse
                                    .razorpay_payment_id,

                            razorpay_signature:
                                paymentResponse
                                    .razorpay_signature,

                            registration:
                                registrationData
                        }
                    )
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result?.message ||
                "Payment verification failed."
            );
        }


        return result;
    }



    // =========================================================
    // COMPLETE PAYMENT
    // =========================================================

    async function completePayment() {

        const payButton =
            $("pay-now-button");


        if (!payButton) {

            return;
        }


        if (
            typeof Razorpay ===
            "undefined"
        ) {

            setPaymentStatus(
                "Payment Unavailable",
                "The payment service could not be loaded. Please refresh the page and try again.",
                "error"
            );

            return;
        }


        payButton.disabled = true;


        setPaymentStatus(
            "Preparing Payment",
            "Please wait while we prepare your secure payment.",
            "processing"
        );


        try {

            const order =
                await createPaymentOrder();


            const registrationData =
                buildRegistrationData();


            const options = {

                key:
                    order.key,

                amount:
                    order.amount,

                currency:
                    order.currency ||
                    "INR",

                name:
                    "Vizag JamHub",

                description:
                    course,

                order_id:
                    order.orderId ||
                    order.id,


                handler:
                    async paymentResponse => {

                        setPaymentStatus(
                            "Verifying Payment",
                            "Your payment was received. We are confirming your enrollment.",
                            "processing"
                        );


                        try {

                            const result =
                                await verifyPayment(
                                    paymentResponse,
                                    registrationData
                                );


                            setPaymentStatus(
                                "Enrollment Confirmed",
                                "Your payment was successful and your enrollment has been confirmed.",
                                "success"
                            );


                            sessionStorage.removeItem(
                                "vizagJamHubEnrollment"
                            );


                            const studentId =
                                result?.studentId ||
                                result?.enrollment
                                    ?.studentId ||
                                "";


                            const destination =
                                studentId
                                    ? `/pages/academy/registered.html?studentId=${encodeURIComponent(studentId)}`
                                    : "/pages/academy/registered.html";


                            window.setTimeout(
                                () => {

                                    window.location.href =
                                        destination;
                                },
                                1200
                            );

                        }

                        catch (error) {

                            console.error(
                                "Payment verification error:",
                                error
                            );


                            setPaymentStatus(
                                "Verification Failed",
                                error.message ||
                                "We could not verify your payment. Please contact Vizag JamHub support.",
                                "error"
                            );


                            payButton.disabled =
                                false;
                        }
                    },


                prefill: {

                    name:
                        [
                            value("firstName"),
                            value("lastName")
                        ]
                            .filter(Boolean)
                            .join(" "),

                    email:
                        value("email"),

                    contact:
                        value("phone")
                },


                notes: {

                    instrument,

                    level,

                    course,

                    format,

                    batch
                },


                theme: {
                    color: "#000000"
                },


                modal: {

                    ondismiss:
                        () => {

                            payButton.disabled =
                                false;


                            setPaymentStatus(
                                "Payment Cancelled",
                                "The payment window was closed. You can try again when you are ready.",
                                "error"
                            );
                        }
                }
            };


            const razorpay =
                new Razorpay(options);


            razorpay.on(
                "payment.failed",
                response => {

                    console.error(
                        "Razorpay payment failed:",
                        response.error
                    );


                    payButton.disabled =
                        false;


                    setPaymentStatus(
                        "Payment Failed",
                        response.error
                            ?.description ||
                        "The payment could not be completed. Please try again.",
                        "error"
                    );
                }
            );


            razorpay.open();

        }

        catch (error) {

            console.error(
                "Payment initialization error:",
                error
            );


            payButton.disabled =
                false;


            setPaymentStatus(
                "Unable to Start Payment",
                error.message ||
                "Something went wrong while preparing your payment.",
                "error"
            );
        }
    }
        // =========================================================
    // PAY BUTTON
    // =========================================================

    const payButton =
        $("pay-now-button");


    if (payButton) {

        payButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (
                    !validateStep(4)
                ) {

                    showStep(4);

                    return;
                }


                completePayment();
            }
        );
    }



    // =========================================================
    // PREVENT FORM SUBMISSION
    // =========================================================

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();
            }
        );
    }



    // =========================================================
    // INITIALIZE ENROLLMENT
    // =========================================================

    populateInstrumentInformation();

    populateCourseSummary();

    showStep(1);

});