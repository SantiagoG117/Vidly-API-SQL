-- Create the Schema ------------------------------------------------------------------------------------------------------
DROP DATABASE IF EXISTS vidly;
CREATE DATABASE vidly;
USE vidly;

-- Create the Tables ------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
	user_id		INT PRIMARY KEY AUTO_INCREMENT,
    first_name	VARCHAR(50) NOT NULL,
    last_name	VARCHAR(50) NOT NULL,
    email		VARCHAR(255) UNIQUE,
    password	VARCHAR(255) NOT NULL,
    is_admin	BOOLEAN NOT NULL
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
    barcode				CHAR(10) NOT NULL UNIQUE,
    title 				VARCHAR(255) NOT NULL,
    daily_rental_rate 	DECIMAL(5,2) NOT NULL,
    number_in_stock		INT NOT NULL,
    
	FOREIGN KEY fk_movies_genres (genre_id)
    REFERENCES genres(genre_id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION
);

DROP TABLE IF EXISTS rentals;
CREATE TABLE IF NOT EXISTS rentals (
	rental_id		INT PRIMARY KEY AUTO_INCREMENT,
    customer_id		INT NOT NULL,
    movie_id		INT NOT NULL,
    movie_barcode	CHAR(10) NOT NULL,
    date_out 		DATE NOT NULL DEFAULT (CURRENT_DATE),
    date_in			DATETIME NULL,
    rental_fee		DECIMAL(5,2) NULL,
	is_returned     BOOLEAN NULL,
    
    FOREIGN KEY fk_rentals_customers  (customer_id)
    REFERENCES customers(customer_id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION,
    
    FOREIGN KEY fk_rentals_movies (movie_id)
    REFERENCES movies(movie_id)
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


INSERT INTO movies (genre_id, barcode, title, daily_rental_rate, number_in_stock) VALUES
(1, '4829103746', 'Die Hard', 4.25, 20),
(1, '1938475620', 'Mad Max: Fury Road', 4.99, 20),
(1, '8573920146', 'John Wick', 3.75, 20),
(2, '2093847561', 'Indiana Jones and the Last Crusade', 3.5, 20),
(2, '3847569201', 'Jurassic Park', 4.75, 20),
(2, '4758392016', 'Pirates of the Caribbean: The Curse of the Black Pearl', 3.99, 20),
(3, '9384756102', 'Toy Story', 2.5, 20),
(3, '1029384758', 'Finding Nemo', 2.99, 20),
(3, '5647382910', 'Shrek', 2.25, 20),
(4, '8374659201', 'The Hangover', 3.5, 20),
(4, '2938475610', 'Superbad', 3.25, 20),
(4, '4758392017', 'Step Brothers', 2.75, 20),
(5, '3847561920', 'The Godfather', 4.99, 20),
(5, '1029384751', 'Pulp Fiction', 4.5, 20),
(5, '5647382911', 'The Departed', 3.99, 20),
(6, '8374659202', 'March of the Penguins', 2.25, 20),
(6, '2938475611', 'Free Solo', 3.5, 20),
(6, '4758392018', 'The Last Dance', 3.75, 20),
(7, '3847561921', 'Forrest Gump', 4.25, 20),
(7, '1029384752', 'The Shawshank Redemption', 4.99, 20),
(7, '5647382912', 'The Green Mile', 3.5, 20),
(8, '8374659203', 'The Incredibles', 2.75, 20),
(8, '2938475612', 'Paddington', 2.5, 20),
(8, '4758392019', 'Matilda', 2.25, 20),
(9, '3847561922', 'Harry Potter and the Sorcerer''s Stone', 4.5, 20),
(9, '1029384753', 'The Lord of the Rings: The Fellowship of the Ring', 4.99, 20),
(9, '5647382913', 'The Lord of the Rings: The Two Towers', 4.99, 20),
(9, '8374659204', 'The Lord of the Rings: The Return of the King', 4.99, 20),
(9, '2938475613', 'Pan''s Labyrinth', 3.25, 20),
(10, '4758392020', 'The Conjuring', 3.5, 20),
(10, '3847561923', 'Get Out', 3.99, 20),
(10, '1029384754', 'A Quiet Place', 3.25, 20),
(11, '5647382914', 'Se7en', 4.25, 20),
(11, '8374659205', 'Gone Girl', 3.75, 20),
(11, '2938475614', 'Prisoners', 3.5, 20),
(12, '4758392021', 'The Notebook', 2.99, 20),
(12, '3847561924', 'Titanic', 4.99, 20),
(12, '1029384755', 'La La Land', 3.25, 20),
(13, '5647382915', 'Inception', 4.99, 20),
(13, '8374659206', 'Interstellar', 4.75, 20),
(13, '2938475615', 'Blade Runner 2049', 4.25, 20),
(14, '4758392022', 'The Silence of the Lambs', 4.5, 20),
(14, '3847561925', 'Zodiac', 3.99, 20),
(14, '1029384756', 'Black Swan', 3.5, 20),
(15, '5647382916', 'Saving Private Ryan', 4.99, 20),
(15, '8374659207', 'Dunkirk', 4.25, 20),
(15, '2938475616', '1917', 4.5, 20),
(1, '4758392023', 'Lethal Weapon', 3.25, 20),
(2, '3847561926', 'The Mummy', 3.5, 20),
(3, '1029384757', 'Monsters, Inc.', 2.75, 20),
(4, '5647382917', 'Anchorman: The Legend of Ron Burgundy', 2.5, 20);

-- Store procedures ------------------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS insert_movie;
DELIMITER $$
CREATE PROCEDURE insert_movie
(
	IN p_genre_id INT,
    IN p_barcode CHAR(10),
    IN p_title VARCHAR(255),
    IN p_daily_rental_rate DECIMAL(5,2),
    IN p_number_in_stock INT
)
BEGIN
	-- Variables
    DECLARE new_movie_id INT;
    
    -- Verify if the genre exist:
    IF EXISTS(SELECT 1 FROM genres WHERE genre_id = p_genre_id) THEN
		INSERT INTO movies (genre_id, barcode ,title, daily_rental_rate, number_in_stock)
        VALUES (p_genre_id, p_barcode ,p_title, p_daily_rental_rate, p_number_in_stock);
        
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
    IN p_barcode CHAR(10),
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
			barcode = p_barcode,
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

DROP PROCEDURE IF EXISTS create_movie_rental;
DELIMITER $$
CREATE PROCEDURE create_movie_rental
(
    IN p_customer_id	INT,
    IN p_movie_id		INT,
    IN p_barcode		CHAR(10)
)
BEGIN
	-- Variables
    DECLARE new_rental_id INT;
	-- Validate the customer_id and movie_id
    IF EXISTS(SELECT 1 FROM customers WHERE customer_id = p_customer_id) 
    AND EXISTS(SELECT 1 FROM movies WHERE movie_id = p_movie_id) THEN
    
		-- Create the rental
		INSERT INTO rentals (customer_id, movie_id, movie_barcode)
		VALUES (p_customer_id, p_movie_id, p_barcode);
        
        -- Decrease the number in stock of the targeted movie by 1
		UPDATE movies
        SET number_in_stock = number_in_stock - 1
        WHERE movie_id = p_movie_id;
        
        -- Return the created rental
		SET new_rental_id = last_insert_id();
		SELECT* FROM rentals where rental_id = new_rental_id;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid movie_id or customer_id';
	END IF;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS create_movie_return;
DELIMITER $$
CREATE PROCEDURE create_movie_return
(
	IN p_customer_id	INT,
    IN p_movie_id		INT
)
BEGIN
	DECLARE v_date_out	DATE;
	DECLARE days_rented INT;
    DECLARE movie_rental_fee DECIMAL(5,2);
    
	-- Verify that the customer and movie exist
	IF EXISTS(SELECT 1 FROM customers WHERE customer_id = p_customer_id) 
    AND EXISTS(SELECT 1 FROM movies WHERE movie_id = p_movie_id) THEN
		
        
        SELECT date_out INTO v_date_out 
        FROM rentals 
        WHERE (customer_id = p_customer_id) AND (movie_id = p_movie_id) AND ( date_in IS NULL) AND (rental_fee IS NULL)
        LIMIT 1;
        
        SELECT daily_rental_rate INTO movie_rental_fee 
        FROM movies 
        WHERE movie_id = p_movie_id;
        
        SET days_rented = DATEDIFF(CURDATE(), v_date_out);
        
        UPDATE rentals
        SET date_in = CURDATE(), rental_fee = movie_rental_fee * days_rented , is_returned = TRUE
        WHERE (customer_id = p_customer_id) AND (movie_id = p_movie_id) AND (rental_fee IS NULL) AND (is_returned IS NULL);
        
        -- Increase the number of stock for the targeted movie by 1
		UPDATE movies
        SET number_in_stock = number_in_stock + 1
        WHERE movie_id = p_movie_id;
        
        -- Return the created rental
        SELECT* FROM rentals WHERE (customer_id = p_customer_id) AND (movie_id = p_movie_id) AND (date_in = CURDATE());
        
	ELSE 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid customer_id or movie_id';
    END IF;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS register_user;
DELIMITER $$
CREATE PROCEDURE register_user
(
	IN p_first_name	VARCHAR(50),
    IN p_last_name	VARCHAR(50),
    IN p_email		VARCHAR(255),
    IN p_password	VARCHAR(1025),
    IN p_is_admin	BOOLEAN
)
BEGIN
	-- Variables
    DECLARE new_user_id INT;

	INSERT INTO users (first_name, last_name, email, password, is_admin)
    VALUES (p_first_name, p_last_name, p_email, p_password, p_is_admin);
    
    SET new_user_id = last_insert_id();
    SELECT* FROM users WHERE user_id = new_user_id;
    
END $$
DELIMITER ;



