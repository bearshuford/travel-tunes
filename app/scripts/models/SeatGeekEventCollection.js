import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import moment from 'moment';


import Artist from './SpotifyArtist';
import ArtistCollection from './SpotifyArtistCollection';


var Concert = Backbone.Model.extend({
  defaults: {
    favorite: false,
    name: ''
  }
});


var ConcertCollection = Backbone.Collection.extend({
  model : Concert,
  url : 'https://api.seatgeek.com/2/events?client_id=NjIyMDI4NXwxNDc5MzEwODUy',

  comparator: function(concert){
    return moment(concert.get('date')).add(concert.get('title').length,'milliseconds').toDate();
  },


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
  }
});


export default ConcertCollection;
