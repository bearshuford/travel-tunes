import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import Place  from 'material-ui/svg-icons/maps/place';
import More from 'material-ui/svg-icons/navigation/more-vert';

import {grey500} from 'material-ui/styles/colors';

import {Avatar, Paper, Dialog, Divider, Drawer, IconMenu, MenuItem,
	FlatButton, IconButton, FloatingActionButton} from 'material-ui';

import {List, ListItem, makeSelectable} from 'material-ui/List';

import App from './app.jsx';
import TripForm from './tripForm.jsx';

import Trip from './../models/Trip';
import TripCollection from './../models/TripCollection';

import TripDetail from './TripDetail.jsx';


const SelectableList = makeSelectable(List);

const styles = {
	page:{
		transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
		position: 'relative',
		paddingLeft: 250,
		paddingRight: 250
	},
	pageLeft:{
		transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
		position: 'relative',
		paddingLeft: 0,
		paddingRight: 250
	},
	pageRight:{
transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',		position: 'relative',
		paddingLeft: 250,
		paddingRight: 0
	},
	pageFull:{
transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',		position: 'relative',
		paddingLeft: 0,
		paddingRight: 0
	},
	paper:{
		maxWidth: 800,
		marginTop: 0,
		display: 'flex',
		flexFlow: 'row nowrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	dialogContent: {
			maxWidth: 309
	},
	direction: {
		padding: 20,
		fontWeight: 300
	}

};


var Calendar = React.createClass({

	handleRequestChange: function(event, index) {
		console.log('handleRequestChange', index);
		if(index !== 'add-button'){
			Backbone.history.navigate(index,{trigger:true});
		}
  },

  render: function() {

		var path = this.props.path;
		var trips = this.props.trips.map(function(trip, i){
			var self = this;
			var id = trip.get('objectId');
			var city = trip.get('city');
			var state = trip.get('state');
			var startDate = moment(trip.get('startDate')).format('ll');
			var endDate   = moment(trip.get('endDate')).format('ll');
			var imgUrl = trip.get('imageUrl');

			return (
				<ListItem
					key={i}
					primaryText={<span style={{display:'block', paddingLeft:20}}>
												{city+' '+state}
											 </span>}
					secondaryText={<p style={{display:'block', paddingLeft:20}}>
													{startDate}<br/>{endDate}
												 </p>}
					secondaryTextLines={2}
					leftAvatar= {
						imgUrl ?
							<Avatar
								size={52}
								style={{top: 16}}
								src={imgUrl}
							/> :
							<Avatar
								size={52}
								style={{top: 16}}
								icon={<Place/>}
							/>}
					insetChildren={true}
					rightIconButton={
						<IconMenu
      				iconButtonElement={<IconButton style={{paddingTop:12}}><More color={grey500} /></IconButton>}
      				anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      				targetOrigin={{horizontal: 'left', vertical: 'top'}}
						>
							<MenuItem
								onTouchTap={function(){
									self.props.deleteTrip(trip);
								}}
							>
								Delete
							</MenuItem>
    				</IconMenu>
					}
					value={'#trips/' + id}
				/>
			);
		}.bind(this));
		trips.unshift(
			<ListItem
				innerDivStyle={{padding:0}}
				key="3210"
				value={'add-button'}
				>
				<FlatButton
					style={{width: '100%', height: '100%'}}
					label="Add a Trip"
					secondary={true}
					href={path ? path+'/new' : '#trips/new'}
				/>
			</ListItem>
		);
		var hasTrips = (trips.length > 0);
		var self = this;
		var value = this.props.path ? this.props.path : null;
		console.log('value', value);
    return (
			<Drawer
				open={this.props.open}
				width={240}
				containerStyle={{top:64, bottom:0, height:'calc(100vh-64px)'}}
			>
				<SelectableList
					value={value}
					onChange={this.handleRequestChange}>
					{trips}
				</SelectableList>
			</Drawer>
		);
  }

});


var CalendarContainer = React.createClass({

	getInitialState: function() {
		return {
			trips: new TripCollection(),
			open: false,
			menu: true,
			music: false
		};
	},

	componentDidMount: function() {
		var trips = this.state.trips;
		var userId = localStorage.getItem('userId');
		trips.parseWhere('user','_User', userId).fetch().then(
      function(){
        this.setState({trips: trips});
      }.bind(this)
    );
    return true;
	},


	openDialog: function() {
		 this.setState({open: true});
	},

	closeDialog: function() {
		this.setState({open: false});
	},

	handleSubmit: function(data) {
		var trip = new Trip(data);
		trip.save().done(function(data){
			var id = data.objectId;
			console.log(trip.get('user'));
			Backbone.history.navigate('trips/'+id, {trigger:true});
		}.bind(this));
	},

	deleteTrip: function(trip) {
		var trips = this.state.trips;
		trips.remove(trip);
		trip.destroy();
		this.setState({trips: trips});
	},

	toggleMenu: function(){
		this.setState({menu: !this.state.menu});
	},

	toggleMusic: function(){
		this.setState({music: !this.state.music});
	},

  openMusic: function(){
		var self = this;
    if(!this.state.music){
			setTimeout(function(){
				self.setState({music: true});
			},300);
			if(this.state.menu)
	    	self.setState({menu: false});
		}
  },

  closeMusic: function(){
    if(this.state.music)
      this.setState({music: false});
  },

	closeMenu: function(){
    // if(this.state.menu)
		console.log('closeMenu');
      this.setState({menu: false});
  },

  render: function() {
		var path  = this.props.path ? this.props.path : false;
		var menu  = this.state.menu;
		var music = this.state.music;

		var pageStyle;
		if(menu && music)				pageStyle = styles.page;
		else if(!menu && music)	pageStyle = styles.pageLeft;
		else if(menu && !music)	pageStyle = styles.pageRight;
		else  									pageStyle = styles.pageFull;

		var model = new Trip();
		if(this.state.trips.length){
			model = this.state.trips.get(this.props.tripId)
		}

    return (
			<App
				fixed={true}
				menu={true}
				toggle={this.toggleMenu}
				music={path !== false}
				toggleMusic={this.toggleMusic}
			>
				<Calendar
					trips={this.state.trips}
					path={path}
					deleteTrip={this.deleteTrip}
					open={this.state.menu}
				/>

				{ path &&
					<div style={pageStyle}>
						<TripDetail
              tripId={this.props.tripId}
              model={model}
              music={this.state.music}
              openMusic={this.openMusic}
              closeMusic={this.closeMusic}
							closeMenu={this.closeMenu}
            />
					</div>
				}

				<Dialog
					title="Add a Trip~"
					titleStyle={{display:'none'}}
					contentStyle={styles.dialogContent}
          open={(this.props.new === true)}
					autoScrollBodyContent={true}
					modal={true}
        >
					<TripForm
						handleSubmit={this.handleSubmit}
						path={path}
					/>
        </Dialog>

			</App>

		);
  }

});





export default CalendarContainer;
