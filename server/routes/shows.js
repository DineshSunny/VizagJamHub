const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();


/* =================================
   FILE LOCATIONS
================================= */

const showsFile = path.join(
  __dirname,
  "../../database/admin/shows/shows.json"
);

const postersFolder = path.join(
  __dirname,
  "../../public/posters"
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
   POSTER UPLOAD
================================= */

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, postersFolder);

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});


const upload = multer({
  storage: storage
});


/* =================================
   GET ALL SHOWS
================================= */

router.get("/api/shows", (req, res) => {

  const shows = readJSON(showsFile);

  res.json(shows);

});


/* =================================
   CREATE SHOW
================================= */

router.post(
  "/api/shows",
  upload.single("poster"),
  (req, res) => {

    const shows = readJSON(showsFile);

    const newShow = {

      id: Date.now(),

      title: req.body.title,
      venue: req.body.venue,
      address: req.body.address,

      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,

      price: req.body.price,
      info: req.body.info,

      poster: req.file
        ? "/posters/" + req.file.filename
        : ""

    };

    shows.push(newShow);

    writeJSON(
      showsFile,
      shows
    );

    res.json({
      message: "Show created successfully",
      show: newShow
    });

  }
);


/* =================================
   UPDATE SHOW
================================= */

router.put(
  "/api/shows/:id",
  upload.single("poster"),
  (req, res) => {

    const shows = readJSON(showsFile);

    const index = shows.findIndex(
      show => show.id == req.params.id
    );

    if (index === -1) {

      return res.status(404).json({
        message: "Show not found"
      });

    }

    shows[index] = {

      ...shows[index],

      title: req.body.title,
      venue: req.body.venue,
      address: req.body.address,

      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,

      price: req.body.price,
      info: req.body.info,

      poster: req.file
        ? "/posters/" + req.file.filename
        : shows[index].poster

    };

    writeJSON(
      showsFile,
      shows
    );

    res.json({
      message: "Show updated successfully"
    });

  }
);


/* =================================
   DELETE SHOW
================================= */

router.delete("/api/shows/:id", (req, res) => {

  let shows = readJSON(showsFile);

  shows = shows.filter(
    show => show.id != req.params.id
  );

  writeJSON(
    showsFile,
    shows
  );

  res.json({
    message: "Show deleted successfully"
  });

});


module.exports = router;