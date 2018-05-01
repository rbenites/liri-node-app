/*========REQUIRE=======*/
require("dotenv").config({ path: '../.env' });
//code for importing NPMs
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var jsonfile = require("jsonfile");
var request = require('request');
//enables read/write to file system
var fs = require("fs");

/*========KEYS=======*/
//Store keys in Var
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

/*========INPUT VARS=======*/
//get the user input and store
var userInput = process.argv;
//get and store process.argv[2]
var action = userInput[2];
//stores users search term as an array of words
var searchArr = [];
//Stores the user search as a combined serch term
var search;
//creates a new line then adds the dashes
var formating = '--------------------------\r\n';

for (var i = 3; i < userInput.length; i++) {
    //add the input to the end of whats stored in userInput[i]
    searchArr.push(userInput[i]);
    //join all elements of the search Arr array into a string with spaces between each word
    search = searchArr.join(' ');
}

runMe(action);

function runMe(action) {
    switch (action) {
        case "my-tweets":
            brcaTweets();
            break;
        case "spotify-this-song":
            if (search != undefined) {
                spotifyThisSong(search);
            } else {
                defaultSong();
            }
            break;
        case 'movie-this':
            if (search != undefined) {
                movieThis(search);
            } else {
                defaultMovie();
            }
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("Please pick either my-tweets, spotify-this-song, movie-this, or do-what-it-says");
            break;
    }
}

function brcaTweets() {
    //console.log("You are in " + action);
    var params = {
        screen_name: 'groupBRCA'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error && response.statusCode === 200) {
            //console.log("in if of " + action);
        }
        //console.log("out of if in " + action);
        console.log(formating);
        fs.appendFileSync('../log.txt', "\n--------------------------\nThis Shows the last 20 Twitter results from groupBRCA\n", function (err) {
            if (err) throw err;
        });
        for (var i = 0; i < tweets.length; i++) {
            //console.log("in the for of " + action);
            var data = tweets[i];
            console.log("Username: " + data.user.name);
            console.log("This is Tweet " + [i + 1] + " of " + tweets.length);
            console.log("Tweet: " + data.text);
            console.log("Created on: " + data.created_at);
            console.log(formating);

            //this logs the search to the log file
            fs.appendFileSync('../log.txt', "\nThis is Tweet " + [i + 1] + " of " + tweets.length, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nTweet: " + data.text, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nCreated on: " + data.created_at, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\n--------------------------\n", function (err) {
                if (err) throw err;
            });
            console.log("\nSearch saved to log.txt");
        }
    });
}

function spotifyThisSong(song) {
    // console.log("You are in " + action);
    spotify
        .search({
            type: 'track',
            query: song,
            limit: 20
        })
        .then(function (response) {

            console.log(formating);
            //Artist name
            console.log("Artist: " + response.tracks.items[0].name);
            // The song's name from the first result
            console.log("Track Name: " + response.tracks.items[0].album.name);
            // A preview link of the song from Spotify
            console.log("Preview URL: " + response.tracks.items[0].preview_url);
            // The album that the song is from
            console.log("Album: " + response.tracks.items[0].album.name);

            //this logs the Search to log the file
            fs.appendFileSync('../log.txt', "\n--------------------------\nThis is a new Spotify Search\n", function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nArtist: " + response.tracks.items[0].name, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nTrack Name: " + response.tracks.items[0].album.name, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nPreview URL: " + response.tracks.items[0].preview_url, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nAlbum: " + response.tracks.items[0].album.name, function (err) {
                if (err) throw err;
            });
            console.log("\nSearch saved to log.txt");
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieThis(movie) {
    //This is where I will respond to movie-this
    // take the input from 'search'
    request('https://www.omdbapi.com/?t=' + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(formating);
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year Released: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log(formating);

            //this logs the Search to log the file
            fs.appendFileSync('../log.txt', "\n--------------------------\nThis is a new Movie Search\n", function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nTitle: " + JSON.parse(body).Title, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nYear Released: " + JSON.parse(body).Year, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nCountry: " + JSON.parse(body).Country, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nLanguage: " + JSON.parse(body).Language, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nPlot: " + JSON.parse(body).Plot, function (err) {
                if (err) throw err;
            });
            fs.appendFileSync('../log.txt', "\nActors: " + JSON.parse(body).Actors, function (err) {
                if (err) throw err;
            });
            console.log("\nSearch saved to log.txt");
        }
    });
}

function doWhatItSays() {
    // This is where I will respond to do-what-it-says
    // pull the search info from the random.txt file
    fs.readFile('../random.txt', "utf8", function (err, data) {
        responseArr = data.split(',');
        action = responseArr[0];
        query = responseArr[1];
        runMe(action);
    });
}

function defaultMovie() {
    movieThis("Mr. Nobody");
}

function defaultSong() {
    spotifyThisSong("Say it ain't so");
}
