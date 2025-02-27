require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials")

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get("/", (req,res,next)=>{
    res.render("home")
})

app.get("/artist-search", (req,res,next)=>{
    
    const {search} = req.query //TODO vamos solo por los datos 
    spotifyApi
  .searchArtists(search) //TODO me trae solo el dato del artista
  .then((data) => {
    
    res.render("artist-search-result",{albums:data.body.artists.items})
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res, next) => {
  const { id } = req.params;
  console.log("ENTRANDO A ID",id);
  spotifyApi.getArtistAlbums(id)
  .then( (data) => {
     
      res.render("albums", { artist: data.body.items});
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((error) => {
      console.log("error", error);
      res.send("error no se ha encontrado la info ");
    });
});

  



app.listen(3008, () => console.log('My Spotify project running on port 300 🎧 🥁 🎸 🔊'));
