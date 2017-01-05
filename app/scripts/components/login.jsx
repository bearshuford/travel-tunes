import React    from 'react';
import Backbone from 'backbone';

import {Paper, RaisedButton, SvgIcon} from 'material-ui'

import Formsy       from 'formsy-react';
import {FormsyText} from 'formsy-material-ui/lib';

import App  from './app.jsx';
import User from './../models/User';

import palette from './theme.jsx';

import SeatGeek from './../../images/SeatGeek.svg';
import Spotify  from './../../images/Spotify.svg';


const styles = {
  login: {
    display:        'flex',
    flexFlow:       'row wrap',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    position: 'absolute',
    top: 72
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
    zIndex: 1400,
    overflow: 'hidden'
  },
  submit: {
    marginTop: 20
  },
  info: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 400,
    fontSize: 24,
    marginBottom: 10
  },
  details: {
    width: '100%',
    height: 112,
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 500,
    paddingTop: 8
  },
  sgIcon: {
    margin: '0 8px',
    width: 114.125,
    height: 22
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



          <div style={styles.details}>

            <div style={styles.info}>

              Find music to see live on your travels.

            </div>

            <span> powered by </span>

            <a style={styles.sgIcon} href="http://platform.seatgeek.com/" target='_blank'>
              <SvgIcon
                style={{width: 114.125, height: 22}}
                viewBox="0 0 114.125 22"
              >
                <SeatGeek />
              </SvgIcon>
            </a>

            <span> and </span>

            <a style={{marginLeft: 8}} href="https://developer.spotify.com/web-api/" target='_blank'>
              <SvgIcon
                style={{width: 106, height: 32}}
                viewBox="0 0 106 32"
              >
                <Spotify />
              </SvgIcon>
            </a>

          </div>

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
