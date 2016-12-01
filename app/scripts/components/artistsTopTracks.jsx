
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
	playIcon: {
		marginTop: 6
	}
};


var Track = React.createClass({

	mixins: [Backbone.React.Component.mixin],
	getInitialState: function() {
		return {
			playing: false,
			audio: null
		};
	},

	onClick: function() {

		// this.props.select()
		var playing = this.state.playing;
		var audio = this.state.audio;
		if(!playing){
			var audioUrl = this.getModel().get('mp3Url');
			console.log('AUDIO:', audio);
			if (audio === null){
				audio = new Audio(audioUrl);
			}
			console.log(audio);

			// audio.play();
			this.props.selectTrack(audio);

			this.setState({playing: true, audio: audio});


		}
		else {
			console.log('pausing');
			this.props.selectTrack(audio);

			this.setState({playing: false})
		}
	},



	render: function() {
		var track = this.getModel();
		return (
			<ListItem
				onTouchTap={this.onClick}
				innerDivStyle={styles.track}
				leftIcon={
					this.state.playing ?
					<i style={styles.playIcon} className="material-icons">pause</i>  :
					<i style={styles.playIcon} className="material-icons">play_arrow</i>
				}
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

	getInitialState: function() {
		return {
			playingTrack: null,
			playing: false
		};
	},

	select: function(track){
		var playing = this.state.playing;
		var playingTrack = this.state.playingTrack;

		if(playing){
			playingTrack.pause();
			playing = false;
		}
		if(track != playingTrack){

			track.play();
			playing = true;
			playingTrack = track;
		}
		this.setState({playingTrack: playingTrack, playing: playing})
	},

	componentDidMount: function() {

	},


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
		var self = this;
		console.log('playlist collection', this.getCollection().toJSON());
		this.getCollection().each(function(artist,j){
			artist.get('tracks').each(function(track,i){
				console.log('track '+ i +' from '+ artist.get('name'));
				tracks.push(<Track model={track} key={track.cid} selectTrack={self.select}/>);
				// console.log('tracks',tracks);
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
