//? Build the server
const express = require("express");
const app = express();

/* 
    TODO:
    ! Build models (using classes) for CRUD operations for each entity. Add todo to create validation function 
    ! Export the respective models and create the routes. Test routes with postman 
    ! Add authentication and authorization 
    ! Add error handling middleware
    ! Build front end

*/

//? Export extrnal libraries
require("dotenv").config();

//? Import routers
const genres = require("./routes/genres");

//? Register middleware functions and routers
app.use(express.json()); //Takes requests and parse their body into a JSON object
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
