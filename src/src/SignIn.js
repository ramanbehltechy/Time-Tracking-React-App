import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Const from '../src/components/common/constant'
import 'react-notifications/lib/notifications.css';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import CircularProgress from '@material-ui/core/CircularProgress';
const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    backgroundColor:'#1bb555 !important'
  },
  progress: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 20,
  }
});
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OfficialEmailId: '',
      password: '',
      loader:false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    var loggedInUseRole = localStorage.getItem('loggedInUserDetails');
    if (loggedInUseRole) {
      this.props.history.push('/dashboard')
    }
  }
  handleSubmit(e) {
    if(!this.state.loader){
    this.setState({
      loader:true
    })
    var body = {
      OfficialEmailId: this.state.OfficialEmailId,
      password: this.state.password
    }
   
    fetch(Const.API_ROOT + Const.VALIDATE_USER, {
      method: 'POST',
      headers: Const.API_HEADER,
      body: JSON.stringify(body),

    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length) {
          if (responseJson[0].RoleId == "1") {
            localStorage.setItem('loggedInUserDetails', JSON.stringify(responseJson[0]));
            NotificationManager.success('Logged In successfully', 'Success', 2000);
            setTimeout(
              function () {
                this.props.history.push('/dashboard')
              }
                .bind(this),
              2000
            );
          } else {
            this.setState({
              loader:false
            })
            NotificationManager.error('Error', 'Sorry! only administrator can login.');
          }

        } else {
          this.setState({
            loader:false
          })
          NotificationManager.error('Error', 'Invalid Email Id or Password or your Organization is not active.');
        }
      })
      .catch((error) => {
        this.setState({
          loader:false
        })
        console.error(error);
      })
    }
    e.preventDefault();
  }
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar alt="TechBit" src={require('../src/components/images/logo.ico')} className={classes.bigAvatar} />
          <Typography component="h1" variant="h5">
            Sign in
        </Typography>
          <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
            <TextValidator margin="normal" fullWidth
              label="Email Address"
              onChange={(e) => this.setState({ OfficialEmailId: e.target.value })}
              name="email"
              value={this.state.OfficialEmailId}
              validators={['required', 'isEmail']}
              errorMessages={['Email  is required', 'Email is not valid']}
            />
            <TextValidator margin="normal" fullWidth
              label="Password"
              onChange={(e) => this.setState({ password: e.target.value })}
              name="password"
              type="password"
              value={this.state.password}
              validators={['required']}
              errorMessages={['password is required']}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {this.state.loader?<div fullWidth ><CircularProgress fullWidth  size={24} className={classes.progress} /></div>:
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign in
        </Button>
          }
            
          
          </ValidatorForm>
        </Paper>
        <Typography  style={{marginTop:25,textAlign:"center"}} variant="subtitle2" >
        Powered By Techbit Solutions Pvt Ltd
        </Typography>
        <NotificationContainer />
      </main>
    );
  }
}


export default withStyles(styles)(Login);
