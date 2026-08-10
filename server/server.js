const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

/* =================================
   NEW — PAYMENT SYSTEM
================================= */

require("dotenv").config();

const Razorpay = require("razorpay");
const crypto = require("crypto");


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
    return JSON.parse(fs.readFileSync(file, "utf-8"));
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
   LYRICS SYSTEM
================================= */


// Telugu
app.get("/api/telugusongs", (req, res) => {
  const file = path.resolve(__dirname, "../database/telugusongs.json");
  let songs = readJSON(file);
  res.json(songs);
});


// English
app.get("/api/englishsongs", (req, res) => {
  const file = path.resolve(__dirname, "../database/englishsongs.json");
  let songs = readJSON(file);
  res.json(songs);
});


// Hindi
app.get("/api/hindisongs", (req, res) => {
  const file = path.resolve(__dirname, "../database/hindisongs.json");
  let songs = readJSON(file);
  res.json(songs);
});






/* =================================
   CHORDS SYSTEM
================================= */


// Telugu Chords
app.get("/api/teluguchords", (req, res) => {


  const file =
    path.resolve(
      __dirname,
      "../database/teluguchords.json"
    );


  let songs = readJSON(file);


  res.json(songs);


});


// English Chords
app.get("/api/englishchords", (req, res) => {


  const file =
    path.resolve(
      __dirname,
      "../database/englishchords.json"
    );


  let songs = readJSON(file);


  res.json(songs);


});


// Hindi Chords
app.get("/api/hindichords", (req, res) => {


  const file =
    path.resolve(
      __dirname,
      "../database/hindichords.json"
    );


  let songs = readJSON(file);


  res.json(songs);


});



// Other Song Chords
app.get("/api/othersongchords", (req, res) => {


  const file =
    path.resolve(
      __dirname,
      "../database/othersongchords.json"
    );


  let songs = readJSON(file);


  res.json(songs);


});


// Instrumental Song Chords
app.get("/api/instrumentalsongchords", (req, res) => {


  const file =
    path.resolve(
      __dirname,
      "../database/instrumentalsongchords.json"
    );


  let songs = readJSON(file);


  res.json(songs);


});


/* =================================
   MUSIC ACADEMY PAYMENT SYSTEM
================================= */


/* =================================
   RAZORPAY CONFIGURATION
================================= */


const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET

});


/*
   Course prices are controlled by
   the server.

   Never trust a price sent directly
   from the browser.
*/


const COURSE_PRICES = {

  "Beginner Drums": 2000,

  "Intermediate Drums": 5000,

  "Advanced Drums": 7000

};


/* =================================
   CREATE PAYMENT ORDER
================================= */


app.post("/api/payment/create-order", async (req, res) => {


  try {


    const {

      course,
      level,
      format,
      time,
      batch

    } = req.body;


    /* Validate enrollment information */


    if (
      !course ||
      !level ||
      !format ||
      !time ||
      !batch
    ) {


      return res.status(400).json({

        success: false,

        message:
          "Incomplete enrollment information."

      });


    }


    /* Get trusted course price */


    const coursePrice =
      COURSE_PRICES[course];


    if (!coursePrice) {


      return res.status(400).json({

        success: false,

        message:
          "Invalid course selected."

      });


    }


    /*
       Razorpay requires the amount
       in paise.

       ₹2,000 = 200000 paise
    */


    const amountInPaise =
      coursePrice * 100;


    /* Generate receipt */


    const receipt =
      "VJH_" + Date.now();


    /* Create Razorpay order */


    const order =
      await razorpay.orders.create({


        amount:
          amountInPaise,


        currency:
          "INR",


        receipt:
          receipt,


        notes: {


          academy:
            "Vizag JamHub Music Academy",


          course:
            course,


          level:
            level,


          format:
            format,


          time:
            time,


          batch:
            batch


        }


      });


    /* Return order to frontend */


    res.json({


      success:
        true,


      key:
        process.env.RAZORPAY_KEY_ID,


      order: {


        id:
          order.id,


        amount:
          order.amount,


        currency:
          order.currency,


        receipt:
          order.receipt


      }


    });


  }


  catch (error) {


    console.error(
      "Create Razorpay order error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Unable to create payment order."

    });


  }


});


/* =================================
   VERIFY PAYMENT
================================= */


