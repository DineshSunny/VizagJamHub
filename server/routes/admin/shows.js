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
  "../../public/images/Shows"
);


/* =================================
   CREATE POSTER FOLDER
================================= */

if (!fs.existsSync(postersFolder)) {

  fs.mkdirSync(
    postersFolder,
    { recursive: true }
  );

}


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
   DELETE POSTER
================================= */

function deletePoster(posterPath) {

  if (!posterPath) {
    return;
  }


  const posterName = path.basename(posterPath);

  const fullPosterPath = path.join(
    postersFolder,
    posterName
  );


  if (fs.existsSync(fullPosterPath)) {

    fs.unlinkSync(fullPosterPath);

  }

}


/* =================================
   POSTER UPLOAD
================================= */

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(
      null,
      postersFolder
    );

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
        ? "/images/Shows/" + req.file.filename
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


    const oldPoster = shows[index].poster;


    if (req.file && oldPoster) {

      deletePoster(oldPoster);

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
        ? "/images/Shows/" + req.file.filename
        : oldPoster

    };


    writeJSON(
      showsFile,
      shows
    );


    res.json({

      message: "Show updated successfully",

      show: shows[index]

    });

  }
);


/* =================================
   DELETE SHOW
================================= */

router.delete(
  "/api/shows/:id",
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


    const show = shows[index];


    if (show.poster) {

      deletePoster(show.poster);

    }


    shows.splice(
      index,
      1
    );


    writeJSON(
      showsFile,
      shows
    );


    res.json({

      message: "Show deleted successfully"

    });

  }
);


module.exports = router;