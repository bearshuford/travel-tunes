import Backbone from 'backbone';
import parseSetup from './../parseUtilities';


var ParseModel = Backbone.Model.extend({
  idAttribute: 'objectId',

  beforeSave: function(){
    parseSetup();
  },

  save: function(key, val, options){
    this.beforeSave();

    delete this.attributes.createdAt;
    delete this.attributes.updatedAt;

    return Backbone.Model.prototype.save.apply(this, arguments);
  }
});



export default ParseModel;
