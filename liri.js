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
var action = process.argv[2];

// The switch-case will direct which function gets run.
switch (action) {
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
	    	console.log("Tweet " + j + " : " + tweets[i].text);
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
	 
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  	if (err) {
	    	return console.log('Error occurred: ' + err);
	  	}else if(song )
	 
	  	console.log(data.tracks.items[0].name);
     	console.log(data.tracks.items[0].artists[0].name);
        console.log(data.tracks.items[0].album.name);
        console.log(data.tracks.items[0].album.external_urls); 
	});
};
