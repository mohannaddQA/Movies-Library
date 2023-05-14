"use strict";
require("dotenv").config();
/////////////////////////////////////////////////////
const ApiKey = process.env.API_KEY;
/////////////////////////////////////////////////////
const express = require("express");
const app = express();
//////////////////////////////////////////////////////
const cors = require("cors");
const axios = require("axios");

/////////////////////////////////////////////////////
const movieData = require("./MovieData/data.json");
const port = 3002;
app.use(cors());
////////////////////////////////////////////////
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.json());
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
////////////////////////////////////////////////////////genres page
function Genres(name) {
  this.name = name;
}
async function genresPage(request, response) {
  const genresApiURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${ApiKey}`;
  const movieData = await axios.get(genresApiURL);
  let genres = movieData.data.genres.map((item) => {
    return new Genres(item.name);
  });
  response.send(genres);
}

app.get("/genres", genresPage);
////////////////////////////////////////////////////////providers

function Providers(id, name, logo) {
  this.provider_id = id;
  this.provider_name = name;
  this.logo_path = logo;
}
async function regionalProviders(request, response) {
  const providersApiURL = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${ApiKey}`;
  const movieData = await axios.get(providersApiURL);
  let providers = movieData.data.results.map((item) => {
    return new Providers(item.provider_id, item.provider_name, item.logo_path);
  });
  response.send(providers);
}

app.get("/providers", regionalProviders);

/////////////////////////////////////////////////////// db handlers

/////// get movies
app.get("/getMovies", getMoviesHandler);

function getMoviesHandler(req, res) {
  const sql = `select * from movies_table;`; // i inserted only two random movie just for testing purpose .
  client.query(sql).then((data) => {
    res.status(200).send(data.rows);
  });
}

/////// add movies
app.post("/addMovies", addMovieHandler);

function addMovieHandler(req, res) {
  const newMovie = req.body;
  const sql = `INSERT into movies_table (id,title, poster, summary , rate , comments) values ($1,$2,$3,$4,$5,$6);`;
  const values = [
    newMovie.id,
    newMovie.title,
    newMovie.poster,
    newMovie.summary,
    newMovie.rate,
    newMovie.comments,
  ];

  client.query(sql, values).then(() => {
    res.send(" movie is added.");
  });
}
///////////////////// delete movie
function deleteMovieHandler(req, res) {
  const id = req.params.id;

  const sql = `DELETE FROM movies_table WHERE id=${id};`;
  client.query(sql).then((data) => {
    res.send(`movie deleted`);
  });
}

app.delete("/deleteMovie/:id", deleteMovieHandler);
//////////////////////update movie
function updateMovieHandler(req, res) {
  const id = req.params.id;
  const sql = `UPDATE movies_table SET id = $1 , title = $2 , poster = $3 , rate=$4 , comments=$5 WHERE id = ${id};`;
  // const { id, title, poster , rate , comments} = req.body; //deconstructing
  const values = [
    req.body.id,
    req.body.title,
    req.body.poster,
    req.body.rate,
    req.body.comments,
  ];
  client.query(sql, values).then((data) => {
    res.send(`movie updated`);
  });
}

app.put("/updateMovie/:id", updateMovieHandler);
//////////////////////////////////// get Specific movie
function getMovieByIdHandler(req, res) {
  const id = req.params.id;
  // we also can take it from query
  const sql = `SELECT * FROM movies_table WHERE id = ${id}`;
  client.query(sql).then((data) => {
    res.send(data.rows);
  });
}
app.get("/getMovie/:id", getMovieByIdHandler);
////////////////////////////////////////////////////////error handlers
app.use("*", (req, res) => {
  let errorMassage = `error status : 404    responseText:Sorry, Page not found`;
  res.status(404).send(errorMassage);
});
app.use("/error", (req, res) => {
  let errorMassage = `error status : 500    responseText": "Sorry, somthing went wrong`;
  res.status(500).send(errorMassage);
});
///////////////////////////////////
client.connect().then(() => {
  app.listen(port);
});
