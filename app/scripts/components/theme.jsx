import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


var Theme = React.createClass({
  render: function() {
    return (
      <MuiThemeProvider>
			  <div> {this.props.children} </div>
			</MuiThemeProvider>
		);
  }
});

export default Theme;
