import React, { Component } from 'react';
import Const from '../common/constant'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
const styles = theme => ({
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },

  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
});
function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}



function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};
class Dashboard extends Component {
  state = {
    Employees: [],
    EmployeesList: [],
    OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
  }
  componentWillMount() {
    this.setAllUserList();
  }
  setAllUserList() {
    var body = {
      OrganizationID: this.state.OrganizationID,
    }
    var selectedId = this.props.id;
    fetch(Const.API_ROOT + Const.GET_USERS, {
      method: 'POST',
      headers: Const.API_HEADER,
      body: JSON.stringify(body),
    }).then((response) => response.json())
      .then((responseJson) => {
        var item = {};
        responseJson['employees'].map((tile, j) => (
          tile.Status == "1" ? item.label = tile.Name : '',
          tile.Status == "1" ? item.value = tile.EmpCode : '',
          tile.Status == "1" ? this.state.EmployeesList.push(item) : '',
          item = {}
        ))
        this.setState({
          EmployeesList: this.state.EmployeesList,
          onload: false
        })
        if (selectedId) {
            var usr = this.state.EmployeesList.filter(c => c.value == selectedId)[0];
            this.setState({
              SelectedEmployeeId: usr.value,
              label: usr.label,
              single: usr
            })
        };
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          onload: false
        })
      })
  }
  handleChange = name => value => {
    this.setState({
      [name]: value,
      SelectedEmployeeId: value.value,
      label: value.label
    }, () => {
      this.props.selectEmployee(this.state.SelectedEmployeeId, this.state.label);
    });
  };
  render() {
    const { classes, theme } = this.props;
    const selectStyles = {
      input: base => ({
        ...base,
        '& input': {
          font: 'inherit',
        },
      }),
    };
    return (
      <div>
        {this.state.EmployeesList.length > 0 ? <FormControl className={classes.paddingTop} margin="normal" fullWidth>
          <Select
            classes={classes}
            styles={selectStyles}
            options={this.state.EmployeesList}
            components={components}
            value={this.state.single}
            onChange={this.handleChange('single')}
            placeholder="Search a employee"
          />
        </FormControl> : ''}

      </div>
    );
  }
}
export default withStyles(styles)(Dashboard);
