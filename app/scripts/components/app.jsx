import $ from 'jquery';
import React from 'react';

import SignOut from 'material-ui/svg-icons/action/power-settings-new';


import {AppBar, FlatButton, IconButton, SvgIcon} from 'material-ui';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import Logo from './../../images/traveltunes.svg';
import Audio from './../../images/audio.svg';

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
    fontSize: 28,
    height: 'auto',
    lineHeight: 'auto'
  },

  rightIcons: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'row nowrap',
    width: 94,
    justifyContent:'space-between'
  }
};




var UserMenu = React.createClass({

  render: function(){
    return (
      <div style={styles.rightIcons}>
        <IconButton
          tooltip="Sign Out"
          touch={true}
          onTouchTap={this.props.handleLogout}
          style={{margin: 0, padding: '0 4px', width: 34}}
          iconStyle={{width: 26, height: 26, color: 'white'}}>
          <SignOut/>
        </IconButton>

        {this.props.music &&
          <IconButton
            tooltip="Top Tracks"
            touch={true}
            onTouchTap={this.props.toggle}
            style={{margin: 0, padding: 0}}
            iconStyle={{ color: 'white', width: 21.66666666666666666667, height: 26}}
          >
          <SvgIcon viewBox="0 0 27 32">
            <Audio/>
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

    var title = 'TravelTunes';
    var menu = this.props.menu ? this.props.menu : null;
    var tooltip = menu ? 'Trips' : null;
    var left =  <IconButton
                  tooltip={tooltip}
                  touch={true}
                  style={{margin: 0, padding: 0, marginRight: 12}}
                  iconStyle={{width:23.375, height:34}}
                >
                  <SvgIcon viewBox="0 0 22 32">
                    <Logo/>
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
