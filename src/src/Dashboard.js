import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Employees from './components/employees';
import CircularProgress from '@material-ui/core/CircularProgress';
import TimeSheet from './components/time-sheet'
import { HashRouter, Route, Switch } from "react-router-dom";
import UserDashboard from './components/dashboard';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from "react-router-dom";
import AddEmployee from '../src/components/add-employee'
import AddBank from '../src/components/settings/banks/add-bank'
import AddDepartment from '../src/components/settings/departments/add-department'
import AddDesignation from '../src/components/settings/designations/add-designation'
import AddShift from '../src/components/settings/shifts/add-shift'
import Settings from '../src/components/settings'
import { NotificationContainer } from 'react-notifications';
import TimeSheetDetails from '../src/components/time-sheet-details'
import Reports from '../src/components/reports'
import Slide from '@material-ui/core/Slide';
const drawerWidth = 260;

const isMobile = window.innerWidth <= 500;
const routes = [
  {
    id: 1,
    name: 'Dashboard',
    path: "/dashboard",
    icon: 'desktop_mac',
    authorisedUsers: "1,2"
  }, {
    id: 2,
    name: 'Employees',
    path: "/dashboard/employees",
    icon: 'supervisor_account',
    authorisedUsers: "1"
  }
  , {
    id: 3,
    name: 'Time Sheet',
    path: "/dashboard/time-sheet",
    icon: 'timeline',
    authorisedUsers: "1"
  }, {
    id: 4,
    name: 'Reports',
    path: "/dashboard/reports",
    icon: 'bar_chart',
    authorisedUsers: "1"
  }, {
    id: 5,
    name: 'Settings',
    path: "/dashboard/settings/0",
    icon: 'settings',
    authorisedUsers: "1"
  }

]
const routes2 = [
  {
    id: 1,
    name: 'Dashboard',
    path: "/dashboard",
    icon: 'desktop_mac',
    authorisedUsers: "1,2"
  }
]
const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  bigAvatar: {
    margin: 10,
    width: '70%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#1bb555'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  active: {
    background: '#1bb555 !important'
  },
  activeIcon: {
    color: '#fff !important'
  },
  progress: {
    marginLeft: 530,
    marginTop: 300,
    position: 'absolute'
  },
  userName: {
    marginRight: 10
  },
  creditsArea: {
    bottom: 0,
    position: 'absolute',
    fontWeight: 500,
    paddingLeft: 10,
  },
  hideCredits: {
    display: 'none'
  },
  techbitLogo: {
    width: 35,
  },
  credits: {
    paddingTop: 8,
    position: 'absolute',
    paddingLeft: 5
  }

});
class Dashboard extends React.Component {
  state = {
    open: true,
    openLogoutDialog: false,
    RoleId: 0,
    curruntTab: '',
    backIcon: false,
    loader: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  handleOpen = () => {
    this.setState({ openLogoutDialog: true });
  };
  handleClose = () => {
    this.setState({ openLogoutDialog: false });
  };
  Transition(props) {
    return <Slide direction="up" {...props} />;
  }
  handleLogout = () => {
    localStorage.removeItem('loggedInUserDetails');
    localStorage.removeItem('SelectedEmployeeIdForCart');
    localStorage.removeItem('SelectedEmployeeNameForCart');
    this.props.history.push('/')
  }

  componentWillMount() {
    var loggedInUserDetails = JSON.parse(localStorage.getItem('loggedInUserDetails'));
    if (!loggedInUserDetails) {
      this.props.history.push('/')
      return false;
    }
    this.setState({
      RoleId: loggedInUserDetails.RoleId,
      userName: loggedInUserDetails.Name
    })
  }
  headerTitle(title, activeTab, backIcon) {
    this.setState({
      curruntTab: title,
      activeTab: activeTab,
      backIcon: backIcon
    })
  }
  loader(action) {
    this.setState({
      loader: action
    })
  }
  goBack() {
    this.props.history.goBack();
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
          <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
            <IconButton color="inherit" aria-label="Open drawer" onClick={this.handleDrawerOpen}
              className={classNames(this.state.open && classes.menuButtonHidden)}>
              <MenuIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="Back" onClick={this.goBack.bind(this)}
              className={classNames(!this.state.backIcon && classes.menuButtonHidden)}>
              <ArrowBack />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              {this.state.curruntTab}
            </Typography>

            <Typography component="h3" variant="h6" color="inherit" noWrap className={classes.userName}>
              {this.state.userName}
            </Typography>

            <IconButton color="inherit">
              <i onClick={this.handleOpen} className="material-icons">power_settings_new</i>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Dialog
          open={this.state.openLogoutDialog}
          onClose={this.handleClose}
          TransitionComponent={this.Transition}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Logout!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleLogout} color="primary" autoFocus>
              Logout
            </Button>
          </DialogActions>
        </Dialog>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <img src={require('../src/components/images/logo-400.png')} className={classes.bigAvatar} />
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />

          {this.state.RoleId == 1 ? <List>
            {routes.map((data, i) =>
              <ListItem key={data.name} button component={Link} to={data.path} className={this.state.activeTab == data.id ? classes.active : ''}>
                <ListItemIcon>
                  <i className={this.state.activeTab == data.id ? `${classes.activeIcon} material-icons` : 'material-icons'} aria-hidden="true">{data.icon}</i>
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: this.state.activeTab == data.id ? classes.activeIcon : '' }}
                  primary={data.name} />
              </ListItem>
            )
            }
            <ListItem button component="a" href="https://bit.ly/2Qs3g5D">
              <ListItemIcon>
                <i className="material-icons" aria-hidden="true">cloud_download</i>
              </ListItemIcon>
              <ListItemText primary="Tracker for Windows" />
            </ListItem>
          </List> : <List>
              {routes2.map((data, i) =>
                <ListItem button component={Link} to={data.path} className={this.state.activeTab == data.id ? classes.active : ''}>
                  <ListItemIcon>
                    <i className="material-icons" aria-hidden="true">{data.icon}</i>
                  </ListItemIcon>
                  <ListItemText classes={{ primary: this.state.activeTab == data.id ? classes.activeIcon : '' }} primary={data.name} />
                </ListItem>
              )
              }
              <ListItem button component="a" href="https://bit.ly/2Qs3g5D">
                <ListItemIcon>
                  <i className="material-icons" aria-hidden="true">cloud_download</i>
                </ListItemIcon>
                <ListItemText primary="Tracker for Windows" />
              </ListItem>
            </List>}
          <div className={classNames(this.state.open && classes.creditsArea, !this.state.open && classes.hideCredits)}>
            {/* class={classes.creditsArea} */}
            <p>Powered By</p>
            <p>
              <img src={require('../src/components/images/logo.png')} className={classes.techbitLogo} />
              <span className={classes.credits}>
                Techbit Solutions Pvt Ltd
              </span>
            </p>
          </div>
          {/* <Divider /> */}
          {/* <List>{secondaryListItems}</List> */}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <div className={classes.tableContainer}>
            {this.state.loader ? <CircularProgress className={classes.progress} /> : ''}
            <HashRouter>
              <Switch>
                <Route exact path="/dashboard" render={(props) => <UserDashboard loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/employees" render={(props) => <Employees loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/add-employee" render={(props) => <AddEmployee loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/add-employee/:id" render={(props) => <AddEmployee loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/time-sheet" render={(props) => <TimeSheet loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/time-sheet-details/:date/:id/:Name" render={(props) => <TimeSheetDetails loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/reports" render={(props) => <Reports loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings" render={(props) => <Settings loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings/:id" render={(props) => <Settings loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings/bank/add-bank" render={(props) => <AddBank loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings/bank/edit-bank/:id" render={(props) => <AddBank loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings/designation/add-designation" render={(props) => <AddDesignation loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings/designation/edit-designation/:id" render={(props) => <AddDesignation loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings/department/add-department" render={(props) => <AddDepartment loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings/department/edit-department/:id" render={(props) => <AddDepartment loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings/shift/add-shift" render={(props) => <AddShift loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                <Route exact path="/dashboard/settings/shift/edit-shift/:id" render={(props) => <AddShift loader={this.loader.bind(this)} headerTitle={this.headerTitle.bind(this)} {...props} />} />
                
              </Switch>
            </HashRouter>
          </div>

        </main>
        <NotificationContainer />
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
