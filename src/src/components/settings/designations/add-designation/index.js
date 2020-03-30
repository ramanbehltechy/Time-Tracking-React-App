import React, { Component } from 'react';
import Const from '../../../common/constant'
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
import Footer from '../../../common/footer'
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
        margin: 5
    }
});
class AddDesignation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DesignationId: '',
            Name: '',
            DesignationIdForSave: '',
            DesignationIdForEdit: this.props.match.params.id,
            action: this.props.match.params.id ? 'update' : 'add',
            buttonText: this.props.match.params.id ? 'Update Designation' : 'Add Designation',
            OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
            loader: true
        };
    }
    componentWillMount() {
        var body = {
            OrganizationID: this.state.OrganizationID
        }

        if (this.state.DesignationIdForEdit) {
            this.setDesignationDetails();
        }
        else {
            fetch(Const.API_ROOT + Const.GET_DESIGNATION_MASTER_DATA, {
                method: 'POST',
                headers: Const.API_HEADER,
                body: JSON.stringify(body),

            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log('responseJson : ' + JSON.stringify(responseJson))

                    this.setState({
                        DesignationId: this.addZero(parseInt(responseJson.LastDesignationId[0].DesignationId) + 1, 3),
                        DesignationIdForSave: this.addZero(parseInt(responseJson.LastDesignationId[0].DesignationId) + 1, 3),
                        loader: false
                    })
                    this.props.loader(false);
                    this.props.headerTitle('Add New Designation', 2, true);

                })
                .catch((error) => {
                    this.props.loader(false);
                    this.setState({
                        loader: false
                    })
                    console.error(error);
                })
        }
    }
    setDesignationDetails = () => {
        var body = {
            DesignationId: this.state.DesignationIdForEdit,
        }
        fetch(Const.API_ROOT + Const.GET_DESIGNATION_DETAILS, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),

        }).then((response) => response.json())
            .then((responseJson) => {
                debugger;
                responseJson = responseJson[0]
                this.setState({
                    DesignationId: this.addZero(parseInt(responseJson.DesignationId), 3),
                    Name: responseJson.Name,
                    loader: false
                })
                this.props.loader(false);
                this.props.headerTitle('Designation Details : ' + this.state.Name, 5, true);
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
        this.props.loader(true);
        var body = {
            DesignationId: this.state.DesignationId,
            Name: this.state.Name,
            OrganizationID: this.state.OrganizationID,
            action: this.state.action,
            DesignationIdForSave: this.state.DesignationIdForSave
        }
        console.log(JSON.stringify(body))
        fetch(Const.API_ROOT + Const.ADD_DESIGNATION, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.props.loader(false);
                if (responseJson.rowsAffected) {
                    if (this.state.DesignationIdForEdit) {
                        NotificationManager.success('Designation updated successfully', 'Success', 2000);
                    } else {
                        NotificationManager.success('Designation Added successfully', 'Success', 2000);
                    }
                    setTimeout(
                        function () {
                            this.props.history.push('/dashboard/settings/1')
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
    render() {
        const { classes } = this.props;
        return (
            <div>
                {!this.state.loader ? 
                <Paper className={classes.root}>
                <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
                    <Typography component="h1" variant="h5">Designation Details</Typography>
                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                            <FormControl disabled margin="normal" required fullWidth>
                                <InputLabel >Id</InputLabel>
                                <Input id="id" name="id" autoComplete="id" value={this.state.DesignationId} onChange={(e) => this.setState({ DesignationId: e.target.value })} placeholder="DesignationId Id" />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextValidator margin="normal" fullWidth
                                label="Designation Name"
                                onChange={(e) => this.setState({ Name: e.target.value })}
                                name="name"
                                value={this.state.Name}
                                validators={['required']}
                                errorMessages={['Designation Name is required']} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className={classes.heading}>
                        <Grid item xs={12} className={classes.paper1}>
                            <Button onClick={() => this.props.history.push('/dashboard/settings/1')} variant="contained" color="primary" className={classes.button}>
                                <i className={`${classes.leftIcon} material-icons`}>arrow_back</i> Back
                    </Button>
                            <Button type="submit" variant="contained" color="primary" className={classes.button}>
                                <i className={`${classes.leftIcon} material-icons`}>{this.props.match.params.id ? 'update' : 'person_add'}</i> {this.state.buttonText}
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Paper> : ''
    //             <Paper className={classes.root}>
    //                 <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
    //                     <Typography component="h1" variant="h5">Designation Details</Typography>
    //                     <Grid container spacing={24}>
    //                         <Grid item xs={6}>
    //                             <FormControl disabled margin="normal" required fullWidth>
    //                                 <InputLabel >Id</InputLabel>
    //                                 <Input id="id" name="id" autoComplete="id" value={this.state.DesignationId} onChange={(e) => this.setState({ DesignationId: e.target.value })} placeholder="Designation Id" />
    //                             </FormControl>
    //                             </Grid>
    //                         <Grid item xs={6}>
    //                             <FormControl margin="normal" required fullWidth>
    //                                 <InputLabel >Designation Name</InputLabel>
    //                                 <Input id="name" name="name" autoComplete="name" value={this.state.Name} onChange={(e) => this.setState({ Name: e.target.value })} placeholder="Designation Name" />
    //                             </FormControl>
    //                         </Grid>
    //                     </Grid>
    //                     <Grid container spacing={24} className={classes.heading}>
    //                         <Grid item xs={12} className={classes.paper1}>
    //                             <Button onClick={() => this.props.history.push('/dashboard/settings/1')} variant="contained" color="primary" className={classes.button}>
    //                                 <i className={`${classes.leftIcon} material-icons`}>arrow_back</i> Back
    //   </Button>
    //                             <Button type="submit" variant="contained" color="primary" className={classes.button}>
    //                                 <i className={`${classes.leftIcon} material-icons`}>{this.props.match.params.id ? 'update' : 'person_add'}</i> {this.state.buttonText}
    //                             </Button>
    //                         </Grid>
    //                     </Grid>
    //                 </ValidatorForm>
    //             </Paper> : ''

                }
                <Footer />
            </div>
        );
    }
}
export default withStyles(styles)(AddDesignation);