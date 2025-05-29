-- Create the Schema ------------------------------------------------------------------------------------------------------
DROP DATABASE IF EXISTS vidly;
CREATE DATABASE vidly;
USE vidly;

-- Create the Tables ------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
	user_id	INT PRIMARY KEY AUTO_INCREMENT,
    first_name	VARCHAR(50) NOT NULL,
    last_name	VARCHAR(50) NOT NULL,
    password	VARCHAR(300) NOT NULL
);

DROP TABLE IF EXISTS customers;
CREATE TABLE IF NOT EXISTS customers (
	customer_id 	INT PRIMARY KEY AUTO_INCREMENT,
    first_name 		VARCHAR(50) NOT NULL,
    last_name 		VARCHAR(50) NOT NULL,
    email 			VARCHAR(255) UNIQUE,
    phone 			VARCHAR(50) NOT NULL UNIQUE,
    points 			INT NOT NULL DEFAULT 0 
);

-- Parent of the genres-movies relationship. A genre can have many movies (a genre exists independently of movies)
DROP TABLE IF EXISTS genres;
CREATE TABLE IF NOT EXISTS genres (
	genre_id	INT PRIMARY KEY AUTO_INCREMENT,
    name		Varchar(100)
);

-- Child of the genre-movies relationship: Each movie belongs to one genre (a movie depends on a genre to exist)
DROP TABLE IF EXISTS movies;
CREATE TABLE IF NOT EXISTS movies (
	movie_id			INT PRIMARY KEY AUTO_INCREMENT,
    genre_id			INT NOT NULL, # Parent digital DNA
    title 				VARCHAR(255) NOT NULL,
    daily_rental_rate 	DECIMAL(5,2) NOT NULL,
    number_in_stock		INT NOT NULL,
    
	FOREIGN KEY fk_movies_genres (genre_id)
    REFERENCES genres(genre_id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION
);

DROP TABLE IF EXISTS coupons;
CREATE TABLE IF NOT EXISTS coupons(
	coupon_id	INT	PRIMARY KEY AUTO_INCREMENT,
    description	VARCHAR(255) NOT NULL,
    discount	DECIMAL(3,2) NOT NULL
    CONSTRAINT chk_discount_range CHECK (discount BETWEEN 0 AND 1)
);

DROP TABLE IF EXISTS rentals;
CREATE TABLE IF NOT EXISTS rentals (
	rental_id	INT PRIMARY KEY AUTO_INCREMENT,
    customer_id	INT NOT NULL,
    movie_id	INT NOT NULL,
    coupon_id	INT NOT NULL,
    date_out	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_in		DATETIME NULL,
    rental_fee	DECIMAL(5,2) NOT NULL,
    
    FOREIGN KEY fk_rentals_customers  (customer_id)
    REFERENCES customers(customer_id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION,
    
    FOREIGN KEY fk_rentals_movies (movie_id)
    REFERENCES movies(movie_id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION,
    
    FOREIGN KEY fk_rentals_coupons (coupon_id)
    REFERENCES coupons(coupon_id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION
);

-- Insert statements ------------------------------------------------------------------------------------------------------

INSERT INTO genres (name) VALUES 
  ('Action'),
  ('Adventure'),
  ('Animation'),
  ('Comedy'),
  ('Crime'),
  ('Documentary'),
  ('Drama'),
  ('Family'),
  ('Fantasy'),
  ('Horror'),
  ('Mystery'),
  ('Romance'),
  ('Science Fiction'),
  ('Thriller'),
  ('War');


INSERT INTO movies (genre_id, title, daily_rental_rate, number_in_stock) VALUES
(1, 'Die Hard', 4.25, 20),
(1, 'Mad Max: Fury Road', 4.99, 20),
(1, 'John Wick', 3.75, 20),
(2, 'Indiana Jones and the Last Crusade', 3.5, 20),
(2, 'Jurassic Park', 4.75, 20),
(2, 'Pirates of the Caribbean: The Curse of the Black Pearl', 3.99, 20),
(3, 'Toy Story', 2.5, 20),
(3, 'Finding Nemo', 2.99, 20),
(3, 'Shrek', 2.25, 20),
(4, 'The Hangover', 3.5, 20),
(4, 'Superbad', 3.25, 20),
(4, 'Step Brothers', 2.75, 20),
(5, 'The Godfather', 4.99, 20),
(5, 'Pulp Fiction', 4.5, 20),
(5, 'The Departed', 3.99, 20),
(6, 'March of the Penguins', 2.25, 20),
(6, 'Free Solo', 3.5, 20),
(6, 'The Last Dance', 3.75, 20),
(7, 'Forrest Gump', 4.25, 20),
(7, 'The Shawshank Redemption', 4.99, 20),
(7, 'The Green Mile', 3.5, 20),
(8, 'The Incredibles', 2.75, 20),
(8, 'Paddington', 2.5, 20),
(8, 'Matilda', 2.25, 20),
(9, 'Harry Potter and the Sorcerer''s Stone', 4.5, 20),
(9, 'The Lord of the Rings: The Fellowship of the Ring', 4.99, 20),
(9, 'The Lord of the Rings: The Two Towers', 4.99, 20),
(9, 'The Lord of the Rings: The Return of the King', 4.99, 20),
(9, 'Pan''s Labyrinth', 3.25, 20),
(10, 'The Conjuring', 3.5, 20),
(10, 'Get Out', 3.99, 20),
(10, 'A Quiet Place', 3.25, 20),
(11, 'Se7en', 4.25, 20),
(11, 'Gone Girl', 3.75, 20),
(11, 'Prisoners', 3.5, 20),
(12, 'The Notebook', 2.99, 20),
(12, 'Titanic', 4.99, 20),
(12, 'La La Land', 3.25, 20),
(13, 'Inception', 4.99, 20),
(13, 'Interstellar', 4.75, 20),
(13, 'Blade Runner 2049', 4.25, 20),
(14, 'The Silence of the Lambs', 4.5, 20),
(14, 'Zodiac', 3.99, 20),
(14, 'Black Swan', 3.5, 20),
(15, 'Saving Private Ryan', 4.99, 20),
(15, 'Dunkirk', 4.25, 20),
(15, '1917', 4.5, 20),
(1, 'Lethal Weapon', 3.25, 20),
(2, 'The Mummy', 3.5, 20),
(3, 'Monsters, Inc.', 2.75, 20),
(4, 'Anchorman: The Legend of Ron Burgundy', 2.5, 20);

-- Store procedures ------------------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS insert_movie;
DELIMITER $$
CREATE PROCEDURE insert_movie
(
	IN p_genre_id INT,
    IN p_title VARCHAR(255),
    IN p_daily_rental_rate DECIMAL(5,2),
    IN p_number_in_stock INT
)
BEGIN
	-- Variables
    DECLARE new_movie_id INT;
    
    -- Verify if the genre exist:
    IF EXISTS(SELECT 1 FROM genres WHERE genre_id = p_genre_id) THEN
		INSERT INTO movies (genre_id, title, daily_rental_rate, number_in_stock)
        VALUES (p_genre_id, p_title, p_daily_rental_rate, p_number_in_stock);
        
        SET new_movie_id = last_insert_id();
        SELECT * FROM movies WHERE movie_id= new_movie_id;
    ELSE
		SIGNAL SQLSTATE '4274C'
        SET MESSAGE_TEXT = 'Invalid genre id';
    END IF;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS update_movie;
DELIMITER $$

CREATE PROCEDURE update_movie
(
    IN p_movie_id INT,
    IN p_genre_id INT,
    IN p_title VARCHAR(255),
    IN p_daily_rental_rate DECIMAL(5,2),
    IN p_number_in_stock INT
)
BEGIN
    -- Verify that the movie and genre exist
    IF EXISTS (SELECT 1 FROM movies WHERE movie_id = p_movie_id)
       AND EXISTS (SELECT 1 FROM genres WHERE genre_id = p_genre_id) THEN

        UPDATE movies 
        SET genre_id = p_genre_id, 
            title = p_title, 
            daily_rental_rate = p_daily_rental_rate, 
            number_in_stock = p_number_in_stock
        WHERE movie_id = p_movie_id;
        
        SELECT * FROM movies WHERE movie_id = p_movie_id;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid movie_id or genre_id';
    END IF;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS delete_movie;
DELIMITER $$

CREATE PROCEDURE delete_movie
(
    IN p_movie_id INT
)
BEGIN
	-- Temporary table to hold the movie to be deleted
    DECLARE v_title VARCHAR(255);
    DECLARE v_daily_rental_rate DECIMAL(5,2);
    DECLARE v_number_in_stock INT;
    
    
    -- Verify that the movie and genre exist
    IF EXISTS (SELECT 1 FROM movies WHERE movie_id = p_movie_id) THEN
		-- Store the movie before deleting it:
        SELECT title, daily_rental_rate, number_in_stock
        INTO v_title, v_daily_rental_rate, v_number_in_stock
        FROM movies 
        WHERE movie_id = p_movie_id;
        
        -- Delete the target movie
		DELETE FROM movies WHERE movie_id = p_movie_id;
        
        -- Return the deleted movie
         SELECT p_movie_id AS movie_id, v_title AS title, v_daily_rental_rate AS daily_rental_rate, v_number_in_stock AS number_in_stock;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid movie_id';
    END IF;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS create_customer;
DELIMITER $$

CREATE PROCEDURE create_customer
(
   IN p_first_name	VARCHAR(50),
   IN p_last_name	VARCHAR(50),
   IN p_email		VARCHAR(255),
   IN p_phone		VARCHAR(50),
   IN p_points		INT 
)
BEGIN
	-- Variables
    DECLARE new_customer_id INT;

	INSERT INTO customers (first_name, last_name, email, phone, points) VALUES(p_first_name, p_last_name, p_email, p_phone, p_points );
	
    SET new_customer_id = last_insert_id();
    SELECT* FROM customers where customer_id = new_customer_id;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS update_customer;
DELIMITER $$
CREATE PROCEDURE update_customer
(
	IN p_customer_id INT,
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(50),
    IN p_phone VARCHAR(50),
    IN p_points INT
)
BEGIN
	-- Verify that the customer exists
    IF EXISTS(SELECT 1 FROM customers WHERE customer_id = p_customer_id) THEN
		UPDATE customers
        SET first_name = p_first_name, last_name = p_last_name, email = p_email, phone = p_phone, points = p_points
        WHERE customer_id = p_customer_id;
        
        SELECT* FROM customers WHERE customer_id = p_customer_id;
	ELSE 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid customer_id';
    END IF;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS delete_customer;
DELIMITER $$
CREATE PROCEDURE delete_customer
(
	p_customer_id	INT
)
BEGIN
	-- create temporary table to store the deleted customer
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_customer AS
		SELECT* FROM customers WHERE 1=0; -- Copies the structure of the customers table without copying its data

	IF EXISTS (SELECT 1 FROM customers WHERE customer_id = p_customer_id) THEN
		
        -- Store the customer to be deleted
        INSERT INTO temp_customer
		SELECT * FROM customers WHERE customer_id = p_customer_id;
        
        -- Delete the target customer
        DELETE FROM customers WHERE customer_id = p_customer_id;
        
        SELECT* FROM temp_customer;
        DROP TEMPORARY TABLE IF EXISTS temp_customer;
	ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid customer id';
    END IF;
END $$

DELIMITER ;



