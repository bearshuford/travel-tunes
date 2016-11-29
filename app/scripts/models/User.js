import $ from 'jquery';
import Backbone from 'backbone';

import ParseModel from './ParseModel';
import setupParse from './../setupParse';

var User = ParseModel.extend({
	idAttribute: 'objectId',
  urlRoot: 'https://maeve.herokuapp.com/users',

  handleBadResponse: function(response) {
    var code = response.responseJSON.code;
    var err  = (code === 202) ? 'account already exists' : 'new bad response!';
    console.log(err);
  },

  handleResponse: function(response, username){
		if(response.sessionToken){
			localStorage.setItem('username', 		 username);
			localStorage.setItem('userId', 	 	   response.objectId);
			localStorage.setItem('sessionToken', response.sessionToken);
		}
	},

  signup: function(username, password, callback){
    var user = {'username': username, 'password': password};
    var self = this;

    this.save(user).then(function(response){
			self.handleResponse(response, username);
			callback();
    });
  },

  login: function(username, password, callback){
    var url  = 'https://maeve.herokuapp.com/login';
    var path = '?username='+username+'&password='+encodeURI(password);
    var self = this;

    $.ajax({
      type:       'GET',
      url:        url + path,
      beforeSend: setupParse
    })
    .done(function(response){
      self.handleResponse(response, username);
    	callback();
    });
  },


  logout: function(){
    var url = 'https://maeve.herokuapp.com/logout';

    var token = localStorage.getItem('sessionToken');
    localStorage.clear();

    $.ajax({
      url:        url,
      type:       'POST',
      beforeSend: setupParse
    })
    .done(function(response){
      console.log('signed out');
    });
    Backbone.history.navigate('login', {trigger: true})
  }
});


export default User;
