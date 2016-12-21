import $ from 'jquery';
import React from 'react';

import ViewList from 'material-ui/svg-icons/action/view-agenda';
import Music from 'material-ui/svg-icons/image/music-note';

import {AppBar, FlatButton, IconButton, IconMenu, MenuItem, Divider, Snackbar} from 'material-ui';

import Theme from './theme.jsx'
import User from './../models/User'


const styles = {
  appBar: {
  	marginBottom: '8px',
    zIndex: 1500
	},
  fixed: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1500
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
    <div>
      <IconMenu

        desktop={true}
        style={styles.iconButton}
        iconButtonElement={<IconButton iconStyle={styles.icon} iconClassName="material-icons" tooltip="Account">account_circle</IconButton>}
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
          iconStyle={{width: 26, height: 26}}>
          <Music color="white"/>
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
    console.log('back',back);

    var title = this.props.title ? this.props.title : "TravelTunes";
    var menu = this.props.menu ? this.props.menu : null;
    var left = back ? <IconButton
                        iconStyle={styles.icon}
                        iconClassName="material-icons"
                        onTouchTap={this.props.handleBack}
                        children="arrow_back"
                      /> : null;
    left = menu ? <IconButton tooltip="Trips">
                    <ViewList/>
                  </IconButton> : left;

    return (
      <Theme>
  			<AppBar
    			title={title}
    			showMenuIconButton={back || menu}
    			onTitleTouchTap={this.handleTitle}
    			style={this.props.fixed ? styles.fixed : styles.appBar}
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
          onLeftIconButtonTouchTap={this.props.toggle}
				/>
        {this.props.children}

    	</Theme>
		);
  }
});


export default App;
