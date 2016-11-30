import $ from 'jquery';
import React from 'react';

import {AppBar, FlatButton, IconButton, IconMenu, MenuItem, Divider, Snackbar} from 'material-ui';

import Theme from './theme.jsx'
import User from './../models/User'


const styles = {
  appBar: {
  	marginBottom: '8px',
	},
  fixed: {
    position: 'fixed',
    top: 0,
    left: 0
  },
	icon: {
    fontSize: 26,
    color: 'white',
    padding: 0
	},
  username: {
    fontFamily: '"Lobster", cursive',
    fontSize: 24,
    hoverColor: 'blue',
    cursor: 'default'
  },
  titleDiv: {

  }
};


var UserMenu = React.createClass({

  render: function(){
    return (
      <IconMenu desktop={true}
        style={styles.iconButton}
        iconButtonElement={<IconButton iconStyle={styles.icon} iconClassName="material-icons">account_circle</IconButton>}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem
          style={styles.nameItem}
          primaryText={this.props.label}
          innerDivStyle={styles.username}
          />
        <Divider />
        <MenuItem
          primaryText="Help"
          disabled={true}
          leftIcon={<i className="material-icons">help</i>}/>
        <MenuItem
          primaryText="Sign out"
          onTouchTap={this.props.handleLogout}
          leftIcon={<i className="material-icons">power_settings_new</i>}/>
      </IconMenu>
    )
  }
});



var App = React.createClass({


  handleLogout: function(){
    var user = new User();
    user.logout();
  },

  render: function() {
    var hasUser = (localStorage.getItem('sessionToken') !== null);
    var username = localStorage.getItem('username');

    var back = this.props.handleBack !== undefined;
    console.log('back',back);

    var title = this.props.title ? this.props.title : "final project";

    return (
      <Theme>
  			<AppBar
    			title={title}
    			showMenuIconButton={back}
    			onTitleTouchTap={this.handleTitle}
    			style={this.props.fixed ? styles.fixed : styles.appBar}
          titleStyle={styles.titleDiv}
          iconElementRight={!hasUser ? null :
            <UserMenu
              label={username}
              handleLogout={this.handleLogout}
						/>
          }
          iconElementLeft={
            (<IconButton
              iconStyle={styles.icon}
              iconClassName="material-icons"
              onTouchTap={this.props.handleBack}
              children="arrow_back"
            />)
          }
				/>
        {this.props.children}

    	</Theme>
		);
  }
});


export default App;