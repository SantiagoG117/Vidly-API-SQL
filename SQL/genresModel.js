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
      console.log("An error occured while querying the database: ", ex);
    }
  }

  async getGenre(id) {
    try {
      const [result] = await connection.query(
        `SELECT* FROM genres WHERE genre_id = ?;`,
        [id] //Parameterized query
      );
      return result;
    } catch (ex) {
      console.log("An error occured while querying the database: ", ex);
    }
  }
}

module.exports = new Genres();
