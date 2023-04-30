"use strict";
const express = require("express");
const cors = require("cors");
const app = express();
const movieData = require("./MovieData/data.json");
const port = 3001;
app.listen(port);
app.use(cors());
/////////////////////////////////////////////////////
let dataArr = [];
function myMovie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overiew = overview;
  dataArr.push(this);
}

function HomePage(request, response) {
  const movie = new myMovie(
    movieData.title,
    movieData.poster_path,
    movieData.overview
  );

  response.send(dataArr);
}
app.get("/", HomePage);
///////////////////////////////////////////////////////
function fav_page(request, response) {
  response.send(`welcome to favorate page`);
}
app.get("/favorite", fav_page);
///////////////////////////////////////////////////////
app.use("*", (req, res) => {
  let errorMassage = `error status : 404    responseText:Sorry, Page not found`;
  res.status(404).send(errorMassage);
});
app.use("/error", (req, res) => {
  let errorMassage = `error status : 500    responseText": "Sorry, somthing went wrong`;
  res.status(500).send(errorMassage);
});
///////////////////////////////////////////////////////
