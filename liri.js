var fs = require("fs");
var request = require("request");
var inquirer = require("inquirer");


//Getting users input from the command line. 
var userCommand;
var combinedInput;

//Version 1 --> Use process.argv to get commands from users
// var userCommand = process.argv[2];
// var userInput = process.argv.slice(3);
// var combinedInput = userInput.join(' ');

//Version 2 --> Use inquirer to get data from users
var askForInput = function() {

inquirer.prompt([
	{	type: "list",
  		name: "inquirerCommand",
	  	choices: [
	      'Spotify',
	      'Twitter',
	      'Movie',
	      'Random'],
  		message: "What can I do for you?"
  	},
    { 	type: "input",
   		name: "inquirerDetails",
    	message: "What would you like to hear?"
  	}
  	]).then(function(answers) {
  		
  	console.log(answers.inquirerCommand);
  	console.log(answers.inquirerDetails);

  	if(answers.inquirerCommand === 'Spotify') {
  		userCommand = 'spotify-this-song';
  		combinedInput = answers.inquirerDetails;
  		console.log(userCommand);
  		console.log(combinedInput);
  	}
  	if(answers.inquirerCommand === 'Twitter') {
  		userCommand = 'my-tweets';
  		console.log(userCommand);
  	}
  	if(answers.inquirerCommand === 'Movie Info') {
  		userCommand = 'movie-this';
 		combinedInput = answers.inquirerDetails;
 		console.log(userCommand);
  		console.log(combinedInput);
  	}
  	if(answers.inquirerCommand === 'Random') {
  		userCommand = 'do-what-it-says';
  		console.log(userCommand);
  	}
	
	switch(userCommand) {
	    case 'spotify-this-song':
	    	spotifyThis(combinedInput);
	    	writeToLog();
	        break;
	    case 'movie-this':
	    	movieThis(combinedInput);
	        writeToLog();
	        break;
	    case 'my-tweets':
	    	seeMyTweets();
	        writeToLog();
	        break;
	    case 'do-what-it-says':
	    	randomDoThis();
	        writeToLog();
	        break;
	}
});

};

askForInput();






//This function will write all users search to the log.txt file
function writeToLog() {
  fs.appendFile("log.txt", [userCommand,combinedInput] + "\r\n", function(err) {
    if (err) {
      return console.log(err);
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
	spotify.search({ type: 'track', query: songSearch, limit: 1}, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  } 

	  else{

		  for (var i = 0; i < data.tracks.items.length; i++) {
		  		console.log('Song: ', data.tracks.items[i].name);
				console.log('Album: ', data.tracks.items[i].album.name);
				console.log('Artist: ', data.tracks.items[i].artists[0].name);
				//Create a variable to hold the song URL, either preview or full
				var currentSong;
				if(data.tracks.items[i].preview_url === null) {
				console.log('Preview: Sorry there is no preview, but paste this URL into the browser to hear the full song.')
				currentSong = data.tracks.items[i].external_urls.spotify;
				console.log(currentSong);

				} else {
		  		currentSong = data.tracks.items[i].preview_url;
		  		console.log('Preview: ', currentSong);		
				}
				//Open the currentSong in the browser and play. 
				var open = require('mac-open');
				open(currentSong);
			};
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
	});
}

//-------------------TWITTER-------------------------------------//
//This will show your last 20 tweets and when they were created at in your terminal/bash window.

function seeMyTweets() {
var Twitter = require('twitter');
var twitterKeys = require('./keys');
var myTwitter = new Twitter(twitterKeys);

console.log(myTwitter);

	var params = {screen_name: 'TestLiri'};
	myTwitter.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    // console.log('TweetsAmy' + tweets);
	    console.log('Test')
	    console.log(JSON.parse(response.body));

	  } else {
	  	console.log(error);
	  }
	});

}

//--------------------RANDOM-------------------------------------//

function randomDoThis() {

var fs = require("fs");

fs.readFile("random.txt", "utf8", function(error, data) {
  if (error) {
    return console.log(error);
  }
  var dataArr = data.split(",");
  spotifyThis(dataArr[1]);

});

	
}



 