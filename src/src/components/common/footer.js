import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },

});
class Employees extends Component {

    render() {
        const { classes } = this.props;
        return (
            <footer>
               {/* <Typography  style={{marginTop:25,marginBottom:25,textAlign:"right"}} variant="subtitle2" >
        Powered By Techbit Solutions Pvt Ltd
        </Typography> */}
            </footer>
        );
    }
}
export default withStyles(styles)(Employees);