//? Build the router
const express = require("express");
const router = express.Router();

//? Load the models
const Rentals = require("../SQL/rentalsModel");
const Movies = require("../SQL/moviesModel");
const Customers = require("../SQL/customersModel");

//? Middlewares
const authorization = require("../middleware/authorization");
const asyncMiddleware = require("../middleware/async");

//? Routes
//GET
router.get(
  "/",
  authorization,
  asyncMiddleware(async (req, res) => {
    const rentals = await Rentals.getAllRentals();
    res.send(rentals);
  })
);

//POST
router.post(
  "/",
  authorization,
  asyncMiddleware(async (req, res) => {
    // Validate the object
    const { error } = Rentals.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Validate customerID and movie ID
    const customer = await Customers.getCustomer(req.body.customerId);
    const [movie] = await Movies.getMovieByBarcode(req.body.barcode);
    if (!customer || !movie) return res.status(404).send("Invalid request");

    // Validate the number in stock of the movie
    const numberInStock = movie.number_in_stock;
    if (numberInStock === 0)
      return res.status(400).send("Movie is not in stock");

    //Create the rental
    const rental = await Rentals.createRental(
      req.body.customerId,
      movie.movie_id,
      req.body.barcode
    );
    res.send(rental);
  })
);

//PUT
router.put(
  "/",
  authorization,
  asyncMiddleware(async (req, res) => {
    // TODO Build logic for lost movies

    //Validate the customerID and movieID
    const customer = await Customers.getCustomer(req.body.customerId);
    const [movie] = await Movies.getMovieByBarcode(req.body.barcode);
    if (!customer || !movie) return res.status(404).send("Invalid request");

    //Verify that the movie has not already been returned
    let [rental] = await Rentals.getActiveRentals(
      req.body.customerId,
      movie.movie_id
    );
    if (rental) return res.send(`Movie has already been returned`);

    //Update the rental
    rental = await Rentals.createReturn(req.body.customerId, movie.movie_id);
    res.send(rental);
  })
);

module.exports = router;
