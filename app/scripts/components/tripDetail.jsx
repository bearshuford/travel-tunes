import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import {Paper, Drawer, MenuItem, Chip, Avatar, RaisedButton, FloatingActionButton} from 'material-ui';

import App from './app.jsx';
import Concerts from './concerts.jsx';
import TopTracks from './artistsTopTracks.jsx';

import Trip from './../models/Trip';
import ArtistCollection from './../models/SpotifyArtistCollection';
import SGEventCollection from './../models/SeatGeekEventCollection';

require('backbone-react-component');


const styles = {

	page:{
		position: 	 'relative',
		display: 		 'flex',
		flexFlow: 	 'row nowrap',
		alignItems:  'space-between',
		fontFamily:  '"Roboto", sans-serif',
		marginRight: 240
	},

	pageFull:{
		position: 	 'relative',
		display: 		 'flex',
		flexFlow: 	 'row nowrap',
		alignItems:  'space-between',
		fontFamily:  '"Roboto", sans-serif',
	},

	artist: {
		marginRight:  8,
		marginBottom: 6
	},

	playlistForm: {
		padding: 				0,
		minWidth: 			0,
		marginLeft: 		20,
		display: 				'flex',
		flexFlow: 			'row nowrap',
		justifyContent: 'space-between',
		alignItems: 		'flex-start',
		flex: 					'1 1 auto'
	},

	selected: {
		display: 				'flex',
		flexFlow: 			'row wrap',
		alignItems: 		'flex-start',
		justifyContent: 'flex-start',
		alignContent: 	'flex-start'
	},

	floatingActionButton: {
		marginRight: 10
	},

	playlist: {
		zIndex: 		5,
		right: 			0,
		bottom: 		0,
		top: 				64,
		width: 			240,
		position: 	'fixed',
		background: 'white',
		height: 		'100vh',
		overflow: 	'scroll'
	},
	playlistEmpty: {
		display: 'none'
	}
};







var TripDetail = React.createClass({

	mixins: [Backbone.React.Component.mixin],

	getInitialState: function() {
		return {
			selectedArtists: new ArtistCollection(),
			favorite: false
		};
	},

	getDefaultProps: function(){
		var trip = new Trip();
		return {
			model: trip
		}
	},

	componentDidMount: function() {
		var tripId = this.props.tripId;
		var self = this;

		this.props.model.set({'objectId': this.props.tripId});
		this.props.model.fetch();

	},

	handleBack: function(){
		Backbone.history.navigate('#trips', {trigger:true});
	},


	addArtist: function(artist){
		var artists = this.state.selectedArtists;
		artist.getTopTracks(6);
		artists.add(artist);
		// this.setState({selectedArtists: artists});
	},

	removeArtist: function(artist){
		var artists = this.state.selectedArtists;
		artist.set('added', false);
		artists.remove(artist);
		// this.setState({selectedArtists: artists});
	},


  addFavorite: function(sgId){
    console.log('addFavorite', sgId);
		var favorites = this.getModel().get('favorites');
		favorites.push(sgId);
		this.getModel().save('favorites', favorites);
		 console.log(this.getModel().get('favorites'));

		// this.props.addFavorite(sgId);
  },

  removeFavorite: function(sgId){

		var favorites = this.getModel().get('favorites');

    var found = favorites.indexOf(sgId);

    while (found !== -1) {
      favorites.splice(found, 1);
      found = favorites.indexOf(sgId);
    }

		this.getModel().save('favorites', favorites);
  },


  render: function() {

		var trip = this.getModel();

		console.log('tripDetail render', trip);

		var startTitle = moment(trip.get('startDate')).format('MMM D');
		var endTitle   = moment(trip.get('endDate')).format('MMM D');

		var location  = trip.get('city') + ', '  + trip.get('state');
		var daterange = startTitle       + ' - ' + endTitle;
		var title     = location         + ' | ' + daterange;

		var concerts = new SGEventCollection();



    return (
			<App
				title={title}
				fixed={true}
				handleBack={this.handleBack}>

				<div style={styles.page}>

					<Concerts
						model={this.getModel()}
						collection={concerts}
						addArtist={this.addArtist}
						removeArtist={this.removeArtist}
						addFavorite={this.addFavorite}
						removeFavorite={this.removeFavorite}
						favorites={this.state.favorites}/>

					<div style={styles.playlist}>
						<TopTracks
							collection={this.state.selectedArtists}
							artistCount={this.state.selectedArtists.length}/>
					</div>

				</div>

			</App>
		);
  }

});



export default TripDetail;
