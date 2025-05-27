//? Build the server
const express = require("express");
const app = express();

//? Export extrnal libraries
require("dotenv").config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
