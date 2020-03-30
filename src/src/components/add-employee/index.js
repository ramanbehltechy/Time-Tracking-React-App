import React, { Component } from 'react';
import Const from '../common/constant'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { NotificationManager } from 'react-notifications';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Avatar from '@material-ui/core/Avatar';
import Footer from '../common/footer'
const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    padding: 25
  },
  table: {
    minWidth: 700,
  },
  paper: {
    marginBottom: 20,
    padding: 20,
    textAlign: 'right'
  },
  heading: {
    marginTop: 50
  },
  paper1: {
    marginBottom: 20,
    padding: 20,
    textAlign: 'right'
  }, bigAvatar: {
    marginLeft: 80,
    marginTop: 15,
    width: 140,
    height: 140,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: 5,
    backgroundColor: '#1BB56D !important'
  }

});
class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      EmployeeId: '',
      Name: '',
      EmpCode: '',
      DesignationId: '',
      DepartmentId: '',
      ShiftId: '',
      JoiningDate: '',
      RelievingDate: '',
      BankAccountNumber: '',
      BankId: 1,
      DateOfBirth: '',
      ContactNumber1: '',
      ContactNumber2: '',
      FatherName: '',
      CorrespondenceAddress: '',
      PermanentAddress: '',
      PersonalEmailId: '',
      PanNumber: '',
      OfficialEmailId: '',
      SkypeId: '',
      Status: true,
      IsRelieved: false,
      Password: '',
      RoleId: '2',
      CompanyId: '',
      IFSCCode: '',
      AdharCardNumber: '',
      OfficialEmailPassword: '',
      BloodGroup: '',
      OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
      DesignationList: [],
      DepartmentList: [],
      ShiftList: [],
      EmployeeRolesList: [],
      BankList: [],
      EmpOrg: '',
      EmployeeIdForSave: '',
      employeeIdForEdit: this.props.match.params.id,
      action: this.props.match.params.id ? 'update' : 'add',
      buttonText: this.props.match.params.id ? 'Update Employee' : 'Add Employee',
      loader: true,
      emailStatus: true
    };
  }
  componentWillMount() {
    ValidatorForm.addValidationRule('checkEmail', (value) => {
      var body = {
        OfficialEmailId: value
      }
      fetch(Const.API_ROOT + Const.CHECK_EMAIL_EXIST, {
        method: 'POST',
        headers: Const.API_HEADER,
        body: JSON.stringify(body),
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.length) {
            if (this.state.action == "add") {
              return false;
            } else {
              if (this.state.EmployeeIdForSave != responseJson[0].EmployeeId) {
                return false;
              } else {
                return true;
              }
            }
          } else {
            return true;
          }
        })
        .catch((error) => {
          console.error(error);
        })
    });
    var body = {
      OrganizationID: this.state.OrganizationID
    }
    this.props.loader(true);
    fetch(Const.API_ROOT + Const.GET_ALL_LIST_DATA, {
      method: 'POST',
      headers: Const.API_HEADER,
      body: JSON.stringify(body),

    }).then((response) => response.json())
      .then((responseJson) => {
        var loggedInUserOrganizationID = this.state.OrganizationID;
        var index = -1;
        responseJson.Organization.find(function (item, i) {
          if (item.ID == loggedInUserOrganizationID) {
            index = i;
          }
        });
        this.setState({
          DesignationList: responseJson.Designation,
          DepartmentList: responseJson.Department,
          ShiftList: responseJson.Shift,
          EmployeeRolesList: responseJson.EmployeeRoles,
          BankList: responseJson.Bank,
          DepartmentId: responseJson.Department[0].DepartmentId,
          ShiftId: responseJson.Shift[0].ShiftId,
          DesignationId: responseJson.Designation[0].DesignationId,
          EmpOrg: responseJson.Organization[index].OrgName.substring(0, 4).toUpperCase(),
        })
        if (this.state.employeeIdForEdit) {
          this.setUserDetails();
        } else {
          this.setState({
            EmployeeId: this.addZero(parseInt(responseJson.LastEmployeeId[0].Id) + 1, 8),
            EmployeeIdForSave: this.addZero(parseInt(responseJson.LastEmployeeId[0].EmployeeId) + 1, 8),
            EmpCode: this.state.employeeIdForEdit ? '' : responseJson.Organization[index].OrgName.substring(0, 4).toUpperCase() + '-EMP-' + this.state.DepartmentId + '-' + this.addZero(parseInt(responseJson.LastEmployeeId[0].Id) + 1, 4),
            loader: false
          })
          this.props.loader(false);
          this.props.headerTitle('Add New Employee', 2, true);
        }
      })
      .catch((error) => {
        this.props.loader(false);
        this.setState({
          loader: false
        })
        console.error(error);
      })
  }
  setUserDetails = () => {
    var body = {
      EmployeeId: this.state.employeeIdForEdit,
    }
    fetch(Const.API_ROOT + Const.GET_EMPLOYEE_DETAILS, {
      method: 'POST',
      headers: Const.API_HEADER,
      body: JSON.stringify(body),
    }).then((response) => response.json())
      .then((responseJson) => {
        responseJson = responseJson[0]
        this.setState({
          EmployeeIdForSave: responseJson.EmployeeId,
          EmployeeId: responseJson.Id,
          Name: responseJson.Name,
          EmpCode: responseJson.EmpCode,
          DesignationId: responseJson.DesignationId,
          DepartmentId: responseJson.DepartmentId,
          ShiftId: responseJson.ShiftId,
          JoiningDate: responseJson.JoiningDate.split('T')[0],
          RelievingDate: responseJson.RelievingDate,
          BankAccountNumber: responseJson.BankAccountNumber,
          BankId: responseJson.BankId,
          DateOfBirth: responseJson.DateOfBirth.split('T')[0],
          ContactNumber1: responseJson.ContactNumber1,
          ContactNumber2: responseJson.ContactNumber2,
          FatherName: responseJson.FatherName,
          CorrespondenceAddress: responseJson.CorrespondenceAddress,
          PermanentAddress: responseJson.PermanentAddress,
          PersonalEmailId: responseJson.PersonalEmailId,
          PanNumber: responseJson.PanNumber,
          OfficialEmailId: responseJson.OfficialEmailId,
          SkypeId: responseJson.SkypeId,
          Status: responseJson.Status == 0 ? false : true,
          IsRelieved: false,
          Password: responseJson.Password,
          RoleId: responseJson.RoleId,
          CompanyId: responseJson.CompanyId,
          IFSCCode: responseJson.IFSCCode,
          AdharCardNumber: responseJson.AdharCardNumber,
          OfficialEmailPassword: responseJson.OfficialEmailPassword,
          BloodGroup: responseJson.BloodGroup,
          loader: false
        })
        this.props.loader(false);
        this.props.headerTitle('Employee Details : ' + this.state.Name + ' (' + this.state.EmpCode + ')', 2, true);
      })
      .catch((error) => {
        this.props.loader(false);
        this.setState({
          loader: false
        })
        console.error(error);
      })
  }
  addZero(Number, totalLength) {
    Number = Number.toString();
    for (var i = Number.length; i < totalLength; i++) {
      Number = 0 + Number
    }
    return Number
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (e) => {
    if (!this.state.JoiningDate) {
      NotificationManager.error('Error', 'Please select Joining Date');
      e.preventDefault();
      return false;
    }
    if (!this.state.DateOfBirth) {
      NotificationManager.error('Error', 'Please select Date Of Birth');
      e.preventDefault();
      return false;
    }
    if (!this.state.emailStatus) {
      NotificationManager.error('Error', 'Official email id already exist.');
      e.preventDefault();
      return false;
    }
    this.props.loader(true);
    var body = {
      EmployeeId: this.state.EmployeeId,
      Name: this.state.Name,
      EmpCode: this.state.EmpCode,
      DesignationId: this.state.DesignationId,
      DepartmentId: this.state.DepartmentId,
      ShiftId: this.state.ShiftId,
      JoiningDate: this.state.JoiningDate,
      RelievingDate: this.state.RelievingDate,
      BankAccountNumber: this.state.BankAccountNumber,
      BankId: this.state.BankId,
      DateOfBirth: this.state.DateOfBirth,
      ContactNumber1: this.state.ContactNumber1,
      ContactNumber2: this.state.ContactNumber2,
      FatherName: this.state.FatherName,
      CorrespondenceAddress: this.state.CorrespondenceAddress,
      PermanentAddress: this.state.PermanentAddress,
      PersonalEmailId: this.state.PersonalEmailId,
      PanNumber: this.state.PanNumber,
      OfficialEmailId: this.state.OfficialEmailId,
      SkypeId: this.state.SkypeId,
      Status: this.state.Status,
      IsRelieved: this.state.IsRelieved,
      Password: this.state.Password,
      RoleId: this.state.RoleId,
      CompanyId: 1,
      IFSCCode: this.state.IFSCCode,
      AdharCardNumber: this.state.AdharCardNumber,
      OfficialEmailPassword: this.state.OfficialEmailPassword,
      BloodGroup: this.state.BloodGroup,
      OrganizationID: this.state.OrganizationID,
      action: this.state.action,
      EmployeeIdForSave: this.state.EmployeeIdForSave
    }
    fetch(Const.API_ROOT + Const.ADD_EMPLOYEE, {
      method: 'POST',
      headers: Const.API_HEADER,
      body: JSON.stringify(body),

    }).then((response) => response.json())
      .then((responseJson) => {
        this.props.loader(false);
        if (responseJson.rowsAffected) {
          if (this.state.employeeIdForEdit) {
            NotificationManager.success('Employee updated successfully', 'Success', 2000);
          } else {
            NotificationManager.success('Employee Added successfully', 'Success', 2000);
          }
          setTimeout(
            function () {
              this.props.history.push('/dashboard/employees')
            }
              .bind(this),
            2000
          );
        } else {
          NotificationManager.error('Error', 'please try again later.');
        }
      })
      .catch((error) => {
        this.props.loader(false);
        console.error(error);
      })
    e.preventDefault();
  }
  checkEmail = () => {
    var body = {
      OfficialEmailId: this.state.OfficialEmailId
    }
    fetch(Const.API_ROOT + Const.CHECK_EMAIL_EXIST, {
      method: 'POST',
      headers: Const.API_HEADER,
      body: JSON.stringify(body),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length) {
          if (this.state.action == "add") {
            NotificationManager.error('Error', 'Official email id already exist.');
            this.setState({
              emailStatus: false
            })
          } else {
            if (this.state.EmployeeIdForSave != responseJson[0].EmployeeId) {
              NotificationManager.error('Error', 'Official email id already exist.');
              this.setState({
                emailStatus: false
              })
            } else {
              this.setState({
                emailStatus: true
              })
            }
          }
        } else {
          this.setState({
            emailStatus: true
          })
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        {!this.state.loader ? <Paper className={classes.root}>
          <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
            <Typography component="h1" variant="h5"  >
              Employee Code
            </Typography>
            <Grid container spacing={24}>
              <Grid item xs={4} >
                <Avatar alt="employee" src={require('../images/face1.jpg')} className={classes.bigAvatar} />
              </Grid>
              <Grid item xs={4}>
                <FormControl disabled margin="normal" required fullWidth>
                  <InputLabel >Id</InputLabel>
                  <Input id="name" name="name" autoComplete="name" value={this.state.EmployeeId} onChange={(e) => this.setState({ EmployeeId: e.target.value })} placeholder="Employee Id" />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                  <TextField
                    id="date"
                    label="Joining Date"
                    type="date"
                    defaultValue={this.state.JoiningDate}
                    className={classes.textField}
                    onChange={(e) => this.setState({ JoiningDate: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl disabled margin="normal" required fullWidth>
                  <InputLabel >Employee Code</InputLabel>
                  <Input id="name" name="name" autoComplete="name" value={this.state.EmpCode} onChange={(e) => this.setState({ EmpCode: e.target.value })} placeholder="Employee Code" />
                </FormControl>
                <FormControl margin="normal"  >
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Is Relieved"
                    onChange={(e) => this.setState({ IsRelieved: e.target.checked })}
                    checked={this.state.IsRelieved}
                  />
                </FormControl>
                <FormControl margin="normal"  >
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="Active"
                    onChange={(e) => this.setState({ Status: e.target.checked })}
                    checked={this.state.Status}
                  />
                </FormControl>
              </Grid>

            </Grid>
            <Typography component="h1" variant="h5" className={classes.heading} >
              Demoraphic Detail
            </Typography>
            <Grid container spacing={24}>
              <Grid item xs={4}>
                <TextValidator margin="normal" fullWidth
                  label="Employee Name"
                  onChange={(e) => this.setState({ Name: e.target.value })}
                  name="name"
                  value={this.state.Name}
                  validators={['required']}
                  errorMessages={['Employee Name is required']}
                />
                <FormControl margin="normal" fullWidth>
                  <InputLabel >Pan Number</InputLabel>
                  <Input value={this.state.PanNumber} onChange={(e) => this.setState({ PanNumber: e.target.value })} placeholder="Pan Number" />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextValidator margin="normal" fullWidth
                  label="Father Name"
                  onChange={(e) => this.setState({ FatherName: e.target.value })}
                  name="fname"
                  value={this.state.FatherName}
                  validators={['required']}
                  errorMessages={['Father Name is required']}
                />
                <FormControl margin="normal" fullWidth>
                  <InputLabel >Adhar Number</InputLabel>
                  <Input value={this.state.AdharCardNumber} onChange={(e) => this.setState({ AdharCardNumber: e.target.value })} placeholder="Adhar Number" />
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl margin="normal" required fullWidth>
                  <TextField
                    id="date"
                    label="Date of Birth"
                    type="date"
                    defaultValue={this.state.DateOfBirth}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => this.setState({ DateOfBirth: e.target.value })}
                  />
                </FormControl>


              </Grid>
            </Grid>
            <Typography component="h1" variant="h5" className={classes.heading}>
              Contact Details
            </Typography>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel >Correspondence Address</InputLabel>
                  <Input value={this.state.CorrespondenceAddress} onChange={(e) => this.setState({ CorrespondenceAddress: e.target.value })} placeholder="Correspondence Address" />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                  <InputLabel >Permanent Address </InputLabel>
                  <Input value={this.state.PermanentAddress} onChange={(e) => this.setState({ PermanentAddress: e.target.value })} placeholder="Permanent Address " />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel >Contact Number 1 :</InputLabel>
                  <Input value={this.state.ContactNumber1} onChange={(e) => this.setState({ ContactNumber1: e.target.value })} placeholder="Father Name" />
                </FormControl>
                <TextValidator margin="normal" fullWidth
                  label="Official Email"
                  onChange={(e) => this.setState({ OfficialEmailId: e.target.value })}
                  name="email"
                  value={this.state.OfficialEmailId}
                  validators={['required', 'isEmail',]}
                  onBlur={this.checkEmail}
                  errorMessages={['Official Email is required', 'email is not valid']}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel >Contact Number 2 :</InputLabel>
                  <Input value={this.state.ContactNumber2} onChange={(e) => this.setState({ ContactNumber2: e.target.value })} placeholder="Father Name" />
                </FormControl>
                <TextValidator margin="normal" fullWidth
                  label="Official Email Password"
                  onChange={(e) => this.setState({ OfficialEmailPassword: e.target.value })}
                  name="password"
                  value={this.state.OfficialEmailPassword}
                  validators={['required']}
                  errorMessages={['Official Email Password is required']}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel >Personal Email :</InputLabel>
                  <Input type="email" id="email" name="email" autoComplete="email" value={this.state.PersonalEmailId} onChange={(e) => this.setState({ PersonalEmailId: e.target.value })} placeholder="Father Name" />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                  <InputLabel >Official Skype</InputLabel>
                  <Input value={this.state.SkypeId} onChange={(e) => this.setState({ SkypeId: e.target.value })} placeholder="Official Skype" />
                </FormControl>
              </Grid>
            </Grid>
            <Typography component="h1" variant="h5" className={classes.heading}>
              Company Detail
            </Typography>
            <Grid container spacing={24} >
              <Grid item xs={4}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel htmlFor="DesignationId">Designation </InputLabel>
                  <Select
                    value={this.state.DesignationId}
                    onChange={this.handleChange}

                    inputProps={{
                      name: 'DesignationId',
                      id: 'DesignationId',
                    }}
                  >
                    {this.state.DesignationList.map(data => {
                      return (
                        <MenuItem key={data.DesignationId} value={data.DesignationId}>{data.Name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                  <InputLabel htmlFor="BankId">Bank Name</InputLabel>
                  <Select
                    value={this.state.BankId}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'BankId',
                      id: 'BankId',
                    }}
                  >
                    {this.state.BankList.map(data => {
                      return (
                        <MenuItem key={data.BankID} value={data.BankID}>{data.Name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel htmlFor="DepartmentId">Department</InputLabel>
                  <Select
                    value={this.state.DepartmentId}
                    onChange={(e) => this.setState({
                      DepartmentId: e.target.value,
                      EmpCode: this.state.EmpOrg + '-EMP-' + e.target.value + '-' + this.addZero(parseInt(this.state.EmployeeId), 4)
                    })}
                    inputProps={{
                      name: 'DepartmentId',
                      id: 'DepartmentId',
                    }}
                  >
                    {this.state.DepartmentList.map(data => {
                      return (
                        <MenuItem key={data.DepartmentId} value={data.DepartmentId}>{data.Name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                  <InputLabel >Account Number</InputLabel>
                  <Input value={this.state.BankAccountNumber} onChange={(e) => this.setState({ BankAccountNumber: e.target.value })} placeholder="Account Number" />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel >IFSC Code</InputLabel>
                  <Input value={this.state.IFSCCode} onChange={(e) => this.setState({ IFSCCode: e.target.value })} placeholder="IFSC Code" />
                </FormControl>
                <FormControl margin="normal" fullWidth>
                  <InputLabel htmlFor="ShiftId">Shift</InputLabel>
                  <Select
                    value={this.state.ShiftId}
                    onChange={(e) => this.setState({
                      ShiftId: e.target.value                      
                    })}
                    inputProps={{
                      name: 'ShiftId',
                      id: 'ShiftId',
                    }}
                  >
                    {this.state.ShiftList.map(data => {
                      return (
                        <MenuItem key={data.ShiftId} value={data.ShiftId}>{data.Name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Typography component="h1" variant="h5" className={classes.heading}>
              GTracker
            </Typography>
            <Grid container spacing={24} >
              <Grid item xs={4}>
                <TextValidator margin="normal" fullWidth
                  label="GTracker Password"
                  onChange={(e) => this.setState({ Password: e.target.value })}
                  name="Password"
                  value={this.state.Password}
                  validators={['required', 'matchRegexp:^([!@#$%^&*(),.?":{}|<>a-zA-Z0-9_-]){6,10}$']}
                  errorMessages={['GTracker Password is required', 'Min 6 and max 10 char allowed']}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel htmlFor="RoleId">Role</InputLabel>
                  <Select
                    value={this.state.RoleId}
                    onChange={(e) => this.setState({
                      RoleId: e.target.value
                    })}
                    inputProps={{
                      name: 'RoleId',
                      id: 'RoleId',
                    }}
                  >
                    {this.state.EmployeeRolesList.map(data => {
                      return (
                        <MenuItem key={data.RoleId} value={data.RoleId}>{data.Name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={24} className={classes.heading}>
              <Grid item xs={12} className={classes.paper1}>
                <Button onClick={() => this.props.history.push('/dashboard/employees')} variant="contained" color="primary" className={classes.button}>
                  <i className={`${classes.leftIcon} material-icons`}>arrow_back</i> Back
                </Button>
                <Button type="submit" variant="contained" color="primary" className={classes.button}>
                  <i className={`${classes.leftIcon} material-icons`}>{this.props.match.params.id ? 'update' : 'person_add'}</i> {this.state.buttonText}
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm>
        </Paper> : ''
        }
        <Footer />
      </div>
    );
  }
}
export default withStyles(styles)(Employees);