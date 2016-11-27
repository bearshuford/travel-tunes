import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import {Paper, Drawer, MenuItem, Chip, Avatar, RaisedButton, FloatingActionButton} from 'material-ui';

import App from './app.jsx';
import Concerts from './concerts.jsx';

import Trip from './../models/Trip';
import ArtistCollection from './../models/SpotifyArtistCollection';
import SGEventCollection from './../models/SeatGeekEventCollection';

require('backbone-react-component');


const styles = {
	page:{
		position: 'relative',
		display: 'flex',
		flexFlow: 'column nowrap',
		alignItems: 'center',
		fontFamily: '"Roboto", sans-serif'
	},
	selectedArtists: {
		position: 'fixed',
		top: 64,
		left: 5,
		width: '100%',
		display: 'flex',
		flexFlow: 'row nowrap',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingTop: 10,
		zIndex: 4,
		background: 'white'
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
		alignItems: 'flex-start',
		padding: 0,
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
	},
	floatingActionButton: {
		marginRight: 10
	},

};





var ArtistChip = React.createClass({

	mixins: [Backbone.React.Component.mixin],

	removeArtist: function(){
		this.getModel().set({added: false});
		this.props.removeArtist(this.getModel());
	},

	render: function() {
		var artist = this.getModel();
		var images = artist.get('images');
		return (
			<Chip
				style={styles.artist}
				onTouchTap={this.props.onTouchTap}
				onRequestDelete={this.removeArtist}
				>
				{/* <Avatar
					src={images[images.length -1].url}/>*/}
				{artist.get('name')}
			</Chip>
		);
	}
});




var SelectedArtists = React.createClass({

	mixins: [Backbone.React.Component.mixin],


	getTracks: function(){
		this.getCollection().each(function(artist){
			 artist.getTopTracks();
		});
	},

	removeArtist(artist){
		this.getCollection().remove(artist);
	},

	render: function() {
		var self = this;

		var artistChips = this.getCollection().map(function(artist,i){
			return <ArtistChip
								key={i}
								model={artist}
								removeArtist={self.removeArtist}/>;
						});
		return (
			<div style={styles.playlistForm}>
				<div style={styles.selected}>{artistChips}</div>

					<FloatingActionButton
						children={<i className="material-icons">playlist_play</i>}
						onTouchTap={this.getTracks}
						style={styles.floatingActionButton}
						mini={false}/>

			</div>
		);
	}

});





var TripDetail = React.createClass({

	mixins: [Backbone.React.Component.mixin],

	getInitialState: function() {
		return {
			selectedArtists: new ArtistCollection()
		};
	},


	handleBack: function(){
		Backbone.history.navigate('#trips', {trigger:true});
	},


	addArtist: function(artist){
		var artists = this.state.selectedArtists;
		artists.add(artist);
	},

	removeArtist: function(artist){
		var artists = this.state.selectedArtists;
		artist.set('added', false);
		artists.remove(artist);
	},


  render: function() {

		var trip = this.getModel();

		var startTitle = moment(trip.get('startDate')).format('l');
		var endTitle = moment(trip.get('endTitle')).format('l');

		var location = trip.get('city') + ', ' + trip.get('state');
		var daterange = startTitle + ' - ' + endTitle;
		var title = location + ' | ' + daterange;

		var EventCollection = new SGEventCollection();


    return (
			<App
				title={title}
				fixed={true}
				handleBack={this.handleBack}>
				<div style={styles.page}>

					<div style={styles.selectedArtists}>

						<SelectedArtists
							collection={this.state.selectedArtists}
							removeArtist={this.removeArtist}
							/>

					</div>
					<Concerts
						model={trip}
						collection={EventCollection}
						addArtist={this.addArtist}
						removeArtist={this.removeArtist}/>
				</div>
			</App>

		);
  }

});





export default TripDetail;
