import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import {Paper, Drawer, MenuItem, Chip, Avatar, RaisedButton, FloatingActionButton} from 'material-ui';

import App from './app.jsx';
import Concerts from './concerts.jsx';
import TopTracks from './artistsTopTracks.jsx';

import Trip from './../models/Trip';
import Artist from './../models/SpotifyArtist';

import ArtistCollection from './../models/SpotifyArtistCollection';
import SGEventCollection from './../models/SeatGeekEventCollection';

require('backbone-react-component');


const styles = {

	page:{
		position: 	 'relative',
		display: 		 'flex',
		flexFlow: 	 'row nowrap',
		alignItems:  'space-between',
		fontFamily:  '"Roboto", sans-serif'
	},

	pageFull:{
		position: 	 'relative',
		display: 		 'flex',
		flexFlow: 	 'row nowrap',
		alignItems:  'space-between',
		fontFamily:  '"Roboto", sans-serif'
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
	},

	drawer: {
		top: 63,
		bottom: 0,
		zIndex: 1300
	},

	drawerContainer: {
		 height: 'calc(100% - 64px)',
		top: 63,
		bottom: 0,
		zIndex: 1300
	}
};







var TripDetail = React.createClass({

	mixins: [Backbone.React.Component.mixin],

	getInitialState: function() {
		return {
			concerts : new SGEventCollection(),
			selectedArtists: new ArtistCollection(),
			selectedArtistId: '',
			selectedArtist: new Artist(),
			favorite: false,
			open: false
		};
	},


	fetchConcerts: function(){
		var self = this;
		var concerts = this.state.concerts;
		var trip   = this.getModel();

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
				self.setState({collection: collection});
			},
			error: function(collection, response, options) {
				console.error(response.statusText);
			}
		});
	},

	fetchTrips: function(){
		var self = this;
		var tripId = this.props.tripId;

		this.getModel().set({'objectId': this.props.tripId});
		this.getModel().fetch().then(function(){self.fetchConcerts()});
	},


	componentDidUpdate: function(prevProps, prevState) {
		var tripId = this.props.tripId;
		var self = this;

		if(prevProps.tripId !== tripId){
			this.getModel().clear();
			this.getModel().set({'objectId': tripId});
			this.getModel().fetch().then(self.fetchConcerts);
		}
	},

	componentDidMount: function() {
		this.fetchTrips();
	},

	addArtist: function(artist){
		var selectedArtistId = this.state.selectedArtistId;
		artist.getTopTracks(10, this.props.openMusic);

		if(selectedArtistId !== artist.get('spotifyId')){
      this.props.openMusic();
			this.setState({
				selectedArtistId: artist.get('spotifyId'),
				selectedArtist:   artist
			});
    }
		else{
      this.props.closeMusic();
			this.setState({
				selectedArtistId: '',
				selectedArtist:   new Artist()
			});
    }
	},

	removeArtist: function(artist){
		var artists = this.state.selectedArtists;
		// artist.set('added', false);
		artists.remove(artist);
	},


  addFavorite: function(sgId){
		console.log('add favorite!')
		var favorites = this.getModel().get('favorites');
		favorites.push(sgId);
		console.log('add favorite', sgId, favorites);
		this.getModel().set('favorites', favorites);
		this.getModel().save();
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


		var startTitle = moment(trip.get('startDate')).format('MMM D');
		var endTitle   = moment(trip.get('endDate')).format('MMM D');

		var location  = trip.get('city') + ', '  + trip.get('state');
		var daterange = startTitle       + ' - ' + endTitle;
		var title     = location         + ' | ' + daterange;

		var concerts = this.state.concerts;

		console.log(this.props.pageStyle);

    return (

			<div>
				<div style={styles.page}>

					<Concerts
						model={this.getModel()}
						collection={concerts}
						addArtist={this.addArtist}
						removeArtist={this.removeArtist}
						addFavorite={this.addFavorite}
						removeFavorite={this.removeFavorite}
						favorites={this.state.favorites}
						selectedArtistId={this.state.selectedArtistId}
						pageStyle={this.props.pageStyle}/>
				</div>



					<Drawer
						containerStyle={{top:64, bottom:0, height:'calc(100vh-64px)'}}
						children={
							<TopTracks
								model={this.state.selectedArtist}
								artistCount={1}/>
						}
						openSecondary={true}
						open={this.props.music}
					/>


				</div>
		);
  }

});



export default TripDetail;
