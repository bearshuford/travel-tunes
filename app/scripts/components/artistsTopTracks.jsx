
import $ 				from 'jquery';
import _ 				from 'underscore';
import React 		from 'react';

import Backbone from 'backbone';

import {List, ListItem, Avatar} from 'material-ui';

import Trip   from './../models/Trip';
import Artist from './../models/SpotifyArtist';
import ArtistCollection from './../models/SpotifyArtistCollection';

require('backbone-react-component');


const styles = {
	trackName: {
		fontSize: 14
	},
	artistName:{
		fontSize: 12
	},
	track: {
		paddingTop: 10,
		paddingBottom: 10
	},

};


var Track = React.createClass({

	mixins: [Backbone.React.Component.mixin],

	render: function() {
		var track = this.getModel();
		return (
			<ListItem
				innerDivStyle={styles.track}
				primaryText={
					<div style={styles.trackName}>
						{track.get('name')}
					</div>}
				secondaryText={
					<div style={styles.artistName}>
						{track.get('artist').get('name')}
					</div>}
			/>
		);
	}

});





/* props: collection={ArtistCollection} */
var TopTracks = React.createClass({

	mixins: [Backbone.React.Component.mixin],


  componentWillUpdate: function(nextProps, nextState) {

    this.getCollection().each(function(artist){
			console.log('componentWillMount', artist);
			if(!artist.get('fetched') && !artist.get('fetching')){
      	artist.getTopTracks(5);
			}
    });
  },

	render: function() {
		var tracks = [];
		this.getCollection().each(function(artist, i){
			console.log('render artist',artist.get('name'));
			artist.get('tracks').each(function(track, j){
				console.log('render tracks', track.get('name'));
				tracks.push(<Track model={track} key={i +'from'+ j}/>);
				console.log('tracks',tracks);
			});
		});
		return (
			<List >
		      {tracks}
			</List>
		);
	}

});

export default TopTracks;
