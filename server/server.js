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
date: req.body.date,
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





/* DELETE show */

app.delete("/api/shows/:id", (req, res) => {

  const file = path.join(__dirname, "../database/shows.json");

  let shows = readJSON(file);

  shows = shows.filter(show => show.id != req.params.id);

  writeJSON(file, shows);

  res.json({ message: "Show deleted successfully" });

});

/* =================================
   UPDATE SHOW
================================= */

const params = new URLSearchParams(window.location.search)
const id = params.get("id")

async function loadShow(){

const res = await fetch("/api/shows")
const shows = await res.json()

const show = shows.find(s => s.id == id)

document.getElementById("title").value = show.title
document.getElementById("venue").value = show.venue
document.getElementById("address").value = show.address || ""
document.getElementById("date").value = show.date
document.getElementById("startTime").value = show.startTime || ""
document.getElementById("endTime").value = show.endTime || ""
document.getElementById("price").value = show.price
document.getElementById("info").value = show.info

}

loadShow()



document.getElementById("editForm").addEventListener("submit", async e => {

e.preventDefault()

const formData = new FormData(e.target)

await fetch("/api/shows/"+id,{
method:"PUT",
body:formData
})

alert("Show Updated")

window.location.href="/manage-shows.html"

})

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