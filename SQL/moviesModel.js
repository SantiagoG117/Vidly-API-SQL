//? Get the connection to the Database
const connection = require("./dbconnection");

//? External libraries
const Joi = require("joi");

/* 
    This class builds an interface to interact with the Movies Database Entity. 
    It allows us to execute CRUD operations on said entity

    TODO: Provide a better validation for a sql error
*/

class Movies {
  async getAllMovies() {
    try {
      const [result] = await connection.query(`SELECT* FROM movies;`);
      return result;
    } catch (ex) {
      console.log("An error occured while querying the database: ", ex);
    }
  }

  async getMovie(id) {
    try {
      const [result] = await connection.query(
        `SELECT* FROM movies WHERE movie_id = ?`,
        [id]
      );
      return result;
    } catch (ex) {
      console.log("An error occured while querying the database: ", ex);
    }
  }

  async createMovie(genreId, barcode, title, dailyRentalRate, numberInStock) {
    try {
      const [result] = await connection.query(`CALL insert_movie(?,?,?,?,?)`, [
        genreId,
        barcode,
        title,
        dailyRentalRate,
        numberInStock,
      ]);
      return result[0];
    } catch (ex) {
      console.log("An error occurred while calling the stored procedure: ", ex);
    }
  }

  async updateMovie(movieId, genreId, barcode ,title, numberInStock, dailyRentalRate) {
    try {
      const [result] = await connection.query(`CALL update_movie(?,?,?,?,?,?)`, [
        movieId,
        genreId,
        barcode,
        title,
        numberInStock,
        dailyRentalRate,
      ]);
      return result[0];
    } catch (ex) {
      console.log("An error occurred while calling the stored procedure: ", ex);
    }
  }

  async deleteMovie(movieId) {
    try {
      const [result] = await connection.query("CALL delete_movie(?)", [
        movieId,
      ]);
      return result[0];
    } catch (ex) {
      console.log("An error occurred while calling the stored procedure: ", ex);
    }
  }

  //Validation for the client's input to our API
  validate(movie) {
    const schema = Joi.object({
      genreId: Joi.number().min(0).required(),
      title: Joi.string().min(1).max(255).required(),
      barcode: Joi.string().min(10).max(10).required(),
      numberInStock: Joi.number().min(0).required(),
      dailyRentalRate: Joi.number().min(0).required(),
    });
    return schema.validate(movie);
  }
}

module.exports = new Movies();
