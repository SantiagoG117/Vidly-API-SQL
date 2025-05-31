We’re going to build a desktop application called Vidly. This application will be used at a video rental store. 


Renting a movie:
At check out, a customer brings one or more movies. The cashier looks up a customer by their phone number. If the customer is a first-time customer, the cashier asks their full name, email and phone number, and then registers them in the system. The cashier then scans the movies the customer has brought to check out and records them in the system. Each movie has a 10 digit barcode printed on the cover. 

Returning a movie: 
  - When the customer returns to the store, they’ll bring the movies they rented.
  - The customer should be charged based on the number of days and the daily rental rate.
  - If a movie is lost, the customer should be charged 10 times the daily rental rate of the movie. The cashier should mark the movie as lost and this will reduce the stock. There is no need to keep track of the lost movies. All we need to know is the the number of movies in stock and how much the customer was charged.
  - It is possible that a customer returns the movies they’ve rented in multiple visits.

We need to be able to track the
- top movies
- top customers
- revenue per day, month and year

Permissions: 
We need different levels of permissions for different users.
  Admins:
    - Can add/update/delete a movie and modify its stock and daily rental rate
    - Can add/update/delete a genre. 
    - Can add/update a rental.
    - Can add/update/delete a customer.

  Cachiers:
    - Can read the list of movies
    - Can add/update a rental
    - Can add/update a customer
