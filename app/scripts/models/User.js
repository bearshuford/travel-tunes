import $ from 'jquery';
import Backbone from 'backbone';

var User = Backbone.Model.extend({
	idAttribute: 'objectId',
  urlRoot: 'https://maeve.herokuapp.com/users',

	beforeSave: function(){
    console.log('before we save')
		$.ajaxSetup({
			beforeSend: function(xhr){
				xhr.setRequestHeader('X-Parse-Application-Id', 'maeve'),
				xhr.setRequestHeader('X-Parse-REST-API-Key',   'clementine')
			}
		});
    return true;
	},

	save: function (key, val, options) {
    this.beforeSave(key, val, options);
    return Backbone.Model.prototype.save.call(this, key, val, options);
  },


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

    console.log('handleResponse', response);

		$.ajaxSetup({
			beforeSend: function(xhr){
				xhr.setRequestHeader('X-Parse-Session-Token',  response.sessionToken);
			}
		});
    console.log('response.sessionToken',response.sessionToken)
    console.log('username:',username);
			if(response.sessionToken){

				localStorage.setItem('username', 		 username);
				localStorage.setItem('userId', 	 	   response.objectId);
				localStorage.setItem('sessionToken', response.sessionToken);
			}
	},


  signup: function(username, password, callback){
    var self = this;
    console.log('username', username);
    var user = {'username': username, 'password': password};
    console.log('user',user);

    this.save(user).then(function(response){
			self.handleResponse(response, username);
      console.log(callback);
			callback();
    });
  },


  login: function(username, password, callback){
    var url  = 'https://maeve.herokuapp.com/login';
    var path = '?username='+username+'&password='+encodeURI(password);
    var self = this;

    $.get(url + path).then(function(response){
			self.handleResponse(response, username);
    	callback();
    });
  },


  logout: function(){
    var url = 'https://maeve.herokuapp.com/logout';

    var token = localStorage.getItem('sessionToken');
    localStorage.clear();

    $.post(url).then(function(response){
      // Backbone.history.navigate('login', {trigger: true})
      console.log('signed out');
    });
    Backbone.history.navigate('login', {trigger: true})
  }
});

export default User;
