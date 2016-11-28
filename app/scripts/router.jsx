import $        from 'jquery';
import React    from 'react';
import ReactDOM from 'react-dom';
import Backbone from 'backbone';

/* components */
import App        from './components/app.jsx';
import Login      from './components/login.jsx';
import Calendar   from './components/calendar.jsx';
import TripDetail from './components/tripDetail.jsx';

/* models & collections */
import Trip             from './models/Trip';
import EventCollection  from './models/SeatGeekEventCollection.js';
import ArtistCollection from './models/SpotifyArtistCollection.js';


var AppRouter = Backbone.Router.extend({

  routes: {
    '': 'index',
    'login': 'login',
		'trips/new': 'tripAdd',
		'trips/:id': 'tripDetail',
		'trips': 'calendar'

  },

  initialize: function(){

  },

  loginRedirect: function(){
    var loggedIn = (localStorage.getItem('sessionToken') !== null);
    console.log('loginRedirect');
    if(!loggedIn){
      this.navigate('login', {trigger: true});
    }
  },

  index: function(){
		this.navigate('trips',{trigger: true});
  },

  login: function(){

    ReactDOM.render(
      <Login/>,
      document.getElementById('root')
    );

    var loggedIn = (localStorage.getItem('sessionToken') !== null);
    if(loggedIn){
      this.navigate('', {trigger: true});
    }
  },

	calendar: function(){
		ReactDOM.render(
			<Calendar/>,
			document.getElementById('root')
		);
		this.loginRedirect();
	},

	tripAdd: function(){
		ReactDOM.render(
			<Calendar new={true}/>,
			document.getElementById('root')
		);
		this.loginRedirect();
	},

	tripDetail: function(tripId){
    var trip = new Trip({'objectId': tripId});
    var self = this;
    trip.fetch({
      success: function(){
        console.log('fetched');
        ReactDOM.render(
          <TripDetail model={trip} collection={new ArtistCollection()}/>,
          document.getElementById('root')
        );
        self.loginRedirect();
      }
    });

	}

});

var Router = new AppRouter();

export default Router;
