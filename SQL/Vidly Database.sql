-- Create the Schema
DROP DATABASE IF EXISTS vidly;
CREATE DATABASE vidly;
USE vidly;

-- Create the Tables
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
    phone 			VARCHAR(50),
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
    title 				VARCHAR(50) NOT NULL,
    daily_rental_rate 	INT NOT NULL,
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

-- Insert statements

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


