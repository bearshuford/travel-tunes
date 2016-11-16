import $ from 'jquery';
import Backbone from 'backbone';
import './router.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';


$(function(){
   injectTapEventPlugin();
  Backbone.history.start();
});
