Endpoint: "/users/:user"
Type: GET
Parameters: user (path parameter)
Description: This accepts a username as a nontrivial input and grants access to their information.
It is used when someone signs in as well as whenever information about their account is needed.
Possible side effects: It might have the side effect of setting a global variable that
tracks who is signed in, though I will have to figure out implementation.
Return: It will need to return a JSON with information such as their settings
and history to be processed.
Example Request: fetch(http:localhost:8000/users/markus35)
Example Return: data = {"full name": "Markus Reever",
                "DOB": "11/18/1999",
                "history": ["Cedar Table", "Glass Door", "Carpet"]}
Errors: 404: "not found", 500: "internal server error"

Endpoint: "/adduser"
Type: POST
Parameters: name, username, DOB (POST parameters)
Description: This accepts a name, username, and date of birth, as nontrivial inputs and adds them
to the database of users.
It is used when someone signs up to register their new account.
Possible side effects: It might have the side effect of adding multiple user of the same name.
Return: It doesn't return anything.
Example Request: fetch(http:localhost:8000/adduser, {method: "POST", body: data})
Errors: 404: "not found", 500: "internal server error"

Endpoint: "/buyitem"
Type: POST
Parameters: username, item
Description: This accepts a username and item, adds the item to the user's purchase history,
and decreases the item's stock by one.
It is used when someone purchases an item.
Possible side effects: It might have the side effect of making stocks go negative.
Return: It doesn't return anything.
Example Request: fetch(http:localhost:8000/buyitem, {method: "POST", body: data})
Errors: 404: "not found", 500: "internal server error"

Endpoint: "/rateitem"
Type: POST
Parameters: username, item, rating
Description: This accepts a username, item, and a rating. It asdds the rating to an item's rating
distribution. If the user has already rated the item in question, it will remove their previous
rating and change it.
It is used when someone rates an item.
Possible side effects: It might be complicated to implement.
Return: It doesn't return anything.
Example Request: fetch(http:localhost:8000/rateitem, {method: "POST", body: data})
Errors: 404: "not found", 500: "internal server error"

Endpoint: "/items"
Type: GET
Parameters: item (query parameter)
Description: This accepts an item name as a nontrivial input and grants access to its information.
If the query parameter is left blank, it will return the names of all of the items.
It is used when someone signs in as well as whenever information about a specific item is needed.
Possible side effects: It might have the side effect of taking a long time if there are a lot of
items. It might also be difficult to work out how much information we should get for the blank one.
Return: It will need to return a JSON with information such as their price and image.
and history to be processed.
Example Request: fetch(http://localhost:8000/items?item=desk)
Example Return: data = {"price": 60,
                "in stock": 7,
                "description": "A small but confortable desk that it likely to suit your needs.",
                "img": "public/img/standarddesk.jpeg"}
Example Request: fetch(http://localhost:8000/items)
Example Return: data = {["standard desk", "fancy desk", "fancy table", "rugged chairs"]}
Errors: 404: "not found", 500: "internal server error"