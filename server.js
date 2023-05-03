"use strict";
require("dotenv").config();
/////////////////////////////////////////////////////
const ApiKey = process.env.API_KEY;
/////////////////////////////////////////////////////
const express = require("express");
const cors = require("cors");
const app = express();
const movieData = require("./MovieData/data.json");
const axios = require("axios");
const port = 3001;
app.listen(port);
app.use(cors());
/////////////////////////////////////////////////home page
function myMovie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overiew = overview;
}
function HomePage(request, response) {
  const movie = new myMovie(
    movieData.title,
    movieData.poster_path,
    movieData.overview
  );
  response.json(movie);
}

app.get("/", HomePage);

/////////////////////////////////////////////////////// fav page
function fav_page(request, response) {
  response.send(`welcome to favorate page`);
}
app.get("/favorite", fav_page);
/////////////////////////////////////////////////////// trending page
const trendingApiURL = `https://api.themoviedb.org/3/trending/all/week?api_key=${ApiKey}`;
function trendingMovie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overiew = overview;
}

async function trendingPage(request, response) {
  const movieData = await axios.get(trendingApiURL);
  let trendingMovies = movieData.data.results.map((item) => {
    return new trendingMovie(
      item.id,
      item.title,
      item.release_date,
      item.poster_path,
      item.overview
    );
  });
  response.json(trendingMovies);
}
app.get("/trending", trendingPage);

//////////////////////////////////////////////////////// search page

async function searchPage(request, response) {
  let searchInput = request.query.name;
  const searchApiURL = `https://api.themoviedb.org/3/search/movie?api_key=${ApiKey}&query=${searchInput}`;
  const movieData = await axios.get(searchApiURL);
  response.send(movieData.data);
}
// searchInput
app.get("/search", searchPage);
////////////////////////////////////////////////////////error handlers
app.use("*", (req, res) => {
  let errorMassage = `error status : 404    responseText:Sorry, Page not found`;
  res.status(404).send(errorMassage);
});
app.use("/error", (req, res) => {
  let errorMassage = `error status : 500    responseText": "Sorry, somthing went wrong`;
  res.status(500).send(errorMassage);
});
///////////////////////////////////////////////////////
