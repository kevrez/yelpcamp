"use strict";

const express = require("express");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.redirect("/campgrounds");
  // res.render("home.ejs");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  if (!err.message) {
    err.message = "Something went wrong!";
  }
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).render("error.ejs", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
