//? Build the router
const express = require("express");
const router = express.Router();

//? Export the Genres model
const genresModel = require("../SQL/genresModel");

/* 
    TODO: Add middleware error handling
*/

//? Routes
//GET
router.get("/", async (req, res) => {
  const genres = await genresModel.getGenres();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await genresModel.getGenre(req.params.id);
  console.log(genre);
  if (genre.length === 0)
    return res.status(400).send("There is no genre under the provided id");

  res.send(genre);
});

module.exports = router;
