const nodemailer = require("nodemailer");


/* =================================
   EMAIL CONFIGURATION
================================= */

const emailTransporter = nodemailer.createTransport({

  service: "gmail",

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_APP_PASSWORD

  }

});


/* =================================
   SEND ENROLLMENT CONFIRMATION EMAIL
================================= */

async function sendEnrollmentConfirmationEmail(
  enrollment,
  temporaryPassword
) {

  const student =
    enrollment?.student || {};

  const contact =
    enrollment?.contact || {};

  const course =
    enrollment?.course || {};

  const payment =
    enrollment?.payment || {};


  const studentName =
    `${student.firstName || ""} ${student.lastName || ""}`
      .trim() ||
    "Student";


  const studentEmail =
    contact.email;


  if (!studentEmail) {

    throw new Error(
      "Student email address is missing."
    );

  }


  const amount =
    Number(payment.amount || 0);


  const amountText =
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }
    ).format(amount);


  const subject =
    `Enrollment Confirmed - ${enrollment.studentId}`;


  const text = `
Hello ${studentName},

Welcome to Vizag JamHub Music Academy!

Your enrollment and payment have been successfully confirmed.

STUDENT INFORMATION

Student Name: ${studentName}
Student ID: ${enrollment.studentId}

COURSE INFORMATION

Course: ${course.course || "-"}
Level: ${course.level || "-"}
Format: ${course.formatLabel || course.format || "-"}
Time: ${course.timeLabel || course.time || "-"}
Batch: ${course.batchName || course.batch || "-"}
Duration: ${course.duration || "8 Weeks"}
Total Classes: ${course.totalClasses || 24}

CLASS SCHEDULE

Theory: ${course.theoryDay || "-"}
Practical: ${course.practicalDay || "-"}
Song: ${course.songDay || "-"}

PAYMENT

Amount Paid: ${amountText}
Payment Status: Paid
Payment ID: ${payment.paymentId || "-"}
Order ID: ${payment.orderId || "-"}

FIRST LOGIN

Student ID:
${enrollment.studentId}

Temporary Password:
${temporaryPassword}

Use your Student ID and temporary password for your first login.

After signing in, you will be required to create your own password.

For security, do not share your Student ID or temporary password with anyone.

Thank you for joining Vizag JamHub Music Academy.

Vizag JamHub Music Academy
`.trim();


  await emailTransporter.sendMail({

    from:
      `"Vizag JamHub Music Academy" <${process.env.EMAIL_USER}>`,

    to:
      studentEmail,

    subject:
      subject,

    text:
      text

  });


  return true;

}


/* =================================
   EXPORT
================================= */

module.exports = {
  sendEnrollmentConfirmationEmail
};