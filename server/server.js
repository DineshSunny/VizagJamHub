const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve frontend */
app.use(express.static(path.join(__dirname, "../public")));

/* =================================
   Helper functions
================================= */

function readJSON(file) {
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file));
  }
  return [];
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* =================================
   POSTER IMAGE UPLOAD
================================= */

const storage = multer.diskStorage({

destination: function (req, file, cb) {

cb(null, path.join(__dirname, "../public/posters"));

},

filename: function (req, file, cb) {

cb(null, Date.now() + "-" + file.originalname);

}

});

const upload = multer({ storage: storage });

/* =================================
   BOOK US
================================= */

app.post("/book", (req, res) => {

  const file = path.join(__dirname, "../database/bookings.json");

  let bookings = readJSON(file);

  bookings.push(req.body);

  writeJSON(file, bookings);

  res.send("Booking request received!");

});

/* =================================
   BAND CONNECT
================================= */

app.post("/connect", (req, res) => {

  const file = path.join(__dirname, "../database/connections.json");

  let connections = readJSON(file);

  connections.push(req.body);

  writeJSON(file, connections);

  res.send("Connection request received!");

});

/* =================================
   TICKETS
================================= */

app.post("/tickets", (req, res) => {

  const file = path.join(__dirname, "../database/tickets.json");

  let tickets = readJSON(file);

  tickets.push(req.body);

  writeJSON(file, tickets);

  res.send("Ticket booked!");

});

/* =================================
   SHOWS SYSTEM
================================= */

/* GET all shows */

app.get("/api/shows", (req, res) => {

  const file = path.join(__dirname, "../database/shows.json");

  let shows = readJSON(file);

  res.json(shows);

});

/* CREATE new show (Admin) */

app.post("/api/shows", upload.single("poster"), (req, res) => {

const file = path.join(__dirname, "../database/shows.json");

let shows = readJSON(file);

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

poster: req.file ? "/posters/" + req.file.filename : ""

};

shows.push(newShow);

writeJSON(file, shows);

res.json({
message: "Show created successfully",
show: newShow
});

});

/* UPDATE show */

app.put("/api/shows/:id", upload.single("poster"), (req, res) => {

const file = path.join(__dirname, "../database/shows.json")

let shows = readJSON(file)

const index = shows.findIndex(s => s.id == req.params.id)

if(index === -1){
return res.status(404).json({message:"Show not found"})
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

poster: req.file ? "/posters/" + req.file.filename : shows[index].poster

}

writeJSON(file, shows)

res.json({message:"Show updated successfully"})

})





/* DELETE show */

app.delete("/api/shows/:id", (req, res) => {

  const file = path.join(__dirname, "../database/shows.json");

  let shows = readJSON(file);

  shows = shows.filter(show => show.id != req.params.id);

  writeJSON(file, shows);

  res.json({ message: "Show deleted successfully" });

});



/* =================================
   GUITAR SCHOOL
================================= */

app.post("/guitar", (req, res) => {

  const file = path.join(__dirname, "../database/guitarStudents.json");

  let students = readJSON(file);

  students.push(req.body);

  writeJSON(file, students);

  res.send("Enrollment received!");

});

/* =================================
   START SERVER
================================= */

app.listen(PORT, () => {
  console.log("VizagJamHub server running on port " + PORT);
});