import $ from 'jquery';
import Backbone from 'backbone';


import Artist from './SpotifyArtist';

var ArtistCollection = Backbone.Collection.extend({
  model: Artist,


  getTopTracks: function(number, callback){

    var tracks = this.map(function(artist, i){
      // artist.getTopTracks().then();
      return artist.getTopTracks();
    });

    console.log('tracks:',tracks);
    return tracks;
  },

  spotifyArtists: function(){
    var sa = this.map(function(artist){
      if(artist.get('spotify'))
        console.log('SPOTIFY!!!', artist.get('name'));
        return artist;
    });
    console.log('saaa',sa);
    return new ArtistCollection(sa);
  }

});

export default ArtistCollection;
