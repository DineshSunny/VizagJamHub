const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const router = express.Router();


/* =================================
   ENROLLMENT FILE
================================= */

const enrollmentsFile = path.join(
  __dirname,
  "../../../database/academy/enrollments.json"
);


/* =================================
   HELPER FUNCTIONS
================================= */

function readJSON(file) {

  if (fs.existsSync(file)) {

    return JSON.parse(
      fs.readFileSync(file, "utf-8")
    );

  }

  return [];

}


function writeJSON(file, data) {

  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );

}


/* =================================
   GENERATE STUDENT ID
================================= */

function generateStudentId() {

  const year =
    new Date().getFullYear();

  const randomNumber =
    crypto.randomInt(
      100000,
      999999
    );

  return `VJH-${year}-${randomNumber}`;

}


/* =================================
   GENERATE TEMPORARY PASSWORD
================================= */

function generateTemporaryPassword() {

  const uppercase =
    "ABCDEFGHJKLMNPQRSTUVWXYZ";

  const lowercase =
    "abcdefghijkmnopqrstuvwxyz";

  const numbers =
    "23456789";

  const symbols =
    "!@#$%";

  const allCharacters =
    uppercase +
    lowercase +
    numbers +
    symbols;


  let password = "";


  /* Required character types */

  password +=
    uppercase[
      crypto.randomInt(
        0,
        uppercase.length
      )
    ];

  password +=
    lowercase[
      crypto.randomInt(
        0,
        lowercase.length
      )
    ];

  password +=
    numbers[
      crypto.randomInt(
        0,
        numbers.length
      )
    ];

  password +=
    symbols[
      crypto.randomInt(
        0,
        symbols.length
      )
    ];


  /* Fill remaining characters */

  while (password.length < 10) {

    password +=
      allCharacters[
        crypto.randomInt(
          0,
          allCharacters.length
        )
      ];

  }


  /* Shuffle password */

  const characters =
    password.split("");


  for (
    let i = characters.length - 1;
    i > 0;
    i--
  ) {

    const j =
      crypto.randomInt(
        0,
        i + 1
      );

    [
      characters[i],
      characters[j]
    ] = [
      characters[j],
      characters[i]
    ];

  }


  return characters.join("");

}


/* =================================
   CREATE VERIFIED ENROLLMENT
================================= */

async function createVerifiedEnrollment(
  enrollment,
  paymentInformation
) {

  const studentId =
    generateStudentId();

  const temporaryPassword =
    generateTemporaryPassword();

  const temporaryPasswordHash =
    await bcrypt.hash(
      temporaryPassword,
      12
    );


  const totalClasses =
    Number(
      enrollment?.course?.totalClasses
    ) || 24;


  const verifiedEnrollment = {

    ...enrollment,

    studentId:
      studentId,

    enrollmentStatus:
      "active",

    authentication: {

      temporaryPasswordHash:
        temporaryPasswordHash,

      mustChangePassword:
        true,

      passwordCreated:
        false,

      googleLinked:
        false,

      createdAt:
        new Date().toISOString()

    },

    payment: {

      ...(enrollment?.payment || {}),

      ...paymentInformation

    },

    attendance: {

      totalClasses:
        totalClasses,

      completedClasses:
        0,

      remainingClasses:
        totalClasses,

      attendedClasses:
        0,

      missedClasses:
        0

    },

    enrollmentActivatedAt:
      new Date().toISOString()

  };


  return {
    verifiedEnrollment,
    temporaryPassword
  };

}


/* =================================
   FIND PAYMENT
================================= */

function findEnrollmentByPaymentId(
  paymentId
) {

  const enrollments =
    readJSON(enrollmentsFile);

  return enrollments.find(
    item =>
      item?.payment?.paymentId ===
      paymentId
  );

}


/* =================================
   SAVE ENROLLMENT
================================= */

function saveEnrollment(
  enrollment
) {

  const enrollments =
    readJSON(enrollmentsFile);

  enrollments.push(
    enrollment
  );

  writeJSON(
    enrollmentsFile,
    enrollments
  );

}


/* =================================
   GET ENROLLMENT BY STUDENT ID
================================= */

router.get(
  "/api/enrollments/:studentId",
  (req, res) => {

    try {

      const enrollments =
        readJSON(enrollmentsFile);

      const enrollment =
        enrollments.find(
          item =>
            item.studentId ===
            req.params.studentId
        );


      if (!enrollment) {

        return res.status(404).json({

          success: false,

          message:
            "Enrollment not found."

        });

      }


      res.json({

        success: true,

        enrollment:
          enrollment

      });

    }

    catch (error) {

      console.error(
        "Enrollment lookup error:",
        error
      );


      res.status(500).json({

        success: false,

        message:
          "Unable to retrieve enrollment."

      });

    }

  }
);


/* =================================
   EXPORT
================================= */

module.exports = {

  router,

  createVerifiedEnrollment,

  findEnrollmentByPaymentId,

  saveEnrollment

};