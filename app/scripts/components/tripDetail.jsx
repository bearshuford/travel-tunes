import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import {Paper, Card, CardHeader, CardTitle, CardText, Chip} from 'material-ui';

import App from './app.jsx';
import Trip from './../models/Trip';

import SGEventCollection from './../models/SeatGeekEventCollection';


const styles = {
	page:{
		position: 'relative',
		display: 'flex',
		flexFlow: 'column nowrap',
		alignItems: 'center',
		fontFamily: '"Roboto", sans-serif'
	},
	paper: {
		padding: 20
	},
	concerts: {
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'flex-start'
	},
	concert: {
		flex: '1 0 200',

		minWidth: 200,
		margin: 8

	},
	artists: {
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'flex-start'
	},
	artist: {
		marginRight: 8
	}

};



var Concerts = React.createClass({
	getInitialState: function() {
		return {
			concerts: new SGEventCollection()
		};
	},

	componentWillMount: function() {
		var trip    = this.props.trip;

		var arrival = moment(trip.get('startDate')).format('YYYY-MM-DD');
		var departure = moment(trip.get('endDate')).format('YYYY-MM-DD');

		// var concerts = this.state.concerts;
		var concerts = new SGEventCollection();

		if(!trip) {
			return false;
		}

		var self = this;

		concerts.fetch({
        withCredentials: false,
				crossDomain: true,
		  data : {
				// 'sort': 'score.desc',
				'per_page': "100",
		    'venue.state': trip.get('state'),
				'venue.city': trip.get('city'),
				'taxonomies.name': 'concert',
				'datetime_local.gte': arrival,
				'datetime_local.lte': departure
		  },
		  success : function(collection, response, options) {
		    console.log(collection);
				console.log(collection.at(1).toJSON());
		    console.log(response);
		    console.log(options);
				self.setState({'concerts': collection});
		  },
		  error : function(collection, response, options) {
		    console.log(response.statusText);
		  }
		});
	},

	render: function() {
		var concerts = this.state.concerts.map(function(concert,i){
			var date = moment(concert.get('date'));
			var day  = date.format('ddd, MMM Do');
			var time = date.format('h:mm a');
			return (
				<Card
					key={i}
					style={styles.concert}
					>
					<CardHeader
						title={day}
						subtitle={time}
					/>
				  <CardTitle
					  title={concert.get('title')}
					  subtitle={concert.get('venue').name}
				  />
					<CardText style={styles.artists}>
						{
							concert.get('artists').map(function(artist,i){
								return (
									<Chip key={i} style={styles.artist}>
										{artist}
									</Chip>
								);
							})
						}
					</CardText>
				</Card>
			);
		});
		return (
			<div style={styles.concerts}>
				{concerts}
			</div>
		);
	}

});







var TripDetail = React.createClass({

	getInitialState: function() {
		var trip = new Trip();
		return {
			trip: trip,
			fetched: false
		};
	},

	componentWillMount: function() {
		var trip = this.state.trip;
		var tripId = this.props.tripId;

		// if no trip, navigate to index
		if(!tripId){
			Backbone.history.navigate('',{trigger: true});
		}

		trip.set('objectId', tripId);

		trip.fetch().then(function(){
      this.setState({
				trip: trip,
				fetched: true
			});
			return true;
    }.bind(this));
	},

	handleBack: function(){
		Backbone.history.navigate('#trips', {trigger:true});
	},


  render: function() {
		var trip = this.state.trip;
		var startDate = moment(trip.get('startDate')).format('ll');
		var endDate = moment(trip.get('endDate')).format('ll');

		if(!this.state.fetched){
			return (
			<App handleBack={this.handleBack}>
				{/* <div>loading...</div> */}
			</App>
			);
		}

    return (
			<App handleBack={this.handleBack}>
				<div style={styles.page}>

					<div style={styles.paper}>
						<h1>{trip.get('city') + ', ' + trip.get('state')}</h1>
						<h2>{startDate + ' - ' + endDate}</h2>
					</div>
					<Concerts trip={trip}/>
				</div>
			</App>

		);
  }

});





export default TripDetail;
