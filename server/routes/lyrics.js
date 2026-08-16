const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


/* =================================
   HELPER FUNCTION
================================= */

function readJSON(file) {

  if (fs.existsSync(file)) {
    return JSON.parse(
      fs.readFileSync(file, "utf-8")
    );
  }

  return [];

}


/* =================================
   LYRICS
================================= */


/* TELUGU SONGS */

router.get("/api/telugusongs", (req, res) => {

  const file = path.resolve(
    __dirname,
    "../../database/lyrics/telugusongs.json"
  );

  const songs = readJSON(file);

  res.json(songs);

});


/* ENGLISH SONGS */

router.get("/api/englishsongs", (req, res) => {

  const file = path.resolve(
    __dirname,
    "../../database/lyrics/englishsongs.json"
  );

  const songs = readJSON(file);

  res.json(songs);

});


/* HINDI SONGS */

router.get("/api/hindisongs", (req, res) => {

  const file = path.resolve(
    __dirname,
    "../../database/lyrics/hindisongs.json"
  );

  const songs = readJSON(file);

  res.json(songs);

});


module.exports = router;