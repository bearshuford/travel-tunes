import React from 'react';
import Backbone from 'backbone';

import {Paper, RaisedButton} from 'material-ui'



import App from './app.jsx';
import User from './../models/User';




const styles = {
  login: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center'
  },
  header: {
    marginBottom: 4,
    marginTop: 4
  },
  paper: {
    width: 300,
    margin: '10px 20px',
    padding: 20
  },
  submit: {
    marginTop: 32
  }

};



var UserForm = React.createClass({


  render: function() {
    return  <RaisedButton
              label="login using Spotify"

            />;
  }
});






var Login = React.createClass({


	getDefaultProps(){
		var user = new User();
    return{user: user};
	},

	navigate: function() {
      console.log('i got called at least');
		Backbone.history.navigate('', {trigger: true});
	},


  handleSignUp: function(userData){
		this.props.user.signup(userData.username, userData.password, this.navigate);
  },

  handleLogin: function(userData){
    this.props.user.login(userData.username, userData.password, this.navigate);
  },

  render: function(){
    return(
   	<App>
	    <div style={styles.login}>
	      <Paper style={styles.paper}>
	        <h3 style={styles.header}>Sign Up</h3>
	        <UserForm
	          label="Sign Up"
	          handleSubmit={this.handleSignUp}
	          />
	      </Paper>
	      <Paper style={styles.paper}>
	          <h3 style={styles.header}>Log In</h3>
	        <UserForm
	          label="Log In"
	          handleSubmit={this.handleLogin}
	          />
	      </Paper>
	    </div>
		</App>
    );
  }
});

export default Login;
