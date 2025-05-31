//? Get the connection
const connection = require("../SQL/dbconnection");

//? Third party libraries
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class Users {
  async getAllUsers() {
    try {
      const [result] = await connection.query("SELECT * FROM users");
      return result;
    } catch (ex) {
      throw ex;
    }
  }

  async getUser(email) {
    try {
      const [result] = await connection.query(
        `SELECT* FROM users WHERE email = ?`,
        [email]
      );
      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  async registerUser(firstName, lastName, email, password, isAdmin) {
    try {
      const [[result]] = await connection.query(
        "CALL register_user(?,?,?,?,?)",
        [firstName, lastName, email, password, isAdmin]
      );

      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  async generateAuthToken(email) {
    const user = await this.getUser(email);
    return jwt.sign(
      { id: user.user_id, isAdmin: user.is_admin },
      process.env.JWT_PRIVATE_KEY
    );
  }

  validate(user) {
    const schema = Joi.object({
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
      isAdmin: Joi.boolean().required(),
    });
    return schema.validate(user);
  }
}

module.exports = new Users();
