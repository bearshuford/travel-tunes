import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {pink400, blue700, blue800, greenA700} from 'material-ui/styles/colors';


const palette = {
    primary1Color: blue700,
    primary2Color: blue800,
    accent1Color:  pink400,
    spotifyGreen: greenA700
  }

const muiTheme = getMuiTheme({
  palette: palette
});

var Theme = React.createClass({
  render: function() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
			  <div style={{width: '100vw'}}>
          {this.props.children}
        </div>
			</MuiThemeProvider>
		);
  }
});



export {Theme as default, palette};
