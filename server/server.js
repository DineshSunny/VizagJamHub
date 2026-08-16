const express = require("express");
const cors = require("cors");
const path = require("path");


/* =================================
   ENVIRONMENT
================================= */

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

/* =================================
   APP CONFIGURATION
================================= */

const app = express();
const port = 3000;


/* =================================
   MIDDLEWARE
================================= */

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


/* =================================
   BACKEND ROUTES
================================= */

const lyricsRoutes =
  require("./routes/lyrics");

const chordsRoutes =
  require("./routes/chords");

const showsRoutes =
  require("./routes/shows");

const paymentRoutes =
  require("./routes/academy/payment");

const {
  router: enrollmentRoutes
} = require("./routes/academy/enrollment");

const bandconnectRoutes =
  require("./routes/bandconnect");


const bookingsRoutes =
  require("./routes/bookings");


const ticketsRoutes =
  require("./routes/tickets");


app.use(lyricsRoutes);
app.use(chordsRoutes);
app.use(showsRoutes);
app.use(paymentRoutes);
app.use(enrollmentRoutes);
app.use(bandconnectRoutes);
app.use(bookingsRoutes);
app.use(ticketsRoutes);



/* =================================
   FRONTEND
================================= */

app.use(
  express.static(
    path.join(__dirname, "../public")
  )
);


/* =================================
   HOME PAGE
================================= */

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "../public/pages/index/index.html"
    )
  );

});


/* =================================
   START SERVER
================================= */

app.listen(port, () => {

  console.log(
    "vizag jamhub server running on port " + port
  );

});

