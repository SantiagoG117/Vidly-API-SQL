//? Build the server
const express = require("express");
const app = express();

/* 
    TODO:
    ! Add authentication and authorization 
    ! Add error handling middleware
    ! Build front end
*/

//? Export extrnal libraries
require("dotenv").config();

//? Import routers
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const logins = require("./routes/login");

//? Register middleware functions and routers
app.use(express.json()); //Takes requests and parse their body into a JSON object
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/login", logins);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
