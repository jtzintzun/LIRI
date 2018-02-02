require("dotenv").config()
var fs = require("fs");
var keys = require("./keys.js")

var command = process.argv[2]
var nodeArgs = process.argv;
var input = ""

for (var i = 3; i < nodeArgs.length; i++) {
    input =  input + " " + nodeArgs[i];
  }



console.log('======================');
console.log('KEYS IMPORTED');
console.log(keys);
console.log('======================');

var spotify = keys.spotify;
var client = keys.twitter;

//
console.log('======================');
console.log('Spotify - KEYS IMPORTED');
console.log(spotify);
console.log('======================');
console.log('Twitter - KEYS IMPORTED');
console.log(client);
console.log('======================');


switch (command) {
  case "my-tweets":
    myTweets()
    break;

  case "spotify-this-song":
    spotifyThisSong()
    break;

  case "movie-this":
    movieThis()
    break;

  case "do-what-it-says":
    doWhatItSays()
    break;
}  // Ends switch

function myTweets(){
  console.log("my Tweets " + input);
} //Ends function

function spotifyThisSong() {
  console.log("my Song " + input);
} //Ends function

function movieThis() {
  console.log("my movie " + input);
} //Ends function

function doWhatItSays() {
  console.log("do waht ut says " + input);
} //Ends function
