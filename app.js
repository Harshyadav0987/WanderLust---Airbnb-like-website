if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const passport = require("passport");
const LocalStrategy = require("passport-local");


const ExpressError = require("./utils/ExpressError.js");
const Wrapasync = require("./utils/Wrapasync.js");

// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const signupRouter = require("./routes/user.js");


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

const store =MongoStore.create({
  mongoUrl : dbUrl,
  crypto:{
      secret : process.env.SECRET,
  },
  touchAfter : 24*3600,
});

store.on("error",()=>{
  console.log("Error in mongo session store ",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make flash + current user available in all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.send("Everything is working fine");
});

app.get(
  "/demouser",
  Wrapasync(async (req, res) => {
    const fakeUser = new User({
      email: "Harshy9893@gmail.com",
      username: "Yadav",
    });
    const registeredUser = await User.register(fakeUser, "Harshlovescoding");
    res.send(registeredUser);
  })
);

app.get("/reqcount", (req, res) => {
  req.session.count = (req.session.count || 0) + 1;
  res.send(`You opened the website ${req.session.count} times`);
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", signupRouter);

// // 404
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });

// // error handler
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Some problem occurred" } = err;
//   res.status(statusCode).send(message);
//   // or: res.status(statusCode).render("error", { err });
// });

app.listen(8080, () => {
  console.log("Server is live on port 8080");
});
