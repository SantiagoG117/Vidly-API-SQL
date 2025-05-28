//? Build the Router
const express = require("express");
const router = express.Router();

//? Import the Movies Model
const moviesModel = require("../SQL/moviesModel");

//? Import third party libraries
const lodash = require("lodash");

//? Add routes:

//GET
router.get("/", async (req, res) => {
  const movies = await moviesModel.getAllMovies();
  res.send(movies);
});

//GET one
router.get("/:id", async (req, res) => {
  const movie = await moviesModel.getMovie(req.params.id);
  if (movie.length === 0)
    return res.status(404).send("There is no movie under the provided id");

  res.send(movie);
});

//POST
router.post("/", async (req, res) => {
  //Validate the object send by the client
  const { error } = moviesModel.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Ensure that the movie does not already exist
  const movies = await moviesModel.getAllMovies();
  const result = movies.find((movie) => movie.title === req.body.title);
  console.log(result);
  if (result)
    return res.status(400).send("Movie already exists on our servers");

  const [movie] = await moviesModel.createMovie(
    req.body.genreId,
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
});

//PUT
router.put("/:id", async (req, res) => {
  //Validate the object
  const { error } = moviesModel.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Update the
  const [result] = await moviesModel.updateMovie(
    req.params.id,
    req.body.genreId,
    req.body.title,
    req.body.dailyRentalRate,
    req.body.numberInStock
  );

  res.send(
    lodash.pick(result, ["title", "daily_rental_rate", "number_in_stock"])
  );
});

// DELETE
router.delete("/:id", async (req, res) => {
  //Verify the movie exists
  let [result] = await moviesModel.getMovie(req.params.id);

  if (!result)
    return res.status(404).send("There is no movie under the provided id");

  //Delete the movie
  [result] = await moviesModel.deleteMovie(req.params.id);
  res.send(result);
});

module.exports = router;
