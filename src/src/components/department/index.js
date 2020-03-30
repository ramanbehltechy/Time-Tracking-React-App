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
import Footer from '../common/footer';
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
    }
})

class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Banks: [],
            confirmDeleteDialog: false,
            bankIdForDelete: '',
            listView: false,
            OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID
        };
    }
    componentWillMount() {
        this.props.headerTitle('Banks List', 5);
        var body = {
            OrganizationID: this.state.OrganizationID,
        }
        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_BANKS, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.props.loader(false);
                this.setState({
                    Banks: responseJson,
                })
            })
            .catch((error) => {
                this.props.loader(false);
                console.error(error);
            })
    }
    editBank = (BankId) => {
        this.props.history.push('/dashboard/add-bank/' + BankId);
    }
    addBank() {
        this.props.history.push('/dashboard/add-bank');
    }
    confirmDelete = (BankId) => {
        this.setState({ confirmDeleteDialog: true, bankIdForDelete: BankId });
    }
    handleClose = () => {
        this.setState({ confirmDeleteDialog: false });
    };
    deleteBank = () => {
        this.setState({ confirmDeleteDialog: false });
        var body = {
            BankID: this.state.bankIdForDelete,
            OrganizationID: this.state.OrganizationID
        }
        fetch(Const.API_ROOT + Const.DELETE_BANK, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),

        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.rowsAffected) {
                    NotificationManager.success('Bank deleted successfully', 'Success', 2000);
                    setTimeout(
                        function () {
                            this.componentWillMount();
                        }
                            .bind(this),
                        2000
                    );
                } else {
                    NotificationManager.error('Error', 'Error in deleting bank.');
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
                    <Button variant="contained" color="primary" className={classes.button} onClick={() => this.addBank()}>
                        <i className={`${classes.leftIcon} material-icons`}>person_add</i>Add Bank</Button>
                </Paper>
                {this.state.listView ?
                    <Paper className={classes.root}>

                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Branch</TableCell>
                                    <TableCell align="right">IFSC</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.Banks.map(n => {
                                    return (
                                        <TableRow className={classes.tableRowHover} key={n.BankID}>
                                            <TableCell component="th" scope="row">
                                                {n.Name}
                                            </TableCell>
                                            <TableCell align="right">{n.Branch}</TableCell>
                                            <TableCell align="right">{n.IFSC}</TableCell>
                                            <TableCell align="right">
                                                <span className={classes.action} onClick={() => this.editBank(n.BankID)} ><i className={`${classes.editAction} material-icons`} aria-hidden="true">edit</i></span>
                                                <span className={classes.action}><i className={`${classes.deleteAction} material-icons`} onClick={() => this.confirmDelete(n.BankID)} aria-hidden="true">delete</i></span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper> : <Grid container spacing={16}>{this.state.Banks.map((data, i) => {
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
                                                    {data.Branch}
                                                </Typography>
                                            </Grid>
                                            <Typography style={{ padding: 10 }} component="p">
                                                IFSC Code : {data.IFSC}
                                            </Typography>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={() => this.editBank(data.BankID)}>
                                            <i className={`${classes.editAction} material-icons`} aria-hidden="true">edit</i>&nbsp;edit
                                            </Button>
                                        <Button size="small" color="primary" onClick={() => this.confirmDelete(data.BankID)}>
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
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Confirm!</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this bank?
                </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                </Button>
                        <Button onClick={this.deleteBank} color="primary" autoFocus>
                            Delete
                </Button>
                    </DialogActions>
                </Dialog>
                <Footer />
            </div>
        );
    }
}
export default withStyles(styles)(Department);