/* ==========================================================
   VIZAG JAMHUB MUSIC ACADEMY
   REGISTERED STUDENT CONFIRMATION

   Shared confirmation logic for all academy courses.
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


        if (Number.isNaN(date.getTime())) {

            return dateValue;

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
       LOAD CONFIRMED ENROLLMENT

       IMPORTANT:

       The backend will eventually create this ONLY after
       successful payment verification.

       We intentionally DO NOT use
       vizagJamHubPendingRegistration here because a pending
       registration is not proof of payment/enrollment.
    ====================================================== */

    let registration = null;


    try {

        registration =
            JSON.parse(
                sessionStorage.getItem(
                    "vizagJamHubConfirmedEnrollment"
                )
            );

    }

    catch (error) {

        console.error(
            "Unable to read confirmed enrollment:",
            error
        );

    }



    /* ======================================================
       NO CONFIRMED ENROLLMENT
    ====================================================== */

    if (!registration) {

        console.warn(
            "No confirmed Vizag JamHub enrollment was found."
        );


        /*
         * Once the backend exists, students should only
         * reach registered.html after successful payment.
         *
         * For now, redirect away rather than showing
         * fake confirmation information.
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


    const enrollment =
        registration.enrollment || {};


    const payment =
        registration.payment || {};


    const schedule =
        Array.isArray(registration.schedule)
            ? registration.schedule
            : [];



    /* ======================================================
       COURSE DISPLAY VALUES
    ====================================================== */

    const courseName =
        course.course || "—";


    const level =
        course.level || "—";


    const format =
        course.format || "";


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
            course.price
        );


    const theoryDay =
        course.theoryDay || "—";


    const practicalDay =
        course.practicalDay || "—";


    const songDay =
        course.songDay || "—";



    /* ======================================================
       STUDENT ID
    ====================================================== */

    setText(
        "registered-student-id",
        enrollment.studentId
    );



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
       EMAIL
    ====================================================== */

    if (contact.email) {

        setText(
            "registered-email",
            contact.email
        );

    }



    /* ======================================================
       FORMAT-SPECIFIC CLASS ACCESS

       ONLINE:
       - Show online access
       - Hide physical location

       IN PERSON:
       - Show academy location
       - Hide online access
    ====================================================== */

    function configureClassAccess() {


        /* ==================================================
           ONLINE
        ================================================== */

        if (format === "online") {


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
             * Backend-created online meeting/class URL.
             */

            if (
                enrollment.onlineClassUrl &&
                onlineClassLink
            ) {

                onlineClassLink.href =
                    enrollment.onlineClassUrl;


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

        if (format === "in-person") {


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



            /*
             * Backend/admin-controlled academy address.
             */

            if (enrollment.locationAddress) {

                setText(
                    "academy-address",
                    enrollment.locationAddress
                );

            }



            /*
             * Directions URL.
             */

            if (
                enrollment.directionsUrl &&
                directionsButton
            ) {

                directionsButton.href =
                    enrollment.directionsUrl;


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

           Hide both rather than accidentally displaying
           the wrong access information.
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
         * Backend should provide the complete
         * 24-session schedule.
         */

        if (!schedule.length) {

            return;

        }



        calendarContainer.innerHTML = "";



        /*
         * Group sessions by week.
         */

        const weeks = {};


        schedule.forEach(session => {


            const week =
                Number(session.week) || 1;


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
                    Number(a) - Number(b)
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
                                session.date
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



        /*
         * Calendar export becomes available only
         * when the backend provides a calendar URL/file.
         */

        if (
            enrollment.calendarUrl &&
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
            next.type
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
            next.name
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


                if (
                    !enrollment.calendarUrl
                ) {

                    return;

                }


                window.location.href =
                    enrollment.calendarUrl;

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


                /*
                 * Receipt should come from the verified
                 * payment record — never generated from
                 * unverified frontend information.
                 */

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


});

