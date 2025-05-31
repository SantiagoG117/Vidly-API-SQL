//? Build the server
const express = require("express");
const router = express.Router();

//? Import customers model
const Customers = require("../SQL/customersModel");

//? Third party libraries and middleware
const lodash = require("lodash");
const authorization = require("../middleware/authorization");
const isAdmin = require("../middleware/adminAuthorization");
const asyncMiddleware = require("../middleware/async");

//? Routes

//GET
router.get(
  "/",
  authorization,
  asyncMiddleware(async (req, res) => {
    const customers = await Customers.getAllCustomers();
    res.send(customers);
  })
);

//POST
router.post(
  "/",
  authorization,
  asyncMiddleware(async (req, res) => {
    //Validate the body of the request
    const { error } = Customers.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Verify that the customer does not exist already
    const customerExist = await searchCustomer(req);

    if (customerExist)
      return res
        .status(400)
        .send("There is already a customer under the provided phone number");

    //Save the customer
    const result = await Customers.createCustomer(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.phone,
      req.body.points
    );

    //Return the customer
    res.send(result);
  })
);

//PUT
router.put(
  "/:id",
  authorization,
  asyncMiddleware(async (req, res) => {
    // Validate the client's input
    const { error } = Customers.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Verify that the customer exist and the id is valid
    const [validId] = await Customers.getCustomer(req.params.id);
    const customer = await searchCustomer(req);

    if (!customer || !validId)
      return res
        .status(404)
        .send("There is no customer under the provided phone number or Id");

    // Update the customer
    const result = await Customers.updateCustomer(
      req.params.id,
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.phone,
      req.body.points
    );

    res.send(
      lodash.pick(result, [
        "first_name",
        "last_name",
        "email",
        "phone",
        "points",
      ])
    );
  })
);

//DELETE
router.delete(
  "/:id",
  [authorization, isAdmin],
  asyncMiddleware(async (req, res) => {
    const customerExist = await Customers.getCustomer(req.params.id);
    if (customerExist.length === 0)
      return res.status(404).send("There is no customer under the provided id");

    const result = await Customers.deleteCustomer(req.params.id);

    res.send(result);
  })
);

async function searchCustomer(req) {
  const customers = await Customers.getAllCustomers();
  const customerExist = customers.find(
    (customer) => customer.phone === req.body.phone
  );
  return customerExist;
}

module.exports = router;
