import React    from 'react';
import Backbone from 'backbone';

import {Paper, RaisedButton, FlatButton, SvgIcon, IconButton, FloatingActionButton} from 'material-ui'

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
    top: 72,
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
    margin:  '8px 24px',
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
    fontSize: 'calc(1.2em + .8vw)',
    marginBottom: 16,
    padding: '4px 24px'
  },
  details: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: '"Roboto", serif',
    fontWeight: 400,
    minHeight:144,
    marginTop: 12
  },
  sgIcon: {
    margin: '0 8px',
    width: 114.125,
    height: 22
  },
  buttons:{
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },

  fab: {
    position: 'fixed',
    bottom: 29,
    right: 25,
    zIndex: 50000
  }
};





const BearIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 32 32" >
    <path d="M26.771 2.022c-2.44 0-4.462 1.673-4.95 3.904h-11.782c-0.558-2.231-2.58-3.904-4.95-3.904-2.789 0-5.089 2.301-5.089 5.089 0 1.952 1.115 3.695 2.789 4.532v5.508c0 7.111 6.135 12.828 13.246 12.828s13.246-5.717 13.246-12.828v-5.508c1.603-0.837 2.719-2.58 2.719-4.532-0.070-2.789-2.37-5.089-5.229-5.089zM9.272 12.549c0-0.767 0.627-1.464 1.464-1.464s1.464 0.627 1.464 1.464-0.627 1.464-1.464 1.464-1.464-0.627-1.464-1.464zM15.895 27.468c-2.649 0-4.88-2.858-4.88-6.344s2.161-6.344 4.88-6.344c2.719 0 4.88 2.858 4.88 6.344s-2.161 6.344-4.88 6.344zM21.124 14.013c-0.837 0-1.464-0.627-1.464-1.464 0-0.767 0.627-1.464 1.464-1.464 0.767 0 1.464 0.627 1.464 1.464s-0.627 1.464-1.464 1.464z"></path>
    <path d="M13.386 18.475c-0.418 0-0.837 0.209-0.976 0.558-0.139 0.418-0.070 0.837 0.209 1.115l2.51 2.51c0.418 0.418 1.115 0.418 1.534 0l2.51-2.51c0.279-0.279 0.418-0.697 0.209-1.115-0.139-0.418-0.558-0.558-0.976-0.558h-5.020z"></path>
  </SvgIcon>
);


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

              <span>Discover music to enjoy live on your travels.</span>

            </div>

            <span> powered by </span>

            <div style={styles.buttons}>

              <FlatButton
                href="http://platform.seatgeek.com/"
                target="_blank"
                style={{margin: '0 6px', width: 132.125, height: 52, padding: '7px 2px'}}
                icon={
                  <SvgIcon
                    viewBox="0 0 114.125 22"
                    style={{width: 114.125, height: 22}}
                  >
                    <SeatGeek />
                  </SvgIcon>
                }
              />


            <span style={{fontSize: 18}}> + </span>

              <FlatButton
                href="https://developer.spotify.com/web-api/"
                target="_blank"
                style={{marginLeft: 6, width: 124, height: 52, padding: '7px 4px'}}
                icon={
                  <SvgIcon
                    style={{width: 106, height: 32}}
                    viewBox="0 0 106 32"
                  >
                    <Spotify />
                  </SvgIcon>
                }
              />
            </div>

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
          <FloatingActionButton
            style={styles.fab}
            backgroundColor="black"
            children={<BearIcon color="white"/>}
            href="http://bear.works"
          />
  	    </div>
		</App>
    );
  }
});

export default Login;
