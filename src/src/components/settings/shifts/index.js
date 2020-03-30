import React, { Component } from 'react';
import Const from '../../common/constant'
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CardActions from '@material-ui/core/CardActions';
import Footer from '../../common/footer';
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
    editAction: {
        color: '#00a9f4'
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    }, tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    }
})

class Shift extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Shifts: [],
            listView: false,
            OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID
        };
    }
    componentWillMount() {
        var body = {
            OrganizationID: this.state.OrganizationID,
        }
        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_SHIFTS, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.props.loader(false);
                this.setState({
                    Shifts: responseJson,
                })
            })
            .catch((error) => {
                this.props.loader(false);
                console.error(error);
            })
    }
    editShift = (ShiftId) => {
        this.props.history.push('/dashboard/settings/shift/edit-shift/' + ShiftId);
    }
    addShift = () => {
        this.props.history.push('/dashboard/settings/shift/add-shift');
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Paper className={classes.paper}>
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
                    <Button variant="contained" color="primary" className={classes.button} onClick={() => this.addShift()}>
                        <i className={`${classes.leftIcon} material-icons`}>person_add</i>Add Shift</Button>
                </Paper>
                {this.state.listView ?
                    <Paper className={classes.root}>

                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell >Start Time</TableCell>
                                    <TableCell ></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.Shifts.map(n => {
                                    return (
                                        <TableRow className={classes.tableRowHover} key={n.ShiftId}>
                                            <TableCell component="th" scope="row">
                                                {n.Name}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {moment(n.StartTime).format('hh:mm A')}
                                            </TableCell>
                                            <TableCell align="right">
                                                <span className={classes.action} onClick={() => this.editShift(n.ShiftId)} ><i className={`${classes.editAction} material-icons`} aria-hidden="true">edit</i></span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper> : <Grid container spacing={16}>{this.state.Shifts.map((data, i) => {
                        return (
                            <Grid item xs={12} sm={3} key={i}>
                                <Card className={classes.card} >
                                    <CardContent>
                                        <Grid container spacing={24}>
                                            <Grid style={{ padding: 5 }} item xs={12}>
                                                <Typography variant="title" component="h2">
                                                    {data.Name}
                                                </Typography> 
                                            </Grid>
                                            <Typography style={{ padding: 10 }} component="p">
                                            Start Time : {moment(data.StartTime).format('hh:mm A')}
                                            </Typography>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={() => this.editShift(data.ShiftId)}>
                                            <i className={`${classes.editAction} material-icons`} aria-hidden="true">edit</i>&nbsp;edit
                                            </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                    </Grid>
                }
                <Footer />
            </div>
        );
    }
}
export default withStyles(styles)(Shift);