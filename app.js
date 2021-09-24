"use strict";

// Environment variable imports
const dbURL = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const secret = process.env.SECRET || "thisshouldbeabettersecret";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// Local machine imports
const path = require("path");
// Express imports
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError");
// Database imports
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");
const User = require("./models/user");
// Page rendering imports
const campgroundRoutes = require("./routes/campgroundRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
// Session imports
const passport = require("passport");
const LocalStrategy = require("passport-local");
// Security imports
const helmet = require("helmet");
const CSP = require("./security/contentSecurityPolicy");

const app = express();

// Express setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Database setup
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Mongo database connected.");
  })
  .catch((err) => {
    console.log("Mongo connection error:");
    console.log(err);
  });

// Mongo injection sanitizer
app.use(mongoSanitize());

// Mongo store for session
const store = MongoStore.create({
  mongoUrl: dbURL,
  secret,
  touchAfter: 24 * 3600, // seconds
});

store.on("error", function (e) {
  console.log("Session store error:", e);
});

// Session setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const sessionConfig = {
  store,
  name: "Session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // Enable for real production app
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// Page rendering setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
// Flash messages middleware setup
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Security setup
app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet.contentSecurityPolicy(CSP));

// Route controllers
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//General routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Default error handling page
app.use((err, req, res, next) => {
  if (!err.message) {
    err.message = "Something went wrong!";
  }
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).render("error.ejs", { err });
});
// TODO: Add 404 page

// Express listener
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
