import $ from 'jquery';
import React from 'react';

import ViewList from 'material-ui/svg-icons/action/view-agenda';
import Account from 'material-ui/svg-icons/social/person';

import Music from 'material-ui/svg-icons/av/library-music';



import {AppBar, FlatButton, IconButton, IconMenu, MenuItem, Divider, Snackbar, SvgIcon} from 'material-ui';

import Theme from './theme.jsx'
import User from './../models/User'


const styles = {
  fixed: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1500,
    height: 64,
    width: '100vw',
    alignItems: 'center'
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
    marginLeft: 4,
    fontSize: 26,
    height: 'auto',
    lineHeight: 'auto'
  }
};




var UserMenu = React.createClass({

  render: function(){
    return (
    <div style={{display: 'flex', alignItems: 'center', flexFlow: 'row nowrap', width: 94, justifyContent:'space-between'}}>
      <IconMenu
        desktop={true}
        style={{margin: 0, padding: 0}}
        iconButtonElement={
          <IconButton
            tooltip="Account"
            style={{margin: 0, padding: '0 4px', width: 34}}
            iconStyle={{width: 26, height: 26, color: 'white'}}>
            <Account/>
          </IconButton>}
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
      {this.props.music &&
        <IconButton
          tooltip="Top Tracks"
          onTouchTap={this.props.toggle}
          style={{margin: 0, padding: 0}}
          iconStyle={{ color: 'white', width: 21.66666666666666666667, height: 26}}
        >
        <SvgIcon viewBox="0 0 27 32">
          <path className="path1" d="M15.837 6.978v17.102l-0.107 1.289-0.302 1.218-0.48 1.138-0.64 1.031-0.791 0.924-0.924 0.791-1.040 0.649-1.138 0.48-1.218 0.293-1.28 0.107-1.28-0.107-1.218-0.293-1.138-0.48-1.040-0.649-0.924-0.791-0.791-0.924-0.64-1.031-0.48-1.138-0.302-1.218-0.107-1.289 0.107-1.28 0.302-1.218 0.48-1.138 0.64-1.031 0.791-0.924 0.924-0.791 1.040-0.649 1.138-0.48 1.218-0.302 1.28-0.098 1.28 0.098 1.218 0.302 0.72 0.302v-16.871h15.529v6.978h-10.827z"/>
        </SvgIcon>
        </IconButton>
      }
    </div>
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

    var title = "TravelTunes";
    var menu = this.props.menu ? this.props.menu : null;
    var tooltip = menu ? 'Trips' : null;
    var left =  <IconButton
                  tooltip={tooltip}
                  style={{margin: 0, padding: 0, marginRight: 12}}
                  iconStyle={{width:23.375, height:34}}
                >
                  <SvgIcon viewBox="0 0 22 32">
                    <path className="path1" d="M16.35 1.249l1.468 0.91 1.305 1.119 0.592 0.69h-7.046v7.626l-0.323-0.136-0.55-0.136-0.581-0.047-0.58 0.047-0.55 0.136-0.514 0.217-0.469 0.291-0.417 0.358-0.357 0.417-0.291 0.469-0.218 0.513-0.136 0.55-0.047 0.58 0.047 0.58 0.136 0.55 0.218 0.513 0.291 0.469 0.357 0.417 0.417 0.358 0.469 0.291 0.514 0.217 0.55 0.136 0.58 0.047 0.581-0.047 0.55-0.136 0.514-0.217 0.469-0.291 0.417-0.358 0.358-0.417 0.291-0.469 0.217-0.513 0.136-0.55 0.046-0.58v-7.731h6.811l0.226 0.536 0.424 1.724 0.146 1.819-0.314 2.623-0.852 2.765-1.254 2.808-1.523 2.753-1.657 2.599-1.658 2.348-1.524 1.997-1.254 1.548-0.851 1.002-0.313 0.355-0.313-0.355-0.851-1.002-1.254-1.548-1.524-1.997-1.657-2.348-1.657-2.599-1.524-2.753-1.254-2.808-0.852-2.765-0.314-2.623 0.146-1.819 0.424-1.724 0.679-1.607 0.91-1.468 1.119-1.304 1.304-1.119 1.468-0.91 1.607-0.678 1.724-0.424 1.819-0.146 1.819 0.146 1.724 0.424 1.607 0.678z"/>
                  </SvgIcon>
                </IconButton>;

    return (
      <Theme>
  			<AppBar
    			title={title}
    			showMenuIconButton={true}
    			onTitleTouchTap={this.handleTitle}
    			style={styles.fixed }
          titleStyle={styles.titleDiv}
          iconElementRight={!hasUser ? null :
            <UserMenu
              label={username}
              handleLogout={this.handleLogout}
              music={this.props.music}
              toggle={this.props.toggleMusic}
						/>
          }
          iconElementLeft={left}
          iconStyleLeft={{margin: 0, height: 48, padding: 0}}
          iconStyleRight={{margin: 0, padding: 0}}
          onLeftIconButtonTouchTap={menu ? this.props.toggle : null}
				/>
        {this.props.children}

    	</Theme>
		);
  }
});


export default App;
