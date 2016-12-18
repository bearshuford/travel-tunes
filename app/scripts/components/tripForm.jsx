import $      from 'jquery';
import React  from 'react';
import moment from 'moment';
import Formsy from 'formsy-react';

import {FormsySelect, FormsyText, FormsyDate, FormsyAutoComplete} from 'formsy-material-ui/lib';
import {FlatButton, RaisedButton, IconButton, MenuItem, Avatar, AutoComplete}   from 'material-ui';

import AddPhoto from 'material-ui/svg-icons/image/add-a-photo';

import setupParse from './../setupParse.js';

const styles = {
  form: {
    position: 'relative'
  },
  header: {
    marginTop:      10,
    height:         76,
    width:          '100%',
    display:        'flex',
    flexFlow:       'row nowrap',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom: -14
  },

  title: {
    fontSize:   22,
    fontWeight: 400,
    border:     0,
    lineHeight: '32px',
    margin:     '0px 0px -1px ',
    color:      'rgba(0, 0, 0, 0.870588)',
    paddingBottom: 14
  },
  location: {
    width:          '100%',
    display:        'flex',
    flexFlow:       'row wrap',
    justifyContent: 'flex-start'
  },
  city: {
    flex: '1 0 50%'
  },
  state: {
    flex: '1 0 50%'
  },
  cityInput: {
    minWidth: 256
  },
  stateInput: {
    minWidth: 256
  },
  dates: {
    width:          '100%',
    display:        'flex',
    flexFlow:       'row wrap',
    justifyContent: 'space-between'
  },
  date:{
    flex: '1 0 45%'
  },
  buttons:{
    display:        'flex',
    width:          '100%',
    justifyContent: 'flex-end',
    flexFlow:       'row wrap',
    alignItems:     'center',
    marginTop:      30
  },
  cancel:{
    marginRight: 12
  },
  imageInput:{
    cursor:   'pointer',
    position: 'absolute',
    width:    '100%',
    height:    '100%',
    top:      0,
    bottom:   0,
    right:    0,
    left:     0,
    opacity:  0
  },
  imagePreview: {
    width:      64,
    height:     64,
    marginLeft: 36,
    position:  'relative'
  },
  imagePreviewButton: {
    width:      64,
    height:     64,
    marginLeft: 36,
    cursor:    'pointer',
    position:  'relative'
  },

  imageUpload: {
    // height:         64,
    // flex:           '1 0 auto'
  }
};

