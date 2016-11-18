import React from 'react';
import moment from 'moment';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,
				Paper, Dialog, FlatButton, FloatingActionButton} from 'material-ui';

import App from './app.jsx';
import AddTripForm from './addTripForm.jsx';

import Trip from './../models/Trip';
import TripCollection from './../models/TripCollection';





const tripList = [
	{
		city:			 'portland',
		state:		 'OR',
		startDate: '2016-12-20',
		endDate:   '2017-1-7'
	},{
		city:			 'columbia',
		state:		 'SC',
		startDate: '2017-1-18',
		endDate:   '2017-1-25'
	}
];



const styles = {
	page:{
		position: 'relative',
		display: 'flex',
		flexFlow: 'row nowrap',
		justifyContent: 'center'
	},
	paper:{
		width: 500,
		marginTop: 20
	},
	addButton: {
		position: 'absolute',
		right: 100,
		bottom: -100,
		zIndex: 1300
	},
	dialog:{

	},
	dialogTitle:{
		border: 0
		// marginBottom: 16
	},
	dialogBody: {

	},
	dialogContent: {

	}

};









var TripRow = React.createClass({
	render: function() {
		var trip = this.props.trip;
		var startDate = moment(trip.startDate).format('ll');
		var endDate   = moment(trip.endDate).format('ll');
		return (
			<TableRow>
				<TableRowColumn> {trip.city}      </TableRowColumn>
				<TableRowColumn> {trip.state}     </TableRowColumn>
				<TableRowColumn> {startDate} </TableRowColumn>
				<TableRowColumn> {endDate}   </TableRowColumn>
			</TableRow>
		);
	}
});


var Calendar = React.createClass({

  render: function() {
		var trips = this.props.trips.map(function(trip, i){
			console.log('arguments', arguments);
			console.log(trip.toJSON)
			return <TripRow trip={trip} key={i}/>
		});
    return (
			<Paper style={styles.paper}>
				<Table>
					<TableHeader
						adjustForCheckbox={false}
						displaySelectAll={false}>
						<TableRow>
							<TableHeaderColumn>City</TableHeaderColumn>
							<TableHeaderColumn>State</TableHeaderColumn>
							<TableHeaderColumn>Start Date</TableHeaderColumn>
							<TableHeaderColumn>End Date</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody>
						{trips}
					</TableBody>
				</Table>
			</Paper>
		);
  }

});


var CalendarContainer = React.createClass({


	getInitialState: function() {
		return {
			trips: new TripCollection(),
			state: open
		};
	},

	componentWillMount: function() {
		var trips = this.state.trips;
		var userId = localStorage.getItem('userId');
		trips.parseWhere('user','_User', userId).fetch().then(
      function(){
        this.setState({trips: trips});
      }.bind(this)
    );
    return true;
	},


	openDialog: function() {
		 this.setState({open: true});
	},

	closeDialog: function() {
		this.setState({open: false});
	},

	handleSubmit(data) {
		console.log('handlesubmit',data);
		var trip = new Trip(data);
		trip.save();
	},


  render: function() {



    return (
			<App>
				<div style={styles.page}>
					<Calendar trips={this.state.trips.toJSON()}/>
					<FloatingActionButton style={styles.addButton}
						secondary={true}
						children={<i className="material-icons">add</i>}
						href="#trips/new"/>
				</div>
				<Dialog
          title="Add a Trip"
					titleStyle={styles.dialogTitle}
					bodyStyle={styles.dialogBody}
					contentStyle={styles.dialogContent}
          open={(this.props.new === true)}
					autoScrollBodyContent={true}
					modal={true}
        >
					<AddTripForm
						handleSubmit={this.handleSubmit}
					/>
        </Dialog>
			</App>

		);
  }

});





export default CalendarContainer;
