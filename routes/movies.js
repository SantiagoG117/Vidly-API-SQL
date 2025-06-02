//? Build the Router
const express = require("express");
const router = express.Router();

//? Import the Movies Model
const moviesModel = require("../SQL/moviesModel");
const genresModel = require("../SQL/genresModel");

//? Import third party libraries and middleware
const lodash = require("lodash");
const authorization = require("../middleware/authorization");
const isAdmin = require("../middleware/adminAuthorization");
const asyncMiddleware = require("../middleware/async");

//? Add routes:
//GET
router.get(
  "/",
  authorization,
  asyncMiddleware(async (req, res) => {
    const movies = await moviesModel.getAllMovies();
    res.send(movies);
  })
);

//GET one
router.get(
  "/:id",
  authorization,
  asyncMiddleware(async (req, res) => {
    const movie = await moviesModel.getMovieByBarcode(req.params.id);
    if (movie.length === 0)
      return res.status(404).send("There is no movie under the provided id");

    res.send(movie);
  })
);

//POST
router.post(
  "/",
  [authorization, isAdmin],
  asyncMiddleware(async (req, res) => {
    //Validate the object sent by the client
    const { error } = moviesModel.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Ensure that the movie does not already exist
    const movieExist = await searchMovie(req);
    if (movieExist)
      return res.status(400).send("Movie already exists on our servers");

    const [movie] = await moviesModel.createMovie(
      req.body.genreId,
      req.body.barcode,
      req.body.title,
      req.body.dailyRentalRate,
      req.body.numberInStock
    );
    if (!movie) return res.status(500).send("Failed to save the movie");

    res
      .status(201)
      .send(
        lodash.pick(movie, ["title", "daily_rental_rate", "number_in_stock"])
      );
  })
);

//PUT
router.put(
  "/:barcode",
  [authorization, isAdmin],
  asyncMiddleware(async (req, res) => {
    //Validate the object
    const { error } = moviesModel.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Verify that the movie exist and the id is valid
    const [movie] = await moviesModel.getMovieByBarcode(req.params.barcode);
    // Get the genre id
    const [genre] = await genresModel.getGenre(req.body.genre);

    console.log(genre);
    if (!movie || !genre)
      return res
        .status(404)
        .send("The provided movie or genre does not exists in our servers");

    //Update the movie
    const [result] = await moviesModel.updateMovie(
      movie.movie_id,
      genre.genre_id,
      req.body.barcode,
      req.body.title,
      req.body.dailyRentalRate,
      req.body.numberInStock
    );

    res.send(
      lodash.pick(result, ["title", "daily_rental_rate", "number_in_stock"])
    );
  })
);

// DELETE
router.delete(
  "/:barcode",
  [authorization, isAdmin],
  asyncMiddleware(async (req, res) => {
    //Verify the movie exists
    let [movie] = await moviesModel.getMovieByBarcode(req.params.barcode);

    if (!movie)
      return res.status(404).send("There is no movie under the provided id");

    //Delete the movie
    [movie] = await moviesModel.deleteMovie(movie.movie_id);
    res.send(movie);
  })
);

async function searchMovie(req) {
  const movies = await moviesModel.getAllMovies();
  const movieExist = movies.find((movie) => movie.title === req.body.title);
  return movieExist;
}

module.exports = router;
