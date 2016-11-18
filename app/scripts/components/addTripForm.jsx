import $ from 'jquery';
import React from 'react';

import moment from 'moment';

import Formsy from 'formsy-react';
import {FormsySelect, FormsyText, FormsyDate} from 'formsy-material-ui/lib';

import {FlatButton, RaisedButton, MenuItem} from 'material-ui';



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
  }

};








var AddTripForm = React.createClass({


  getInitialState: function() {
    var today = new Date();
    return {
      today: today,
      startDate: today
    };
  },

  submitForm: function(data){
    console.log('submitForm', arguments)
    this.props.handleSubmit(data);
  },

  handleStartDate: function(e, date){
    this.setState({startDate: date});
  },


  formatDate: function(date){
    return moment(date).format('ll');

  },


  render: function() {
    return (
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
    );
  }

});



export default AddTripForm;
