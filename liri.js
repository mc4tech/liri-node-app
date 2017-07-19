//using require to access the exports in keys.js
var unlock = require("./keys.js");
//creates vars for each key and secret in keys.js
var consumerKey = unlock.twitterKeys.consumer_key;
var consumerSec = unlock.twitterKeys.consumer_secret;
var accessKey = unlock.twitterKeys.access_token_key;
var accessSec = unlock.twitterKeys.access_token_secret;
// console.log(unlock.twitterKeys.consumer_key);
// console.log(consumerKey);
// console.log(consumerSec);
// console.log(accessKey);
// console.log(accessSec);

// spotify id/secret variables
var spotId = unlock.spotifyKeys.client_id;
var spotSec = unlock.spotifyKeys.client_secret;

//takes one of the following arguments: my-tweets, spotify-this-song, movie-this, or do-what-it-says
var nodeArgs = process.argv;

// The switch-case will direct which function gets run.
switch (nodeArgs[2]) {
	case "my-tweets":
	myTweets();
	break;

	case "spotify-this-song":
	spotify();
	break;

	case "movie-this":
	movie();
	break;

	case "do-what-it-says":
	doThis();
	break;

	default:
	console.log("Must choose one of the following: my-tweets, spotify-this-song, movie-this, or do-what-it-says.");
}

//runs when user types node liri.js my-tweets in command line
function myTweets() {
	var Twitter = require('twitter');
	var j = 0;
 
	var client = new Twitter({
	  consumer_key: consumerKey,
	  consumer_secret: consumerSec,
	  access_token_key: accessKey,
	  access_token_secret: accessSec
	});
	 
	var params = {screen_name:'devstudentgt'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	//loop will console log the 20 newest tweets
	  	for(var i = tweets.length-1; i >= tweets.length-20 && i >= 0; i--) {
	    	j++;
	    	console.log("Created at : " + tweets[i].created_at);
	    	console.log("Tweet " + j + " : " + tweets[i].text + "\n");
		}
	  }else{
	  	console.log(error);
	  }	
	});
};

function spotify() {
	
	var Spotify = require('node-spotify-api');
 	
 	var song = process.argv[3];

	var spotify = new Spotify({
		id: spotId,
	  	secret: spotSec
	});
	 
	if(song === undefined || song === ""){
		song = "the sign ace of base";
	}
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  	if (err) {
	    	return console.log('Error occurred: ' + err);
	    	console.log('You must enter a valid song ex : ' + "the sign ace of base");
	  	}else if(song != "the sign ace of base") {
		 	for(var i = 0; i < data.tracks.items.length && i < 5; i ++) {
			  	console.log("Song : " + data.tracks.items[i].name);
		     	console.log("Artist : " + data.tracks.items[i].artists[0].name);
		        console.log("Album : " + data.tracks.items[i].album.name);
		        console.log("Spotify URL : " + data.tracks.items[i].album.external_urls.spotify + "\n");
	    	}
	    }   console.log("Song : " + data.tracks.items[0].name);
		 	console.log("Artist : " + data.tracks.items[0].artists[0].name);
		    console.log("Album : " + data.tracks.items[0].album.name);
		    console.log("Spotify URL : " + data.tracks.items[0].album.external_urls.spotify);
		});
};


function movie() {

	var request = require("request");

	var movieName = "";

	// Loop through all the words in the nodeArgs
	for (var i = 3; i < nodeArgs.length; i++) {
	  if (i > 3 && i < nodeArgs.length) {
	    movieName = movieName + "+" + nodeArgs[i];
	  }else {
	    movieName += nodeArgs[i];
	  }
	};

	if(movieName === undefined || movieName === ""){
		movieName = "Mr. Nobody";
	};

	// console.log(movieName);
	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {

	  // tests if the request is successful
	  if (!error && response.statusCode === 200) {
	  	// console.log(body);
	    // Parse the body of the site and recover just the imdbRating
	    console.log("Title : " + JSON.parse(body).Title);
        console.log("Year : " + JSON.parse(body).Year);
        console.log("IMDB Rating : " + JSON.parse(body).Ratings[0].Value);
        console.log("Rotten Tomatoe : " + JSON.parse(body).Ratings[1].Value);
        console.log("Country : " + JSON.parse(body).Country);
        console.log("Language : " + JSON.parse(body).Language);
        console.log("Plot : " + JSON.parse(body).Plot);
        console.log("Actors : " + JSON.parse(body).Actors + "\n");
	  }else{
	  	console.log(error);
	  }

	});

};

function doThis() {
	// fs is a core Node package for reading and writing files
	var fs = require("fs");

	fs.readFile("random.txt", "utf8", function(error, data) {
		// If the code experiences any errors it will log the error to the console.
	    if (error) {
	  	  return console.log( error);
	  	};
	  	// console.log(data);

	  	var dataArr = data.split(",");
	  	// console.log(dataArr);

	  	function testFile(arg) {
	  		if(arg != "my-tweets" || "spotify-this-song" || "movie-this" || "do-what-it-says") {
	  			// console.log("arg 0 " + arg);
	  			process.argv[3] = arg;
	  		}
	  		// else {
	  			// console.log("arg 1 " + arg);
	  		// };
	  	};

	  	// for(var i = 0; i < dataArr.length; i++) {

	  		// var j = ++i;
	  		var arg = dataArr[1];
	  		// console.log("arg : " + arg);
	  		// console.log("data Arr : " + dataArr[0]);
			// The switch-case will direct which function gets run.
			switch (dataArr[0]) {
				case "my-tweets":
				testFile(arg);
				myTweets();
				break;

				case "spotify-this-song":
				testFile(arg);
				spotify();
				break;

				case "movie-this":
				movie();
				break;

				case "do-what-it-says":
				doThis();
				break;

				default:
				console.log("File does not contain command.");
			};
		// };

	});
};
