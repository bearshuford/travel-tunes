import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import {Paper, Drawer, MenuItem, Chip, Avatar, RaisedButton} from 'material-ui';

import App from './app.jsx';
import Concerts from './concerts.jsx';

import Trip from './../models/Trip';
import ArtistCollection from './../models/SpotifyArtistCollection';
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
		padding: 20,
		width: '100%',
		display: 'flex',
		flexFlow: 'row nowrap',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	eventDetails:{
		flex: '0 0 auto'
	},
	artist: {
		marginRight: 8,
		marginBottom: 6

	},
	playlistForm: {
		display: 'flex',
		flexFlow: 'row nowrap',
		justifyContent: 'space-between',
		padding: 20,
		flex: '1 1 auto',
		minWidth: 0,
		marginLeft: 20
	},
	selected: {

		display: 'flex',
		flexFlow: 'row wrap',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		alignContent: 'flex-start'
	}

};





var ArtistChip = React.createClass({

	removeArtist: function(){
		this.props.removeArtist(this.props.artist);
	},



	render: function() {
		var artist = this.props.artist;
		var images = artist.get('images');
		return (
			<Chip
				style={styles.artist}
				onTouchTap={this.props.onTouchTap}
				>
				<Avatar
					src={images[images.length -1].url}/>
				{artist.get('name')}
			</Chip>
		);
	}
});




var SelectedArtists = React.createClass({

	getTracks: function(){
		console.log(this.props.artists);
		console.log(this.props.artists.getTopTracks());
	},

	render: function() {
		var self = this;
		var artists = this.props.artists.map(function(artist,i){
			return <ArtistChip
								key={i}
								artist={artist}
								removeArtist={self.props.removeArtist}/>;
						});
		return (
			<div style={styles.playlistForm}>
				<div style={styles.selected}>{artists}</div>
				<RaisedButton
					label="get top tracks"
					onTouchTap={this.getTracks}/>
			</div>
		);
	}

});







var TripDetail = React.createClass({

	getInitialState: function() {
		return {
			trip: new Trip(),
			selectedArtists: new ArtistCollection(),
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


	addArtist: function(artist){
		var artists = this.state.selectedArtists;
		artists.add(artist);
		console.log('selected artists', artists);
		this.setState({selectedArtists: artists});
	},

	removeArtist: function(artist){
		var artists = this.state.selectedArtists;
		artist.set('added', false);
		artists.remove(artist);
		console.log('selected artists', artists);
		this.setState({selectedArtists: artists});
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
						<div style={styles.eventDetails}>
							<h1>{trip.get('city') + ', ' + trip.get('state')}</h1>
							<h2>{startDate + ' - ' + endDate}</h2>
						</div>

						<SelectedArtists
							artists={this.state.selectedArtists}
							removeArtist={this.removeArtist}
							/>

					</div>
					<Concerts
						trip={trip}
						addArtist={this.addArtist}
						removeArtist={this.removeArtist}/>
				</div>
			</App>

		);
  }

});





export default TripDetail;
