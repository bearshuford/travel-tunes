
import $ 				from 'jquery';
import _ 				from 'underscore';
import React 		from 'react';
import moment 	from 'moment';
import Backbone from 'backbone';

import {Avatar, Card, CardHeader, CardTitle, CardText,
				Chip, IconButton, Toggle, Checkbox,
				BottomNavigation, BottomNavigationItem} from 'material-ui';

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
		paddingBottom: 8
	},
	date:{

	},
	seat: {
		position: 'absolute',
		top: 0,
		right: 42,
		marginTop: 5,
		marginBottom: 5
	},
	fave: {
		position: 'absolute',
		top: 0,
		right: 4,
		marginTop: 5,
		marginBottom: 5
	},
  detail: {
    width:'100%',
    paddingLeft: 30,
    margin: 10
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

		var color 		= spotify && added ? '#23CF5F'  : null;
		var iconColor = spotify && !added ? '#23CF5F'  : null;

		var avatarIcon = added  ?  <i className="material-icons">playlist_add_check</i> : <i style={{'color':iconColor}} className="material-icons">queue_music</i>;

		console.log('~~~~~~~~',spotifyId, this.props.selectedArtistId);

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
		}
		else{
			this.props.removeFavorite(concert.get('sgId'));
		}

		//  concert.set({'favorite': favorite});
	},


	render: function() {
		var concert = this.getModel();
		var m    = moment(concert.get('date'));
		var day  = m.format('ddd, MMM D');
		var time = m.format('h:mm a');
		var self = this;

		var price = concert.get('price') ? 'from $'+ concert.get('price'): null;
		var chair = (concert.get('price') == null );
		//? {color: 'gray', fill: 'currentColor'} : null;

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
					openIcon={<span><i style={{color: '#E91E63'}} className="material-icons">favorite</i></span>}
					closeIcon={<span><i style={{color: '#E91E63'}} className="material-icons">favorite_border</i></span> }
				/>

				<div style={styles.seat}>
					<IconButton
						tooltip={price}
						disabled={chair}
						iconStyle={{cursor:'default'}}
						tooltipPosition="top-center"
						tooltipStyles={{fontSize: 12}}
						href={concert.get('sgUrl')}
						>
						<EventSeat style={{color: 'blue', fill: 'currentColor'}}/>
					</IconButton>

				</div>

				<div style={styles.fave}>
					<IconButton
						iconStyle={{color: '#E91E63'}}
						onTouchTap={this.onExpandChange}
						>
						{concert.get('favorite') ? <ActionFavorite /> : <ActionFavoriteBorder/>}
					</IconButton>



				</div>





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
      favorites: false,
			index: 0
    };
	},

	select: function(index){
		this.setState({favorites:(index===1), index: index});
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
								removeFavorite={self.props.removeFavorite}
								selectedArtistId={self.props.selectedArtistId}/>;
		});

		return (
			<div style={styles.concerts}>
{/*				<BottomNavigation selectedIndex={this.state.index}>
          <BottomNavigationItem
            label="All"
						icon={<ActionFavoriteBorder/>}
            onTouchTap={() => this.select(0)}
          />
          <BottomNavigationItem
            label="Favorites"
            icon={<ActionFavorite/>}
            onTouchTap={() => this.select(1)}
          />
        </BottomNavigation> */}
				<div style={styles.detail}>
					<Checkbox
							checked={this.state.favorites}
							onCheck={this.handleToggle}
							checkedIcon={<ActionFavorite />}
				      uncheckedIcon={<ActionFavoriteBorder />}
							iconStyle={{color: '#E91E63', fill: 'currentColor'}}
							label={'Favorites'}
							labelStyle={{color: '#E91E63', marginLeft: -8}}
							/>
				</div>

				{concerts}

			</div>
		);
	}

});

export default Concerts;
