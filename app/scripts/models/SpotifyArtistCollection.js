import $ from 'jquery';
import Backbone from 'backbone';


import Artist from './SpotifyArtist';
import ParseCollection from './ParseCollection';

var ArtistCollection = ParseCollection.extend({
  model: Artist,

  getTopTracks: function(number){
    return this.map(function(artist){
      return artist.getTopTracks(number);
    });
  }
});

export default ArtistCollection;
