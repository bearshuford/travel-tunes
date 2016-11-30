import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';

import Artist from './SpotifyArtist';
import ArtistCollection from './SpotifyArtistCollection';


var Concert = Backbone.Model.extend({
  defaults: {
    favorite: false
  }
});


var ConcertCollection = Backbone.Collection.extend({
  model : Concert,
  url : "https://api.seatgeek.com/2/events?client_id=NjIyMDI4NXwxNDc5MzEwODUy",

  parse : function(response) {

    var concerts = response.events.map(function(r){

      var artists = r.performers.map(function(artist){
        return new Artist({
          name: artist.name,
          sgId: artist.id
        });
      });

      return {
        artists: new ArtistCollection(artists),
        date:    r['datetime_local'],
        price:   r.stats['lowest_price'],
        title:   r.title,
        type:    r.type,
        score:   r.score,
        sgUrl:   r.url,
        sgId:    r.id,
        venue: {
          name:     r.venue.name,
          address:  r.venue.address,
          location: r.venue.location,
          url:      r.venue.url
        }
      };
    });
    return concerts;
  },

  // getAllArtists: function(){
  //   console.log('this',this);
  //   var self = this;
  //   var a = new ArtistCollection();
  //   self.each(function(concert){
  //     concert.get('artists').each(function(artist){
  //       a.add(artist, {silent:true})
  //     });
  //   });

  //   console.log('all artists',a);
  //   return a;
  // }
});


export default ConcertCollection;
