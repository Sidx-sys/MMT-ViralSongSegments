var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
require('dotenv').config()

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '886f020eb8dc4a34976575cc87cb47fa',
    clientSecret: 'f488c7e2bb674e168b0f752066cdce3d',
    redirectUri: 'http://www.example.com/callback'
});

spotifyApi.setAccessToken(process.env.TOKEN);
// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
    function (data) {
        // console.log('Artist albums', data.body);
        console.log("spotify api working :)");
    },
    function (err) {
        console.error(err);
    }
);


app.post("/search", (req, res, next) => {
    spotifyApi.searchTracks(req.body.name)
        // spotifyApi.searchTracks('one kiss')
        .then(function (data) {
            console.log(req.body)
            console.log("searched")
            // console.log('Search by "One kiss"', data.body.tracks.items[0]);
            res.set('Access-Control-Allow-Origin', '*');
            res.status(200).json(data.body.tracks.items);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
});

app.get("/features", (req, res, next) => {
    console.log(req.query.id)
    spotifyApi.getAudioFeaturesForTrack(req.query.id)
        .then(function (data) {
            console.log('Audio features : "', data.body);
            res.set('Access-Control-Allow-Origin', '*');
            res.status(200).json(data.body);
        }, function (err) {
            console.log('Something went wrong!', err);
            res.status(500).json(err);
        });
});

app.get("/analysis", (req, res, next) => {
    spotifyApi.getAudioAnalysisForTrack(req.query.id)
        .then(function (data) {
            console.log('Audio analysis : "', data.body);
            res.set('Access-Control-Allow-Origin', '*');
            res.status(200).json(data.body);
        }, function (err) {
            console.log('Something went wrong!', err);
            res.status(500).json(err);
        });
});

app.post("/genre", (req, res, next) => {
    spotifyApi.searchTracks(req.body.name)
        // spotifyApi.searchTracks('one kiss')
        .then(function (data) {
            console.log(req.body)
            console.log("searched")
            // res.set('Access-Control-Allow-Origin', '*');
            // res.status(200).json(data.body.tracks.items);
            spotifyApi.getTrack(data.body.tracks.items[0].id)
                .then(function (data) {
                    console.log('Track information', data.body);
                    res.set('Access-Control-Allow-Origin', '*');
                    res.status(200).json(data.body);
                }, function (err) {
                    console.error(err);
                    res.status(500).json(err);
                });
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
});

app.post("/albumfeatures", (req, res, next) => {
    spotifyApi.getAudioFeaturesForTracks(req.body.ids)
        .then(function (data) {
            console.log('Audio features for tracks', data.body);
            res.set('Access-Control-Allow-Origin', '*');
            res.status(200).json(data.body);
        }, function (err) {
            console.log('Something went wrong!', err);
            res.status(500).json(err);
        });
});

app.post("/gettrack", (req, res, next) => {
    spotifyApi.getTrack(req.body.id)
        .then(function (data) {
            console.log('Track information', data.body);
            res.set('Access-Control-Allow-Origin', '*');
            res.status(200).json(data.body);
        }, function (err) {
            console.error(err);
            res.status(500).json(err);
        });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});