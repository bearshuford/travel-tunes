import $ from 'jquery';
import Backbone from 'backbone';

import ParseModel from './ParseModel';

var Image = ParseModel.extend({
  idAttribute: 'objectId',
  urlRoot: 'https://maeve.herokuapp.com/files',


});

export default Image;
