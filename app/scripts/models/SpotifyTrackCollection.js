import $ from 'jquery';
import Backbone from 'backbone';


import Track from './SpotifyTrack';

var TrackCollection = Backbone.Collection.extend({
  model: Track




});

export default TrackCollection;
