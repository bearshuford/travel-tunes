import Backbone from 'backbone';
import {blueA200, redA700, deepPurple500, orange700} from 'material-ui/styles/colors';

import ParseModel from './ParseModel';

const colors = [blueA200, redA700, deepPurple500, orange700];


var Trip = ParseModel.extend({
  idAttribute: 'objectId',
  urlRoot:     'https://maeve.herokuapp.com/classes/Trip',

  defaults: {
    user: {
			'__type':    'Pointer',
			'className': '_User',
			'objectId':  localStorage.getItem('userId')
		},
    favorites: [],
    color: colors[Math.floor(Math.random()*colors.length)]
  }

});

export default Trip;
