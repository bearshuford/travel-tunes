import $ from 'jquery';

var setupParse = function(sessionId){
  $.ajaxSetup({
    beforeSend: function(xhr){
      xhr.setRequestHeader("X-Parse-Application-Id", 'maeve');
      xhr.setRequestHeader("X-Parse-REST-API-Key", 'clementine');

      if(localStorage.getItem('sessionId') !== null){
        xhr.setRequestHeader("X-Parse-Session-Token", sessionId);
      }
    }
  });
}


export default setupParse;
