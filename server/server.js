const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Serve frontend */
app.use(express.static(path.join(__dirname, "../public")));

/* Helper functions */

function readJSON(file) {
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file));
  }
  return [];
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ============================= */
/* Book Us */
/* ============================= */

app.post("/book", (req, res) => {
  const file = path.join(__dirname, "../database/bookings.json");

  let bookings = readJSON(file);
  bookings.push(req.body);

  writeJSON(file, bookings);

  res.send("Booking request received!");
});

/* ============================= */
/* Band Connect */
/* ============================= */

app.post("/connect", (req, res) => {
  const file = path.join(__dirname, "../database/connections.json");

  let connections = readJSON(file);
  connections.push(req.body);

  writeJSON(file, connections);

  res.send("Connection request received!");
});

/* ============================= */
/* Tickets */
/* ============================= */

app.post("/tickets", (req, res) => {
  const file = path.join(__dirname, "../database/tickets.json");

  let tickets = readJSON(file);
  tickets.push(req.body);

  writeJSON(file, tickets);

  res.send("Ticket booked!");
});


/* ============================= */
/* ===== ADDED FOR SHOWS SYSTEM ===== */
/* ============================= */


/* GET all shows */

app.get("/api/shows", (req, res) => {

  const file = path.join(__dirname, "../database/shows.json");

  let shows = readJSON(file);

  res.json(shows);

});


/* CREATE new show (Admin) */

app.post("/api/shows", (req, res) => {

  const file = path.join(__dirname, "../database/shows.json");

  let shows = readJSON(file);

  const newShow = {
    id: Date.now(),
    title: req.body.title,
    venue: req.body.venue,
    date: req.body.date,
    price: req.body.price
  };

  shows.push(newShow);

  writeJSON(file, shows);

  res.json({
    message: "Show created successfully",
    show: newShow
  });

});


/* ============================= */
/* Start Server */
/* ============================= */

app.listen(PORT, () => {
  console.log("VizagJamHub server running on port " + PORT);
});