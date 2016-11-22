import $ from 'jquery';
import Backbone from 'backbone';


import Artist from './SpotifyArtist';

var ArtistCollection = Backbone.Collection.extend({
  model: Artist,

  defaults: {
    spotify: false
  },

  getTopTracks: function(number){
    var artists = this.get('spotify') ? this : this.spotifyArtists();
    var tracks = artists.map(function(artist){
      artist.getTopTracks();
    });

    console.log('tracks:',tracks);
    return tracks;
  },

  spotifyArtists: function(){
    this.set({spotify: true});
    return this.where({spotify: true});
  }

});

export default ArtistCollection;
