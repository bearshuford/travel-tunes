import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {greenA700, greenA400, pink400} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: greenA700,
    primary2Color: greenA700,
    accent1Color:  pink400
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
