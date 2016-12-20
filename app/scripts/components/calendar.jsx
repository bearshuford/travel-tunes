import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import Place  from 'material-ui/svg-icons/maps/place';
import More from 'material-ui/svg-icons/navigation/more-vert';

import {Avatar, Paper, Dialog, Divider, Drawer, IconMenu, MenuItem,
	FlatButton, IconButton, FloatingActionButton} from 'material-ui';

import {List, ListItem, makeSelectable} from 'material-ui/List';

import App from './app.jsx';
import TripForm from './tripForm.jsx';

import Trip from './../models/Trip';
import TripCollection from './../models/TripCollection';


const SelectableList = makeSelectable(List);

const styles = {
	page:{
		position: 'relative',
		paddingLeft: 260,
		paddingRight: 50
		// display: 'flex',
		// flexFlow: 'column nowrap',
		// alignItems: 'flex-start',
		// fontFamily: '"Roboto", sans-serif',
		// marginTop: 22
	},
	paper:{
		maxWidth: 800,
		marginTop: 0,
		display: 'flex',
		flexFlow: 'row nowrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	dialog:{

	},

	dialogBody: {

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



	componentDidUpdate: function() {

	//  var path = this.props.path;
	// 	var value = path ? path : this.state.selectedIndex;
	 //
	 //
	// 	if(path && this.props.trips.length > 1){
	// 		console.log('~~PATH');
	// 		this.setState({selectedIndex: path});
	// 	}
	// 	else if(value === null && this.props.trips.length > 1){
	// 		value = '#trips/' + this.props.trips.at(1).get('objectId');
	// 		// this.setState({selectedIndex: value});
	// 	}


	},

	handleRequestChange: function(event, index) {
		console.log('handleRequestChange', index);
		if(index !== 'add-button'){
			Backbone.history.navigate(index,{trigger:true});
		}
  },

  render: function() {

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
					primaryText={<span style={{display:'block', paddingLeft:14}}>
												{city+' '+state}
											 </span>}
					secondaryText={<p style={{display:'block', paddingLeft:14}}>
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
      				iconButtonElement={<IconButton><More/></IconButton>}
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
					href="#trips/new"
				/>
			</ListItem>
		);
		var hasTrips = (trips.length > 0);
		var self = this;
		var value = this.props.path ? this.props.path : null;
		console.log('value', value);
    return (
			<Drawer width={240} containerStyle={{top:80, bottom:20, height:'calc(100vh-100px)'}}>
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
			open: false
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

  render: function() {
		var path = this.props.path ? this.props.path : false;
    return (
			<App fixed={true}>

				<Calendar
					trips={this.state.trips}
					path={path}
					deleteTrip={this.deleteTrip}
				/>

				{ path &&
					<div style={styles.page}>
						{this.props.children}
					</div>
				}

				<Dialog
					title="Add a Trip~"
					titleStyle={{display:'none'}}
					bodyStyle={styles.dialogBody}
					contentStyle={styles.dialogContent}
          open={(this.props.new === true)}
					autoScrollBodyContent={true}
					modal={true}
					style={styles.dialog}
        >
					<TripForm
						handleSubmit={this.handleSubmit}
					/>
        </Dialog>

			</App>

		);
  }

});





export default CalendarContainer;
