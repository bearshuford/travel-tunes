import $ from 'jquery';
import Backbone from 'backbone';

import ParseModel from './ParseModel';
import setupParse from './../setupParse';

var User = ParseModel.extend({
	idAttribute: 'objectId',
  urlRoot: 'https://maeve.herokuapp.com/users',

  handleBadResponse: function(response) {
    var r = response.responseJSON;

    if(r.code === 202) {
      console.log('account already exists');
    }
    else {
      console.log('new bad response!', r);
    }
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


    // $.get(url + path).then(function(response){
    //   self.handleResponse(response, username);
    // 	callback();
    // });
    $.ajax({
      type: 'GET',
      url: url + path,
      beforeSend: setupParse
    }).done(function(response){
      self.handleResponse(response, username);
    	callback();
    });
  },


  logout: function(){
    var url = 'https://maeve.herokuapp.com/logout';

    var token = localStorage.getItem('sessionToken');
    localStorage.clear();

    $.ajax({
      type: 'POST',
      url: url,
      beforeSend: setupParse
    }).done(function(response){
      console.log('signed out');
    });
    Backbone.history.navigate('login', {trigger: true})
  }
});


export default User;
