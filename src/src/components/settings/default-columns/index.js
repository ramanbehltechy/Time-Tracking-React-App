import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Const from '../../common/constant'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { NotificationManager } from 'react-notifications';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    paper: {
        marginBottom: 20,
        padding: 20,
    },
    title: {
        marginBottom: 15,
        textDecoration: "underline"
    },
    details: {
        margin: "15px 0",
    },
    dropdown: {
        minWidth: 200,
        marginRight: 20,
        textAlign: 'left'
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    button: {
        margin: 5,
        backgroundColor: '#1BB56D !important'
    },
    paper1: {

        padding: 20,
        textAlign: 'right'
    },
    heading: {
        marginTop: 50
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    labelTag: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: '90%',
    }
});

class DefaultColumns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DefaultColumns: [],
            DefaultEmployeeColumns: [],
            EmployeeEditableColumns: [],
            opened: '',
            OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID
        };
    } 
    componentWillMount() {
        var body = {
            OrganizationID: this.state.OrganizationID, 
        }
        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_DEFAULT_COLUMN_MASTER, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.props.loader(false);
                const employeeColumns = responseJson.DefaultColumns.filter((menu) => menu.Entity == 'Employee')
                this.setState({
                    DefaultColumns: responseJson.DefaultColumns,
                    DefaultEmployeeColumns: employeeColumns,
                    EmployeeEditableColumns: responseJson.EmployeeEditableColumns
                })

            })
            .catch((error) => {
                this.props.loader(false);
                console.error(error);
            })
    }
    handleChange = (event) => {
        var index = event.target.name.split('-')[2];
        var columns = this.state.DefaultEmployeeColumns
        columns[index].ColumnName = event.target.value;
        this.setState({ DefaultEmployeeColumns: columns });
    };
    handleSubmit = (e) => {
        this.props.loader(true);
        var body = {
            OrganizationID: this.state.OrganizationID,
            employees: this.state.DefaultEmployeeColumns,
        }
        console.log(JSON.stringify(body))
        fetch(Const.API_ROOT + Const.SAVE_DEFAULT_COLUMNS, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.props.loader(false);
                if (responseJson.rowsAffected) {
                    NotificationManager.success('Records updated successfully', 'Success', 2000);
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
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Paper className={classes.paper}>
                    <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
                        <Typography variant="title" component="h2" className={classes.title}>
                            Employees
                    </Typography>
                        <Grid container spacing={24}>
                            {this.state.DefaultEmployeeColumns.map((data, i) => {
                                return (
                                    <Grid item xs={4} className={classes.paper1} key={i}>

                                        {data.IsEditable ?
                                            <div>
                                                <FormControl fullWidth className={classes.formControl}>
                                                    <InputLabel htmlFor={"column-employee-" + i}>Column Name <small className={classes.labelTag}>(Secondary)</small></InputLabel>
                                                    <Select className={classes.dropdown} value={data.ColumnName}
                                                        onChange={this.handleChange}
                                                        inputProps={{
                                                            name: "column-employee-" + i,
                                                            id: "column-employee-" + i,
                                                            index: i
                                                        }}
                                                    >
                                                        {this.state.EmployeeEditableColumns.map((col, ind) => {
                                                            return (
                                                                <MenuItem value={col.columnName} key={ind}>
                                                                    {col.columnName}
                                                                </MenuItem>)
                                                            // <MenuItem value={{ name: col.columnName, index: i }} key={ind}>
                                                            //     {col.columnName}
                                                            // </MenuItem>)
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            :
                                            <div>
                                                <FormControl fullWidth disabled margin="normal">
                                                    <InputLabel >Column Name <small className={classes.labelTag}>(Permanent)</small></InputLabel>
                                                    <Input id="columnName" name="columnName" className={classes.minWidth} value={data.ColumnName} placeholder="" />
                                                </FormControl>
                                            </div>
                                        }
                                    </Grid>
                                );
                            })}
                        </Grid>
                        <Grid container spacing={24} >
                            <Grid item xs={12} className={classes.paper1}>
                                <Button type="submit" variant="contained" color="primary" className={classes.button}>
                                    <i className={`${classes.leftIcon} material-icons`}>save</i>Save
                            </Button>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </Paper>
            </div>
        );
    }
}


export default withStyles(styles)(DefaultColumns);