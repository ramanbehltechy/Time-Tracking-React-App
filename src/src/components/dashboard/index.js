import React, { Component } from 'react';
import Const from '../common/constant'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { DateRangePicker } from 'react-dates';
import EmployeesDropDown from '../common/employeeDropDown'
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import FormControl from '@material-ui/core/FormControl';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
import { NotificationManager } from 'react-notifications';
import Radio from '@material-ui/core/Radio';
import InputLabel from '@material-ui/core/InputLabel';
import Footer from '../common/footer'
var moment = require('moment');

const styles = {
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
    color: '#fff'
  },
  active: {
    background: '#22b14c'
  },
  inActive: {
    background: '#00a2e8'
  },
  total: {
    background: '#ff7f27'
  },
  paper: {
    marginTop: 30,
    padding: 20,
  },
  
};

class Dashboard extends Component {
  _isMounted = false;
  state = {
    OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    pageLoaded: false,
    loadEmployeeGraph: false,
    employeeReport: [],
    employeesTimeSheet: [],
    SelectedDate: moment().format("YYYY-MM-DD"),
    selectedValueRadio: 'TimeDiff',
    sheetData:[],
    startDate: moment().subtract(7,'d'),
    endDate: moment(),
    OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
  }
 componentWillMount() {
  this._isMounted = true;
    this.props.headerTitle('Dashboard', 1);
    var body = {
      OrganizationID:this.state.OrganizationID
    }
    this.props.loader(true);
    if(this._isMounted){
    fetch(Const.API_ROOT + Const.GET_Employees_Status, {
      method: 'POST', 
      headers: Const.API_HEADER,
      body: JSON.stringify(body),
    }).then((response) => response.json())
      .then((responseJson) => {
        this.props.loader(false);
        this.setState({
          totalEmployees: responseJson.length>1?responseJson[0].StatusCount + responseJson[1].StatusCount:responseJson[0].StatusCount,
          activeEmployees: responseJson[0].StatusCount,
          inactiveEmployees: responseJson[1]?responseJson[1].StatusCount:0,
        })
        
        this.props.loader(false);
        var SelectedEmployeeIdForCart = localStorage.getItem('SelectedEmployeeIdForCart');
        if(SelectedEmployeeIdForCart){
          this.setState({
            SelectedEmployeeId:SelectedEmployeeIdForCart
          }, () => {
            this.getEmployeeReport(true,localStorage.getItem('SelectedEmployeeNameForCart'));
          })
        }else{
          this.getTimeSheetData();
        }
      })
      .catch((error) => {
        console.error(error);
        this.props.loader(false);
        var SelectedEmployeeIdForCart = localStorage.getItem('SelectedEmployeeIdForCart');
        if(SelectedEmployeeIdForCart){
          this.setState({
            SelectedEmployeeId:SelectedEmployeeIdForCart
          }, () => {
            this.getEmployeeReport(true,localStorage.getItem('SelectedEmployeeNameForCart'));
          })
        }else{
          this.getTimeSheetData();
        }
      })
    }
  }
  componentWillUnmount = () => {
    this._isMounted = false;
}
  selectEmployee(SelectedEmployeeId, label) {
    this.setState({
      SelectedEmployeeId: SelectedEmployeeId,
      selectedEmployeeName: label
    }, () => {
      this.getEmployeeReport('',label);
    })
  }
  changeRange(startDate, endDate){
    this.setState({
      startDate:startDate,
      endDate:endDate
    }, () => {
      if (this.state.SelectedEmployeeId) {
        this.getEmployeeReport();
      }
    })
  }
  getEmployeeReport(onload,label) {
    if (!this.state.startDate) {
      NotificationManager.error('Error', 'Select start date first!.');
      return false;
    }
    if (!this.state.endDate) {
      NotificationManager.error('Error', 'Select end date first!.');
      return false;
    }
    if (!this.state.SelectedEmployeeId) {
      NotificationManager.error('Error', 'Select employee  first!.');
      return false;
    }
    var body = {
      OrganizationID: this.state.OrganizationID,
      EmployeeId: this.state.SelectedEmployeeId,
      StartDate: this.state.startDate.format("YYYY-MM-DD") + ' 00:00:00',
      EndDate: this.state.endDate.format("YYYY-MM-DD") + ' 23:59:59'
    }
    this.props.loader(true);
    if(this._isMounted){
    fetch(Const.API_ROOT + Const.GET_EMPLOYEE_REPORT, {
      method: 'POST',
      headers: Const.API_HEADER,
      body: JSON.stringify(body),
    }).then((response) => response.json())
      .then((responseJson) => {
        if(onload){
          this.getTimeSheetData();
        }
        this.props.loader(false);
        localStorage.setItem('SelectedEmployeeIdForCart', this.state.SelectedEmployeeId);
        if(label){
          localStorage.setItem('SelectedEmployeeNameForCart',label)
        }
        responseJson = responseJson[0];
        this.setEmployeeReportGraph(responseJson);
      })
      .catch((error) => {
        this.props.loader(false);
        if(onload){
          this.getTimeSheetData();
        }
      })
    }
  }
  getTimeSheetData = () => {
    var body = {
      OrganizationID: this.state.OrganizationID,
      DateForTimeSheet: this.state.SelectedDate,
      SelectedEmployeeId: '',
      active: true
    }
    this.props.loader(true);
    if(this._isMounted){
    fetch(Const.API_ROOT + Const.GET_TIMING_DATA, {
      method: 'POST', 
      headers: Const.API_HEADER,
      body: JSON.stringify(body),
    }).then((response) => response.json())
      .then((responseJson) => {
        this.props.loader(false);
        this.setState({
          pageLoaded: true,
          sheetData:responseJson
        }, () => {
          this.setTimeSheet();
        })
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          pageLoaded: true
        })
      })
    }
  }
  setTimeSheet() {
    var item = {};
    this.setState({
      employeesTimeSheet: [],
      loadTimeSheetGraph: false
    }, () => {
    this.state.sheetData.map((data) => (
      item = {},
      item['name'] = data.Name,
      this.state.selectedValueRadio === 'TimeDiff'?item['Total'] = this.getHours(data.TimeDiff):this.state.selectedValueRadio === 'IdleTime'?item['Idle'] = this.getHours(data.IdleTime):this.state.selectedValueRadio === 'ActualWork'?item['Actual'] = this.getHours(data.ActualWork):'',
      this.state.employeesTimeSheet.push(item)
    ))
    this.setState({
      employeesTimeSheet: this.state.employeesTimeSheet,
      loadTimeSheetGraph: true
    })
    })
   
  }
  setEmployeeReportGraph(responseJson) {
    var item = {};
    this.setState({
      employeeReport: [],
      loadEmployeeGraph: false
    })
    responseJson.map((data) => (
      item = {},
      item['name'] = data.ScreenDate,
      item['Total'] = this.getHours(data.TotalWorkTime),
      item['Idle'] = this.getHours(data.IdleTime),
      item['Actual'] = this.getHours(data.ActualWork),
      this.state.employeeReport.push(item)
    ))
    this.setState({
      employeeReport: this.state.employeeReport,
      loadEmployeeGraph: true
    })
  }
  getHours = (minutes) => {
    var hours = Math.floor(minutes / 60);
    var minutes = (minutes % 60)
    if (hours < 0) {
      hours = 0;
    }
    if (minutes < 0) {
      minutes = 0;
    }
    return hours + "." + minutes;
  }
  handleChange = event => {
    this.setState({ selectedValueRadio: event.target.value }, () => {
      this.setTimeSheet();
    });
  };
  handleDateChange = date => {
    var CahngedDate = moment(date).format("YYYY-MM-DD")
    this.setState({
      SelectedDate: CahngedDate
    }, () => {
      this.getTimeSheetData();
    })
  };
  
  render() {
    const { text, match: { params } } = this.props;
    const { classes } = this.props;
    return (
      <div>
        <Grid container spacing={16}>

          <Grid item xs={12} sm={3} >
            <Card className={`${classes.card} ${classes.active}`}>
              <CardContent >
                <Typography style={{ color: '#fff' }} variant="h5" component="h2">
                  {this.state.activeEmployees}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Active Employees
        </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} >
            <Card className={`${classes.card} ${classes.inActive}`}>

              <CardContent>
                <Typography style={{ color: '#fff' }} variant="h5" component="h2">
                  {this.state.inactiveEmployees}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Inactive Employees
        </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} >
            <Card className={`${classes.card} ${classes.total}`}>
              <CardContent>
                <Typography style={{ color: '#fff' }} variant="h5" component="h2">
                  {this.state.totalEmployees} {text}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Total Employees
        </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Typography style={{ marginTop: 30 }} variant="headline" component="h2">
          Performance Charts
        </Typography>
        <Typography variant="subtitle1" component="h2">
          Employees
        </Typography>
        <Paper className={classes.paper}>
          <Typography variant="title" component="h2">
            Hours in Office vs Hours Worked Graph  
        </Typography>
          <Grid container spacing={24} style={{ margin: 15 }}>
            <Grid item xs={12} sm={4} className={classes.filterDiv}>
              <DateRangePicker
                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                onDatesChange={({ startDate, endDate }) => this.changeRange(startDate, endDate)}  // PropTypes.func.isRequired,
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                isOutsideRange={() => false}
              />
            </Grid>
            <Grid container item xs={12} sm={6} style={{ padding: 0 }}>
              <Grid item xs={12} sm={6} >
                {this.state.pageLoaded ? <EmployeesDropDown id={this.state.SelectedEmployeeId}  selectEmployee={this.selectEmployee.bind(this)} /> : <span>Loading...</span>}
              </Grid>
            </Grid>
          </Grid>
          {!localStorage.getItem('SelectedEmployeeIdForCart')?
          <Typography variant="headline"  component="h2" style={{textAlign:"center",padding:15}}>
          Please select employee for render chart!
      </Typography>:this.state.loadEmployeeGraph ?
            <ResponsiveContainer width="100%" height={350}><BarChart data={this.state.employeeReport}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total" fill="#8884d8" />
              <Bar dataKey="Idle" fill="#f40b0080" />
              <Bar dataKey="Actual" fill="#22b14c" />
            </BarChart></ResponsiveContainer> : <div></div>
        }

        </Paper>
        <Paper className={classes.paper} style={{ marginBottom: 50 }}>
          <Typography variant="title" component="h2">
            Employees Time Sheet
        </Typography>
          <Grid container spacing={24} style={{ margin: 15 }}>
            <Grid item xs={12} sm={3}>
              <FormControl margin="normal" fullWidth>

                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    keyboard
                    label="Date"
                    value={this.state.SelectedDate}
                    onChange={this.handleDateChange}
                    format={'DD/MM/YYYY'}
                    disableOpenOnEnter
                  />
                </MuiPickersUtilsProvider>

              </FormControl>
            </Grid>
            <Grid container item xs={12} sm={5} style={{paddingTop:35}}>
            <Grid item xs={12} sm={4}>
            <InputLabel >Total Work</InputLabel>
            <Radio
                checked={this.state.selectedValueRadio === 'TimeDiff'}
                onChange={this.handleChange}
                value="TimeDiff"
                name="radio-button-demo"
                aria-label="A"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
            <InputLabel >Idle Time</InputLabel>
            <Radio
                checked={this.state.selectedValueRadio === 'IdleTime'}
                onChange={this.handleChange}
                value="IdleTime"
                name="radio-button-demo"
                aria-label="B"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
            <InputLabel >Actual Work</InputLabel>
            <Radio
                checked={this.state.selectedValueRadio === 'ActualWork'}
                onChange={this.handleChange}
                value="ActualWork"
                name="radio-button-demo"
                aria-label="C"
                classes={{
                  root: classes.root,
                  checked: classes.checked,
                }}
              />
            </Grid>
            </Grid>
          </Grid>
          {this.state.loadTimeSheetGraph ?<ResponsiveContainer width="100%" height={350}>
            <BarChart  data={this.state.employeesTimeSheet}
              margin={{ top: 5, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} textAnchor="end" angle={-85} dy={0} style={{ marginTop: 50 }} />
              <YAxis  />
              <Tooltip />
              {/* <Legend /> */}
              {this.state.selectedValueRadio === 'TimeDiff'?<Bar dataKey="Total" fill="#8884d8" />:this.state.selectedValueRadio === 'IdleTime'?<Bar dataKey="Idle" fill="#f40b0080" />:this.state.selectedValueRadio === 'ActualWork'?<Bar dataKey="Actual" fill="#22b14c" />:''}
            </BarChart></ResponsiveContainer> : ''
          }
        </Paper>
        <Footer />
      </div>
    );
  }
}
export default withStyles(styles)(Dashboard);