// https://gist.githubusercontent.com/norcal82/42440bd06a67eb7d9616/raw/882838c2fa2dca4ae350589fe2ec7dd632a85d88/city_names.js
var cityNames = ["Aberdeen", "Abilene", "Akron", "Albany", "Albuquerque", "Alexandria", "Allentown", "Amarillo", "Anaheim", "Anchorage", "Ann Arbor", "Antioch", "Apple Valley", "Appleton", "Arlington", "Arvada", "Asheville", "Athens", "Atlanta", "Atlantic City", "Augusta", "Aurora", "Austin", "Bakersfield", "Baltimore", "Barnstable", "Baton Rouge", "Beaumont", "Bel Air", "Bellevue", "Berkeley", "Bethlehem", "Billings", "Birmingham", "Bloomington", "Boise", "Boise City", "Bonita Springs", "Boston", "Boulder", "Bradenton", "Bremerton", "Bridgeport", "Brighton", "Brownsville", "Bryan", "Buffalo", "Burbank", "Burlington", "Cambridge", "Canton", "Cape Coral", "Carrollton", "Cary", "Cathedral City", "Cedar Rapids", "Champaign", "Chandler", "Charleston", "Charlotte", "Chattanooga", "Chesapeake", "Chicago", "Chula Vista", "Cincinnati", "Clarke County", "Clarksville", "Clearwater", "Cleveland", "College Station", "Colorado Springs", "Columbia", "Columbus", "Concord", "Coral Springs", "Corona", "Corpus Christi", "Costa Mesa", "Dallas", "Daly City", "Danbury", "Davenport", "Davidson County", "Dayton", "Daytona Beach", "Deltona", "Denton", "Denver", "Des Moines", "Detroit", "Downey", "Duluth", "Durham", "El Monte", "El Paso", "Elizabeth", "Elk Grove", "Elkhart", "Erie", "Escondido", "Eugene", "Evansville", "Fairfield", "Fargo", "Fayetteville", "Fitchburg", "Flint", "Fontana", "Fort Collins", "Fort Lauderdale", "Fort Smith", "Fort Walton Beach", "Fort Wayne", "Fort Worth", "Frederick", "Fremont", "Fresno", "Fullerton", "Gainesville", "Garden Grove", "Garland", "Gastonia", "Gilbert", "Glendale", "Grand Prairie", "Grand Rapids", "Grayslake", "Green Bay", "GreenBay", "Greensboro", "Greenville", "Gulfport-Biloxi", "Hagerstown", "Hampton", "Harlingen", "Harrisburg", "Hartford", "Havre de Grace", "Hayward", "Hemet", "Henderson", "Hesperia", "Hialeah", "Hickory", "High Point", "Hollywood", "Honolulu", "Houma", "Houston", "Howell", "Huntington", "Huntington Beach", "Huntsville", "Independence", "Indianapolis", "Inglewood", "Irvine", "Irving", "Jackson", "Jacksonville", "Jefferson", "Jersey City", "Johnson City", "Joliet", "Kailua", "Kalamazoo", "Kaneohe", "Kansas City", "Kennewick", "Kenosha", "Killeen", "Kissimmee", "Knoxville", "Lacey", "Lafayette", "Lake Charles", "Lakeland", "Lakewood", "Lancaster", "Lansing", "Laredo", "Las Cruces", "Las Vegas", "Layton", "Leominster", "Lewisville", "Lexington", "Lincoln", "Little Rock", "Long Beach", "Lorain", "Los Angeles", "Louisville", "Lowell", "Lubbock", "Macon", "Madison", "Manchester", "Marina", "Marysville", "McAllen", "McHenry", "Medford", "Melbourne", "Memphis", "Merced", "Mesa", "Mesquite", "Miami", "Milwaukee", "Minneapolis", "Miramar", "Mission Viejo", "Mobile", "Modesto", "Monroe", "Monterey", "Montgomery", "Moreno Valley", "Murfreesboro", "Murrieta", "Muskegon", "Myrtle Beach", "Naperville", "Naples", "Nashua", "Nashville", "New Bedford", "New Haven", "New London", "New Orleans", "New York", "New York City", "Newark", "Newburgh", "Newport News", "Norfolk", "Normal", "Norman", "North Charleston", "North Las Vegas", "North Port", "Norwalk", "Norwich", "Oakland", "Ocala", "Oceanside", "Odessa", "Ogden", "Oklahoma City", "Olathe", "Olympia", "Omaha", "Ontario", "Orange", "Orem", "Orlando", "Overland Park", "Oxnard", "Palm Bay", "Palm Springs", "Palmdale", "Panama City", "Pasadena", "Paterson", "Pembroke Pines", "Pensacola", "Peoria", "Philadelphia", "Phoenix", "Pittsburgh", "Plano", "Pomona", "Pompano Beach", "Port Arthur", "Port Orange", "Port Saint Lucie", "Port St. Lucie", "Portland", "Portsmouth", "Poughkeepsie", "Providence", "Provo", "Pueblo", "Punta Gorda", "Racine", "Raleigh", "Rancho Cucamonga", "Reading", "Redding", "Reno", "Richland", "Richmond", "Richmond County", "Riverside", "Roanoke", "Rochester", "Rockford", "Roseville", "Round Lake Beach", "Sacramento", "Saginaw", "Saint Louis", "Saint Paul", "Saint Petersburg", "Salem", "Salinas", "Salt Lake City", "San Antonio", "San Bernardino", "San Buenaventura", "San Diego", "San Francisco", "San Jose", "Santa Ana", "Santa Barbara", "Santa Clara", "Santa Clarita", "Santa Cruz", "Santa Maria", "Santa Rosa", "Sarasota", "Savannah", "Scottsdale", "Scranton", "Seaside", "Seattle", "Sebastian", "Shreveport", "Simi Valley", "Sioux City", "Sioux Falls", "South Bend", "South Lyon", "Spartanburg", "Spokane", "Springdale", "Springfield", "St. Louis", "St. Paul", "St. Petersburg", "Stamford", "Sterling Heights", "Stockton", "Sunnyvale", "Syracuse", "Tacoma", "Tallahassee", "Tampa", "Temecula", "Tempe", "Thornton", "Thousand Oaks", "Toledo", "Topeka", "Torrance", "Trenton", "Tucson", "Tulsa", "Tuscaloosa", "Tyler", "Utica", "Vallejo", "Vancouver", "Vero Beach", "Victorville", "Virginia Beach", "Visalia", "Waco", "Warren", "Washington", "Waterbury", "Waterloo", "West Covina", "West Valley City", "Westminster", "Wichita", "Wilmington", "Winston", "Winter Haven", "Worcester", "Yakima", "Yonkers", "York", "Youngstown"];



