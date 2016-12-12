
import $ 				from 'jquery';
import _ 				from 'underscore';
import Backbone from 'backbone';

import React, {Component, PropTypes} from 'react';

import {List, ListItem, makeSelectable, Avatar, Subheader} from 'material-ui';
import Pause from 'material-ui/svg-icons/av/pause-circle-filled';
import Play  from 'material-ui/svg-icons/av/play-circle-outline';
import Replay  from 'material-ui/svg-icons/av/replay';

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
	}

};


// let SelectableList = makeSelectable(List);
//
// function wrapState(ComposedComponent) {
//   return class SelectableList extends Component {
//     // const propTypes = {
//     //   children: PropTypes.node.isRequired,
//     //   defaultValue: PropTypes.number.isRequired
//     // };
//
//     componentWillMount() {
//       this.setState({
//         selectedIndex: this.props.defaultValue
//       });
//     }
//
//     handleRequestChange = (event, index) => {
//       this.setState({
//         selectedIndex: index
//       });
//     };
//
//     render() {
//       return (
//         <ComposedComponent
//           value={this.state.selectedIndex}
//           onChange={this.handleRequestChange}
//         >
//           {this.props.children}
//         </ComposedComponent>
//       );
//     }
//   };
// }
//
// SelectableList = wrapState(SelectableList);




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

	componentWillUpdate: function(nextProps, nextState) {

	},

	onClick: function() {

		// this.props.select()
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





/* props: collection={ArtistCollection} */
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
		var artist = this.getCollection().at(0);
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



  componentWillUpdate: function(nextProps, nextState) {

    // this.getCollection().each(function(artist){
		// 	console.log('componentWillMount', artist);
		// 	if(!artist.get('fetched') && !artist.get('fetching')){
    //   	artist.getTopTracks(5);
		// 	}
    // });
  },

	render: function() {
		var tracks   = [];
		var self     = this;
    var name     = null;
		var img      = null;
		var genres   = null;
		var ended    = this.ended;
		var autoplay = this.state.autoplay;
		var imgCount;
		console.log('playlist collection', this.getCollection().toJSON());
		this.getCollection().each(function(artist,j){
      name      = artist.get('name');
			imgCount  = artist.get('images').length
			img       = artist.get('images')[0];
			genres		= artist.get('genres')[0];
			console.log('genres~~',genres);


			artist.get('tracks').each(function(track,i){
				tracks.push(<Track
											model={track}
											key={track.cid}
											pos={i}
											ended={ended}
											autoplay={i === autoplay}
											selectTrack={self.select}/>);
			});
		});
		var hasTracks = (tracks.length > 0);
		var hasArtist = (name !== null);
		return (
			<List >
					{hasTracks
						&&
						<Subheader children="top tracks"/>}
					{hasArtist
						&&
						<ListItem
							primaryText={name}
							secondaryText={genres}
							autoGenerateNestedIndicator={false}
							leftAvatar={<Avatar src={img.url} />}
							nestedItems={tracks}
							initiallyOpen={true}
	          />
					}
			</List>
		);
	}

});

export default TopTracks;
