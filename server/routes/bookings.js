const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


/* =================================
   BOOKINGS FILE
================================= */

const bookingsFile = path.join(
  __dirname,
  "../../database/admin/shows/bookings.json"
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
   BOOK US
================================= */

router.post("/book", (req, res) => {

  try {

    const bookings =
      readJSON(bookingsFile);

    bookings.push(req.body);

    writeJSON(
      bookingsFile,
      bookings
    );

    res.send(
      "Booking request received!"
    );

  }

  catch (error) {

    console.error(
      "Booking request error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to save booking request."

    });

  }

});


module.exports = router;