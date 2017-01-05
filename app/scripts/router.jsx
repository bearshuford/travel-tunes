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
    'login/': 'login',
		'trips/new': 'tripAdd',
    'trips/new/': 'tripAdd',
    'trips/:id/edit': 'tripEdit',
    'trips/:id/edit/': 'tripEdit',
    'trips/:id/new': 'tripDetailAdd',
    'trips/:id/new/': 'tripDetailAdd',
		'trips/:id': 'tripDetail',
    'trips/:id/': 'tripDetail',
		'trips': 'calendar',
    'trips/': 'calendar'

  },

  loginRedirect: function(){
    var loggedIn = (localStorage.getItem('sessionToken') !== null);
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

  tripEdit: function(tripId){
    ReactDOM.render(
      <Calendar
        edit={true}
        tripId={tripId}
        path={'#trips/'+tripId}/>,
      document.getElementById('root')
    );
    this.loginRedirect();
  },

  tripDetail: function(tripId){
    ReactDOM.render(
      <Calendar tripId={tripId} path={'#trips/'+tripId}/>,
      document.getElementById('root')
    );
    this.loginRedirect();

	},

  tripDetailAdd: function(tripId){

      ReactDOM.render(
        <Calendar new={true} tripId={tripId} path={'#trips/'+tripId}/>,
        document.getElementById('root')
      );

  }

});

var Router = new AppRouter();

export default Router;
