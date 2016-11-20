import Backbone from 'backbone';
import setupParse from './../setupParse';


var ParseModel = Backbone.Model.extend({
  idAttribute: 'objectId',



  sync: function(method, model, options){
    console.log('sync', method);

    options = options || {};
    var beforeSend = options.beforeSend;

    options.beforeSend = setupParse;
    
    if (beforeSend) return beforeSend.apply(this, arguments);

    return Backbone.Model.prototype.sync.apply(this, arguments);
  },

  save: function(key, val, options){
    console.log('save');

    delete this.attributes.createdAt;
    delete this.attributes.updatedAt;

    options = options || {};
    var beforeSend = options.beforeSend;

    options.beforeSend = setupParse;

    if (beforeSend) return beforeSend.apply(this, arguments);


    return Backbone.Model.prototype.save.apply(this, arguments);
  },

});



export default ParseModel;
