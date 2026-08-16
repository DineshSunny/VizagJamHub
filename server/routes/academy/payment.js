const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const {
  createVerifiedEnrollment,
  findEnrollmentByPaymentId,
  saveEnrollment
} = require("./enrollment");

const {
  sendEnrollmentConfirmationEmail
} = require("./email");


const router = express.Router();


/* =================================
   RAZORPAY CONFIGURATION
================================= */

const razorpay = new Razorpay({

  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET

});


/* =================================
   COURSE PRICES
================================= */

const COURSE_PRICES = {

  "Beginner Drums": 2000,

  "Intermediate Drums": 5000,

  "Advanced Drums": 7000

};


/* =================================
   CREATE PAYMENT ORDER
================================= */

router.post(
  "/api/payment/create-order",
  async (req, res) => {

    try {

      const {
        course,
        level,
        format,
        time,
        batch
      } = req.body;


      /* Validate enrollment information */

      if (
        !course ||
        !level ||
        !format ||
        !time ||
        !batch
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Incomplete enrollment information."

        });

      }


      /* Get trusted server-side price */

      const coursePrice =
        COURSE_PRICES[course];


      if (!coursePrice) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid course selected."

        });

      }


      /* Razorpay uses paise */

      const amountInPaise =
        coursePrice * 100;


      const receipt =
        "VJH_" + Date.now();


      const order =
        await razorpay.orders.create({

          amount:
            amountInPaise,

          currency:
            "INR",

          receipt:
            receipt,

          notes: {

            academy:
              "Vizag JamHub Music Academy",

            course:
              course,

            level:
              level,

            format:
              format,

            time:
              time,

            batch:
              batch

          }

        });


      res.json({

        success: true,

        key:
          process.env.RAZORPAY_KEY_ID,

        order: {

          id:
            order.id,

          amount:
            order.amount,

          currency:
            order.currency,

          receipt:
            order.receipt

        }

      });

    }

    catch (error) {

      console.error(
        "Create Razorpay order error:",
        error
      );


      res.status(500).json({

        success: false,

        message:
          "Unable to create payment order."

      });

    }

  }
);


/* =================================
   VERIFY PAYMENT
================================= */

router.post(
  "/api/payment/verify",
  async (req, res) => {

    try {

      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        enrollment
      } = req.body;


      /* Validate Razorpay response */

      if (
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature
      ) {

        return res.status(400).json({

          success: false,

          verified: false,

          message:
            "Missing payment verification information."

        });

      }


      /* =================================
         VERIFY RAZORPAY SIGNATURE
      ================================= */

      const signatureBody =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;


      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
          )
          .update(signatureBody)
          .digest("hex");


      const receivedBuffer =
        Buffer.from(
          razorpay_signature,
          "utf8"
        );


      const expectedBuffer =
        Buffer.from(
          expectedSignature,
          "utf8"
        );


      let signatureValid = false;


      if (
        receivedBuffer.length ===
        expectedBuffer.length
      ) {

        signatureValid =
          crypto.timingSafeEqual(
            receivedBuffer,
            expectedBuffer
          );

      }


      if (!signatureValid) {

        return res.status(400).json({

          success: false,

          verified: false,

          message:
            "Payment verification failed."

        });

      }


      /* =================================
         VERIFY COURSE PRICE
      ================================= */

      const courseName =
        enrollment?.course?.course;


      const trustedCoursePrice =
        COURSE_PRICES[courseName];


      if (!trustedCoursePrice) {

        return res.status(400).json({

          success: false,

          verified: false,

          message:
            "Invalid enrollment course."

        });

      }


      /* =================================
         PREVENT DUPLICATE ENROLLMENT
      ================================= */

      const existingEnrollment =
        findEnrollmentByPaymentId(
          razorpay_payment_id
        );


      if (existingEnrollment) {

        return res.json({

          success: true,

          verified: true,

          message:
            "Payment was already verified.",

          enrollment:
            existingEnrollment

        });

      }


      /* =================================
         CREATE ENROLLMENT
      ================================= */

      const {
        verifiedEnrollment,
        temporaryPassword
      } =
        await createVerifiedEnrollment(
          enrollment,
          {

            amount:
              trustedCoursePrice,

            currency:
              "INR",

            paymentId:
              razorpay_payment_id,

            orderId:
              razorpay_order_id,

            status:
              "paid",

            verified:
              true,

            verifiedAt:
              new Date().toISOString()

          }
        );


      /* =================================
         SAVE ENROLLMENT
      ================================= */

      saveEnrollment(
        verifiedEnrollment
      );


      console.log(
        "Music Academy enrollment activated:",
        verifiedEnrollment.studentId
      );


      /* =================================
         SEND CONFIRMATION EMAIL
      ================================= */

      let confirmationEmailSent =
        false;

      let confirmationEmailError =
        null;


      try {

        await sendEnrollmentConfirmationEmail(
          verifiedEnrollment,
          temporaryPassword
        );


        confirmationEmailSent =
          true;


        console.log(
          "Enrollment confirmation email sent:",
          verifiedEnrollment?.contact?.email
        );

      }

      catch (emailError) {

        confirmationEmailSent =
          false;

        confirmationEmailError =
          emailError.message;


        console.error(
          "Enrollment confirmation email error:",
          emailError
        );

      }


      /* =================================
         EMAIL DELIVERY STATUS
      ================================= */

      verifiedEnrollment.emailConfirmation = {

        sent:
          confirmationEmailSent,

        sentAt:
          confirmationEmailSent
            ? new Date().toISOString()
            : null,

        recipient:
          verifiedEnrollment?.contact?.email ||
          null,

        error:
          confirmationEmailError

      };


      /* =================================
         RETURN SUCCESS
      ================================= */

      res.json({

        success: true,

        verified: true,

        message:
          "Payment verified and enrollment activated.",

        enrollment:
          verifiedEnrollment,

        firstLogin: {

          studentId:
            verifiedEnrollment.studentId,

          temporaryPassword:
            temporaryPassword,

          mustChangePassword:
            true

        },

        emailConfirmation: {

          sent:
            confirmationEmailSent,

          recipient:
            verifiedEnrollment?.contact?.email ||
            null

        }

      });

    }

    catch (error) {

      console.error(
        "Payment verification error:",
        error
      );


      res.status(500).json({

        success: false,

        verified: false,

        message:
          "Unable to verify payment."

      });

    }

  }
);


/* =================================
   EXPORT
================================= */

module.exports = router;