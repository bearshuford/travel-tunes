import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import moment from 'moment';
import Backbone from 'backbone';
import FlipMove from 'react-flip-move';

import App from './app.jsx';
import TopTracks from './artistsTopTracks.jsx';

import Trip from './../models/Trip';
import Artist from './../models/SpotifyArtist';

import ArtistCollection from './../models/SpotifyArtistCollection';
import SGEventCollection from './../models/SeatGeekEventCollection';

import {Avatar, Card, CardHeader, CardTitle, CardText,
				Chip, IconButton, RaisedButton, FloatingActionButton,
				Toggle, Checkbox, Paper, Drawer, MenuItem} from 'material-ui';

import {greenA700, greenA400, pink400} from 'material-ui/styles/colors';

import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import EventSeat from 'material-ui/svg-icons/action/event-seat';

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
	},
	concerts: {
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'stretch',
		marginTop: 70
	},
	concert: {
		position: 'relative',
		margin: 8
	},
	artists: {
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'flex-start',
		paddingBottom: 4,
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
		paddingTop: 10,
		paddingBottom: 8
	},
	cardTitle: {
		fontSize: 20
	},
	header:{
		paddingBottom: 6,
		paddingTop: 10,
		display: 'flex',
		flexFlow: 'row nowrap',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	cardIcons: {
		display: 'flex',
		flexFlow: 'row nowrap',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: 60
	},
  detail: {
		width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
		alignItems: 'center',
		height: 42,
		padding: '0 16px 4px',
		transition: 'all .3s'
  },
	checkIcon: {
		color:  pink400,
		fill:   'currentColor',
		width:  26,
		height: 26
	},

	checkLabel: {
		color:      pink400,
		fontSize:   18,
		fontWeight: 400,
		marginLeft: -8,
		marginLeft: 0,
		marginTop:  1,
		lineHeight: '26px'
	},

	chairCheckIcon: {
		fill:   'currentColor',
		width:  26,
		height: 26
	},

	chairEmptyCheckIcon: {
		color:  'rgba(0, 0, 0, 0.298039)',
		fill:   'currentColor',
		width:  26,
		height: 26
	},

	chairCheckLabel: {
		fontSize:   18,
		fontWeight: 400,
		marginLeft: -4,
		marginTop:  1,
		lineHeight: '26px',
		transition: 'color .5s'
	},

	chairEmptyCheckLabel: {
		color:  'rgba(0, 0, 0, 0.298039)',
		fontSize:   18,
		fontWeight: 400,
		marginLeft: -4,
		marginTop:  1,
		lineHeight: '26px',
		transition: 'color .5s'
	}


};



var ArtistChip = React.createClass({


  mixins: [Backbone.React.Component.mixin],

	componentDidMount: function() {
		var artist = this.getModel();
    if(!artist.get('searched'))
		  artist.search();
	},

	handleClick: function(e){
		e.preventDefault();
		var artist =  this.getModel();
		this.props.addArtist(artist);
	},

	render: function(){
		var artist  = this.getModel();
		var spotify = artist.get('spotify');
		var spotifyId = artist.get('spotifyId')
		var added = spotifyId === this.props.selectedArtistId && spotifyId;
		var images  = artist.get('images');

		var labelStyle  = spotify && added ? styles.spotify : styles.label;
		var href 			  = spotify ? artist.get('spotifyLink') : null;
		var handleClick = spotify ? this.handleClick : undefined;

		var color 		= spotify && added ? greenA700  : null;
		var iconColor = spotify && !added ? greenA700  : null;

		var avatarIcon = added  ?  <i className="material-icons">playlist_add_check</i> : <i style={{'color':iconColor}} className="material-icons">queue_music</i>;

		return (
			<Chip
				style={styles.artist}
				children={artist.get('name')}
				backgroundColor={color}
				onTouchTap={handleClick}
				href={null}
				labelStyle={labelStyle}
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

	onExpandChange: function(){
		var concert = this.getModel();

		if(!concert.get('favorite')){
			this.props.addFavorite(concert.get('sgId'));
		}
		else{
			this.props.removeFavorite(concert.get('sgId'));
		}

	},


	render: function() {
		var concert = this.getModel();
		var m    = moment(concert.get('date'));
		var day  = m.format('ddd, MMM D');
		var time = m.format('h:mm a');
		var self = this;

		var price = concert.get('price') ? 'from $'+ concert.get('price'): null;
		var chair = (concert.get('price') == null );

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
					showExpandableButton={false}
					textStyle={{paddingTop:4}}
					children={
						<div style={styles.cardIcons}>
							{chair ? <EventSeat color={'rgba(0, 0, 0, 0.298039)'}/> : <IconButton
								tooltip={price}
								style={{padding:0, width:24, height:24}}
								tooltipPosition="top-center"
								tooltipStyles={{fontSize: 12}}
								href={concert.get('sgUrl')}
							>
								<EventSeat/>
							</IconButton>}
							<IconButton
								iconStyle={{color: pink400}}
								style={{padding:0, width:24, height:24}}
								tooltipPosition="top-right"
								tooltipStyles={{fontSize: 12}}
								onTouchTap={this.onExpandChange}
							>
								{concert.get('favorite') ? <ActionFavorite /> : <ActionFavoriteBorder/>}
							</IconButton>

						</div>
					}
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
												removeArtist={self.props.removeArtist}
												selectedArtistId={self.props.selectedArtistId}
											/>;
					})}

				</CardText>

			</Card>
		);
	}

});




