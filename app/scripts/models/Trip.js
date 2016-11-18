import $ from 'jquery';
import Backbone from 'backbone';

import ParseModel from './ParseModel';

var Trip = ParseModel.extend({

  urlRoot: 'https://maeve.herokuapp.com/classes/Trip',

  defaults: {
    user: {
			'__type':    'Pointer',
			'className': '_User',
			'objectId':  localStorage.getItem('userId')
		}
  }

});

export default Trip;
