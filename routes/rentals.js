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
    /* 
      TODO: Possible, instead of receiving the customer id, receive their
      !phone number and find customer by phone number
    */

    // Validate the object
    const { error } = Rentals.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Validate customerID and movie ID
    const customer = await Customers.getCustomer(req.body.phoneNumber);
    const [movie] = await Movies.getMovieByBarcode(req.body.barcode);
    if (!customer || !movie) return res.status(404).send("Invalid request");

    // Validate the number in stock of the movie
    const numberInStock = movie.number_in_stock;
    if (numberInStock === 0)
      return res.status(400).send("Movie is not in stock");

    //Create the rental
    const rental = await Rentals.createRental(
      customer.customer_id,
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
    //Validate the customer and movie
    const customer = await Customers.getCustomer(req.body.phoneNumber);
    const [movie] = await Movies.getMovieByBarcode(req.body.barcode);
    if (!customer || !movie) return res.status(404).send("Invalid request");

    //Verify that the movie has not already been returned
    let [activeRentals] = await Rentals.getActiveRentals(
      customer.customer_id,
      movie.movie_id
    );
    if (!activeRentals) return res.status(404).send(`Customer has no active rentals`);

    //Update the rental
    activeRentals = await Rentals.createReturn(customer.customer_id, movie.movie_id);
    res.send(activeRentals);
  })
);

module.exports = router;
