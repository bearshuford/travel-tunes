
import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';


import {Avatar, Card, CardHeader, CardTitle, CardText, Chip} from 'material-ui';

import Trip from './../models/Trip';
import Artist from './../models/SpotifyArtist';

import SGEventCollection from './../models/SeatGeekEventCollection';


const styles = {
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
		marginRight: 8,
		height: 36,
		lineHeight: 36,
		borderRadius: '18px'
	},
	spotify: {
		color: 'white',
		lineHeight: '36px'
	},
	avatar: {
		height: 36,
		width: 36,
		border: '3px transparent'
	},
	label: {
		lineHeight: '36px'
	}

};



var ArtistChip = React.createClass({

	getInitialState: function() {
		return {
			artist: this.props.artist
		};
	},

	updateArtist: function(newArtist) {
		var artist = new Artist(newArtist.toJSON());
		this.setState({'artist': artist});
	},

	componentWillMount: function() {
		var artist = this.state.artist;
		this.state.artist.search(this.updateArtist);
	},

	handleClick: function(e){
		e.preventDefault();
		console.log(this.state.artist.toJSON());
		this.state.artist.getTopTracks();
	},

	render: function(){
		var artist = this.props.artist;
		var spotify = artist.get('spotify');
		var images = artist.get('images');
		var color = spotify ? '#1DB954' : null;
		var labelStyle = spotify ? styles.spotify : styles.label;
		var href = spotify ? artist.get('spotifyLink') : null;


		return (
			<Chip
				style={styles.artist}
				children={artist.get('name')}
				backgroundColor={color}
				onTouchTap={this.handleClick}
				href={null}
				labelStyle={labelStyle}
			>

			{spotify && images.length > 2 &&
				 <Avatar
					 src={images[images.length -1].url}
					 style={styles.avatar}/>	}
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
				'per_page': "100",
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
		// var tracks = this.state.concerts.getAllArtists().getTopTracks();
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
													artist={artist}/>;
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
