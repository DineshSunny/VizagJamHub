/* ==========================================================
   VIZAG JAMHUB MUSIC ACADEMY
   COURSE ENROLLMENT AGREEMENT
========================================================== */


document.addEventListener("DOMContentLoaded", () => {


    const agreements =
        document.querySelectorAll(".course-agreement");


    const enrollButton =
        document.getElementById("final-enroll-btn");


    const agreementStatus =
        document.getElementById("agreement-status");


    /* ======================================================
       CHECK AGREEMENTS
    ====================================================== */

    function checkAgreements() {


        const allAccepted =
            [...agreements].every(
                checkbox => checkbox.checked
            );


        if(allAccepted){


            enrollButton.disabled = false;


            enrollButton.classList.add("ready");


            enrollButton.innerHTML = `
                <i class="fa-solid fa-arrow-right"></i>
                Continue to Enrollment
            `;


            agreementStatus.classList.add("accepted");


            agreementStatus.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                <span>
                    All agreements accepted.
                    You may continue with enrollment.
                </span>
            `;


        }else{


            enrollButton.disabled = true;


            enrollButton.classList.remove("ready");


            enrollButton.innerHTML = `
                <i class="fa-solid fa-lock"></i>
                Enroll Now
            `;


            agreementStatus.classList.remove("accepted");


            agreementStatus.innerHTML = `
                <i class="fa-solid fa-lock"></i>
                <span>
                    Accept all required agreements
                    to continue.
                </span>
            `;


        }


    }



    /* ======================================================
       LISTEN FOR CHECKBOX CHANGES
    ====================================================== */

    agreements.forEach(checkbox => {


        checkbox.addEventListener(
            "change",
            checkAgreements
        );


    });



    /* ======================================================
       ENROLLMENT
    ====================================================== */

    enrollButton.addEventListener("click", () => {


        const allAccepted =
            [...agreements].every(
                checkbox => checkbox.checked
            );


        if(!allAccepted){
            return;
        }


        /*
        ==============================================
        PHASE 2

        This will later launch:

        1. Course confirmation
        2. Student registration
        3. Online / In-person selection
        4. Schedule selection
        5. Payment
        6. Student ID creation

        For now we send the student to the
        enrollment page.
        ==============================================
        */


        window.location.href =
            "enroll.html?course=beginner-drums";


    });



    /* INITIAL STATE */

    checkAgreements();


});