//? Import the database connection
const connection = require("./dbconnection");

//? External libraries
const Joi = require("joi");

class Customers {
  async getAllCustomers() {
    try {
      const [result] = await connection.query(`SELECT* FROM customers`);
      return result;
    } catch (ex) {
      throw ex;
    }
  }

  async getCustomer(phoneNumber) {
    try {
      const [result] = await connection.query(
        `SELECT* FROM customers where phone =  ?`,
        [phoneNumber]
      );
      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  async createCustomer(firstName, lastName, email, phone, points = 0) {
    try {
      const [[result]] = await connection.query(
        `CALL create_customer(?,?,?,?,?)`,
        [firstName, lastName, email, phone, points]
      );
      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  async updateCustomer(userId, firstName, lastName, email, phone, points) {
    try {
      const [[result]] = await connection.query(
        `CALL update_customer(?,?,?,?,?,?)`,
        [userId, firstName, lastName, email, phone, points]
      );

      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  async deleteCustomer(id) {
    try {
      const [[result]] = await connection.query(`CALL delete_customer(?)`, [
        id,
      ]);
      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  validate(customer) {
    const schema = Joi.object({
      firstName: Joi.string().min(0).max(50).required(),
      lastName: Joi.string().min(0).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      phone: Joi.string().min(10).max(50).required(),
      points: Joi.number().min(0),
    });
    return schema.validate(customer);
  }
}

module.exports = new Customers();
