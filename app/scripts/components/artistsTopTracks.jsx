
import $ 				from 'jquery';
import _ 				from 'underscore';
import Backbone from 'backbone';

import React, {Component, PropTypes} from 'react';

import {List, ListItem, makeSelectable, Avatar, Subheader} from 'material-ui';
import Pause from 'material-ui/svg-icons/av/pause-circle-filled';
import Play  from 'material-ui/svg-icons/av/play-circle-outline';
import Replay  from 'material-ui/svg-icons/av/replay';
import Queue  from 'material-ui/svg-icons/av/queue-music';


import Trip   from './../models/Trip';
import Artist from './../models/SpotifyArtist';
import ArtistCollection from './../models/SpotifyArtistCollection';

require('backbone-react-component');

const styles = {
	trackName: {
		fontSize: 14,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		display: 'block',
		textOverflow: 'ellipsis',
	},
	track: {
		paddingLeft: 56
	},
	list: {
		paddingBottom: 2
	}

};


var Track = React.createClass({

	mixins: [Backbone.React.Component.mixin],
	getInitialState: function() {
		return {
			playing: false,
			ended:   false,
			audio:   null
		};
	},

	componentDidUpdate: function(prevProps, prevState) {
		if(this.props.autoplay && !prevProps.autoplay){
			console.log('CDU', this.props, prevProps);
			this.onClick();
		}
	},

	onClick: function() {

		var playing = this.getModel().get('playing');
		var audio = this.state.audio;
		if(!playing){
			var audioUrl = this.getModel().get('mp3Url');

			if (audio === null){
				var self = this;
				audio = new Audio(audioUrl);
				audio.onpause = function(){
					self.setState({playing: false, ended: false});
				};
				audio.onended = function(){
					var a = self.state.audio;
					a.currentTime = 0;
					self.setState({ended: true});
					self.props.ended();
				};

			}

			this.props.selectTrack(audio, this.props.pos);
			this.setState({playing: true, audio: audio});
		}
		else {
			this.props.selectTrack(audio);
		}
	},


	render: function() {
		var name = this.getModel().get('name');
	  var icon = this.state.ended ? <Replay/>:<Play color="white"/>;
		icon = this.state.playing ?  <Pause/> : icon;

		return (
			<ListItem
				onTouchTap={this.onClick}
				innerDivStyle={styles.track}
				leftIcon={icon}
				primaryText={<span style={styles.trackName}>{name}</span>}

			/>
		);
	}

});




/* props: model={Artist} */
var TopTracks = React.createClass({

	mixins: [Backbone.React.Component.mixin],

	getInitialState: function() {
		return {
			playingTrack: null,
			playingPos: null,
			playing: false,
			autoplay: null
		};
	},

	select: function(track, pos){
		var playing = this.state.playing;
		var playingTrack = this.state.playingTrack;
		var artist = this.getModel();
		var t = artist.get('tracks').at(pos);
		var same = this.state.playingPos === pos;

		if(playing){
			console.log('~~select: something is playing~~');
			playingTrack.pause();
			playing = false;
		}
		if(!same){
			console.log('~~select: !same~~')
			track.play();
			playing = true;
			playingTrack = track;
		}
		else if(!this.state.playing){
			track.play();
			playing = true;
		}

		this.setState({
			playingTrack: playingTrack,
			playing: playing,
			playingPos: pos
		});
	},

	ended: function() {
		var autoplay = this.state.playingPos+1;
		console.log('autoplay',autoplay);

		this.setState({playing:false, autoplay: autoplay});
	},



	render: function() {
		var self     = this;
    var tracks = [];
    var artist = this.getModel();

		var name = artist.get('name')
		var imgCount = 0;

		if(name.length > 1){
			tracks = artist.get('tracks').map(function(track,i){
	      return (<Track
	                model={track}
	                key={track.cid}
	                pos={i}
	                ended={self.ended}
	                autoplay={i === self.state.autoplay}
	                selectTrack={self.select}/>);
	    });
		}

		var hasTracks = (tracks.length > 0);
		var img   = null;
    var genre = null;

		if(hasTracks && this.getModel().get('images')[0]){
			img = this.getModel().get('images')[0].url;
			genre = this.getModel().get('genres')[0];
		}

		return (
			<List style={styles.list}>
					{
						<Subheader
							children={
								<div style={{display:'flex', alignItems:'center', padding: 'auto 26px'}}>
									<Queue color={'#757575'}/>
									<span style={{marginLeft: 12}}>{hasTracks ? 'top tracks' : 'select an artist for tunes'}</span>
								</div>
							}
						/>
					}
					{hasTracks
						&&
						<ListItem
							primaryText={name}
							secondaryText={genre}
							autoGenerateNestedIndicator={false}
							leftAvatar={<Avatar src={img} />}
							nestedItems={tracks}
							initiallyOpen={true}
	          />
					}
			</List>
		);
	}

});

export default TopTracks;
