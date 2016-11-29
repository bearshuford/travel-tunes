import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#23CF5F',
    primary2Color: '#000'
  },
  appBar: {

  },
});

var Theme = React.createClass({
  render: function() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
			  <div> {this.props.children} </div>
			</MuiThemeProvider>
		);
  }
});

export default Theme;
