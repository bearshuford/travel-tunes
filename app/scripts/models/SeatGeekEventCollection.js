import $ from 'jquery';
import Backbone from 'backbone';

import setupParse from './../setupParse'; // setupParse(clear=true)

var Concert = Backbone.Model.extend();

// Backbone & JSONP - https://gist.github.com/michielvaneerd/5989839


var ConcertCollection = Backbone.Collection.extend({
  model : Concert,
  url : "https://api.seatgeek.com/2/events?client_id=NjIyMDI4NXwxNDc5MzEwODUy",
  sync : function(method, collection, options) {
    // options.dataType = "jsonp";
    var clear = true;
    console.log('clear',clear)
    return Backbone.sync(method, collection, options);
  },
  parse : function(response) {
    console.log('parse', response.events);

    var concerts = response.events.map(function(r){

      var artists = r.performers.map(function(artist){
        return artist.name;
      });

      return {
        title: r.title,
        artists: artists,
        date: r['datetime_local'],
        //date: r['datetime_utc'],
        type: r.type,
        venue: {
          name: r.venue.name,
          address: r.venue.address,
          location: r.venue.location
        },
        generalAdmission: r.general_admission
      }
    });


    return concerts;
  }
});

// var events = new SGEventCollection();
//
// artists.fetch({
//   data : {
//     q : "bananarama"
//   },
//   success : function(collection, response, options) {
//     console.log(collection);
//     console.log(response);
//     console.log(options);
//   },
//   error : function(collection, response, options) {
//     console.log(response.statusText);
//   },
//   // A timeout is the only way to get an error event for JSONP calls!
//   timeout : 5000
// });


export default ConcertCollection;
