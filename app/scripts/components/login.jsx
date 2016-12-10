import React    from 'react';
import Backbone from 'backbone';

import {Paper, RaisedButton} from 'material-ui'

import Formsy       from 'formsy-react';
import {FormsyText} from 'formsy-material-ui/lib';

import App  from './app.jsx';
import User from './../models/User';


const styles = {
  login: {
    display:        'flex',
    flexFlow:       'row wrap',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%'
  },
  header: {
    marginTop:    4,
    marginBottom: 0,
    paddingBottom: 0
  },
  paper: {
    padding: 20,
    width:   300,
    minWidth: 240,
    margin:  '8px 16px',
    zIndex: 3000,
    overflow: 'hidden'
  },
  submit: {
    marginTop: 20
  }
};


var UserForm = React.createClass({

  getInitialState: function(){
    return {canSubmit: false}
  },

  enableButton: function() {
    this.setState({canSubmit: true});
  },

  disableButton: function() {
    this.setState({canSubmit: false});
  },

  submitForm: function(data) {
    this.props.handleSubmit(data);
  },

  render: function() {
    return (
      <Formsy.Form ref="form"
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        onValidSubmit={this.submitForm}
        onInvalidSubmit={this.notifyFormError}
      >
        <FormsyText
          name="username"
          type="text"
          floatingLabelText="username"
          required
        />
        <FormsyText
          name="password"
          type="password"
          floatingLabelText="password"
          required
        />
        <RaisedButton
          style={styles.submit}
          type="submit"
          label={this.props.label}
          disabled={!this.state.canSubmit}
          secondary={true}
        />
      </Formsy.Form>
		);
  }
});




var Login = React.createClass({

	getDefaultProps(){
		var user = new User();
    return{user: user};
	},

	navigate: function() {
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
