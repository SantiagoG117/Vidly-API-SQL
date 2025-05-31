//? Get the connection to the Database
const connection = require("./dbconnection");

//? External libraries
const Joi = require("joi");

class Rentals {
  async getAllRentals() {
    try {
      const [result] = await connection.query("SELECT* FROM rentals");
      return result;
    } catch (ex) {
      throw ex;
    }
  }

  async getActiveRentals(customerId, movieId) {
    try {
      const [result] = await connection.query(
        `SELECT* 
         FROM rentals 
         WHERE customer_id = ${customerId} AND movie_id = ${movieId} AND is_returned IS NOT NULL;`
      );
      return result;
    } catch (ex) {
      throw ex;
    }
  }

  async createRental(customerId, movieId, movieBarcode) {
    try {
      const [[result]] = await connection.query(
        "CALL create_movie_rental(?,?,?)",
        [customerId, movieId, movieBarcode]
      );
      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  async createReturn(customerId, movieId) {
    try {
      const [[result]] = await connection.query(
        "CALL create_movie_return(?,?)",
        [customerId, movieId]
      );
      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  validate(rental) {
    const schema = Joi.object({
      customerId: Joi.number().min(1).required(),
      barcode: Joi.string().min(10).max(10).required(),
    });
    return schema.validate(rental);
  }
}

module.exports = new Rentals();
