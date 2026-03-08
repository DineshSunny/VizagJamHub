const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

/* Middleware */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Serve frontend */

app.use(express.static(path.join(__dirname, "../public")));


/* Helper functions */

function readJSON(filePath){

    if(fs.existsSync(filePath)){
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }

    return [];
}

function writeJSON(filePath, data){

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

}


/* =============================
   BOOK US FORM
============================= */

app.post("/book", (req,res)=>{

    const file = path.join(__dirname, "../database/bookings.json");

    let bookings = readJSON(file);

    bookings.push(req.body);

    writeJSON(file, bookings);

    res.send("Booking request received!");

});


/* =============================
   BAND CONNECT FORM
============================= */

app.post("/connect", (req,res)=>{

    const file = path.join(__dirname, "../database/connections.json");

    let connections = readJSON(file);

    connections.push(req.body);

    writeJSON(file, connections);

    res.send("Connection request received!");

});


/* =============================
   TICKET PURCHASE
============================= */

app.post("/tickets", (req,res)=>{

    const file = path.join(__dirname, "../database/tickets.json");

    let tickets = readJSON(file);

    tickets.push(req.body);

    writeJSON(file, tickets);

    res.send("Ticket booked successfully!");

});


/* =============================
   START SERVER
============================= */

app.listen(PORT, ()=>{

    console.log("VizagJamHub server running on port " + PORT);

});