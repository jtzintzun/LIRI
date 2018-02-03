require("dotenv").config()
var fs = require("fs");
var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request")


var command = process.argv[2]
var nodeArgs = process.argv;
var input = ""

for (var i = 3; i < nodeArgs.length; i++) {
    input =  input + " " + nodeArgs[i];
  }


var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);


switch (command) {
  case "my-tweets":
    myTweets()
    log()
    break;

  case "spotify-this-song":
    spotifyThisSong()
    log()
    break;

  case "movie-this":
    movieThis()
    log()
    break;

  case "do-what-it-says":
    doWhatItSays()
    log()
    break;
}  // Ends switch

function myTweets(){
  console.log("my Tweets " + input);

var params = {
  // q: 'dogs',
  count: 20
};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      console.log("========================================================================================");
      console.log("");
      console.log("This tweet was created at: " + tweets[0].created_at);
      console.log("tweet: " + tweets[0].text);
      console.log("");
      console.log("========================================================================================");

    }
  });

} //Ends function

function spotifyThisSong() {

  if (input === "") {
    input = "The Sign by Ace of Base"
  }


  spotify.search({ type: 'track', query: input, limit:1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

  console.log("");
  console.log("========================================================================================");
  console.log("");
  console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
  console.log("");
  console.log("The song's name: " + data.tracks.items[0].name);
  console.log("");
  console.log("A preview link of the song from Spotify: " + data.tracks.items[0].album.external_urls.spotify);
  console.log("");
  console.log("The album that the song is from: " + data.tracks.items[0].album.name);
  console.log("");
  console.log("========================================================================================");
  console.log("");


  });

} //Ends function

function movieThis() {

if (input === "") {
  input = "Mr. Nobody"
}

  request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

    if (!error && response.statusCode === 200) {

      console.log("");
      console.log("========================================================================================");
      console.log("");
      console.log("Title of the movie is: " + JSON.parse(body).Title);
      console.log("");
      console.log("The movie's year is: " + JSON.parse(body).Year);
      console.log("");
      console.log("IMDB rating of the movie: " + JSON.parse(body).imdbRating);
      console.log("");
      console.log("Rotten Tomatoes rating of the movie: " + JSON.parse(body).Ratings[1].Value);
      console.log("");
      console.log("Country where the movie was produced: " + JSON.parse(body).Country);
      console.log("");
      console.log("Language of the movie: " + JSON.parse(body).Language);
      console.log("");
      console.log("Plot of the movie: " + JSON.parse(body).Plot);
      console.log("");
      console.log("Actors in the movie: " + JSON.parse(body).Actors);
      console.log("");
      console.log("========================================================================================");
      console.log("");

    }
  });

} //Ends function

function doWhatItSays() {
  console.log("do what it says " + input);

fs.readFile("random.txt", "utf8", function(error, data){
  if (error) {
    return console.log(error);
  }
  console.log(data);
  var dataArr = data.split(",");
  input = dataArr[1]
  command = dataArr[0]
  spotifyThisSong(input)

})

} //Ends function

function log(){
  fs.appendFile("log.txt", "," + command, function(err){
    if (err) {
      console.log(err);
    } else{
      console.log("command registrered");
    }
  })
}
