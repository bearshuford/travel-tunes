import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import {Paper} from 'material-ui';

import App from './app.jsx';
import Concerts from './concerts.jsx';
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
	}

};






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
