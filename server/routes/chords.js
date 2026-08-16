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
   CHORDS
================================= */


/* TELUGU CHORDS */

router.get("/api/teluguchords", (req, res) => {

  const file = path.resolve(
    __dirname,
    "../../database/admin/chords/teluguchords.json"
  );

  const songs = readJSON(file);

  res.json(songs);

});


/* ENGLISH CHORDS */

router.get("/api/englishchords", (req, res) => {

  const file = path.resolve(
    __dirname,
    "../../database/admin/chords/englishchords.json"
  );

  const songs = readJSON(file);

  res.json(songs);

});


/* HINDI CHORDS */

router.get("/api/hindichords", (req, res) => {

  const file = path.resolve(
    __dirname,
    "../../database/admin/chords/hindichords.json"
  );

  const songs = readJSON(file);

  res.json(songs);

});


/* OTHER SONG CHORDS */

router.get("/api/othersongchords", (req, res) => {

  const file = path.resolve(
    __dirname,
    "../../database/admin/chords/othersongchords.json"
  );

  const songs = readJSON(file);

  res.json(songs);

});


/* INSTRUMENTAL SONG CHORDS */

router.get("/api/instrumentalsongchords", (req, res) => {

  const file = path.resolve(
    __dirname,
    "../../database/admin/chords/instrumentalsongchords.json"
  );

  const songs = readJSON(file);

  res.json(songs);

});


module.exports = router;