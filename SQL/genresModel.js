//? Get the connection to the Database
const connection = require("./dbconnection");

/* 
    This class builds an interface to interact with the genres Database Entity.
    It allows us to implement CRUD operations on said entity
*/

class Genres {
  //? Prototype methods
  async getGenres() {
    try {
      const [result] = await connection.query(`SELECT* FROM genres;`); //Extracts the rows and save them in an array of objects
      return result;
    } catch (ex) {
      throw ex; //Pass the error to the route handler
    }
  }

  async getGenre(name) {
    try {
      const [result] = await connection.query(
        `SELECT* FROM genres WHERE name = ?;`,
        [name]
      );
      return result;
    } catch (ex) {
      throw ex;
    }
  }
}

module.exports = new Genres();
