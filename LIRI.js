require("dotenv").config()
var fs = require("fs");
var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request")
var inquirer = require("inquirer");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var command
var input


questionaryCommand();

// ========= Main quesationary - Function

function questionaryCommand() {

  inquirer.prompt([

      {
        type: "list",
        message: "What do you want to do?",
        choices: ["My tweets", "Spotify this song", "Movie this", "Do what it says", "EXIT"],
        name: "toDo"
      }
    ])


    .then(function(inquirerResponse) {

      command = inquirerResponse.toDo

      switch (command) {
        case "My tweets":
          myTweets()
          log()
          break;

        case "Spotify this song":
          inputSong()
          log()
          break;

        case "Movie this":
          inputMovie()
          log()
          break;

        case "Do what it says":
          doWhatItSays()
          log()
          break;

        case "EXIT":
          exit()
          break;
      } // Ends switch

    });

}

// input for movie search

function inputMovie() {

  inquirer.prompt([

      {
        type: "input",
        message: "Especify the movie:",
        name: "selection"
      }

    ])

    .then(function(inquirerResponse) {
      input = inquirerResponse.selection
      movieThis()
    });
}

// input for movie search

function inputSong() {

  inquirer.prompt([{
        type: "input",
        message: "Especify the song:",
        name: "selection"
      }

    ])

    .then(function(inquirerResponse) {
      input = inquirerResponse.selection
      spotifyThisSong()
    });
}

/// ========= functions ==============

// ========= Tweeter query

function myTweets() {

  var params = {
    q: 'dogs',
    count: 20
  };
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      console.log("========================================================================================");
      console.log("");
      console.log("This tweet was created at: " + tweets[0].created_at);
      console.log("");
      console.log("tweet: " + tweets[0].text);
      console.log("");
      console.log("========================================================================================");

      questionaryCommand()

    }
  });
} //Ends function

// ========= Spotify query

function spotifyThisSong() {

  // Default option in case not user input

  if (input === "") {
    input = "The Sign, Ace of Base"
  }

// request to API

  spotify.search({
    type: 'track',
    query: input,
    limit: 1
  }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

// CASE UN DEFINED SONG

    if (typeof(data.tracks.items[0]) === 'undefined') {
      console.log("*****************************************************************************************");
      console.log("");
      console.log("SORRY!!! We don't have this song yet!");
      console.log("");
      console.log("*****************************************************************************************");
      console.log("");

    } else {

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
    }
    questionaryCommand()

  });

} //Ends function

// ========= OMDBA query

function movieThis() {

  // Default option in case not user input
  if (input === "") {
    input = "Mr. Nobody"
  }

  // request to API

  request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

    if (!error && response.statusCode === 200) {

// CASE UN DEFINED MOVIE

      if (typeof(JSON.parse(body).Title) === 'undefined') {
        console.log("*****************************************************************************************");
        console.log("");
        console.log("SORRY!!! We don't have this Title yet!");
        console.log("");
        console.log("*****************************************************************************************");
        console.log("");

      } else {

        console.log("");
        console.log("========================================================================================");
        console.log("");
        console.log("Title of the movie is: " + JSON.parse(body).Title);
        console.log("");
        console.log("The movie's year is: " + JSON.parse(body).Year);
        console.log("");
        console.log("IMDB rating of the movie: " + JSON.parse(body).imdbRating);
        console.log("");

// CASE UN DEFINED TOTTEN TOMATOES

        if (typeof(JSON.parse(body).Ratings[1]) === 'undefined') {
          console.log("*****************************************************************************************");
          console.log("");
          console.log("This movie is a classic !!! Rotten Tomatoes did not exist back in " + JSON.parse(body).Year);
          console.log("");
          console.log("*****************************************************************************************");
          console.log("");
        } else {

          console.log("Rotten Tomatoes rating of the movie: " + JSON.parse(body).Ratings[1].Value);
          console.log("");

        }
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
      questionaryCommand()
    }
  });

} //Ends function

// ========= do what ut says query
function doWhatItSays() {

  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    input = dataArr[1]
    command = dataArr[0]
    spotifyThisSong(input)
    questionaryCommand()
  })

} //Ends function

// ========= log funtion

function log() {
  fs.appendFile("log.txt", "," + command, function(err) {
    if (err) {
      console.log(err);
    }
  })
}

// ========= Exist function

function exit() {
  console.log("See you later");
}
