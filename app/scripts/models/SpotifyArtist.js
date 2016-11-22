import $ from 'jquery';
import Backbone from 'backbone';
import Spotify from 'spotify-web-api-js';


import setupParse from './../setupParse'; // setupParse(clear=true)


var SpotifyApi = new Spotify();


var Artist = Backbone.Model.extend({

  spotifyApi: SpotifyApi,

  urlRoot: 'https://api.spotify.com/v1/search',

  defaults: {
    name: '',
    spotify: false,
    added: false
  },

  getTopTracks: function(number, callback){
    var self = this;

    if(!this.get('spotify')){
      console.log('bail');
      return false;
    }

    if(!number) {
      number = 3;
    }
    console.log('top track yeah');
    this.spotifyApi.getArtistTopTracks(this.get('spotifyId'), 'US')
      .then(function(data){

        console.log('top tracks:', data.tracks);

        var tracks = data.tracks.slice(0,number).map(function(track){

          var album = {
            type:   track.album['album_type'],
            id:     track.album.id,
            images: track.album.images,
            uri:    track.album.uri
          };
          return {
            album:      track.album,
            uri:        track.uri,
            id:         track.id,
            name:       track.name,
            explicit:   track.explicit,
            mp3Url:     track['preview_url'],
            duration:   track['duration_ms'],
            number:     track['track_number'],
            popularity: track.popularity
          };

        });
        console.log('tracks', tracks);
        return tracks;
      },

      function(err) {
        console.error(err);
      });
  },

  search: function(callback){
    var self = this;
    this.spotifyApi.searchArtists(this.get('name'), {limit: 1})
    .then(function(data) {
      var artist = {};
      var items = data.artists.items

      if(items.length < 1) {
        artist = {
          spotify: false
        };
      }
      else {
        var r = data.artists.items[0];
        console.log('Search artists by', self.get('name'), ':', data);

        if(self.get('name').toUpperCase() !== r.name.toUpperCase()){
          artist = {
            spotify: false
          };        }
        else {
          artist = {
            spotify: true,
            spotifyId: r.id,
            uri: r.uri,
            genres: r.genres,
            images: r.images,
            popularity: r.popularity,
            spotifyName: r.name,
            spotifyLink: r['external_urls'].spotify
          };
        }
      }

      self.set(artist);
      console.log(self.toJSON());
      if(callback){
        callback(self);
      };

    }, function(err) {
      console.error(err);
    });
  },


  setAccessToken: function(token){

  }

});




export default Artist;
