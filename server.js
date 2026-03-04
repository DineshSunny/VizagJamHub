const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

/* BOOKING FORM */

app.post("/book", (req, res) => {

const data = req.body;

let bookings = [];

if(fs.existsSync("bookings.json")){
bookings = JSON.parse(fs.readFileSync("bookings.json"));
}

bookings.push(data);

fs.writeFileSync("bookings.json", JSON.stringify(bookings,null,2));

res.send("Booking request received!");

});


/* BAND CONNECT FORM */

app.post("/connect", (req, res) => {

const data = req.body;

let connections = [];

if(fs.existsSync("connections.json")){
connections = JSON.parse(fs.readFileSync("connections.json"));
}

connections.push(data);

fs.writeFileSync("connections.json", JSON.stringify(connections,null,2));

res.send("Connection request received!");

});


app.listen(3000, () => {

console.log("VizagJamHub server running on port 3000");

});