//? Build the router
const express = require("express");
const router = express.Router();

//? Get the model
const Users = require("../SQL/usersModel");

//? Third party libraries
const lodash = require("lodash");
const bcrypt = require("bcrypt");

//? Routes
router.post("/", async (req, res) => {
  const { error } = Users.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Verify that the user does not already exist
  let user = await Users.getUser(req.body.email);
  if (user)
    return res
      .status(400)
      .send("There is already an user under the provided email");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = await Users.registerUser(
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    hashedPassword,
    req.body.isAdmin
  );

  //Generate JSON Web token:
  const token = await Users.generateAuthToken(user.email);

  /* 
    TODO
    When the user registers, log them into the application automatically.
    Return the JSON Web Token as a header so the client can store it and
    user it in the future
  */

  res
    .header("x-auth-token", token)
    .send(lodash.pick(user, ["first_name", "last_name", "email"]));
});

module.exports = router;
