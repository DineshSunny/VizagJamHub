const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


/* =================================
   CONNECTIONS FILE
================================= */

const connectionsFile = path.join(
  __dirname,
  "../../database/admin/shows/connections.json"
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
   BAND CONNECT
================================= */

router.post("/connect", (req, res) => {

  try {

    const connections =
      readJSON(connectionsFile);

    connections.push(req.body);

    writeJSON(
      connectionsFile,
      connections
    );

    res.send(
      "Connection request received!"
    );

  }

  catch (error) {

    console.error(
      "Band connect error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to save connection request."
    });

  }

});


module.exports = router;