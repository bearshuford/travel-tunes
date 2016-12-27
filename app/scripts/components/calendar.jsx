import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';
import _ from 'underscore';

import Place  from 'material-ui/svg-icons/maps/place';
import More from 'material-ui/svg-icons/navigation/more-vert';

import {greenA700, greenA400, pink400, grey500} from 'material-ui/styles/colors';


import {Avatar, Paper, Dialog, Divider, Drawer, IconMenu, MenuItem,
	FlatButton, IconButton, FloatingActionButton} from 'material-ui';

import {List, ListItem, makeSelectable} from 'material-ui/List';

import App from './app.jsx';
import TripForm from './tripForm.jsx';

import Trip from './../models/Trip';
import TripCollection from './../models/TripCollection';
import SGEventCollection from './../models/SeatGeekEventCollection';


import TripDetail from './TripDetail.jsx';


const SelectableList = makeSelectable(List);

const styles = {
	page:{
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'stretch',
		marginLeft: 250,
		marginRight: 250,
		marginTop: 70
	},
	pageLeft:{
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'stretch',
		paddingLeft: 0,
		marginRight: 250,
		marginTop: 70
	},
	pageRight:{
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'stretch',
		paddingLeft: 250,
		paddingRight: 10,
		marginTop: 70
	},
	pageFull:{
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'stretch',
		paddingLeft: 0,
		paddingRight: 10,
		marginTop: 70
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
    console.log('handlerequestChange');
		if(index !== 'add-button'){
			// Backbone.history.navigate(index,{trigger:true});
		}
  },



  render: function() {

		var path = this.props.path;
		var trips = this.props.trips.map(function(trip, i){

			var startDatePast = moment() > moment(trip.get('startDate'));
			var endDatePast   = moment() > moment(trip.get('endDate'));

			var startDateStyle = startDatePast ? {color: pink400} : {};
			var endDateStyle   = endDatePast   ? {color: pink400} : {};

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
													<span style={startDateStyle}>{startDate}</span>
													<br/>
													<span style={endDateStyle}>{endDate}</span>
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
      				iconButtonElement={<IconButton style={{paddingTop:12}}>
																	 <More color={grey500} />
																 </IconButton>}
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
					href={'#trips/' + id}
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
			trip: null,
			open: false,
			menu: true,
			music: false,
			concerts: new SGEventCollection()
		};
	},

	fetchConcerts: function(trip) {
    var self = this;
    var concerts = new SGEventCollection();

    var arrival   = moment(trip.get('startDate')).format('YYYY-MM-DD');
    var departure = moment(trip.get('endDate')).format('YYYY-MM-DD');

    concerts.fetch({
        withCredentials: false,
        crossDomain:     true,
      data : {
        'per_page': 			    '300',
        'taxonomies.name':    'concert',
        'venue.state': 			  trip.get('state'),
        'venue.city': 			  trip.get('city'),
        'datetime_local.gte': arrival,
        'datetime_local.lte': departure
      },
      success: function(collection, response, options) {
				self.setState({concerts, collection});
      },
      error: function(collection, response, options) {
        console.error(response.statusText);
      }
    });
  },


	componentDidMount: function() {
		var trips = this.state.trips;
		var self = this;
		var userId = localStorage.getItem('userId');
		trips.parseWhere('user','_User', userId).fetch().then(
      function(){
				console.log('fetched trips', trips.toJSON());
				if(self.props.tripId){
					self.setState({trips: trips, trip: self.state.trips.get(self.props.tripId)});
					self.fetchConcerts(trips.get(self.props.tripId));
				}
        else self.setState({trips: trips});
      }
    );
    return true;
	},

	componentDidUpdate: function(prevProps, prevState) {
		if(prevProps.tripId !== this.props.tripId){
			console.log('Cal–props.path CDU:', prevProps.tripId, this.props.tripId);
			this.setState({trip: this.state.trips.get(this.props.tripId)});
			this.fetchConcerts(this.state.trips.get(this.props.tripId));
		}
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


			var trips = this.state.trips;
			var self = this;
			var userId = localStorage.getItem('userId');
			trips.parseWhere('user','_User', userId).fetch().then(
				function(){
					self.setState({trips: trips});
					Backbone.history.navigate('trips/'+id, {trigger:true});
				}
			);
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
			if(this.state.menu)
	    	self.setState({menu: false, music: true});
			else self.setState({music: true});
		}
  },

  closeMusic: function(){
    if(this.state.music)
      this.setState({music: false});
  },

	closeMenu: function(){
    if(this.state.menu)
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

		var model = this.state.trip;


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

			{ path &&  model !== null &&

						<TripDetail
              tripId={this.props.tripId}
              model={model}
							collection={this.state.concerts}
              music={this.state.music}
              openMusic={this.openMusic}
              closeMusic={this.closeMusic}
							closeMenu={this.closeMenu}
							pageStyle={pageStyle}
            />

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
