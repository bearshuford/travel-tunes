import Backbone        from 'backbone';

import Trip            from './Trip';
import ParseCollection from './ParseCollection';

var TripCollection = ParseCollection.extend({
  model:   Trip,
  comparator: 'startDate',
  baseUrl: 'https://maeve.herokuapp.com/classes/Trip'
});

export default TripCollection;
