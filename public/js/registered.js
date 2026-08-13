/* ==========================================================
   VIZAG JAMHUB MUSIC ACADEMY
   REGISTERED STUDENT CONFIRMATION

   Final successful-enrollment confirmation logic.
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ======================================================
       ELEMENTS
    ====================================================== */

    const onlineSection =
        document.getElementById(
            "online-class-access"
        );


    const inPersonSection =
        document.getElementById(
            "in-person-class-access"
        );


    const onlineClassLink =
        document.getElementById(
            "online-class-link"
        );


    const directionsButton =
        document.getElementById(
            "academy-directions"
        );


    const calendarContainer =
        document.getElementById(
            "registered-calendar"
        );


    const addCalendarButton =
        document.getElementById(
            "add-calendar-button"
        );


    const receiptButton =
        document.getElementById(
            "receipt-button"
        );


    const studentLoginButton =
        document.getElementById(
            "student-portal-button"
        );


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


        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {

            element.textContent = "—";

            return;

        }


        element.textContent =
            String(value);

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


    function capitalizeValue(value) {

        if (!value) {

            return "—";

        }


        return String(value)
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );

    }


    function formatDate(dateValue) {

        if (!dateValue) {

            return "—";

        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(dateValue);

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }


    /* ======================================================
       LOAD COMPLETED ENROLLMENT

       This value is written by enrollment.js only after
       successful server-side Razorpay verification.
    ====================================================== */

    let registration = null;


    try {

        const storedEnrollment =
            sessionStorage.getItem(
                "vizagJamHubCompletedEnrollment"
            );


        if (storedEnrollment) {

            registration =
                JSON.parse(
                    storedEnrollment
                );

        }

    }

    catch (error) {

        console.error(
            "Unable to read completed enrollment:",
            error
        );

    }


    /* ======================================================
       NO COMPLETED ENROLLMENT
    ====================================================== */

    if (!registration) {

        console.warn(
            "No completed Vizag JamHub enrollment was found."
        );


        /*
         * registered.html should only be reached after
         * successful payment verification.
         */

        window.location.href =
            "/index.html#school";


        return;

    }


    /* ======================================================
       DATA GROUPS
    ====================================================== */

    const course =
        registration.course || {};


    const student =
        registration.student || {};


    const contact =
        registration.contact || {};


    /*
     * Some future enrollment-specific information such as
     * Zoom links and location information may live here.
     */

    const enrollment =
        registration.enrollment || {};


    const payment =
        registration.payment || {};


    const authentication =
        registration.authentication || {};


    const firstLogin =
        registration.firstLogin || {};


    const emailConfirmation =
        registration.emailConfirmation || {};


    const schedule =
        Array.isArray(
            registration.schedule
        )
            ? registration.schedule
            : [];


    /* ======================================================
       STUDENT INFORMATION
    ====================================================== */

    const studentName =
        `${student.firstName || ""} ${student.lastName || ""}`
            .trim();


    const studentId =
        registration.studentId ||
        firstLogin.studentId ||
        enrollment.studentId ||
        "—";


    setText(
        "registered-student-name",
        studentName || "Student"
    );


    setText(
        "registered-student-id",
        studentId
    );


    /* ======================================================
       COURSE DISPLAY VALUES
    ====================================================== */

    const courseName =
        course.course || "—";


    const level =
        course.level || "—";


    const format =
        course.format || "";


    const normalizedFormat =
        String(format)
            .toLowerCase()
            .trim();


    const formatDisplay =
        course.formatLabel ||
        capitalizeValue(format);


    const timeDisplay =
        course.timeLabel ||
        course.time ||
        "—";


    const batchDisplay =
        course.batchName ||
        capitalizeValue(
            course.batch
        );


    const duration =
        course.duration ||
        "8 Weeks";


    const totalClasses =
        Number(
            course.totalClasses
        ) || 24;


    const priceDisplay =
        formatPrice(
            payment.amount ??
            course.price
        );


    const theoryDay =
        course.theoryDay || "—";


    const practicalDay =
        course.practicalDay || "—";


    const songDay =
        course.songDay || "—";


    /* ======================================================
       COURSE INFORMATION
    ====================================================== */

    setText(
        "registered-level",
        level !== "—"
            ? `${String(level).toUpperCase()} COURSE`
            : "—"
    );


    setText(
        "registered-course",
        courseName
    );


    setText(
        "registered-format",
        formatDisplay
    );


    setText(
        "registered-time",
        timeDisplay
    );


    setText(
        "registered-batch",
        batchDisplay
    );


    setText(
        "registered-duration",
        duration
    );


    setText(
        "registered-total-classes",
        `${totalClasses} Classes`
    );


    setText(
        "registered-price",
        priceDisplay
    );


    /* ======================================================
       WEEKLY SCHEDULE
    ====================================================== */

    setText(
        "registered-theory-day",
        theoryDay
    );


    setText(
        "registered-practical-day",
        practicalDay
    );


    setText(
        "registered-song-day",
        songDay
    );


    setText(
        "registered-theory-time",
        timeDisplay
    );


    setText(
        "registered-practical-time",
        timeDisplay
    );


    setText(
        "registered-song-time",
        timeDisplay
    );


    /* ======================================================
       EMAIL INFORMATION
    ====================================================== */

    const studentEmail =
        emailConfirmation.recipient ||
        contact.email ||
        "";


    setText(
        "registered-email",
        studentEmail
    );


    /*
     * These elements are optional.
     * If they exist in registered.html, they will be filled.
     */

    if (emailConfirmation.sent === true) {

        setText(
            "registered-email-status",
            "Confirmation email sent"
        );

    }

    else {

        setText(
            "registered-email-status",
            "Confirmation email could not be sent"
        );

    }


    /* ======================================================
       PAYMENT INFORMATION
    ====================================================== */

    setText(
        "registered-payment-status",
        payment.status
            ? capitalizeValue(
                payment.status
            )
            : "Paid"
    );


    setText(
        "registered-payment-id",
        payment.paymentId
    );


    setText(
        "registered-order-id",
        payment.orderId
    );


    setText(
        "registered-amount-paid",
        formatPrice(
            payment.amount
        )
    );


    /* ======================================================
       FIRST LOGIN INFORMATION
    ====================================================== */

    const temporaryPassword =
        firstLogin.temporaryPassword || "";


    setText(
        "registered-login-student-id",
        studentId
    );


    if (temporaryPassword) {

        setText(
            "registered-temporary-password",
            temporaryPassword
        );


        setText(
            "registered-password-message",
            "Use this temporary password for your first login. You will be required to create your own password after signing in."
        );

    }

    else {

        setText(
            "registered-temporary-password",
            "Sent by email"
        );


        setText(
            "registered-password-message",
            "Use the first-login information sent to your registered email address."
        );

    }


    /* ======================================================
       FORMAT-SPECIFIC CLASS ACCESS
    ====================================================== */

    function configureClassAccess() {


        /* ==================================================
           ONLINE
        ================================================== */

        if (
            normalizedFormat === "online"
        ) {


            if (onlineSection) {

                onlineSection.hidden =
                    false;

            }


            if (inPersonSection) {

                inPersonSection.hidden =
                    true;

            }


            setText(
                "online-access-time",
                timeDisplay
            );


            /*
             * Online-class information can later be assigned
             * by the backend/admin system.
             */

            const onlineClassUrl =
                enrollment.onlineClassUrl ||
                registration.onlineClassUrl;


            if (
                onlineClassUrl &&
                onlineClassLink
            ) {

                onlineClassLink.href =
                    onlineClassUrl;


                onlineClassLink.classList.remove(
                    "disabled"
                );


                onlineClassLink.removeAttribute(
                    "aria-disabled"
                );

            }


            return;

        }


        /* ==================================================
           IN PERSON
        ================================================== */

        if (
            normalizedFormat === "in-person" ||
            normalizedFormat === "in person" ||
            normalizedFormat === "offline"
        ) {


            if (onlineSection) {

                onlineSection.hidden =
                    true;

            }


            if (inPersonSection) {

                inPersonSection.hidden =
                    false;

            }


            setText(
                "in-person-access-time",
                timeDisplay
            );


            const locationAddress =
                enrollment.locationAddress ||
                registration.locationAddress;


            if (locationAddress) {

                setText(
                    "academy-address",
                    locationAddress
                );

            }


            const directionsUrl =
                enrollment.directionsUrl ||
                registration.directionsUrl;


            if (
                directionsUrl &&
                directionsButton
            ) {

                directionsButton.href =
                    directionsUrl;


                directionsButton.classList.remove(
                    "disabled"
                );


                directionsButton.removeAttribute(
                    "aria-disabled"
                );

            }


            return;

        }


        /* ==================================================
           UNKNOWN FORMAT
        ================================================== */

        if (onlineSection) {

            onlineSection.hidden =
                true;

        }


        if (inPersonSection) {

            inPersonSection.hidden =
                true;

        }

    }


    /* ======================================================
       CLASS CALENDAR
    ====================================================== */

    function renderCalendar() {


        if (!calendarContainer) {

            return;

        }


        /*
         * We will populate this when the backend begins
         * generating the complete 24-session schedule.
         */

        if (!schedule.length) {

            return;

        }


        calendarContainer.innerHTML =
            "";


        const weeks = {};


        schedule.forEach(session => {


            const week =
                Number(
                    session.week
                ) || 1;


            if (!weeks[week]) {

                weeks[week] = [];

            }


            weeks[week].push(
                session
            );

        });


        Object.keys(weeks)
            .sort(
                (a, b) =>
                    Number(a) -
                    Number(b)
            )
            .forEach(weekNumber => {


                const week =
                    document.createElement(
                        "div"
                    );


                week.className =
                    "registered-calendar-week";


                const heading =
                    document.createElement(
                        "div"
                    );


                heading.className =
                    "registered-calendar-week-heading";


                heading.innerHTML =
                    `<span>WEEK</span>
                     <strong>${weekNumber}</strong>`;


                week.appendChild(
                    heading
                );


                const classes =
                    document.createElement(
                        "div"
                    );


                classes.className =
                    "registered-calendar-classes";


                weeks[weekNumber]
                    .forEach(session => {


                        const item =
                            document.createElement(
                                "div"
                            );


                        item.className =
                            "registered-calendar-class";


                        const date =
                            document.createElement(
                                "div"
                            );


                        date.className =
                            "registered-calendar-date";


                        date.textContent =
                            formatDate(
                                session.date ||
                                session.startDateTime
                            );


                        const details =
                            document.createElement(
                                "div"
                            );


                        details.className =
                            "registered-calendar-class-details";


                        const type =
                            document.createElement(
                                "strong"
                            );


                        type.textContent =
                            session.name ||
                            session.type ||
                            "Class";


                        const time =
                            document.createElement(
                                "span"
                            );


                        time.textContent =
                            session.time ||
                            timeDisplay;


                        details.appendChild(
                            type
                        );


                        details.appendChild(
                            time
                        );


                        item.appendChild(
                            date
                        );


                        item.appendChild(
                            details
                        );


                        classes.appendChild(
                            item
                        );

                    });


                week.appendChild(
                    classes
                );


                calendarContainer.appendChild(
                    week
                );

            });


        const calendarUrl =
            enrollment.calendarUrl ||
            registration.calendarUrl;


        if (
            calendarUrl &&
            addCalendarButton
        ) {

            addCalendarButton.disabled =
                false;

        }

    }


    /* ======================================================
       NEXT CLASS
    ====================================================== */

    function displayNextClass() {


        if (!schedule.length) {

            return;

        }


        const now =
            new Date();


        const upcoming =
            schedule
                .map(session => {

                    return {

                        ...session,

                        parsedDate:
                            new Date(
                                session.startDateTime ||
                                session.date
                            )

                    };

                })
                .filter(session => {

                    return (
                        !Number.isNaN(
                            session.parsedDate.getTime()
                        ) &&
                        session.parsedDate >= now
                    );

                })
                .sort(
                    (a, b) =>
                        a.parsedDate -
                        b.parsedDate
                );


        if (!upcoming.length) {

            return;

        }


        const next =
            upcoming[0];


        setText(
            "next-class-type",
            next.type ||
            next.name ||
            "Class"
        );


        setText(
            "next-class-date",
            formatDate(
                next.date ||
                next.startDateTime
            )
        );


        setText(
            "next-class-name",
            next.name ||
            next.type ||
            "Class"
        );


        setText(
            "next-class-time",
            next.time ||
            timeDisplay
        );

    }


    /* ======================================================
       ADD TO CALENDAR
    ====================================================== */

    if (addCalendarButton) {

        addCalendarButton.addEventListener(
            "click",
            () => {


                const calendarUrl =
                    enrollment.calendarUrl ||
                    registration.calendarUrl;


                if (!calendarUrl) {

                    return;

                }


                window.location.href =
                    calendarUrl;

            }
        );

    }


    /* ======================================================
       PAYMENT RECEIPT
    ====================================================== */

    if (receiptButton) {

        receiptButton.addEventListener(
            "click",
            () => {


                if (payment.receiptUrl) {

                    window.location.href =
                        payment.receiptUrl;


                    return;

                }


                alert(
                    "Your payment receipt is not available yet."
                );

            }
        );

    }


    /* ======================================================
       STUDENT LOGIN
    ====================================================== */

    if (studentLoginButton) {

        studentLoginButton.href =
            "/studentlogin.html";


        studentLoginButton.addEventListener(
            "click",
            () => {

                /*
                 * Do NOT delete completed enrollment here.
                 *
                 * studentlogin.html may need the Student ID
                 * for first-login convenience.
                 */

                sessionStorage.setItem(
                    "vizagJamHubStudentId",
                    studentId
                );

            }
        );

    }


    /* ======================================================
       PREVENT DISABLED LINKS
    ====================================================== */

    document
        .querySelectorAll(
            "a.disabled"
        )
        .forEach(link => {


            link.addEventListener(
                "click",
                event => {


                    if (
                        link.classList.contains(
                            "disabled"
                        )
                    ) {

                        event.preventDefault();

                    }

                }
            );

        });


    /* ======================================================
       INITIALIZE
    ====================================================== */

    configureClassAccess();

    renderCalendar();

    displayNextClass();


    console.log(
        "Vizag JamHub enrollment confirmation loaded:",
        studentId
    );

});