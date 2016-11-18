import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Backbone from 'backbone';

import App from './components/app.jsx';
import Login from './components/login.jsx';
import Calendar from './components/calendar.jsx';
import TripDetail from './components/tripDetail.jsx';


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

	tripDetail: function(id){
		ReactDOM.render(
			<TripDetail tripId={id}/>,
			document.getElementById('root')
		);
		this.loginRedirect();

	}

});

var Router = new AppRouter();

export default Router;
