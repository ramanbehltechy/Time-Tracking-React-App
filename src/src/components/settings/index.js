import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import DefaultColumns from './default-columns';
import Banks from './banks';
import Designation from './designations';
import Department from './departments';
import Shift from './shifts';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ paddingTop: 20 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    // backgroundColor: '#fafafa',
    // backgroundColor: theme.palette.background.paper,
    padding: 0
  },
});

class Settings extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   selectedTab : isNaN(parseInt(this.props.match.params.id)) ? 1 : parseInt(this.props.match.params.id)
    // }

  }
  componentWillMount() {
    this.props.headerTitle('Settings', 5);
  }
  state = {
    value: this.props.match.params.id == undefined ? 0 : isNaN(parseInt(this.props.match.params.id)) ? 0 : parseInt(this.props.match.params.id),
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs value={value} onChange={this.handleChange} indicatorColor="primary" textColor="primary"
            variant="scrollable" scrollButtons="auto">
            <Tab label="Banks" />
            <Tab label="Designations" />
            <Tab label="Departments" />
            <Tab label="Default Columns" />
            <Tab label="Shifts" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><Banks loader={this.props.loader.bind(this)}  {...this.props} /></TabContainer>}
        {value === 1 && <TabContainer><Designation loader={this.props.loader.bind(this)}  {...this.props} /></TabContainer>}
        {value === 2 && <TabContainer><Department loader={this.props.loader.bind(this)}  {...this.props} /></TabContainer>}
        {value === 3 && <TabContainer><DefaultColumns loader={this.props.loader.bind(this)}  {...this.props} /></TabContainer>}
        {value === 4 && <TabContainer><Shift loader={this.props.loader.bind(this)}  {...this.props} /></TabContainer>}

      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);