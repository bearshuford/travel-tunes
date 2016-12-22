
import $ 				from 'jquery';
import _ 				from 'underscore';
import React 		from 'react';
import moment 	from 'moment';
import Backbone from 'backbone';
import FlipMove from 'react-flip-move';

import {Avatar, Card, CardHeader, CardTitle, CardText,
				Chip, IconButton, Toggle, Checkbox,
				BottomNavigation, BottomNavigationItem} from 'material-ui';

import {greenA700, greenA400, pink400} from 'material-ui/styles/colors';

import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import EventSeat from 'material-ui/svg-icons/action/event-seat';

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
		position: 'relative',
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
		width: 60,

	},

  detail: {
    width:'100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
		alignItems: 'center',
		height: 42,
		paddingLeft: 28,
		paddingBottom: 4
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
		marginLeft: -4,
		marginTop:  1,
		lineHeight: '26px'
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
		console.log(this.getModel().toJSON());

		var artist =  this.getModel();
		this.props.addArtist(artist);
	},

	render: function(){
		var artist  = this.getModel();
		var spotify = artist.get('spotify');
		var spotifyId = artist.get('spotifyId')
		var added = spotifyId === this.props.selectedArtistId && spotifyId;
		if(added) {console.log('ADDED', artist.get('spotifyId'));}
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
		console.log('favorite:');
		var concert = this.getModel();

		if(!concert.get('favorite')){
			this.props.addFavorite(concert.get('sgId'));
			console.log('concert card– adding favorite:', concert.get('sgId'));
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
					children={
						<div style={styles.cardIcons}>
							<IconButton
								tooltip={price}
								disabled={chair}
								style={{padding:0, width:24, height:24}}
								tooltipPosition="top-left"
								tooltipStyles={{fontSize: 12}}
								href={concert.get('sgUrl')}
							>
								<EventSeat/>
							</IconButton>
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








var Concerts = React.createClass({

	mixins: [Backbone.React.Component.mixin],

	getInitialState: function() {
		return {
      favorites: false
    };
	},

	handleToggle: function(event, toggle) {
		 this.setState({favorites: toggle});
	 },

	render: function() {
		var self = this;
		var concerts = this.getCollection();
		var faves = this.getModel().get('favorites');

		// set favorites
		concerts.map(function(concert,i){
			var favorite =_.contains(faves, concert.get('sgId'))
			concert.set({'favorite': favorite});

			return concert;
		});

		if(self.state.favorites === true)
			concerts = concerts.where({favorite:true});

		concerts = concerts.map( function(concert, i){
			return <ConcertCard
			          key={concert.cid}
								model={concert}
								addArtist={self.props.addArtist}
								removeArtist={self.props.removeArtist}
								addFavorite={self.props.addFavorite}
								removeFavorite={self.props.removeFavorite}
								selectedArtistId={self.props.selectedArtistId}/>;
		});
		console.log(this.props.pageStyle);
		return (
			<div style={styles.concerts}>
				<FlipMove
					style={this.props.pageStyle}
					easing={'cubic-bezier(0.43, 1, 0.5, 1)'}
					staggerDurationBy={20}
					staggerDelayBy={20}
					duration={500}
				>
				<div style={styles.detail} key="favorites-check">
					<Checkbox
						style={{width: 120, height: 26}}
						checked={this.state.favorites}
						onCheck={this.handleToggle}
						checkedIcon={<ActionFavorite />}
			      uncheckedIcon={<ActionFavoriteBorder />}
						iconStyle={styles.checkIcon}
						label={'Favorites'}
						labelStyle={styles.checkLabel}
					/>
				</div>
					{concerts}
				</FlipMove>

			</div>
		);
	}

});

export default Concerts;
