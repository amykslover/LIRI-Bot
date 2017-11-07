var fs = require("fs");
var request = require("request");
var inquirer = require("inquirer");


//Creating variables to hold the users input 
var userCommand;
var userSearch;

//Version 1 --> Use process.argv to get commands from users
//----------------------------------------------------------START OF VERSION 1
// var userCommand = process.argv[2];
// var userInput = process.argv.slice(3);
// var userSearch = userInput.join(' ');
// console.log(userCommand,userSearch);
// writeToLog(userCommand,userSearch);

// switch(userCommand) {
//     case 'spotify-this-song':
//     	spotifyThis(userSearch);
//         break;
//     case 'movie-this':
//     	movieThis(userSearch);
//         break;
//     case 'my-tweets':
//     	seeMyTweets();
//         break;
//     case 'do-what-it-says':
//     	randomDoThis();
//         break;	
// };

//----------------------------------------------------------END OF VERSION 1

//Version 2 --> Use inquirer to get data from users
//----------------------------------------------------------START OF VERSION 2

function stepOne() {

inquirer.prompt([
	{	type: "list",
  		name: "inquirerCommand",
	  	choices: [
	      'spotify-this-song',
	      'my-tweets',
	      'movie-this',
	      'do-what-it-says'],
  		message: "What can I do for you?"
  	}
  	]).then(function(answers) {

	  	userCommand = answers.inquirerCommand; 

		switch(userCommand) {
		    
		    case 'spotify-this-song':
		    	stepTwo();
		        break;
		    case 'movie-this':
		    	stepTwo();
		        break;
		    case 'my-tweets':
		    	seeMyTweets();
			  	writeToLog(userCommand);
		        break;
		    case 'do-what-it-says':
		    	randomDoThis();
		    	writeToLog(userCommand);
		        break;
		}

	})

};
//Call the initial function for user input
stepOne();

function stepTwo() {
    if (userCommand === 'spotify-this-song') {
      detailSong();
    } 
    if (userCommand === 'movie-this') {
      detailMovie();
    }
};


function detailSong() {
	var question = [
		{	type: "input",
	  		name: "songDetail",
	  		message: "What song do you want to hear?"
	  	}
  	];

 	inquirer.prompt(question).then(function (answers) {
 		userSearch = answers.songDetail;
 		spotifyThis(userSearch);
 		writeToLog(userCommand,userSearch);
	});
}

function detailMovie() {
	var question = [
		{	type: "input",
		  	name: "movieDetail",
		  	message: "What movie do you want to know about?"
		}
	];

	inquirer.prompt(question).then(function (answers) {
 		userSearch = answers.movieDetail;
 		movieThis(userSearch);
 		writeToLog(userCommand,userSearch);
	});
}

//----------------------------------------------------------END OF VERSION 2


//This function will write all users search to the log.txt file
function writeToLog(input1, input2) {
  fs.appendFile("log.txt", [input1,input2] + "\r\n", function(error) {
    if(!error) {
    	console.log('Logged.')
    }
    else {
      return console.log(error);
    }
  });
}

//-------------------SPOTIFY-------------------------------------//
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: '70f89d9ad94f4294a61e73d9bbb6b55d',
  secret: 'dd7854360843452f91033dd74d859a2f'
});

function spotifyThis(songSearch) {
	spotify.search({ type: 'track', query: songSearch, limit: 1}, function(error, data) {
	  	if (!error) {
		  	for (var i = 0; i < data.tracks.items.length; i++) {
		  		console.log('Song: ', data.tracks.items[i].name);
				console.log('Album: ', data.tracks.items[i].album.name);
				console.log('Artist: ', data.tracks.items[i].artists[0].name);
				//Create a variable to hold the song URL, either preview or full
				var currentSong;
				if(data.tracks.items[i].preview_url === null) {
					console.log('Preview: Sorry there is no preview, but here is the full song!')
					currentSong = data.tracks.items[i].external_urls.spotify;
					console.log(currentSong);
				} 
				else {
			  		currentSong = data.tracks.items[i].preview_url;
			  		console.log('Preview: ', currentSong);		
				}
				//Open the currentSong in the browser and play. 
				var open = require('mac-open');
				open(currentSong);
			};
	  	} 

	  else {
	  		return console.log('Error occurred: ' + error);
	  	}
	});

};

//-------------------OMDB----------------------------------------//

function movieThis(movieName) {
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(error, response, body) {
	  // If the request is successful
		if (!error && response.statusCode === 200) {

			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release Year: " + JSON.parse(body).Year);

			for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
				var source = JSON.parse(body).Ratings[i].Source;
				var sourceRating = JSON.parse(body).Ratings[i].Value;
				console.log(source + " rated it " + sourceRating);
			};

			console.log("Production Location: " + JSON.parse(body).Country);
			console.log("Language(s): " + JSON.parse(body).Language);
			console.log("Plot Summary: " + JSON.parse(body).Plot);
			console.log("Actor(s): " + JSON.parse(body).Actors);
		}
		else {
			return console.log('Error occurred: ' + error);
		}
	});
}

//-------------------TWITTER-------------------------------------//
//This will show your last 20 tweets and when they were created at in your terminal/bash window.

function seeMyTweets() {
var Twitter = require('twitter');
var twitterKeys = require('./keys');
var myTwitter = new Twitter(twitterKeys);
var params = {screen_name: 'TestLiri'};

	myTwitter.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
		    	console.log(tweets[i].text);
			};

	  	} 
	  	else {
	  		console.log(error);
	  	}
	});
}

//--------------------RANDOM-------------------------------------//

function randomDoThis() {

	var fs = require("fs");

	fs.readFile("random.txt", "utf8", function(error, data) {
		if(!error) {
	  		var dataArr = data.split(",");
	  		spotifyThis(dataArr[1]);
	  	}
	  	else {
	    	return console.log(error);
	  	}
	});
}