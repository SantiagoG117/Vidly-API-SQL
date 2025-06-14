//? Build the server
const express = require("express");
const app = express();

//? Export external libraries
require("dotenv").config();
const cors = require("cors");

//? Import routers
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const logins = require("./routes/login");
const error = require("./middleware/errorHandler");

//? Register middleware functions and routers
// Add required CORS headers in the response. Must be declared first
app.use(
  cors({ origin: "http://127.0.0.1:5500", exposedHeaders: ["x-auth-token"] })
);
app.use(express.json()); //Takes requests and parse their body into a JSON object
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/login", logins);
// Serve HTML and JS files
app.use(express.static("public"));

//Error middleware: Must be declared at the end so route handlers can pass control to it in case of errors
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
