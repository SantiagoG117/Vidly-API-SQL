//? Build the Router
const express = require("express");
const router = express.Router();

//? Import the Movies Model
const moviesModel = require("../SQL/moviesModel");

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
    const movie = await moviesModel.getMovieById(req.params.id);
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
  "/:id",
  [authorization, isAdmin],
  asyncMiddleware(async (req, res) => {
    //Validate the object
    const { error } = moviesModel.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Verify that the movie exist and the id is valid
    const [validID] = await moviesModel.getMovieById(req.params.id);

    if (!validID)
      return res
        .status(404)
        .send("The provided movie id does not exists in our servers");

    //Update the movie
    const [result] = await moviesModel.updateMovie(
      req.params.id,
      req.body.genreId,
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
  "/:id",
  [authorization, isAdmin],
  asyncMiddleware(async (req, res) => {
    //Verify the movie exists
    let [result] = await moviesModel.getMovieById(req.params.id);

    if (!result)
      return res.status(404).send("There is no movie under the provided id");

    //Delete the movie
    [result] = await moviesModel.deleteMovie(req.params.id);
    res.send(result);
  })
);

async function searchMovie(req) {
  const movies = await moviesModel.getAllMovies();
  const movieExist = movies.find((movie) => movie.title === req.body.title);
  return movieExist;
}

module.exports = router;
