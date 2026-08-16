const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


/* =================================
   TICKETS FILE
================================= */

const ticketsFile = path.join(
  __dirname,
  "../../database/admin/shows/tickets.json"
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
   TICKET BOOKING
================================= */

router.post("/tickets", (req, res) => {

  try {

    const tickets =
      readJSON(ticketsFile);

    tickets.push(req.body);

    writeJSON(
      ticketsFile,
      tickets
    );

    res.send(
      "Ticket booked!"
    );

  }

  catch (error) {

    console.error(
      "Ticket booking error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to save ticket booking."

    });

  }

});


module.exports = router;