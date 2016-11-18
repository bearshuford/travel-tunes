import React from 'react';
import moment from 'moment';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,
				Paper, Dialog, FlatButton, FloatingActionButton} from 'material-ui';

import App from './app.jsx';
import AddTripForm from './addTripForm.jsx';





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
	dialogTitle:{
		border: 0
	},
	dialogBody: {

	}

};







var Trip = React.createClass({
	render: function() {
		var trip = this.props.trip;
		return (
			<TableRow>
				<TableRowColumn> {trip.city}      </TableRowColumn>
				<TableRowColumn> {trip.state}     </TableRowColumn>
				<TableRowColumn> {trip.startDate} </TableRowColumn>
				<TableRowColumn> {trip.endDate}   </TableRowColumn>
			</TableRow>
		);
	}
});


var Calendar = React.createClass({

  render: function() {
		var trips = this.props.trips.map(function(trip, i){
			return <Trip trip={trip} key={i}/>
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
			trips: tripList,
			state: open
		};
	},

	componentWillMount: function() {
		var trips = this.state.trips;
		// trips.fetch();
	},


	openDialog: function() {
		 this.setState({open: true});
	},

	closeDialog: function() {
		this.setState({open: false});
	},

	handleSubmit(data) {
		console.log('handlesubmit',data);
	},


  render: function() {



    return (
			<App>
				<div style={styles.page}>
					<Calendar trips={this.state.trips}/>
					<FloatingActionButton style={styles.addButton}
						secondary={true}
						children={<i className="material-icons">add</i>}
						href="#trips/new"/>
				</div>
				<Dialog
          title="Add a Trip"
					titleStyle={styles.dialogTitle}
					bodyStyle={styles.dialogBody}
          open={(this.props.new === true)}
					autoScrollBodyContent={true}
					modal={true}
        >
          Only actions can close this dialog.
					<AddTripForm
						handleSubmit={this.handleSubmit}
					/>
        </Dialog>
			</App>

		);
  }

});





export default CalendarContainer;
