var BASE_URL = `http://localhost:8080`;

//
// EVENTS
//

//Button for VideoGameDB display
var saveButton = document.querySelector("#button");
saveButton.onclick = function () {
    console.log("The add button was clicked.");
    var nameField = document.querySelector("#name-field");
    var yearField = document.querySelector("#year-field");
    var ratingField = document.querySelector("#rating-field");
    var genreField = document.querySelector("#genre-field");
    var systemField = document.querySelector("#system-field"); 
    createVideoGames(nameField.value, yearField.value, ratingField.value, genreField.value, systemField.value);
    document.getElementById("name-field").value = "";
    document.getElementById("year-field").value = "";
    document.getElementById("rating-field").value = "";
    document.getElementById("genre-field").value = "";
    document.getElementById("system-field").value = "";
};

//Buttons for Registration form
var signUpButton = document.querySelector("#sign_up");
signUpButton.onclick = function () {
    console.log("Registration Button Clicked");
    var firstName = document.querySelector("#reg_first");
    var lastName = document.querySelector("#reg_last");
    var email = document.querySelector("#reg_email");
    var password = document.querySelector("#reg_password");
    //Javascript function that handles createUser
    createUser(firstName.value, lastName.value, email.value, password.value);
};

var alreadyUserButton = document.querySelector("#already_user");
alreadyUserButton.onclick = function () {
    document.querySelector("#registration_form").style.display = "none";
    document.querySelector("#login_form").style.display = "block";
};

//Button for login form
var logInButton = document.querySelector("#sign_in");
logInButton.onclick = function () {
    console.log("Login Button Clicked");
    var email = document.querySelector("#login_email");
    var password = document.querySelector("#login_password");
    //Javascript function that handles a user logging in
    loginUser(email.value, password.value);
};

//Button for logout
var LogOutButton = document.querySelector("#logout");
LogOutButton.onclick = function () {
    console.log("Logout Button Clicked");
    logoutUser();
};

//
// FUNCTIONS
//

//Function and Variables for Registration Form
//
//When user is created bring them to the sign in form
var createUser = function (first, last, email, password) {
    var data = `first=${encodeURIComponent(first)}`;
    data += `&last=${encodeURIComponent(last)}`;
    data += `&email=${encodeURIComponent(email)}`;
    data += `&password=${encodeURIComponent(password)}`;
    fetch(`https://videogamesdb.herokuapp.com/users`, {
	method: "POST",
	body: data,
	credentials: 'include',
	headers: {
	    "Content-type": "application/x-www-form-urlencoded"
	}
    }).then(function (response) {
	if (response.status == 201){
	    console.log("A user was created.");
	    document.getElementById("reg_first").value = "";
	    document.getElementById("reg_last").value = "";
	    document.getElementById("reg_email").value = "";
	    document.getElementById("reg_password").value = "";
	    document.querySelector("#registration_form").style.display = "none";
	    document.querySelector("#login_form").style.display = "block";
	    //Print success message!
	}
	if (response.status == 422){
	    //Error message, User already logged in. Stay on current form.
	    document.getElementById("reg_first").value = "";
	    document.getElementById("reg_last").value = "";
	    document.getElementById("reg_email").value = "";
	    document.getElementById("reg_password").value = "";
	    window.alert("Error: User already exists");
	}
	if (response.status != 422 && response.status != 201){
	    //Error message, stay on current form
	    document.getElementById("reg_first").value = "";
	    document.getElementById("reg_last").value = "";
	    document.getElementById("reg_email").value = "";
	    document.getElementById("reg_password").value = "";
	    window.alert("Error: Please try again!");
	}
    });
};

var loginUser = function (email, password) {
    var data = `&email=${encodeURIComponent(email)}`;
    data += `&password=${encodeURIComponent(password)}`;
    fetch(`https://videogamesdb.herokuapp.com/session`, {
	method: "POST",
	body: data,
	credentials: 'include',
	headers: {
	    "Content-type": "application/x-www-form-urlencoded"
	}
    }).then(function (response) {
	if (response.status != 401 && response.status != 404){
	    //Success! Print message
	    console.log("A user has logged in.");
	    document.getElementById("login_email").value = "";
	    document.getElementById("login_password").value = "";
	    document.querySelector("#login_form").style.display = "none";
	    document.querySelector("#video_game_db").style.display = "block";
	    //Print success message!
	    loadGames();
	}
	if (response.status != 201){
	    //Error message, stay on current form
	    document.getElementById("login_email").value = "";
	    document.getElementById("login_password").value = "";
	    window.alert("Error: Please try again!");
	}
    });
};

var logoutUser = function () {
    return nill;
};

//Functions and Variables for VideoGameDB 
var deleteGame = function (game) {
    if (confirm("Do you want to delete this game? " + game.name)) {
	console.log("Deleting game with ID", game.id);
	fetch(`https://videogamesdb.herokuapp.com/videogames/${game.id}`, {
	    method: "DELETE",
	    credentials: 'include'
	}).then(function (response) {
	    if (response.status != 401 /*&& response.status != 400*/ && response.status != 404){
		console.log("Delete game successful.");
		//Print success message!
		loadGames();
	    }
	    else if (response.status == 401) {
		window.alert("Unauthorized: You are not logged in!");
	    }
	});
    };
};