var TripDetail = React.createClass({

	mixins: [Backbone.React.Component.mixin],

	getInitialState: function() {
		return {
			selectedArtistId: '',
			selectedArtist: new Artist(),
			favorites: false,
			seat: false,
			open: false
		};
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
		artists.remove(artist);
	},


  addFavorite: function(sgId){
		var favorites = this.getModel().get('favorites');
		favorites.push(sgId);
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

	handleFaveToggle: function(event, toggle) {
		 this.setState({favorites: toggle});
	 },

	 handleSeatToggle: function(event, toggle) {
		 this.setState({seat: toggle});
	 },


  render: function() {

		var self = this;

		var faves = this.getModel().get('favorites');

		console.log('unfiltered concerts.length', this.getCollection().length);

		var concerts = this.getCollection().filter(function(concert){
			var keep = self.state.seat  ? concert.get('price') != null    : true;
			return self.state.favorites ? keep && concert.get('favorite') : keep;;
		}).map( function(concert, i){
			 concert.set({'favorite': _.contains(faves, concert.get('sgId'))});
			return <ConcertCard
								key={i}
								model={concert}
								addArtist={self.addArtist}
								removeArtist={self.removeArtist}
								addFavorite={self.addFavorite}
								removeFavorite={self.removeFavorite}
								selectedArtistId={self.props.selectedArtistId}
								z={i}/>;
		});

		console.log('filtered concerts.length',concerts.length);

    return (
			<div>
				<div style={styles.page}>
					<FlipMove
						style={this.props.pageStyle}
						easing={'ease'}
						staggerDurationBy={20}
						delay={100}
						duration={450}
					>
						<div style={styles.detail} key="favorites-check">
							<Checkbox
								key="check-fave"
								style={{width: 120, height: 26, marginLeft: 16}}
								onCheck={this.handleFaveToggle}
								checkedIcon={<ActionFavorite />}
					      uncheckedIcon={<ActionFavoriteBorder />}
								iconStyle={styles.checkIcon}
								label={'Favorites'}
								labelStyle={styles.checkLabel}
							/>
							<Checkbox
								key="check-seat"
								style={{width: 120, height: 26, marginLeft: 42}}
								onCheck={this.handleSeatToggle}
								checkedIcon={<EventSeat />}
								uncheckedIcon={<EventSeat />}
								iconStyle={this.state.seat ? styles.chairCheckIcon : styles.chairEmptyCheckIcon}
								label={'Tickets'}
								labelStyle={this.state.seat ? styles.chairCheckLabel : styles.chairEmptyCheckLabel}
							/>
						</div>
						{concerts}
					</FlipMove>
				</div>

				<Drawer
					key="drawer"
					containerStyle={{top:64, bottom:0, height:'calc(100vh-64px)'}}
					children={<TopTracks model={this.state.selectedArtist}/>}
					openSecondary={true}
					open={this.props.music}
				/>


			</div>
		);
  }

});



export default TripDetail;
