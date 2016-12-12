import Backbone from 'backbone';

var Track = Backbone.Model.extend({
  defaults: {
    playing: false
  }
});

export default Track;
