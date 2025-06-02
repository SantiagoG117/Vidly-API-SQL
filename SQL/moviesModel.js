//? Get the connection to the Database
const connection = require("./dbconnection");

//? External libraries
const Joi = require("joi");

/* 
  Every file in a Node JS application is considered a module. 

  Variables and funnctions defined in a file are only scoped to that file and are not visible to other modules.
  To export a variable or function from a module we must add them to module.exports

  Two Object Oriented Principles are applied in this model:
    1. Encapsulation: Group related methods together that work with the movies table. Reduce complexity and allows reusability
    2. Abstraction: Hide implementation details.If tomorrow we choose a different DBMS or way to store, extract and manipulate the data, the changes will only
    impact our model. The routes that work with this model won't be impacted by changes. They do not care for implementation details, all they are exposed to is the
    interface of this model.
*/
class Movies {
  async getAllMovies() {
    try {
      const [result] = await connection.query(`
        SELECT
	        title,
          barcode,
          daily_rental_rate,
          number_in_stock,
          genres.name as genre
        FROM movies
        JOIN genres on movies.genre_id = genres.genre_id;`);
      return result;
    } catch (ex) {
      throw ex;
    }
  }

  async getMovieByBarcode(barcode) {
    try {
      const [result] = await connection.query(
        `select* from movies where barcode = ?`,
        [barcode]
      );
      return result;
    } catch (ex) {
      throw ex;
    }
  }

  async getMovieByBarcode(barcode) {
    try {
      const [result] = await connection.query(
        "SELECT* FROM movies WHERE barcode = ? ",
        [barcode]
      );
      return result;
    } catch (ex) {
      throw ex;
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
      throw ex;
    }
  }

  async updateMovie(
    movieId,
    genreId,
    barcode,
    title,
    numberInStock,
    dailyRentalRate
  ) {
    try {
      const [result] = await connection.query(
        `CALL update_movie(?,?,?,?,?,?)`,
        [movieId, genreId, barcode, title, numberInStock, dailyRentalRate]
      );
      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  async deleteMovie(movieId) {
    try {
      const [result] = await connection.query("CALL delete_movie(?)", [
        movieId,
      ]);
      return result[0];
    } catch (ex) {
      throw ex;
    }
  }

  //Validation for the client's input to our API
  validate(movie) {
    const schema = Joi.object({
      barcode: Joi.string().min(10).max(10).required(),
      title: Joi.string().min(1).max(255).required(),
      dailyRentalRate: Joi.number().min(0).required(),
      numberInStock: Joi.number().min(0).required(),
      genre: Joi.string().min(1).max(255).required(),
    });
    return schema.validate(movie);
  }
}

module.exports = new Movies();
