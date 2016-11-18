import Backbone from 'backbone';

import setupParse from './../setupParse';

var ParseCollection = Backbone.Collection.extend({

  whereClause: {field: '', className: '', objectId: ''},

  parseWhere: function(field, className, objectId){
    this.whereClause = {
      field:     field,
      className: className,
      objectId:  objectId,
      '__type':  'Pointer'
    };

    return this;
  },

  url: function(){
    var url = this.baseUrl;

    console.log('whereClause',this.whereClause.field)
    if(this.whereClause.field){
      var field = this.whereClause.field;
      delete this.whereClause.field;
      url += '?where={"' + field + '":' + JSON.stringify(this.whereClause) + '}';
    }

    return url;
  },

  fetch: function() {
    setupParse();
    return Backbone.Collection.prototype.fetch.apply(this, arguments);
  },

  parse: function(data){
    return data.results;
  }

});

export default ParseCollection;
