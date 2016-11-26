
import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';

import {Avatar, Card, CardHeader, CardTitle, CardText, Chip} from 'material-ui';

import Trip from './../models/Trip';
import Artist from './../models/SpotifyArtist';

import SGEventCollection from './../models/SeatGeekEventCollection';

require('backbone-react-component');


const styles = {
	concerts: {
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'stretch',
		marginTop: 108
	},
	concert: {
		// flex: '1 0 200',
		// minWidth: 200,
		margin: 8
	},
	artists: {
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'flex-start',
		maxWidth: 800
	},
	artist: {
		marginRight: 8,
		height: 36,
		lineHeight: 36,
		borderRadius: '18px',
		marginBottom: 6
	},
	spotify: {
		color: 'white',
		lineHeight: '36px'
	},
	avatar: {
		width: 36,
		height: 36
	},
	label: {
		lineHeight: '36px'
	}

};



var ArtistChip = React.createClass({


  mixins: [Backbone.React.Component.mixin],

	getInitialState: function() {
		return {
			// hover: false,
			added: false
		};
	},



	componentWillMount: function() {
		var artist = this.getModel();
		artist.search();
	},

	addArtist: function(artist){
		this.props.addArtist(artist, this.updateRemoved);
	},

	updateRemoved: function(artist){
		// this.setState({'artist': artist, 'added': false});
		this.props.removeArtist(artist);
	},


	handleClick: function(e){
		e.preventDefault();
		console.log(this.getModel().toJSON());

		var artist =  this.getModel();
		var added  =  artist.get('added');

		if(!added) {
			artist.set({added: true});
			this.addArtist(artist);
		}
		else {
			artist.set({added: false});
			this.updateRemoved(artist);
		}

		// this.state.artist.getTopTracks();

		this.setState({added: !this.state.added});
	},

	// onMouseOver: function(){
	// 	this.setState({hover: true});
	// },
	//
	// onMouseLeave: function(){
	// 	this.setState({hover: false});
	// },

	render: function(){
		var artist = this.getModel();
		var spotify = artist.get('spotify');
		var images = artist.get('images');


		// var color 		  = spotify ? '#1DB954' : null;
		var labelStyle  = spotify && added ? styles.spotify : styles.label;
		var href 			  = spotify ? artist.get('spotifyLink') : null;
		var handleClick = spotify ? this.handleClick : (function(){});

		var hover = this.state.hover;
		var added = artist.get('added');
		var color = spotify && added ? '#23CF5F'  : null;
		var iconColor = spotify && !added ? '#23CF5F'  : null;


		var avatarIcon = added  ?  <i className="material-icons">playlist_add_check</i> : <i style={{'color':iconColor}} className="material-icons">playlist_add</i>;


		return (
			<Chip
				style={styles.artist}
				children={artist.get('name')}
				backgroundColor={color}
				onTouchTap={handleClick}
				href={null}
				labelStyle={labelStyle}
				onMouseOver={this.onMouseOver}
				onMouseLeave={this.onMouseLeave}
			>

			{spotify && images.length > 2 &&
				 <Avatar
					 src={avatarIcon ? null : images[images.length -1].url}
					 style={styles.avatar}
					 icon={avatarIcon}
					 backgroundColor="transparent"/>	}
					 {artist.get('name')}
			</Chip>
		);
	}
});



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

		var concerts = this.state.concerts;


		if(!trip) {
			return false;
		}

		var self = this;

		concerts.fetch({
        withCredentials: false,
				crossDomain: true,
		  data : {
				// 'sort': 'score.desc',
				'per_page': "50",
				'taxonomies.name': 'concert',
		    'venue.state': trip.get('state'),
				'venue.city': trip.get('city'),
				'datetime_local.gte': arrival,
				'datetime_local.lte': departure
		  },
		  success : function(collection, response, options) {
		    console.log(collection);

				self.setState({'concerts': collection});
		  },
		  error : function(collection, response, options) {
		    console.log(response.statusText);
		  }
		});
	},


	render: function() {


		// var artists = this.state.concerts.getAllArtists();
		// console.log('artists', artists)
		// console.log('spotify artists',artists.spotifyArtists());
		// console.log('artists', artists);


		var self = this;
		// console.log(tracks);
		var concerts = this.state.concerts.map(function(concert,i){
		var date = moment(concert.get('date'));
		var day  = date.format('ddd, MMM Do');
		var time = date.format('h:mm a');


			return (
				<Card key={i} style={styles.concert}>
					<CardHeader
						title={day}
						subtitle={time}/>
				  <CardTitle
					  title={concert.get('title')}
					  subtitle={concert.get('venue').name}/>

					<CardText style={styles.artists}>
						{concert.get('artists').map(
							function(artist, i){

								return  <ArtistChip
													key={i}
													model={artist}
													addArtist={self.props.addArtist}
													removeArtist={self.props.removeArtist}/>;
							})}
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
export default Concerts;
