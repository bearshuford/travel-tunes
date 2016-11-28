import $ from 'jquery';

var setupParse = function(xhr){
  console.log('beforeSend');
  var token = localStorage.getItem('sessionToken');

  xhr.setRequestHeader("X-Parse-Application-Id", 'maeve');
  xhr.setRequestHeader("X-Parse-REST-API-Key", 'clementine');

  if(token !== null) {
    xhr.setRequestHeader("X-Parse-Session-Token", token);
  }


};


export default setupParse;
