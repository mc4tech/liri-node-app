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
	doIt();
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
	 
	if(song === undefined){
		song = "the sign ace of base";
	}
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  	if (err) {
	    	return console.log('Error occurred: ' + err);
	    	console.log('You must enter a valid song ex : ' + "the sign ace of base");
	  	}
	 	for(var i = 0; i < data.tracks.items.length && i < 5; i ++) {
		  	console.log("Song : " + data.tracks.items[i].name);
	     	console.log("Artist : " + data.tracks.items[i].artists.name);
	        console.log("Album : " + data.tracks.items[i].album.name);
	        console.log("Spotify URL : " + data.tracks.items[i].album.external_urls.spotify + "\n");
    	}
	});
};

function movie() {

	var request = require("request");

	// Create an empty variable for holding the movie name
	var movieName = "";

	// Loop through all the words in the node argument
	// And do a little for-loop magic to handle the inclusion of "+"s
	for (var i = 3; i < nodeArgs.length; i++) {

	  if (i > 3 && i < nodeArgs.length) {

	    movieName = movieName + "+" + nodeArgs[i];

	  }

	  else {

	    movieName += nodeArgs[i];

	  }
	}

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	// This line is just to help us debug against the actual URL.
	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {

	  // If the request is successful
	  if (!error && response.statusCode === 200) {
	  	// console.log(body);
	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    console.log("Title : " + JSON.parse(body).Title);
        console.log("Year : " + JSON.parse(body).Year);
        console.log("IMDB Rating : " + JSON.parse(body).Ratings[0].Value);
        console.log("Rotten Tomatoe : " + JSON.parse(body).Ratings[1].Value);
        console.log("Country : " + JSON.parse(body).Country);
        console.log("Language : " + JSON.parse(body).Language);
        console.log("Plot : " + JSON.parse(body).Plot);
        console.log("Actors : " + JSON.parse(body).Actors + "\n");
	  }
	});

};
