import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Backbone from 'backbone';

import App from './components/app.jsx'
import Login from './components/login.jsx'



var AppRouter = Backbone.Router.extend({

  routes: {
    '': 'index',
    'login': 'login',
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
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
    this.loginRedirect();
  },

  login: function(){

    ReactDOM.render(
      <App>
        <Login/>
      </App>,
      document.getElementById('root')
    );

    var loggedIn = (localStorage.getItem('sessionToken') !== null);
    if(loggedIn){
      this.navigate('', {trigger: true});
    }
  }

});

var Router = new AppRouter();

export default Router;