app.post("/api/payment/verify", async (req, res) => {


  try {


    const {

      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      enrollment

    } = req.body;


    /* Validate payment response */


    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {


      return res.status(400).json({

        success: false,

        verified: false,

        message:
          "Missing payment verification information."

      });


    }


    /* Create expected Razorpay signature */


    const signatureBody =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;


    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(signatureBody)
        .digest("hex");


    /* Secure signature comparison */


    const receivedBuffer =
      Buffer.from(
        razorpay_signature,
        "utf8"
      );


    const expectedBuffer =
      Buffer.from(
        expectedSignature,
        "utf8"
      );


    let signatureValid = false;


    if (
      receivedBuffer.length ===
      expectedBuffer.length
    ) {


      signatureValid =
        crypto.timingSafeEqual(
          receivedBuffer,
          expectedBuffer
        );


    }


    if (!signatureValid) {


      return res.status(400).json({

        success: false,

        verified: false,

        message:
          "Payment verification failed."

      });


    }


    /* =================================
       VERIFY COURSE AGAIN
    ================================= */


    const courseName =
      enrollment?.course?.course;


    const trustedCoursePrice =
      COURSE_PRICES[courseName];


    if (!trustedCoursePrice) {


      return res.status(400).json({

        success: false,

        verified: false,

        message:
          "Invalid enrollment course."

      });


    }


    /* =================================
       GENERATE STUDENT ID
    ================================= */


    const year =
      new Date().getFullYear();


    const randomNumber =
      crypto.randomInt(
        100000,
        999999
      );


    const studentId =
      `VJH-${year}-${randomNumber}`;


    /* =================================
       BUILD VERIFIED ENROLLMENT
    ================================= */


    const totalClasses =
      Number(
        enrollment?.course?.totalClasses
      ) || 24;


    const verifiedEnrollment = {


      ...enrollment,


      studentId:
        studentId,


      enrollmentStatus:
        "active",


      payment: {


        ...(enrollment?.payment || {}),


        amount:
          trustedCoursePrice,


        currency:
          "INR",


        paymentId:
          razorpay_payment_id,


        orderId:
          razorpay_order_id,


        status:
          "paid",


        verified:
          true,


        verifiedAt:
          new Date().toISOString()


      },


      attendance: {


        totalClasses:
          totalClasses,


        completedClasses:
          0,


        remainingClasses:
          totalClasses,


        attendedClasses:
          0,


        missedClasses:
          0


      },


      enrollmentActivatedAt:
        new Date().toISOString()


    };


    /* =================================
       SAVE ENROLLMENT
    ================================= */


    const file =
      path.join(
        __dirname,
        "../database/enrollments.json"
      );


    let enrollments =
      readJSON(file);


    /*
       Prevent the same Razorpay payment
       from creating duplicate enrollment
       records.
    */


    const existingEnrollment =
      enrollments.find(
        item =>
          item?.payment?.paymentId ===
          razorpay_payment_id
      );


    if (existingEnrollment) {


      return res.json({

        success: true,

        verified: true,

        message:
          "Payment was already verified.",

        enrollment:
          existingEnrollment

      });


    }


    enrollments.push(
      verifiedEnrollment
    );


    writeJSON(
      file,
      enrollments
    );


    console.log(
      "Music Academy enrollment activated:",
      studentId
    );


    /* =================================
       RETURN SUCCESS
    ================================= */


    res.json({


      success:
        true,


      verified:
        true,


      message:
        "Payment verified and enrollment activated.",


      enrollment:
        verifiedEnrollment


    });


  }


  catch (error) {


    console.error(
      "Payment verification error:",
      error
    );


    res.status(500).json({

      success: false,

      verified: false,

      message:
        "Unable to verify payment."

    });


  }


});


/* =================================
   GET ENROLLMENT BY STUDENT ID
================================= */


app.get("/api/enrollments/:studentId", (req, res) => {


  try {


    const file =
      path.join(
        __dirname,
        "../database/enrollments.json"
      );


    const enrollments =
      readJSON(file);


    const enrollment =
      enrollments.find(
        item =>
          item.studentId ===
          req.params.studentId
      );


    if (!enrollment) {


      return res.status(404).json({

        success: false,

        message:
          "Enrollment not found."

      });


    }


    res.json({

      success: true,

      enrollment:
        enrollment

    });


  }


  catch (error) {


    console.error(
      "Enrollment lookup error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Unable to retrieve enrollment."

    });


  }


});


/* =================================
   START SERVER
================================= */


app.listen(PORT, () => {
  console.log("VizagJamHub server running on port " + PORT);
});