var updateGame = function (name, year, rating, genre, system, game) {
    var data = `name=${encodeURIComponent(name)}`;
    data += `&year=${encodeURIComponent(year)}`;
    data += `&rating=${encodeURIComponent(rating)}`;
    data += `&genre=${encodeURIComponent(genre)}`;
    data += `&system=${encodeURIComponent(system)}`;
    console.log("Updating game with ID ", game.id);
    fetch(`https://videogamesdb.herokuapp.com/videogames/${game.id}`, {
	method: "PUT",
	body: data,
	credentials: 'include',
	headers: {
	    "Content-type": "application/x-www-form-urlencoded"
	}
    }).then(function (response) {
	if (response.status != 401){
	    //Print success message!
	    console.log("Update game successful.");
	    loadGames();
	}
	if (response.status == 401) {
	    window.alert("Unauthorized: You are not logged in!");
	}
    });
};

var showVideoGames = function (videoGames) {
    var list = document.querySelector("#list");
    list.innerHTML = "";

    videoGames.forEach(function (game) {
	var listGame = document.createElement("li");
	listGame.className = "listClass";
	listGame.innerHTML = "NAME: " + game.name + "<br><br>" + "RATING: " + game.rating + "<br><br>" + "GENRE: " + game.genre;
	listGame.style.fontSize = "15px";

	var deleteButton = document.createElement("button");
	deleteButton.innerHTML = "Delete";
	deleteButton.className = "del-button";
	listGame.appendChild(deleteButton);
	var updateButton = document.createElement("button");
	updateButton.innerHTML = "Update";
	updateButton.className = "update-button";
	listGame.appendChild(updateButton);

	updateButton.onclick = function () {
	    var newNameField = document.querySelector("#name-field");
	    var newYearField = document.querySelector("#year-field");
	    var newRatingField = document.querySelector("#rating-field");
	    var newGenreField = document.querySelector("#genre-field");
	    var newSystemField = document.querySelector("#system-field");
	    updateGame(newNameField.value, newYearField.value, newRatingField.value, newGenreField.value, newSystemField.value, game);
	    document.getElementById("name-field").value = "";
	    document.getElementById("year-field").value = "";
	    document.getElementById("rating-field").value = "";
	    document.getElementById("genre-field").value = "";
	    document.getElementById("system-field").value = "";
	};

	deleteButton.onclick = function () {
	    deleteGame(game);
	};

	list.appendChild(listGame);
    });  
};

var createVideoGames = function (name, year, rating, genre, system) {
    var data = `name=${encodeURIComponent(name)}`;
    data += `&year=${encodeURIComponent(year)}`;
    data += `&rating=${encodeURIComponent(rating)}`;
    data += `&genre=${encodeURIComponent(genre)}`;
    data += `&system=${encodeURIComponent(system)}`;
    fetch(`https://videogamesdb.herokuapp.com/videogames`, {
	method: "POST",
	body: data,
	credentials: 'include',
	headers: {
	    "Content-type": "application/x-www-form-urlencoded"
	}
    }).then(function (response) {
	if (response.status != 401) {
	    console.log("A game was created.");
	    //Print Success Message!
	    loadGames();
	}
	if (response.status == 401){
	    window.alert("Unauthorized: You are not logged in!");
	}
    });
};

var oneGame = function (game) {
    fetch(`https://videogamesdb.herokuapp.com/videogames/${game.id}`, {
	method: "GET",
	credentials: 'include'
    }).then(function (response) {
	if (response.status != 401) {
	    console.log("Found Game.");
	    //Print Success Message!
	    loadGames();
	}
	if (response.status == 401){
	    window.alert("Unauthorized: You are not logged in!");
	}
    });
};

//
// PAGE LOAD
//

//Page Load for VideoGamesDB
var loadGames = function () {
    fetch(`https://videogamesdb.herokuapp.com/videogames`, {
	credentials: 'include'}).then(function (response) {
	    //if else statements so that page load will not refresh to registration form
	    //upon refresh.
	    if (response.status == 401) {
		document.querySelector("#registration_form").style.display = "block";
		//window.alert("Unauthorized: You are not logged in!");
	    }
	    else if (response.status == 404) {
		//document.querySelector("#registration_form").style.display = "block";
		window.alert("Error: Please try again!");
	    }
	    else if (response.status == 200){
		document.querySelector("#login_form").style.display = "none";
		document.querySelector("#registration_form").style.display = "none";
		document.querySelector("#video_game_db").style.display = "block";
		response.json().then(function (theVideoGames) {
		    console.log("VideoGames: ", theVideoGames);
		    showVideoGames(theVideoGames);
		});
	    }
	    else if (response.status == 201) {
		response.json().then(function (theVideoGames) {
		    console.log("VideoGames: ", theVideoGames);
		    showVideoGames(theVideoGames);
		});
	    }
	});
};

//Only call the following function if you want to load the VideoGames list...
//at the beginning, or on page load
//
loadGames();