var TripForm = React.createClass({

  getInitialState: function() {
    var today = new Date();
    return {
      today:           today,
      startDate:       today,
      imageFile:       null,
      imagePreviewUrl: null
    };
  },

  beforeImageSubmit: function(xhr) {
    console.log('beforeImageSubmit');
    var imageFile = this.state.imageFile;
    var type      = imageFile.type;
    xhr.setRequestHeader("Content-Type", type);
    setupParse(xhr);
  },

  submitForm: function(data){
    console.log('submitForm', arguments);
    var formData     = data;
    var imageFile    = this.state.imageFile;
    var handleSubmit = this.props.handleSubmit;

    var success = function(response){
      formData.imageUrl = response.url;
      handleSubmit(formData);
    };

    var error = function(response){
      console.log('image upload error:', response);
    };

    if(imageFile !== null){
      $.ajax({
        beforeSend:  this.beforeImageSubmit,
        url:         'https://maeve.herokuapp.com/files/'+imageFile.name,
        data:        imageFile,
        type:        'POST',
        success:     success,
        error:       error,
        processData: false
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

    var reader = new FileReader();
    var file   = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imageFile:       file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  },


  render: function() {
    var imagePreview = (this.state.imagePreviewUrl !== null);

    return (
      <div>




      <Formsy.Form
        style={styles.form}
        onSubmit={this.submitForm}
      >

      <div style={styles.header}>

      <h3 style={styles.title}>Add a Trip</h3>

      { imagePreview ?
        <Avatar
          src={this.state.imagePreviewUrl}
          style={styles.imagePreview}
        /> :

        <Avatar style={styles.imagePreviewButton} size={64}>
          <AddPhoto color="white"/>
          <input
            type="file"
            style={styles.imageInput}
            onChange={this.onImageChange}/>
        </Avatar>
      }
    </div>

      <div style={styles.location}>

        <div style={styles.city}>
          <FormsyAutoComplete
            dataSource={cityNames}
            style={styles.cityInput}
            filter={AutoComplete.caseInsensitiveFilter}
            maxSearchResults={5}
            name="city"
            floatingLabelText="City"
            disableFocusRipple={false}
            required
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
        <div style={styles.imageUpload}>

          {/* imagePreview ?
            <Avatar
              src={this.state.imagePreviewUrl}
              style={styles.imagePreview}
            /> :

            <Avatar style={styles.imagePreview}>
              <AddPhoto />
              <input
                type="file"
                style={styles.imageInput}
                onChange={this.onImageChange}/>
            </Avatar>
          */}
        </div>
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
