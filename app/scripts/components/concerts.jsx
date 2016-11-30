
import $ 				from 'jquery';
import _ 				from 'underscore';
import React 		from 'react';
import moment 	from 'moment';
import Backbone from 'backbone';

import {Avatar, Card, CardHeader, CardTitle, CardText,
				Chip, IconButton, Toggle} from 'material-ui';

import Trip   from './../models/Trip';
import Artist from './../models/SpotifyArtist';
import SGEventCollection from './../models/SeatGeekEventCollection';

require('backbone-react-component');


const styles = {
	concerts: {
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'stretch',
		marginTop: 70
	},
	concert: {
		margin: 8
	},
	artists: {
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'flex-start',
		paddingBottom: 8,
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
	},
	cardHeader:{
		paddingTop: 8,
		paddingBottom: 8
	},
	cardTitle: {
		fontSize: 20
	},
	header:{
		paddingBottom: 8
	},
	date:{

	}

};



var ArtistChip = React.createClass({


  mixins: [Backbone.React.Component.mixin],

	componentWillMount: function() {
		var artist = this.getModel();
		artist.search();
	},

	handleClick: function(e){
		e.preventDefault();
		console.log(this.getModel().toJSON());

		var artist =  this.getModel();
		var added  =  artist.get('added');

		if(!added) {
			artist.set({added: true});
			this.props.addArtist(artist);
		}
		else {
			artist.set({added: false})
			this.props.removeArtist(artist);
		}
	},

	render: function(){
		var artist  = this.getModel();
		var spotify = artist.get('spotify');
		var added   = artist.get('added');
		var images  = artist.get('images');

		var labelStyle  = spotify && added ? styles.spotify : styles.label;
		var href 			  = spotify ? artist.get('spotifyLink') : null;
		var handleClick = spotify ? this.handleClick : undefined;

		var color 		= spotify && added ? '#23CF5F'  : null;
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










var ConcertCard = React.createClass({
	mixins: [Backbone.React.Component.mixin],

	onExpandChange: function(favorite){
		console.log('favorite:', favorite);
		var concert = this.getModel();

		if(favorite){
			this.props.addFavorite(concert.get('sgId'));
		}
		else{
			this.props.removeFavorite(concert.get('sgId'));
		}

		//  concert.set({'favorite': favorite});
	},


	render: function() {
		var concert = this.getModel();
		var m    = moment(concert.get('date'));
		var day  = m.format('ddd, MMM Do');
		var time = m.format('h:mm a');
		var self = this;
		return (
			<Card
				style={styles.concert}
				expanded={concert.get('favorite')}
				onExpandChange={this.onExpandChange}
			>

				<CardHeader
					style={styles.header}
					title={day}
					subtitle={time}
					showExpandableButton={true}
					openIcon={<span><i style={{color: '#E91E63'}} className="material-icons">favorite</i></span>}
					closeIcon={<span><i style={{color: '#E91E63'}} className="material-icons">favorite_border</i></span> }
				/>

				<CardTitle
					style={styles.cardHeader}
					titleStyle={styles.cardTitle}
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
	}

});








var Concerts = React.createClass({

	mixins: [Backbone.React.Component.mixin],

	getInitialState: function() {
		return {
      favorites: false
    };
	},

	componentWillReceiveProps: function(nextProps){
		var trip     = this.getModel();
		var concerts = this.getCollection();

		console.log('~~~concerts cdm trip:', trip.get('startDate'));

		var arrival   = moment(trip.get('startDate')).format('YYYY-MM-DD');
		var departure = moment(trip.get('endDate')).format('YYYY-MM-DD');



		console.log('arrival', arrival);

		var self = this;

		console.log(concerts);
		concerts.fetch({
        withCredentials: false,
				crossDomain:     true,
		  data : {
				'per_page': 			    '50',
				'taxonomies.name':    'concert',
		    'venue.state': 			  trip.get('state'),
				'venue.city': 			  trip.get('city'),
				'datetime_local.gte': arrival,
				'datetime_local.lte': departure
		  },
		  success: function(collection, response, options) {
				console.log('concerts fetched', collection.toJSON());

				self.getCollection().set(collection.toJSON());

		  },
		  error: function(collection, response, options) {
		    console.error(response.statusText);
		  }
		});

	},


	handleToggle: function(event, toggle) {
		 this.setState({favorites: toggle});
	 },

	render: function() {
		console.log('render concerts', this.getCollection());
		var self = this;
		var concerts = this.getCollection();


		var faves = this.getModel().get('favorites');



		// set favorites
		concerts.map(function(concert,i){
			var favorite =_.contains(faves, concert.get('sgId'))
			concert.set({'favorite': favorite});

			return concert;
		});

		if(self.state.favorites === true){
			concerts = concerts.where({favorite:true});
		}

		 concerts = concerts.map( function(concert, i){
			return <ConcertCard
			          key={i}
								model={concert}
								addArtist={self.props.addArtist}
								removeArtist={self.props.removeArtist}
								addFavorite={self.props.addFavorite}
								removeFavorite={self.props.removeFavorite}/>;
		});

		return (
			<div style={styles.concerts}>
				<div style={{width:'100%'}}>
					<Toggle
						toggled={this.state.favorites}
						onToggle={this.handleToggle}
						labelPosition="right"
						label="favorites"
						/>
				</div>

				{concerts}
			</div>
		);
	}

});

export default Concerts;
