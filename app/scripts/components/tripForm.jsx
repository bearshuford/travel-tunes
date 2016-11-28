import $ from 'jquery';
import React from 'react';
import moment from 'moment';

import Formsy from 'formsy-react';
import {FormsySelect, FormsyText, FormsyDate} from 'formsy-material-ui/lib';
import {FlatButton, RaisedButton, MenuItem} from 'material-ui';

import setupParse from './../setupParse.js';
import Image from './../models/Image.js';

const styles = {
  form: {

  },
  location: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-start'
  },
  city:{
    flex: '1 0 45%'
  },
  state:{
    flex: '1 0 45%'
  },
  cityInput:{
    width: 256
  },
  stateInput:{
    width: 256
  },
  dates:{
    width: '100%',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-start'
  },
  date:{
    flex: '1 0 45%'
  },
  buttons:{
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: 30
  },
  cancel:{
    marginRight: 12
  },
  imageInput:{
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0
  },
  imagePreview: {
    height: 80,
    marginLeft: 30
  },
  imageUpload: {
    height: 80,
    display: 'flex',
    flexFlow: 'row nowrap',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'

  }

};



var TripForm = React.createClass({

  getInitialState: function() {
    var today = new Date();
    return {
      today: today,
      startDate: today,
      imageFile: null,
      imagePreviewUrl: null
    };
  },

  beforeImageSubmit: function(xhr) {
    console.log('beforeImageSubmit');
    var imageFile = this.state.imageFile;
    var type = imageFile.type;
    xhr.setRequestHeader("Content-Type", type);
    setupParse(xhr);

  },

  submitForm: function(data){
    console.log('submitForm', arguments);
    var formData = data;
    var imageFile = this.state.imageFile;
    var handleSubmit = this.props.handleSubmit;

    var success = function(response){
      console.log('image url:', response.url);
      formData.imageUrl = response.url;
      handleSubmit(formData);
    };

    var error = function(response){
      console.log('image upload error:', response);

    };


    if(imageFile !== null){
      console.log(imageFile);
      // var settings = ;
      // settings.beforeSend = this.beforeImageSubmit;
      // settings.url = 'https://maeve.herokuapp.com/files';
      // settings.data = imageFile;
      // settings.type = 'POST';
      // settings.success = success;
      // console.log('beforeAjax', settings);
      $.ajax({
        beforeSend: this.beforeImageSubmit,
        url:        'https://maeve.herokuapp.com/files/'+imageFile.name,
        data:       imageFile,
        type:       'POST',
        success:    success,
        error:      error,
        processData: false
      }).then(function(){
        console.log('ajaxed!')
      });
    }
    else{
      this.props.handleSubmit(data);
    }

  },

  handleStartDate: function(e, date){
    this.setState({startDate: date});
  },


  formatDate: function(date){
    return moment(date).format('ll');
  },

  onImageChange: function(e){
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imageFile: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  },


  render: function() {
    var imagePreview = (this.state.imagePreviewUrl !== null);

    return (
      <div>
        <div style={styles.imageUpload}>
          <RaisedButton
            label="Choose an Image"
            labelPosition="before"
            style={styles.button}
          >
            <input
              type="file"
              style={styles.imageInput}
              onChange={this.onImageChange}/>
          </RaisedButton>
          <img
            src={this.state.imagePreviewUrl}
            style={styles.imagePreview}/>
        </div>

      <Formsy.Form
        style={styles.form}
        onSubmit={this.submitForm}
      >

      <div style={styles.location}>

        <div style={styles.state}>
          <FormsyText
            style={styles.cityInput}
            name="city"
            floatingLabelText="City"
          />
        </div>

        <div style={styles.state}>
          <FormsySelect
            name="state"
            floatingLabelText="State"
            style={styles.stateInput}
          >
            <MenuItem value="AL" primaryText="Alabama"/>
            <MenuItem value="AK" primaryText="Alaska"/>
            <MenuItem value="AZ" primaryText="Arizona"/>
            <MenuItem value="AR" primaryText="Arkansas"/>
            <MenuItem value="CA" primaryText="California"/>
            <MenuItem value="CO" primaryText="Colorado"/>
            <MenuItem value="CT" primaryText="Connecticut"/>
            <MenuItem value="DE" primaryText="Delaware"/>
            <MenuItem value="FL" primaryText="Florida"/>
            <MenuItem value="GA" primaryText="Georgia"/>
            <MenuItem value="HI" primaryText="Hawaii"/>
            <MenuItem value="ID" primaryText="Idaho"/>
            <MenuItem value="IL" primaryText="Illinois"/>
            <MenuItem value="IN" primaryText="Indiana"/>
            <MenuItem value="IA" primaryText="Iowa"/>
            <MenuItem value="KS" primaryText="Kansas"/>
            <MenuItem value="KY" primaryText="Kentucky"/>
            <MenuItem value="LA" primaryText="Louisiana"/>
            <MenuItem value="ME" primaryText="Maine"/>
            <MenuItem value="MD" primaryText="Maryland"/>
            <MenuItem value="MA" primaryText="Massachusetts"/>
            <MenuItem value="MI" primaryText="Michigan"/>
            <MenuItem value="MN" primaryText="Minnesota"/>
            <MenuItem value="MS" primaryText="Mississippi"/>
            <MenuItem value="MO" primaryText="Missouri"/>
            <MenuItem value="MT" primaryText="Montana"/>
            <MenuItem value="NE" primaryText="Nebraska"/>
            <MenuItem value="NV" primaryText="Nevada"/>
            <MenuItem value="NH" primaryText="New Hampshire"/>
            <MenuItem value="NJ" primaryText="New Jersey"/>
            <MenuItem value="NM" primaryText="New Mexico"/>
            <MenuItem value="NY" primaryText="New York"/>
            <MenuItem value="NC" primaryText="North Carolina"/>
            <MenuItem value="ND" primaryText="North Dakota"/>
            <MenuItem value="OH" primaryText="Ohio"/>
            <MenuItem value="OK" primaryText="Oklahoma"/>
            <MenuItem value="OR" primaryText="Oregon"/>
            <MenuItem value="PA" primaryText="Pennsylvania"/>
            <MenuItem value="RI" primaryText="Rhode Island"/>
            <MenuItem value="SC" primaryText="South Carolina"/>
            <MenuItem value="SD" primaryText="South Dakota"/>
            <MenuItem value="TN" primaryText="Tennessee"/>
            <MenuItem value="TX" primaryText="Texas"/>
            <MenuItem value="UT" primaryText="Utah"/>
            <MenuItem value="VT" primaryText="Vermont"/>
            <MenuItem value="VA" primaryText="Virginia"/>
            <MenuItem value="WA" primaryText="Washington"/>
            <MenuItem value="WV" primaryText="West Virginia"/>
            <MenuItem value="WI" primaryText="Wisconsin"/>
            <MenuItem value="WY" primaryText="Wyoming"/>
          </FormsySelect>
        </div>
      </div>



        <div style={styles.dates}>

          <FormsyDate
            name="startDate"
            floatingLabelText="Arival"
            hintText="Arival"
            style={styles.date}
            minDate={this.state.today}
            onChange={this.handleStartDate}
            formatDate={this.formatDate}
            autoOk={true}
            mode="landscape"
            required
          />
          <FormsyDate
            name="endDate"
            floatingLabelText="Departure"
            hintText="Departure"
            style={styles.date}
            minDate={this.state.startDate}
            formatDate={this.formatDate}
            autoOk={true}
            mode="landscape"
            required
          />
        </div>





      <div style={styles.buttons}>
        <FlatButton
          style={styles.cancel}
          label="Cancel"
          secondary={true}
          href="#trips"
          type="button"
        />
        <RaisedButton
          label="Add"
          type="submit"
          primary={true}
        />
      </div>

      </Formsy.Form>
    </div>
    );
  }

});



export default TripForm;
