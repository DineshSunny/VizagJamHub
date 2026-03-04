const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));


/* Utility function to read JSON safely */

function readJSON(file){

if(fs.existsSync(file)){
return JSON.parse(fs.readFileSync(file));
}

return [];

}


/* Utility function to write JSON */

function writeJSON(file,data){

fs.writeFileSync(file, JSON.stringify(data,null,2));

}


/* BOOKING FORM */

app.post("/book", (req,res)=>{

const bookings = readJSON("bookings.json");

bookings.push(req.body);

writeJSON("bookings.json", bookings);

res.send("Booking request received!");

});


/* BAND CONNECT */

app.post("/connect",(req,res)=>{

const connections = readJSON("connections.json");

connections.push(req.body);

writeJSON("connections.json",connections);

res.send("Connection request received!");

});


/* TICKET BOOKING */

app.post("/tickets",(req,res)=>{

const tickets = readJSON("tickets.json");

tickets.push(req.body);

writeJSON("tickets.json",tickets);

res.send("Ticket booking successful!");

});


/* START SERVER */

app.listen(3000,()=>{

console.log("VizagJamHub server running on port 3000");

});