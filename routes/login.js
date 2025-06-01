//? Build a router
const express = require("express");
const router = express.Router();

//? Import model
const Users = require("../SQL/usersModel");

//? Third party libraries
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  //Validate the body of the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  /* 
    When authenticating a user (login a user) we must validate their email and password
    The user sends the password in plain text, we must hash the password, add the salt and
    compare the result with the password stored in the database. bcrypt will compare both
    passwords
  */

  const user = await Users.getUser(req.body.email);
  if (!user)
    return res.status(400).send("Combination of email and passowrd is invalid");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Combination of email and passowrd is invalid");

  //Return a JSON Web token for the loged in user
  const token = await Users.generateAuthToken(user.email);
  res.header("x-auth-token", token).send();
});

//? Client side validation
function validate(request) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(request);
}

module.exports = router;
