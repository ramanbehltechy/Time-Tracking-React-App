import React, { Component } from 'react';
import Const from '../common/constant'
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { NotificationManager } from 'react-notifications';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CardActions from '@material-ui/core/CardActions';
import Footer from '../common/footer'
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel, { inputLabelRef } from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';

var moment = require('moment');
const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },

    table: {
        minWidth: 700,
    },
    paper: {
        marginBottom: 20,
        padding: 20,
        textAlign: 'right'
    },
    action: {
        cursor: 'pointer',
        margin: 2
    },
    deleteAction: {
        color: '#ea1b1b'
    },
    editAction: {
        color: '#00a9f4'
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    }, tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    button: {
        backgroundColor: '#1BB56D !important'
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    di: {
        display: 'inline',
        float: 'left'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: '100%',
        // marginTop: 16
    },
    EmployeesFormControl176: {
        marginTop: 100
    },
    sortableIcon: {
        position: 'relative',
        paddingRight: '30px !important',
    },
    sortableIconContiner: {
        margin: 0,
        //position: 'absolute',
        top: '50%',
        display: 'inline-block',
        //right: 0,
        cursor: 'pointer',


    },
    sortableIconItem: {
        fontWeight: 'bold',
        fontSize: 15,
        verticalAlign: 'middle'
    },
    paddingRight10: {
        paddingRight: 10,
    },
    sortingDetail: {

        display: 'inline-block',
        verticalAlign: 'middle',
    },
    textLeft: {
        textAlign: 'left',
    },
    marginLeft20: {
        marginLeft: 20
    },
    custFlex: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    positionR: { position: 'relative' }
});
class Employees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AllEmployees: [],
            Employees: [],
            columns: [],
            labelWidth: 0,
            columns: [],
            filterBy: "",
            filterValue: "",
            sortBy: "",
            sortOrder: "asc",
            sortIcon: "arrow_downward",
            confirmDeleteDialog: false,
            employeeIdForDelete: '',
            listView: false,
            OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID
        };
    }
    componentWillMount() {
        this.props.headerTitle('Employees List', 2);
        var body = {
            OrganizationID: this.state.OrganizationID,
        }
        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_USERS, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.props.loader(false);
                this.setState({
                    Employees: responseJson.employees,
                    AllEmployees: responseJson.employees,
                    columns: responseJson.defaultColumns,
                    filterBy: responseJson.defaultColumns[0].ColumnName,
                    sortBy: responseJson.defaultColumns[0].ColumnName,

                })

            })
            .catch((error) => {
                this.props.loader(false);
                console.error(error);
            })
    }
    Transition(props) {
        return <Slide direction="up" {...props} />;
    }
    editEmployee = (EmployeeId) => {
        this.props.history.push('/dashboard/add-employee/' + EmployeeId);
    }
    addEmployee() {
        this.props.history.push('/dashboard/add-employee');
    }
    confirmDelete = (EmployeeId) => {
        this.setState({ confirmDeleteDialog: true, employeeIdForDelete: EmployeeId });
    }
    handleClose = () => {
        this.setState({ confirmDeleteDialog: false });
    };
    deleteEmployee = () => {
        this.setState({ confirmDeleteDialog: false });
        var body = {
            EmployeeId: this.state.employeeIdForDelete,
            OrganizationID: this.state.OrganizationID
        }
        fetch(Const.API_ROOT + Const.DELETE_EMPLOYEE, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),

        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.rowsAffected) {
                    NotificationManager.success('Employee deleted successfully', 'Success', 2000);
                    setTimeout(
                        function () {
                            this.componentWillMount();
                        }
                            .bind(this),
                        2000
                    );
                } else {
                    NotificationManager.error('Error', 'Error in delete employee.');
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }
    getDate(date) {
        return moment(date).format("MM/DD/YYYY");
    }
    handleFilterByChange = (event) => {
        this.setState({
            filterBy: event.target.value,
        });
        if (this.state.filterValue != "")
            this.filterRecords(event.target.value, this.state.filterValue)
    }
    handlefilterResults(e) {
        this.setState({
            filterValue: e.target.value,
        });
        if (this.state.filterBy != "")
            this.filterRecords(this.state.filterBy, e.target.value)
    }

    filterRecords = (filterBy, filterValue) => {
        var filteredRecords = this.state.AllEmployees.filter(function (emp) {
            var val = emp[filterBy];
            if (val) {
                if (val.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) {
                    emp.name = "abc";
                    return emp;
                }
            }
        });

        this.setState({
            Employees: filteredRecords,
        })
    }


    handleSortByChange = (event) => {
        this.setState({
            sortBy: event.target.value,
        });
        if (this.state.sortValue != "")
            this.sortRecords(event.target.value, this.state.sortOrder);
    }
    changeSort = () => {
        var order = "asc";
        if (this.state.sortOrder == "asc") {
            this.setState({
                sortOrder: "desc",
                sortIcon: "arrow_upward"
            })
            order = "desc";
        }
        else {
            this.setState({
                sortOrder: "asc",
                sortIcon: "arrow_downward"
            })
            order = "asc";
        }
        if (this.state.sortBy != "")
            this.sortRecords(this.state.sortBy, order);
    }
    sortRecords = (sortBy, sortOrder) => {
        this.state.Employees.sort(function (a, b) {
            var x = a[sortBy];
            var y = b[sortBy];
            if (x && y) {
                if (sortBy == "JoiningDate" || sortBy == "RelievingDate" || sortBy == "DateOfBirth") {
                    if (sortOrder == "asc") {
                        if (new Date(x).getTime() < new Date(y).getTime()) { return -1; }
                        if (new Date(x).getTime() > new Date(y).getTime()) { return 1; }
                    }
                    else {
                        if (new Date(x).getTime() > new Date(y).getTime()) { return -1; }
                        if (new Date(x).getTime() < new Date(y).getTime()) { return 1; }
                    }
                    return 0;
                }
                else if (x.toFixed) {
                    if (sortOrder == "asc") {
                        if (x < y) { return -1; }
                        if (x > y) { return 1; }
                    }
                    else {
                        if (x > y) { return -1; }
                        if (x < y) { return 1; }
                    }
                    return 0;
                }
                else {
                    var reA = /[^a-zA-Z]/g;
                    var reN = /[^0-9]/g;
                    var AInt = parseInt(a, 10);
                    var BInt = parseInt(b, 10);
                    if (sortOrder == "asc") {
                        if (isNaN(AInt) && isNaN(BInt)) {
                            var aA = x.replace(reA, "");
                            var bA = y.replace(reA, "");
                            if (aA === bA) {
                                var aN = parseInt(x.replace(reN, ""), 10);
                                var bN = parseInt(y.replace(reN, ""), 10);
                                return aN === bN ? 0 : aN > bN ? 1 : -1;
                            } else {
                                return aA > bA ? 1 : -1;
                            }
                        } else if (isNaN(AInt)) {//A is not an Int
                            return 1;//to make alphanumeric sort first return -1 here
                        } else if (isNaN(BInt)) {//B is not an Int
                            return -1;//to make alphanumeric sort first return 1 here
                        } else {
                            return AInt > BInt ? 1 : -1;
                        }
                    }
                    else {
                        if (x.toLowerCase() > y.toLowerCase()) { return -1; }
                        if (x.toLowerCase() < y.toLowerCase()) { return 1; }
                    }
                    return 0;
                }
            }
        });
    }
    checkValidDate = (val) => {
        var timestamp = Date.parse('foo');

        if (isNaN(timestamp) == false) {
            return true;
        }
        else
            return false;

    }
    checkData = (data, column) => {
        var val = data[column];
        // if (!isNaN(Date.parse(val)))
        if (!val) {
            return "N/A";
        }
        // else if (moment(val).format("MM/DD/YYYY") != "Invalid date")
        else if (column == "JoiningDate" || column == "RelievingDate" || column == "DateOfBirth") {
            return this.getDate(val);
        }
        else
            return val;
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Paper className={classes.paper}>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={8} className={classes.textLeft}>
                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={4} className={classes.textLeft}>
                                    <FormControl variant="filled" className={classes.formControl}>
                                        <InputLabel htmlFor="filter-by-simple">Search By</InputLabel>
                                        <Select
                                            value={this.state.filterBy}
                                            onChange={this.handleFilterByChange}
                                            input={<FilledInput name="filter-by" id="filter-by-simple" />}
                                            className={classes.textLeft}                >
                                            {this.state.columns.map((col, ind) => {
                                                return (
                                                    <MenuItem value={col.ColumnName} key={ind}>
                                                        {col.ColumnName}
                                                    </MenuItem>)
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4} className={classes.textLeft}>
                                    <FormControl margin="normal" >
                                        <InputLabel >Search By {this.state.filterBy}</InputLabel>
                                        <Input id="filterValue" name="filterValue" autoComplete="filterValue" value={this.state.filterValue} onChange={(e) => this.handlefilterResults(e)} placeholder="Search" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={3} className={classes.textLeft}>

                                    <FormControl variant="filled" className={`${classes.formControl} ${classes.paddingRight10}  ${classes.marginLeft20}`}>
                                        <InputLabel htmlFor="sort-by-simple">Sort By</InputLabel>
                                        <Select
                                            value={this.state.sortBy}
                                            onChange={this.handleSortByChange}
                                            input={<FilledInput name="sort-by" id="sort-by-simple" />}>
                                            {this.state.columns.map((col, ind) => {
                                                return (
                                                    <MenuItem value={col.ColumnName} >
                                                        {col.ColumnName}
                                                    </MenuItem>)
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={1} className={classes.textLeft}>
                                    <FormControl margin="normal" className={classes.sortableIconContiner} onClick={this.changeSort}>
                                        <i className={`material-icons  ${classes.sortableIconItem}`}>{this.state.sortIcon}</i>
                                        {this.state.sortOrder == "asc" ?
                                            <small className={classes.sortingDetail}>A-Z</small> :
                                            <small className={classes.sortingDetail}>Z-A</small>}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>



                        {/* </Grid>
            <Grid item xs={12} sm={4} className={`${classes.sortableIcon} ${classes.textLeft}`} > */}


                        <Grid item xs={12} sm={4} className={classes.custFlex}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.listView}
                                        onChange={(e) => this.setState({
                                            listView: !this.state.listView
                                        })}
                                        value={this.state.listView}
                                    />
                                }
                                label={!this.state.listView ? "Tiles View" : "List View"}
                            />
                            <Button variant="contained" color="primary" className={classes.button} onClick={() => this.addEmployee()}>
                                <i className={`${classes.leftIcon} material-icons `}>person_add</i>Add Employee
              </Button>
                        </Grid>
                    </Grid>
                </Paper>
                {this.state.listView ?
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    {this.state.columns.map(col => {
                                        return (
                                            <TableCell align="right">{col.ColumnName}</TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.Employees.map(n => {
                                    return (
                                        <TableRow className={classes.tableRowHover} key={n.EmployeeId}>
                                            {this.state.columns.map(col => {
                                                return (
                                                    <TableCell align="right">{this.checkData(n, col.ColumnName)}</TableCell>
                                                )
                                            })}
                                            <TableCell align="right"><span className={classes.action} onClick={() => this.editEmployee(n.EmployeeId)} ><i className={`${classes.editAction} material-icons`} aria-hidden="true">edit</i></span><span className={classes.action}><i className={`${classes.deleteAction} material-icons`} onClick={() => this.confirmDelete(n.EmployeeId)} aria-hidden="true">delete</i></span></TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper> : <Grid container spacing={16}>{this.state.Employees.map((data, i) => {
                        return (
                            <Grid item xs={12} sm={3} key={i}>
                                <Card className={classes.card} >
                                    <CardContent>
                                        <Grid container spacing={24}>

                                            <Grid item xs={3}>
                                                <Avatar alt="TechBit" src={require('../images/face1.jpg')} className={classes.bigAvatar} />
                                            </Grid>
                                            <Grid style={{ padding: 5 }} item xs={9}>
                                                <Typography variant="title" component="h2">
                                                    {data.Name}
                                                </Typography>
                                                <Typography variant="caption" className={classes.pos} color="textSecondary">
                                                    {/* {data.Designation} */}
                                                    {data.EmpCode}
                                                </Typography>
                                            </Grid>
                                            <Typography style={{ padding: 10 }} component="p">
                                                {this.state.columns.slice(2).map((col, index) => {
                                                    return (
                                                        <span>
                                                            {/* {col.ColumnName} : {this.checkData({data[col.ColumnName]})} */}
                                                            {col.ColumnName} : {this.checkData(data, col.ColumnName)}

                                                            <br />
                                                        </span>
                                                    )
                                                })}
                                                {/* {this.state.columns[2].ColumnName} : {data[this.state.columns[2].ColumnName]}
                        <br />
                        Joining Date    : {this.getDate(data.JoiningDate)} */}
                                            </Typography>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={() => this.editEmployee(data.EmployeeId)}>
                                            <i className={`${classes.editAction} material-icons`} aria-hidden="true">edit</i>&nbsp;Edit
        </Button>
                                        <Button size="small" color="primary" onClick={() => this.confirmDelete(data.EmployeeId)}>
                                            <i className={`${classes.deleteAction} material-icons`} aria-hidden="true">delete</i>&nbsp;Delete
        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                    </Grid>
                }

                <Dialog
                    open={this.state.confirmDeleteDialog}
                    onClose={this.handleClose}
                    TransitionComponent={this.Transition}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Confirm!</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this employee?
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
            </Button>
                        <Button onClick={this.deleteEmployee} color="primary" autoFocus>
                            Delete
            </Button>
                    </DialogActions>
                </Dialog>
                <Footer />
            </div>
        );
    }
}
export default withStyles(styles)(Employees);